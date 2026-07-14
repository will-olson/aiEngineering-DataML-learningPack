#!/usr/bin/env python3
"""FS1 step 1 — Fetch open EONET events (CS106 HTTP/JSON + CS229 data acquisition)."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import EONET, get_json, save_csv, save_json

def main() -> None:
    data = get_json(f"{EONET}/events", {"status": "open", "limit": 50})
    save_json("fs1_open_events.json", data)
    rows = []
    for ev in data.get("events", []):
        cats = ",".join(c.get("title", "") for c in ev.get("categories", []))
        srcs = ",".join(s.get("id", "") for s in ev.get("sources", []))
        geoms = ev.get("geometry") or []
        g0 = geoms[0] if geoms else {}
        rows.append(
            {
                "id": ev.get("id"),
                "title": ev.get("title"),
                "categories": cats,
                "sources": srcs,
                "geometry_type": (g0.get("type") if isinstance(g0, dict) else None),
                "geometry_date": g0.get("date") if isinstance(g0, dict) else None,
                "closed": ev.get("closed"),
            }
        )
    save_csv("fs1_open_events.csv", rows)
    print(f"Open events: {len(rows)}. Next: 02_build_feature_table.py")

if __name__ == "__main__":
    main()
