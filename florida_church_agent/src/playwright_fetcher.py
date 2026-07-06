"""Playwright fallback for JavaScript-heavy pages."""
from __future__ import annotations

from dataclasses import dataclass

from playwright.sync_api import sync_playwright

from .utils import pick_user_agent
from config import settings


@dataclass
class PlaywrightResult:
    url: str
    status_code: int
    html: str


class PlaywrightFetcher:
    def fetch(self, url: str) -> PlaywrightResult:
        ua = pick_user_agent(settings.user_agent_rotation)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(user_agent=ua)
            page = context.new_page()
            response = page.goto(url, wait_until="domcontentloaded", timeout=settings.request_timeout * 1000)
            page.wait_for_timeout(1500)
            html = page.content()
            final_url = page.url
            status_code = response.status if response else 200
            browser.close()
        return PlaywrightResult(url=final_url, status_code=status_code, html=html)
