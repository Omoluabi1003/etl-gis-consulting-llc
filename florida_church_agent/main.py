"""CLI entrypoint for Florida church scraping pipeline."""
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

import pandas as pd
import typer
from tqdm import tqdm

from config import settings
from src.counties import FLORIDA_COUNTIES, cities_for_county
from src.deduplicate import deduplicate
from src.discover import DiscoveryEngine, DuckDuckGoHtmlProvider
from src.exporter import export_cleaned, export_excel, export_logs, export_raw, export_summary
from src.extractors import extract_from_page
from src.fetcher import HttpFetcher
from src.geocode import geocode_address
from src.logger import setup_logger
from src.models import RawChurchRecord, ScrapeRunSummary, SourceResult
from src.normalize import normalize_record
from src.parsers import soupify
from src.playwright_fetcher import PlaywrightFetcher
from src.query_builder import city_queries, county_queries
from src.storage import Storage

app = typer.Typer(help="Florida church discovery and scraping agent")


def run_pipeline(max_pages: Optional[int] = None, use_playwright: Optional[bool] = None, export: Optional[List[str]] = None) -> None:
    started_at = datetime.now(timezone.utc)
    output_dir = Path(settings.output_dir)
    logger = setup_logger(output_dir / "logs" / "scrape_log.txt", settings.log_level)

    storage = Storage(settings.sqlite_db_path)
    provider = DuckDuckGoHtmlProvider(timeout=settings.request_timeout)
    engine = DiscoveryEngine(provider)
    fetcher = HttpFetcher()
    pw_fetcher = PlaywrightFetcher()

    max_pages = max_pages or settings.max_pages
    use_playwright = settings.use_playwright if use_playwright is None else use_playwright
    export = export or settings.export_formats

    raw_rows: List[dict] = []
    source_summary: List[dict] = []
    failed_urls: List[dict] = []

    logger.info("Starting discovery across %s counties", len(FLORIDA_COUNTIES))
    for county in tqdm(FLORIDA_COUNTIES, desc="Discover counties"):
        queries = county_queries(county)
        for city in cities_for_county(county):
            queries.extend(city_queries(city))
        discovered = engine.discover(queries=queries, county=county)
        for d in discovered:
            storage.upsert_discovered(d.url, d.source_type, county=d.county, city=d.city)
        logger.info("%s: discovered %s URLs", county, len(discovered))

    pending = storage.pending_urls(limit=max_pages)
    logger.info("Scraping %s URLs", len(pending))

    for row in tqdm(pending, desc="Scrape pages"):
        url = row["url"]
        source_type = row["source_type"]
        try:
            fr = fetcher.fetch(url)
            html = fr.html
            used_playwright = False
            if use_playwright and fetcher.needs_playwright(html, url):
                pwr = pw_fetcher.fetch(url)
                html = pwr.html
                used_playwright = True
            soup = soupify(html)
            extracted = extract_from_page(soup, url)
            extracted["county"] = row["county"]
            extracted["confidence_score"] = 0.65 if source_type == "official" else 0.5
            record = RawChurchRecord(**extracted)
            raw_rows.append(record.model_dump())
            source_summary.append(SourceResult(url=url, domain=record.source_domain or "", source_type=source_type, success=True).model_dump())
            storage.cache_page(url, html, 200)
            storage.mark_scraped(url)
            logger.info("Scraped: %s (playwright=%s)", url, used_playwright)
        except Exception as exc:
            storage.mark_scraped(url, failed=True)
            failed_urls.append({"url": url, "error": str(exc), "source_type": source_type})
            source_summary.append(SourceResult(url=url, domain="", source_type=source_type, success=False, error=str(exc)).model_dump())
            logger.exception("Failed URL: %s", url)
            continue

    raw_export_path = output_dir / "raw" / "churches_florida_raw.csv"
    export_raw(raw_rows, raw_export_path)

    normalized = [normalize_record(RawChurchRecord(**r)) for r in raw_rows]
    if settings.enable_geocoding:
        for rec in normalized:
            if rec.street_address and (rec.latitude is None or rec.longitude is None):
                lat, lon = geocode_address(f"{rec.street_address}, {rec.city or ''}, FL {rec.zip_code or ''}")
                rec.latitude, rec.longitude = lat, lon

    deduped, dup_pairs = deduplicate(normalized, settings.fuzzy_dup_threshold)
    clean_rows = [r.model_dump() for r in deduped]
    storage.save_clean_records(clean_rows)

    cleaned_csv = output_dir / "cleaned" / "churches_florida_cleaned.csv"
    df = export_cleaned(clean_rows, cleaned_csv)

    if "excel" in [e.lower() for e in export]:
        export_excel(df, source_summary, failed_urls, output_dir / "cleaned" / "churches_florida.xlsx")

    export_logs(failed_urls, source_summary, dup_pairs, output_dir / "logs")

    finished_at = datetime.now(timezone.utc)
    summary = ScrapeRunSummary(
        started_at=started_at,
        finished_at=finished_at,
        counties_processed=len(FLORIDA_COUNTIES),
        urls_discovered=len({s['url'] for s in source_summary}),
        urls_scraped=len(raw_rows),
        raw_records=len(raw_rows),
        cleaned_records=len(clean_rows),
        failed_urls=len(failed_urls),
        duplicate_pairs=len(dup_pairs),
        source_results=[SourceResult(**s) for s in source_summary],
    )
    export_summary(summary.model_dump(), output_dir / "logs")
    logger.info("Run complete. Raw=%s Clean=%s Failed=%s", len(raw_rows), len(clean_rows), len(failed_urls))
    storage.close()


@app.command()
def run(
    state: str = typer.Option("Florida", help="Only Florida is currently supported."),
    max_pages: int = typer.Option(settings.max_pages, help="Maximum pages to scrape."),
    use_playwright: bool = typer.Option(False, help="Enable Playwright fallback."),
    export: List[str] = typer.Option(["csv", "excel"], help="Export formats."),
) -> None:
    if state.lower() != "florida":
        raise typer.BadParameter("This build supports Florida only.")
    run_pipeline(max_pages=max_pages, use_playwright=use_playwright, export=export)


@app.command()
def resume() -> None:
    """Resume run from pending URLs in SQLite checkpoint."""
    run_pipeline(max_pages=settings.max_pages, use_playwright=settings.use_playwright, export=settings.export_formats)


@app.command()
def summary() -> None:
    """Display last run summary."""
    summary_path = Path(settings.output_dir) / "logs" / "run_summary.json"
    if not summary_path.exists():
        typer.echo("No summary found yet.")
        raise typer.Exit(code=1)
    typer.echo(summary_path.read_text(encoding="utf-8"))


if __name__ == "__main__":
    app()
