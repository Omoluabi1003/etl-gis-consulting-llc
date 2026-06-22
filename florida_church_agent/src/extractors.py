"""Field extraction from church-related pages."""
from __future__ import annotations

import re
from typing import Dict, Optional
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from .parsers import extract_candidate_links, json_ld_blocks
from .utils import EMAIL_RE, PHONE_RE, clean_whitespace, domain_of

DENOM_KEYWORDS = {
    "baptist": "Baptist",
    "catholic": "Catholic",
    "pentecostal": "Pentecostal",
    "methodist": "Methodist",
    "presbyterian": "Presbyterian",
    "lutheran": "Lutheran",
    "episcopal": "Episcopal",
    "non denominational": "Non-denominational",
}


def _find_name(soup: BeautifulSoup) -> Optional[str]:
    og = soup.select_one("meta[property='og:site_name']")
    if og and og.get("content"):
        return clean_whitespace(og["content"])
    h1 = soup.select_one("h1")
    if h1:
        return clean_whitespace(h1.get_text(" ", strip=True))
    if soup.title:
        return clean_whitespace(soup.title.get_text(" ", strip=True).split("|")[0])
    return None


def _find_email(text: str) -> Optional[str]:
    m = EMAIL_RE.search(text)
    return m.group(0).lower() if m else None


def _find_phone(text: str) -> Optional[str]:
    m = PHONE_RE.search(text)
    return m.group(0) if m else None


def _find_social(soup: BeautifulSoup) -> Dict[str, Optional[str]]:
    links = {"facebook_url": None, "instagram_url": None, "youtube_url": None}
    for a in soup.select("a[href]"):
        href = a.get("href", "")
        l = href.lower()
        if "facebook.com" in l and not links["facebook_url"]:
            links["facebook_url"] = href
        if "instagram.com" in l and not links["instagram_url"]:
            links["instagram_url"] = href
        if "youtube.com" in l and not links["youtube_url"]:
            links["youtube_url"] = href
    return links


def _find_denomination(text: str) -> Optional[str]:
    lower = text.lower()
    for k, v in DENOM_KEYWORDS.items():
        if k in lower:
            return v
    return None


def _find_service_times(text: str) -> Optional[str]:
    m = re.search(r"((sunday|worship|service)[^\n]{0,140}(am|pm))", text, flags=re.IGNORECASE)
    return clean_whitespace(m.group(0)) if m else None


def _find_pastor(text: str) -> Optional[str]:
    m = re.search(r"(?:pastor|rev\.?|minister)\s*[:\-]?\s*([A-Z][A-Za-z .'-]{3,60})", text, flags=re.IGNORECASE)
    return clean_whitespace(m.group(1)) if m else None


def _extract_address_from_jsonld(soup: BeautifulSoup) -> dict:
    out = {}
    for block in json_ld_blocks(soup):
        addr = block.get("address")
        geo = block.get("geo")
        if isinstance(addr, dict):
            out["street_address"] = addr.get("streetAddress")
            out["city"] = addr.get("addressLocality")
            out["state"] = addr.get("addressRegion")
            out["zip_code"] = addr.get("postalCode")
        if isinstance(geo, dict):
            out["latitude"] = geo.get("latitude")
            out["longitude"] = geo.get("longitude")
    return out


def extract_from_page(soup: BeautifulSoup, page_url: str) -> dict:
    text = soup.get_text("\n", strip=True)
    record = {
        "church_name": _find_name(soup),
        "denomination": _find_denomination(text),
        "website": f"{soup.find('base')['href']}" if soup.find("base") and soup.find("base").get("href") else page_url,
        "phone": _find_phone(text),
        "email": _find_email(text),
        "service_times": _find_service_times(text),
        "pastor_name": _find_pastor(text),
        "source_url": page_url,
        "source_domain": domain_of(page_url),
        "state": "FL",
    }
    record.update(_find_social(soup))
    record.update(_extract_address_from_jsonld(soup))
    links = [urljoin(page_url, h) for h in extract_candidate_links(soup)]
    record["candidate_detail_links"] = links[:8]
    return record
