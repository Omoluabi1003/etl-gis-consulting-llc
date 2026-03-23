"""URL discovery engine with provider abstraction."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List, Protocol
from urllib.parse import quote_plus

import httpx
from bs4 import BeautifulSoup

from .utils import domain_of


@dataclass
class DiscoveredURL:
    url: str
    source_type: str
    county: str | None = None
    city: str | None = None


class SearchProvider(Protocol):
    def search(self, query: str, limit: int = 10) -> List[str]: ...


class DuckDuckGoHtmlProvider:
    """Simple HTML provider; selector may need tuning over time."""

    base_url = "https://duckduckgo.com/html/?q="

    def __init__(self, timeout: int = 20) -> None:
        self.timeout = timeout

    def search(self, query: str, limit: int = 10) -> List[str]:
        url = f"{self.base_url}{quote_plus(query)}"
        with httpx.Client(timeout=self.timeout, follow_redirects=True) as client:
            response = client.get(url)
            response.raise_for_status()
        soup = BeautifulSoup(response.text, "lxml")
        links = []
        for a in soup.select("a.result__a"):
            href = a.get("href")
            if href and href.startswith("http"):
                links.append(href)
            if len(links) >= limit:
                break
        return links


def classify_url(url: str) -> str:
    dom = domain_of(url)
    if any(x in dom for x in ["church", "chapel", "parish", "ministry"]):
        return "official"
    if any(x in dom for x in ["yelp", "yellowpages", "facebook", "mapquest"]):
        return "directory"
    if any(x in dom for x in ["sbc", "umc", "ag", "diocese", "presbytery"]):
        return "denominational"
    return "misc"


class DiscoveryEngine:
    def __init__(self, provider: SearchProvider) -> None:
        self.provider = provider

    def discover(self, queries: Iterable[str], county: str | None = None, city: str | None = None) -> List[DiscoveredURL]:
        out: List[DiscoveredURL] = []
        seen = set()
        for q in queries:
            try:
                for url in self.provider.search(q):
                    if url in seen:
                        continue
                    seen.add(url)
                    out.append(DiscoveredURL(url=url, source_type=classify_url(url), county=county, city=city))
            except Exception:
                continue
        return out
