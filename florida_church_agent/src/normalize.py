"""Record normalization logic."""
from __future__ import annotations

import re
from urllib.parse import urlparse

from .models import CleanChurchRecord, RawChurchRecord
from .utils import clean_whitespace

DENOM_MAP = {
    "non denominational": "Non-denominational",
    "nondenominational": "Non-denominational",
    "assemblies of god": "Pentecostal",
}


def normalize_phone(phone: str | None) -> str | None:
    if not phone:
        return None
    digits = re.sub(r"\D", "", phone)
    if len(digits) == 11 and digits.startswith("1"):
        digits = digits[1:]
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    return phone


def canonical_website(url: str | None) -> str | None:
    if not url:
        return None
    p = urlparse(url)
    if not p.scheme:
        return url
    return f"{p.scheme}://{p.netloc.lower()}"


def normalize_record(raw: RawChurchRecord) -> CleanChurchRecord:
    data = raw.model_dump()
    data["church_name"] = clean_whitespace(data.get("church_name"))
    data["normalized_name"] = (data.get("church_name") or "").lower()
    data["phone"] = normalize_phone(data.get("phone"))
    data["email"] = (data.get("email") or "").lower() or None
    data["website"] = canonical_website(data.get("website"))
    data["state"] = "FL"
    denom = (data.get("denomination") or "").strip().lower()
    if denom in DENOM_MAP:
        data["denomination"] = DENOM_MAP[denom]
    return CleanChurchRecord(**data)
