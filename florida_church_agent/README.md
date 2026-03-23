# Florida Church Agent

Production-oriented Python scraping pipeline that discovers and builds a structured database of churches in Florida, with county-wide discovery, modular source handling, normalization, deduplication, checkpointing, and export.

## What this tool does
- Expands discovery across all **67 Florida counties**.
- Uses layered query generation (county + city + denomination keyword variations).
- Discovers church and directory URLs from public web search providers.
- Scrapes public pages with polite HTTP fetching + optional Playwright fallback.
- Extracts church profile fields (name, contacts, address, social links, service details, leadership hints, etc.).
- Normalizes and deduplicates records with exact and fuzzy matching.
- Stores checkpoint data in SQLite for resume behavior.
- Exports raw, cleaned, logs, summary JSON, and formatted Excel workbook.

## Features
- ✅ Typer CLI (`run`, `resume`, `summary`)
- ✅ Search provider abstraction (swap DuckDuckGo HTML with other providers)
- ✅ robots.txt checks + retry + rate limiting + user-agent rotation
- ✅ JSON-LD extraction + heuristic text extraction
- ✅ Optional geocoding (Nominatim / Google / Mapbox / Positionstack)
- ✅ Duplicate review output for human QA
- ✅ Excel formatting (header freeze, bold headers, filters, reasonable autosizing)

## Installation
```bash
cd florida_church_agent
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Playwright setup
```bash
python -m playwright install chromium
```

## Configuration
Copy environment template:
```bash
cp .env.example .env
```

Key config values:
- `REQUEST_TIMEOUT`, `MAX_RETRIES`, `RATE_LIMIT_SECONDS`
- `MAX_PAGES`, `USE_PLAYWRIGHT`
- `ENABLE_GEOCODING`, `GEOCODING_PROVIDER` (`nominatim`, `google`, `mapbox`, `positionstack`)
- `FUZZY_DUP_THRESHOLD`
- `OUTPUT_DIR`, `SQLITE_DB_PATH`

## How to run
```bash
python main.py run --state Florida
python main.py run --state Florida --max-pages 5000
python main.py run --state Florida --use-playwright
python main.py run --state Florida --export csv --export excel
python main.py resume
python main.py summary
```

## Output files
- `data/raw/churches_florida_raw.csv`
- `data/cleaned/churches_florida_cleaned.csv`
- `data/cleaned/churches_florida.xlsx`
- `data/logs/scrape_log.txt`
- `data/logs/failed_urls.csv`
- `data/logs/source_summary.csv`
- `data/logs/duplicate_review.csv`
- `data/logs/run_summary.json`

## Legal and ethical notes
- Scrapes only publicly accessible pages.
- Honors robots.txt checks in HTTP fetcher.
- Does not bypass CAPTCHAs, login walls, or private endpoints.
- Intended for organizational contact data only.
- You are responsible for complying with source website terms and applicable laws.

## Limitations
- Search engine HTML selectors can change and may need periodic tuning.
- Address parsing is heuristic and may require provider-specific extractors.
- Some JS-heavy pages may still require custom Playwright waits/selectors.
- Denomination and pastor extraction are best-effort, not guaranteed.

## Scaling ideas
- Add provider plugins (Bing API / SerpAPI / Common Crawl source packs).
- Distribute crawling with queues/workers (RQ, Celery, or Ray).
- Add incremental recrawl policy by `last_seen` timestamps.
- Add a review UI for duplicate and extraction confidence triage.
- Train an ML classifier for church-page confidence and field extraction ranking.
