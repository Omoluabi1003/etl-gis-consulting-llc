"""Pydantic data models for scraped church records."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional
from uuid import uuid4

from pydantic import BaseModel, Field, HttpUrl, field_validator


class RawChurchRecord(BaseModel):
    record_id: str = Field(default_factory=lambda: str(uuid4()))
    church_name: Optional[str] = None
    denomination: Optional[str] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    street_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    county: Optional[str] = None
    pastor_name: Optional[str] = None
    service_times: Optional[str] = None
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None
    youtube_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    source_url: Optional[str] = None
    source_domain: Optional[str] = None
    scraped_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    confidence_score: float = 0.5


class CleanChurchRecord(RawChurchRecord):
    normalized_name: Optional[str] = None

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: Optional[str]) -> Optional[str]:
        return value.lower().strip() if value else value

    @field_validator("state")
    @classmethod
    def normalize_state(cls, value: Optional[str]) -> Optional[str]:
        if not value:
            return "FL"
        return "FL" if value.strip().lower().startswith("fl") else value.strip().upper()


class SourceResult(BaseModel):
    url: str
    domain: str
    source_type: str
    success: bool = True
    error: Optional[str] = None


class ScrapeRunSummary(BaseModel):
    started_at: datetime
    finished_at: datetime
    counties_processed: int
    urls_discovered: int
    urls_scraped: int
    raw_records: int
    cleaned_records: int
    failed_urls: int
    duplicate_pairs: int
    source_results: List[SourceResult] = Field(default_factory=list)
