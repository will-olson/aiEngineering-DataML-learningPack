#!/usr/bin/env python3
"""FS2 step 3 — Co-list ISS track samples with open EONET events (narrative overlay)."""
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
    events = get_json(f"{EONET}/events", {"status": "open", "limit": 30})
    ev_rows = []
    for ev in events.get("events", []):
        cats = ",".join(c.get("title", "") for c in ev.get("categories", []))
        ev_rows.append({"event_id": ev.get("id"), "title": ev.get("title"), "categories": cats})
    save_csv("fs2_open_events_summary.csv", ev_rows)
    # Simple join narrative: mean ISS lat/lon vs event count
    summary = {
        "iss_samples": len(traj),
        "iss_lat_mean": float(traj["lat"].mean()),
        "iss_lon_mean": float(traj["lon"].mean()),
        "open_events": len(ev_rows),
    }
    print("Overlay summary:", summary)
    print("Interpret: satellite state trajectory (EE263) vs concurrent Earth events (observation context).")

if __name__ == "__main__":
    main()
