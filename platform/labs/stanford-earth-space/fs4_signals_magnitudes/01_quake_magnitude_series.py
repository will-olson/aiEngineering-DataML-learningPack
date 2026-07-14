#!/usr/bin/env python3
"""FS4 step 1 — Earthquake magnitude series via magnitudes catalog + mag filters."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import EONET, get_json, save_csv, save_json


def main() -> None:
    mags = get_json(f"{EONET}/magnitudes", expect_keys=["magnitudes"], optional=True)
    if mags:
        save_json("fs4_magnitudes_catalog.json", mags)
        print("Magnitude kinds:", [m.get("id") for m in mags.get("magnitudes", [])][:12])

    # Prefer MMS magnitude filter when API supports magID / magMin
    filtered = get_json(
        f"{EONET}/events",
        {
            "source": "USGS_EHP",
            "status": "all",
            "days": 30,
            "limit": 100,
            "magID": "mms",
            "magMin": 4.5,
        },
        expect_keys=["events"],
        optional=True,
    )
    if filtered and filtered.get("events"):
        data = filtered
        save_json("fs4_quake_mag_filtered.json", data)
        print(f"magID=mms magMin=4.5 → {len(data['events'])} events")
    else:
        data = get_json(
            f"{EONET}/events",
            {"source": "USGS_EHP", "status": "all", "days": 30, "limit": 100},
            expect_keys=["events"],
        )
        print("Magnitude query params unused/empty — fell back to USGS_EHP open window")

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
