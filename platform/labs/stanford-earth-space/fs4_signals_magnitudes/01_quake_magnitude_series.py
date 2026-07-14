#!/usr/bin/env python3
"""FS4 step 1 — Earthquake magnitude time series (EONET + USGS_EHP)."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import EONET, get_json, save_csv

def main() -> None:
    data = get_json(
        f"{EONET}/events",
        {"source": "USGS_EHP", "status": "all", "days": 30, "limit": 100},
    )
    rows = []
    for ev in data.get("events", []):
        for g in ev.get("geometry") or []:
            rows.append(
                {
                    "id": ev.get("id"),
                    "title": ev.get("title"),
                    "date": g.get("date"),
                    "magnitudeValue": g.get("magnitudeValue"),
                    "magnitudeUnit": g.get("magnitudeUnit"),
                }
            )
    save_csv("fs4_quake_series.csv", rows)
    print(f"Quake geometry samples: {len(rows)}. Next: 02_storm_wind_series.py")

if __name__ == "__main__":
    main()
