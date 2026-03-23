"""SQLite persistence for checkpointing and metadata."""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Iterable, List, Optional


class Storage:
    def __init__(self, db_path: Path) -> None:
        db_path.parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(db_path)
        self.conn.row_factory = sqlite3.Row
        self._init_db()

    def _init_db(self) -> None:
        cur = self.conn.cursor()
        cur.execute("""
        CREATE TABLE IF NOT EXISTS discovered_urls (
            url TEXT PRIMARY KEY,
            source_type TEXT,
            county TEXT,
            city TEXT,
            discovered_at TEXT DEFAULT CURRENT_TIMESTAMP,
            scraped INTEGER DEFAULT 0,
            failed INTEGER DEFAULT 0
        )
        """)
        cur.execute("""
        CREATE TABLE IF NOT EXISTS page_cache (
            url TEXT PRIMARY KEY,
            html TEXT,
            fetched_at TEXT DEFAULT CURRENT_TIMESTAMP,
            status_code INTEGER
        )
        """)
        cur.execute("""
        CREATE TABLE IF NOT EXISTS normalized_records (
            record_id TEXT PRIMARY KEY,
            payload TEXT NOT NULL,
            inserted_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """)
        self.conn.commit()

    def upsert_discovered(self, url: str, source_type: str, county: str | None = None, city: str | None = None) -> None:
        self.conn.execute(
            """
            INSERT INTO discovered_urls(url, source_type, county, city) VALUES (?, ?, ?, ?)
            ON CONFLICT(url) DO UPDATE SET source_type=excluded.source_type
            """,
            (url, source_type, county, city),
        )
        self.conn.commit()

    def pending_urls(self, limit: int = 5000) -> List[sqlite3.Row]:
        cur = self.conn.execute(
            "SELECT * FROM discovered_urls WHERE scraped=0 AND failed=0 LIMIT ?", (limit,)
        )
        return cur.fetchall()

    def mark_scraped(self, url: str, failed: bool = False) -> None:
        col = "failed" if failed else "scraped"
        self.conn.execute(f"UPDATE discovered_urls SET {col}=1 WHERE url=?", (url,))
        self.conn.commit()

    def cache_page(self, url: str, html: str, status_code: int) -> None:
        self.conn.execute(
            "INSERT OR REPLACE INTO page_cache(url, html, status_code) VALUES (?, ?, ?)",
            (url, html, status_code),
        )
        self.conn.commit()

    def save_clean_records(self, rows: Iterable[dict]) -> None:
        for row in rows:
            self.conn.execute(
                "INSERT OR REPLACE INTO normalized_records(record_id, payload) VALUES (?, ?)",
                (row["record_id"], json.dumps(row, ensure_ascii=False)),
            )
        self.conn.commit()

    def load_clean_records(self) -> List[dict]:
        data: List[dict] = []
        for row in self.conn.execute("SELECT payload FROM normalized_records"):
            data.append(json.loads(row["payload"]))
        return data

    def close(self) -> None:
        self.conn.close()
