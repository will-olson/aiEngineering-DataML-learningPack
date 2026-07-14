#!/usr/bin/env python3
"""FS5 step 1 — Multi-source bundle: EONET + LL2 + TLE."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import EONET, LL2, TLE, get_json, save_json

def main() -> None:
    bundle = {
        "eonet_open": get_json(f"{EONET}/events", {"status": "open", "limit": 20}),
        "ll2_upcoming": get_json(f"{LL2}/launch/upcoming/", {"limit": 10}),
        "tle_iss": get_json(f"{TLE}/25544"),
    }
    save_json("fs5_multi_source_bundle.json", bundle)
    print(
        f"Bundle: {len(bundle['eonet_open'].get('events', []))} events, "
        f"{len(bundle['ll2_upcoming'].get('results', []))} launches, ISS TLE ok"
    )
    print("Next: 02_unified_feature_bundle.py")

if __name__ == "__main__":
    main()
