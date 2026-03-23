"""Runtime configuration for Florida church scraping agent."""
from __future__ import annotations

from pathlib import Path
from typing import List

from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class Settings(BaseSettings):
    """Environment-backed settings."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    request_timeout: int = Field(default=20, alias="REQUEST_TIMEOUT")
    max_retries: int = Field(default=3, alias="MAX_RETRIES")
    rate_limit_seconds: float = Field(default=1.0, alias="RATE_LIMIT_SECONDS")
    max_pages: int = Field(default=5000, alias="MAX_PAGES")
    use_playwright: bool = Field(default=False, alias="USE_PLAYWRIGHT")
    enable_geocoding: bool = Field(default=False, alias="ENABLE_GEOCODING")
    geocoding_provider: str = Field(default="nominatim", alias="GEOCODING_PROVIDER")
    nominatim_email: str = Field(default="", alias="NOMINATIM_EMAIL")
    google_geocoding_api_key: str = Field(default="", alias="GOOGLE_GEOCODING_API_KEY")
    mapbox_access_token: str = Field(default="", alias="MAPBOX_ACCESS_TOKEN")
    positionstack_api_key: str = Field(default="", alias="POSITIONSTACK_API_KEY")
    fuzzy_dup_threshold: int = Field(default=88, alias="FUZZY_DUP_THRESHOLD")
    user_agent_rotation: bool = Field(default=True, alias="USER_AGENT_ROTATION")
    output_dir: Path = Field(default=Path("florida_church_agent/data"), alias="OUTPUT_DIR")
    sqlite_db_path: Path = Field(default=Path("florida_church_agent/cache/church_agent.sqlite"), alias="SQLITE_DB_PATH")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")

    export_formats: List[str] = ["csv", "excel"]


settings = Settings()
