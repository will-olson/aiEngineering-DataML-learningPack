#!/usr/bin/env python3
"""FS5 step 1 — Prefer composing prior out/ artifacts; fall back to live fetch."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import (
    EONET,
    LL2,
    OUT,
    TLE,
    get_json,
    load_csv_rows,
    load_json_out,
    save_json,
)


def main() -> None:
    provenance = {"mode": "compose", "sources": {}}

    eonet = load_json_out("fs1_open_events.json")
    if eonet and eonet.get("events"):
        provenance["sources"]["eonet"] = "out/fs1_open_events.json"
    else:
        eonet = get_json(f"{EONET}/events", {"status": "open", "limit": 20}, expect_keys=["events"])
        provenance["sources"]["eonet"] = "live:/events"
        provenance["mode"] = "mixed" if provenance["mode"] == "compose" else "live"

    ll2 = load_json_out("fs3_upcoming_raw.json")
    if ll2 and ll2.get("results"):
        provenance["sources"]["ll2"] = "out/fs3_upcoming_raw.json"
    else:
        ll2 = get_json(f"{LL2}/launch/upcoming/", {"limit": 10}, expect_keys=["results"])
        provenance["sources"]["ll2"] = "live:/launch/upcoming/"
        provenance["mode"] = "mixed" if provenance.get("mode") == "compose" else "live"

    tle = load_json_out("fs2_iss_tle.json")
    if tle and tle.get("line1"):
        provenance["sources"]["tle"] = "out/fs2_iss_tle.json"
    else:
        tle = get_json(f"{TLE}/25544", expect_keys=["line1", "line2"])
        provenance["sources"]["tle"] = "live:/25544"
        provenance["mode"] = "mixed" if provenance.get("mode") == "compose" else "live"

    # Attach prior feature-table pointers when present (no re-fetch)
    artifacts = {}
    for name in (
        "fs1_features.csv",
        "fs2_iss_trajectory.csv",
        "fs3_ranked.csv",
        "fs4_event_rate.csv",
    ):
        if (OUT / name).exists():
            artifacts[name] = f"out/{name}"
            rows = load_csv_rows(name)
            artifacts[f"{name}__n"] = len(rows or [])

    if provenance["mode"] == "compose" and not any(
        k.startswith("live:") for k in provenance["sources"].values()
    ):
        provenance["mode"] = "compose"
    elif all(str(v).startswith("live:") for v in provenance["sources"].values()):
        provenance["mode"] = "live"

    bundle = {
        "eonet_open": eonet,
        "ll2_upcoming": ll2,
        "tle_iss": tle,
        "prior_artifacts": artifacts,
        "provenance": provenance,
    }
    save_json("fs5_multi_source_bundle.json", bundle)
    print(
        f"Bundle mode={provenance['mode']}: "
        f"{len(eonet.get('events', []))} events, "
        f"{len(ll2.get('results', []))} launches, ISS TLE ok; "
        f"prior artifacts={list(artifacts)}"
    )
    print("Next: 02_unified_feature_bundle.py")


if __name__ == "__main__":
    main()
