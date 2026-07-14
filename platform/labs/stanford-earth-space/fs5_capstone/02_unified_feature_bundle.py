#!/usr/bin/env python3
"""FS5 step 2 — Flatten multi-source bundle into a provenance-aware feature table."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import OUT, save_csv

def main() -> None:
    raw = OUT / "fs5_multi_source_bundle.json"
    if not raw.exists():
        print("Run 01_multi_source_bundle.py first", file=sys.stderr)
        raise SystemExit(1)
    bundle = json.loads(raw.read_text())
    rows = []
    for ev in bundle.get("eonet_open", {}).get("events", []):
        cats = ",".join(c.get("title", "") for c in ev.get("categories", []))
        rows.append(
            {
                "source_api": "eonet",
                "record_id": ev.get("id"),
                "title": ev.get("title"),
                "category_or_status": cats,
                "when": (ev.get("geometry") or [{}])[0].get("date"),
            }
        )
    for L in bundle.get("ll2_upcoming", {}).get("results", []):
        st = (L.get("status") or {}).get("abbrev")
        rows.append(
            {
                "source_api": "launch_library",
                "record_id": L.get("id"),
                "title": L.get("name"),
                "category_or_status": st,
                "when": L.get("net"),
            }
        )
    tle = bundle.get("tle_iss") or {}
    rows.append(
        {
            "source_api": "tle",
            "record_id": str(tle.get("satelliteId")),
            "title": tle.get("name"),
            "category_or_status": "orbital_elements",
            "when": tle.get("date"),
        }
    )
    save_csv("fs5_unified_features.csv", rows)
    print("Next: 03_ask_to_apply_checklist.py")

if __name__ == "__main__":
    main()
