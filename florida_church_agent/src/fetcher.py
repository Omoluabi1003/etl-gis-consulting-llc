"""HTTP fetcher with retries, rate limiting, and robots checks."""
from __future__ import annotations

import urllib.robotparser
from dataclasses import dataclass
from urllib.parse import urljoin, urlparse

import requests
from tenacity import retry, stop_after_attempt, wait_exponential

from config import settings
from .utils import pick_user_agent, sleep_polite


@dataclass
class FetchResult:
    url: str
    status_code: int
    html: str
    used_playwright: bool = False


class HttpFetcher:
    def __init__(self) -> None:
        self.session = requests.Session()
        self._robots_cache: dict[str, urllib.robotparser.RobotFileParser] = {}

    def _can_fetch(self, url: str, ua: str) -> bool:
        parsed = urlparse(url)
        base = f"{parsed.scheme}://{parsed.netloc}"
        robots_url = urljoin(base, "/robots.txt")
        if robots_url not in self._robots_cache:
            rp = urllib.robotparser.RobotFileParser()
            rp.set_url(robots_url)
            try:
                rp.read()
            except Exception:
                return True
            self._robots_cache[robots_url] = rp
        return self._robots_cache[robots_url].can_fetch(ua, url)

    @retry(stop=stop_after_attempt(settings.max_retries), wait=wait_exponential(multiplier=1, min=1, max=8), reraise=True)
    def fetch(self, url: str) -> FetchResult:
        ua = pick_user_agent(settings.user_agent_rotation)
        if not self._can_fetch(url, ua):
            raise PermissionError(f"Blocked by robots.txt: {url}")
        sleep_polite(settings.rate_limit_seconds)
        response = self.session.get(
            url,
            timeout=settings.request_timeout,
            headers={"User-Agent": ua},
            allow_redirects=True,
        )
        response.raise_for_status()
        return FetchResult(url=response.url, status_code=response.status_code, html=response.text)

    @staticmethod
    def needs_playwright(html: str, url: str) -> bool:
        script_count = html.lower().count("<script")
        tiny = len(html) < 3500
        js_domain = any(x in url for x in ["wixsite", "squarespace", "webflow"])
        return (tiny and script_count > 8) or js_domain
