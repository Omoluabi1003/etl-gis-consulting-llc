"""General helper functions."""
from __future__ import annotations

import random
import re
import time
from urllib.parse import urlparse

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 Version/17.4 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
]

PHONE_RE = re.compile(r"(?:\+1\s*)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}")
EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")


def pick_user_agent(enabled: bool) -> str:
    return random.choice(USER_AGENTS) if enabled else USER_AGENTS[0]


def sleep_polite(seconds: float) -> None:
    if seconds > 0:
        time.sleep(seconds)


def domain_of(url: str) -> str:
    return urlparse(url).netloc.lower().replace("www.", "")


def clean_whitespace(value: str | None) -> str | None:
    if not value:
        return value
    return re.sub(r"\s+", " ", value).strip()
