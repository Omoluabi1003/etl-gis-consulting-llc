"""CSV and Excel export routines."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable, List

import pandas as pd
from openpyxl.styles import Font

from .deduplicate import DuplicatePair


def export_raw(records: Iterable[dict], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    pd.DataFrame(records).to_csv(path, index=False)


def export_cleaned(records: Iterable[dict], csv_path: Path) -> pd.DataFrame:
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    df = pd.DataFrame(records)
    df.to_csv(csv_path, index=False)
    return df


def export_logs(failed: List[dict], source_summary: List[dict], duplicates: List[DuplicatePair], logs_dir: Path) -> None:
    logs_dir.mkdir(parents=True, exist_ok=True)
    pd.DataFrame(failed).to_csv(logs_dir / "failed_urls.csv", index=False)
    pd.DataFrame(source_summary).to_csv(logs_dir / "source_summary.csv", index=False)
    pd.DataFrame([d.__dict__ for d in duplicates]).to_csv(logs_dir / "duplicate_review.csv", index=False)


def export_summary(summary: dict, logs_dir: Path) -> None:
    logs_dir.mkdir(parents=True, exist_ok=True)
    (logs_dir / "run_summary.json").write_text(json.dumps(summary, indent=2, default=str), encoding="utf-8")


def export_excel(df: pd.DataFrame, source_summary: List[dict], failed: List[dict], xlsx_path: Path) -> None:
    xlsx_path.parent.mkdir(parents=True, exist_ok=True)
    with pd.ExcelWriter(xlsx_path, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Churches")
        pd.DataFrame(source_summary).to_excel(writer, index=False, sheet_name="Source Summary")
        pd.DataFrame(failed).to_excel(writer, index=False, sheet_name="Failed URLs")

        ws = writer.book["Churches"]
        ws.freeze_panes = "A2"
        ws.auto_filter.ref = ws.dimensions
        for cell in ws[1]:
            cell.font = Font(bold=True)
        for col in ws.columns:
            length = max(len(str(c.value or "")) for c in col[:300])
            ws.column_dimensions[col[0].column_letter].width = min(max(length + 2, 12), 60)
