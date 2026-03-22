"""Optional geocoding provider wrappers."""
from __future__ import annotations

from typing import Optional, Tuple

import httpx

from config import settings


def geocode_address(address: str) -> Tuple[Optional[float], Optional[float]]:
    provider = settings.geocoding_provider.lower()
    if provider == "nominatim":
        params = {"q": address, "format": "json", "limit": 1}
        headers = {"User-Agent": f"florida-church-agent ({settings.nominatim_email or 'no-email'})"}
        r = httpx.get("https://nominatim.openstreetmap.org/search", params=params, headers=headers, timeout=20)
        r.raise_for_status()
        data = r.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
    elif provider == "google" and settings.google_geocoding_api_key:
        params = {"address": address, "key": settings.google_geocoding_api_key}
        r = httpx.get("https://maps.googleapis.com/maps/api/geocode/json", params=params, timeout=20)
        r.raise_for_status()
        data = r.json()
        if data.get("results"):
            loc = data["results"][0]["geometry"]["location"]
            return loc["lat"], loc["lng"]
    elif provider == "mapbox" and settings.mapbox_access_token:
        r = httpx.get(
            f"https://api.mapbox.com/geocoding/v5/mapbox.places/{address}.json",
            params={"access_token": settings.mapbox_access_token, "limit": 1},
            timeout=20,
        )
        r.raise_for_status()
        features = r.json().get("features", [])
        if features:
            lon, lat = features[0]["center"]
            return float(lat), float(lon)
    elif provider == "positionstack" and settings.positionstack_api_key:
        r = httpx.get(
            "http://api.positionstack.com/v1/forward",
            params={
                "access_key": settings.positionstack_api_key,
                "query": address,
                "limit": 1,
                "country": "US",
                "region": "Florida",
            },
            timeout=20,
        )
        r.raise_for_status()
        data = r.json().get("data", [])
        if data:
            return data[0].get("latitude"), data[0].get("longitude")
    return None, None
