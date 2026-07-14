#!/usr/bin/env python3
"""FS2 step 2 — Propagate ISS (+ optional CSS) with velocity columns."""
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import TLE, get_json, save_csv


def propagate_sat(norad: int, label: str, n: int = 10, optional: bool = False) -> list[dict]:
    start = datetime.now(timezone.utc).replace(microsecond=0)
    rows = []
    for i in range(0, n):
        t = start + timedelta(minutes=10 * i)
        iso = t.strftime("%Y-%m-%dT%H:%M:%SZ")
        prop = get_json(f"{TLE}/{norad}/propagate", {"date": iso}, optional=optional)
        if prop is None:
            return rows
        g = prop.get("geodetic") or {}
        vec = prop.get("vector") or {}
        pos = vec.get("position") or {}
        vel = vec.get("velocity") or {}
        rows.append(
            {
                "sat": label,
                "norad": norad,
                "t": iso,
                "lat": g.get("latitude"),
                "lon": g.get("longitude"),
                "alt_km": g.get("altitude"),
                "x_km": pos.get("x"),
                "y_km": pos.get("y"),
                "z_km": pos.get("z"),
                "vx_kms": vel.get("x"),
                "vy_kms": vel.get("y"),
                "vz_kms": vel.get("z"),
            }
        )
    return rows


def main() -> None:
    rows = propagate_sat(25544, "ISS", n=10)
    css = propagate_sat(48274, "CSS", n=5, optional=True)
    if css:
        rows.extend(css)
    else:
        print("CSS propagate optional — skipped", file=sys.stderr)
    save_csv("fs2_iss_trajectory.csv", rows)
    print("State trajectory samples (with velocity) written. Next: 03_track_vs_event.py")


if __name__ == "__main__":
    main()
