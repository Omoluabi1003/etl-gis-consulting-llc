#!/usr/bin/env python3
"""Download a brochure PDF and export each page as an image for sponsored galleries."""

from __future__ import annotations

import argparse
import logging
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

import fitz  # PyMuPDF

LOGGER = logging.getLogger("extract-brochure-pages")


def download_pdf(source_url: str, output_pdf: Path, refresh: bool) -> bool:
    if output_pdf.exists() and not refresh:
        LOGGER.info("Using cached PDF: %s", output_pdf)
        return True

    output_pdf.parent.mkdir(parents=True, exist_ok=True)
    request = Request(
        source_url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; brochure-ingest/1.0)",
            "Accept": "application/pdf,*/*;q=0.8",
        },
    )

    try:
        with urlopen(request, timeout=90) as response:
            output_pdf.write_bytes(response.read())
            LOGGER.info("Downloaded PDF to %s", output_pdf)
            return True
    except (HTTPError, URLError, TimeoutError) as error:
        LOGGER.warning("Unable to download %s (%s)", source_url, error)
        return False


def export_pages(pdf_path: Path, output_dir: Path, quality_scale: float, refresh: bool) -> list[Path]:
    output_dir.mkdir(parents=True, exist_ok=True)

    if refresh:
        for existing in output_dir.glob("page-*.jpg"):
            existing.unlink()

    exported = []
    with fitz.open(pdf_path) as document:
        for page_index, page in enumerate(document):
            image_path = output_dir / f"page-{page_index + 1:02d}.jpg"
            if image_path.exists() and not refresh:
                exported.append(image_path)
                continue

            pixmap = page.get_pixmap(matrix=fitz.Matrix(quality_scale, quality_scale), alpha=False)
            pixmap.save(image_path, output="jpeg", jpg_quality=90)
            exported.append(image_path)

    return exported


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-url", required=True, help="Brochure PDF source URL")
    parser.add_argument("--cache-pdf", required=True, type=Path, help="Local PDF cache path")
    parser.add_argument("--output-dir", required=True, type=Path, help="Output directory for page images")
    parser.add_argument("--quality-scale", type=float, default=2.2, help="Render scale for output quality")
    parser.add_argument("--refresh", action="store_true", help="Force re-download and image regeneration")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    downloaded = download_pdf(args.source_url, args.cache_pdf, args.refresh)
    if not downloaded:
        LOGGER.warning("Falling back to existing cached assets only.")
        return 1

    pages = export_pages(args.cache_pdf, args.output_dir, args.quality_scale, args.refresh)
    LOGGER.info("Exported %d page image(s) into %s", len(pages), args.output_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
