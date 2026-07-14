#!/usr/bin/env python3
"""FS4 step 2 — Storm wind magnitude series (mag_kts)."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import EONET, get_json, save_csv

def main() -> None:
    data = get_json(
        f"{EONET}/events",
        {"category": "severeStorms", "status": "all", "days": 60, "limit": 50},
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
    save_csv("fs4_storm_series.csv", rows)
    print(f"Storm geometry samples: {len(rows)}. Next: 03_event_rate_signal.py")

if __name__ == "__main__":
    main()
