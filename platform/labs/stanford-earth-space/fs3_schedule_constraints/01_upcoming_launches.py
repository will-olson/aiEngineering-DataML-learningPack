#!/usr/bin/env python3
"""FS3 step 1 — Upcoming launches (EE364 windows / CS106 client)."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import LL2, get_json, save_csv, save_json

def main() -> None:
    data = get_json(f"{LL2}/launch/upcoming/", {"limit": 25})
    save_json("fs3_upcoming_raw.json", data)
    rows = []
    for L in data.get("results", []):
        pad = L.get("pad") or {}
        loc = (pad.get("location") or {}).get("name")
        lsp = L.get("launch_service_provider") or {}
        st = L.get("status") or {}
        rows.append(
            {
                "id": L.get("id"),
                "name": L.get("name"),
                "net": L.get("net"),
                "window_start": L.get("window_start"),
                "window_end": L.get("window_end"),
                "status_id": st.get("id"),
                "status": st.get("abbrev") or st.get("name"),
                "lsp_id": lsp.get("id"),
                "lsp": lsp.get("name"),
                "pad": pad.get("name"),
                "location": loc,
            }
        )
    save_csv("fs3_upcoming.csv", rows)
    print(f"Upcoming launches: {len(rows)}. Next: 02_window_filters.py")

if __name__ == "__main__":
    main()
