#!/usr/bin/env python3
"""FS2 step 3 — Co-list ISS track with open EONET events (incl. bbox sample)."""
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import EONET, OUT, get_json, save_csv


def main() -> None:
    traj_path = OUT / "fs2_iss_trajectory.csv"
    if not traj_path.exists():
        print("Run 02_propagate_sample.py first", file=sys.stderr)
        raise SystemExit(1)
    traj = pd.read_csv(traj_path)
    # Prefer ISS-only rows for mean lat/lon if multi-sat present
    iss = traj[traj["sat"] == "ISS"] if "sat" in traj.columns else traj

    events = get_json(
        f"{EONET}/events",
        {"status": "open", "limit": 30},
        expect_keys=["events"],
    )
    # Regional overlay sample around mean ISS lon/lat (±20°)
    lat_m = float(iss["lat"].mean())
    lon_m = float(iss["lon"].mean())
    bbox = f"{lon_m - 20},{lat_m - 20},{lon_m + 20},{lat_m + 20}"
    regional = get_json(
        f"{EONET}/events",
        {"bbox": bbox, "status": "open", "limit": 25},
        expect_keys=["events"],
        optional=True,
    ) or {"events": []}

    ev_rows = []
    for ev in events.get("events", []):
        cats = ",".join(c.get("title", "") for c in ev.get("categories", []))
        ev_rows.append(
            {
                "event_id": ev.get("id"),
                "title": ev.get("title"),
                "categories": cats,
                "scope": "global_open",
            }
        )
    for ev in regional.get("events", []):
        cats = ",".join(c.get("title", "") for c in ev.get("categories", []))
        ev_rows.append(
            {
                "event_id": ev.get("id"),
                "title": ev.get("title"),
                "categories": cats,
                "scope": "iss_bbox",
            }
        )
    save_csv("fs2_open_events_summary.csv", ev_rows)
    summary = {
        "iss_samples": len(iss),
        "iss_lat_mean": lat_m,
        "iss_lon_mean": lon_m,
        "bbox": bbox,
        "open_events": len(events.get("events", [])),
        "regional_events": len(regional.get("events", [])),
    }
    print("Overlay summary:", summary)
    print("Interpret: satellite state trajectory (EE263) vs concurrent Earth events (observation context).")


if __name__ == "__main__":
    main()
