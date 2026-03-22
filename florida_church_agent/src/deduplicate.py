"""Deduplication helpers using exact and fuzzy matching."""
from __future__ import annotations

from dataclasses import dataclass
from typing import List, Tuple

from rapidfuzz import fuzz

from .models import CleanChurchRecord


@dataclass
class DuplicatePair:
    record_id_1: str
    record_id_2: str
    similarity_score: float
    reason_flag: str


def deduplicate(records: List[CleanChurchRecord], fuzzy_threshold: int = 88) -> Tuple[List[CleanChurchRecord], List[DuplicatePair]]:
    kept: List[CleanChurchRecord] = []
    dupes: List[DuplicatePair] = []

    for rec in records:
        is_dup = False
        for existing in kept:
            if rec.website and existing.website and rec.website == existing.website:
                dupes.append(DuplicatePair(existing.record_id, rec.record_id, 100, "website"))
                is_dup = True
                break
            if rec.phone and existing.phone and rec.phone == existing.phone:
                dupes.append(DuplicatePair(existing.record_id, rec.record_id, 100, "phone"))
                is_dup = True
                break
            if rec.church_name and existing.church_name and rec.city and existing.city and rec.city == existing.city:
                score = fuzz.token_set_ratio(rec.church_name, existing.church_name)
                if score >= fuzzy_threshold:
                    dupes.append(DuplicatePair(existing.record_id, rec.record_id, score, "name+city"))
                    is_dup = True
                    break
            if rec.church_name and existing.church_name and rec.street_address and existing.street_address:
                score = fuzz.token_set_ratio(
                    f"{rec.church_name} {rec.street_address}",
                    f"{existing.church_name} {existing.street_address}",
                )
                if score >= fuzzy_threshold:
                    dupes.append(DuplicatePair(existing.record_id, rec.record_id, score, "name+street_fuzzy"))
                    is_dup = True
                    break
        if not is_dup:
            kept.append(rec)

    return kept, dupes
