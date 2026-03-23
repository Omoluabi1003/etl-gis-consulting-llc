"""HTML parsing helpers."""
from __future__ import annotations

import json
from typing import Any, Dict, List

from bs4 import BeautifulSoup


def soupify(html: str) -> BeautifulSoup:
    return BeautifulSoup(html or "", "lxml")


def json_ld_blocks(soup: BeautifulSoup) -> List[Dict[str, Any]]:
    blocks: List[Dict[str, Any]] = []
    for script in soup.select("script[type='application/ld+json']"):
        try:
            payload = json.loads(script.get_text(strip=True))
            if isinstance(payload, dict):
                blocks.append(payload)
            elif isinstance(payload, list):
                blocks.extend(p for p in payload if isinstance(p, dict))
        except Exception:
            continue
    return blocks


def extract_candidate_links(soup: BeautifulSoup) -> List[str]:
    links = []
    for a in soup.select("a[href]"):
        href = a.get("href", "")
        if any(k in href.lower() for k in ["contact", "about", "staff", "visit", "service", "worship"]):
            links.append(href)
    return links
