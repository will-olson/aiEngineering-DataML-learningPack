#!/usr/bin/env python3
"""FS2 step 2 — Propagate ISS state over a short horizon (discrete trajectory)."""
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import TLE, get_json, save_csv

def main() -> None:
    start = datetime.now(timezone.utc).replace(microsecond=0)
    rows = []
    for i in range(0, 10):
        t = start + timedelta(minutes=10 * i)
        iso = t.strftime("%Y-%m-%dT%H:%M:%SZ")
        prop = get_json(f"{TLE}/25544/propagate", {"date": iso})
        g = prop.get("geodetic") or {}
        v = (prop.get("vector") or {}).get("position") or {}
        rows.append(
            {
                "t": iso,
                "lat": g.get("latitude"),
                "lon": g.get("longitude"),
                "alt_km": g.get("altitude"),
                "x_km": v.get("x"),
                "y_km": v.get("y"),
                "z_km": v.get("z"),
            }
        )
    save_csv("fs2_iss_trajectory.csv", rows)
    print("State trajectory samples written. Next: 03_track_vs_event.py")

if __name__ == "__main__":
    main()
