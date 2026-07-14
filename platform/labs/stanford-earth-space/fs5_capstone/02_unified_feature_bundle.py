#!/usr/bin/env python3
"""FS5 step 2 — Unify multi-source bundle + prior out/ tables into provenance rows."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import OUT, load_csv_rows, save_csv


def main() -> None:
    raw = OUT / "fs5_multi_source_bundle.json"
    if not raw.exists():
        print("Run 01_multi_source_bundle.py first", file=sys.stderr)
        raise SystemExit(1)
    bundle = json.loads(raw.read_text())
    provenance = bundle.get("provenance") or {}
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
                "provenance": provenance.get("sources", {}).get("eonet"),
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
                "provenance": provenance.get("sources", {}).get("ll2"),
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
            "provenance": provenance.get("sources", {}).get("tle"),
        }
    )

    # Fold a few rows from prior lab CSVs when present
    for name, api in (
        ("fs1_features.csv", "eonet_features"),
        ("fs2_iss_trajectory.csv", "tle_trajectory"),
        ("fs3_ranked.csv", "ll2_ranked"),
        ("fs4_event_rate.csv", "eonet_rate"),
    ):
        prior = load_csv_rows(name)
        if not prior:
            continue
        for r in prior[:5]:
            rows.append(
                {
                    "source_api": api,
                    "record_id": str(r.get("id") or r.get("t") or r.get("date") or ""),
                    "title": str(r.get("title") or r.get("name") or name),
                    "category_or_status": "prior_artifact",
                    "when": r.get("when") or r.get("net") or r.get("t") or r.get("date"),
                    "provenance": f"out/{name}",
                }
            )

    save_csv("fs5_unified_features.csv", rows)
    print(f"Unified {len(rows)} rows (mode={provenance.get('mode')}). Next: 03_ask_to_apply_checklist.py")


if __name__ == "__main__":
    main()
