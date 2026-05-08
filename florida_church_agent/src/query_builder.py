"""Search query generation utilities."""
from __future__ import annotations

from typing import List

DENOMS = [
    "christian churches",
    "baptist church",
    "catholic church",
    "pentecostal church",
    "non denominational church",
]


def county_queries(county: str) -> List[str]:
    return [
        f"churches in {county} county florida",
        f"church directory {county} county florida",
        f"worship centers {county} county florida",
    ]


def city_queries(city: str) -> List[str]:
    queries = [f"churches in {city} florida"]
    queries.extend(f"{denom} {city} florida" for denom in DENOMS)
    return queries
