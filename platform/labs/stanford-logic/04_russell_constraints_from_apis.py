#!/usr/bin/env python3
"""Russell-inspired constraint satisfier over apiIntegrations snapshot worlds.

Bridge to Earth–Space FS3: encode Launch Library / EONET / TLE facts as
propositional constraints and search for a satisfying assignment.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _common import (  # noqa: E402
    DEFAULT_WORLDS,
    EONET,
    LL2,
    OUT,
    cnf_clauses,
    die,
    merged_default_world,
    sat,
)

# Hard/soft demo constraints (see docs/apiIntegrations/logica/logicaConstraints.md)
DEFAULT_CONSTRAINTS = [
    "Status_Go | Status_TBD | Status_Hold",
    "Prefer_Go => Status_Go",
    "Sat_ISS => Track_ISS",
    "OpenEvent_wildfires => Cat_wildfires",
]


def maybe_live_refresh() -> dict[str, bool]:
    """Optional network peek — same bases as stanford-earth-space labs."""
    try:
        import requests
    except ImportError:
        die("requests required for --live (pip install -r requirements.txt)")
    world = merged_default_world()
    session = requests.Session()
    session.headers.update({"User-Agent": "aiEngineering-DataML-learningPack/stanford-logic"})
    try:
        st = session.get(f"{LL2}/config/launchstatus/", timeout=30)
        st.raise_for_status()
        results = st.json().get("results") or []
        abbrevs = {str(r.get("abbrev", "")).replace(" ", "_") for r in results}
        world["Status_Go"] = "Go" in abbrevs or any(r.get("id") == 1 for r in results)
        world["Status_TBD"] = "TBD" in abbrevs or any(r.get("id") == 2 for r in results)
        world["Status_Hold"] = "Hold" in abbrevs or any(r.get("id") == 5 for r in results)
        cats = session.get(f"{EONET}/categories", timeout=30)
        cats.raise_for_status()
        ids = {c.get("id") for c in (cats.json().get("categories") or [])}
        world["Cat_wildfires"] = "wildfires" in ids
        world["Cat_volcanoes"] = "volcanoes" in ids
        world["Cat_severeStorms"] = "severeStorms" in ids
        print("Live refresh: LL2 statuses + EONET categories OK")
    except Exception as e:  # noqa: BLE001
        print(f"Live refresh failed ({e}); using offline snapshots", file=sys.stderr)
    return world


def main() -> None:
    ap = argparse.ArgumentParser(description="Russell SAT over API kit constraints")
    ap.add_argument("--live", action="store_true", help="Refresh status/category atoms via network")
    ap.add_argument(
        "--assume",
        action="append",
        default=[],
        help="Extra unit assumptions, e.g. Prefer_Go or ~Status_Hold",
    )
    args = ap.parse_args()

    snapshot = maybe_live_refresh() if args.live else merged_default_world()
    clauses = []
    for c in DEFAULT_CONSTRAINTS:
        clauses.extend(cnf_clauses(c))
    for a in args.assume:
        a = a.strip()
        if a.startswith("~"):
            clauses.append(frozenset([a]))
        else:
            clauses.append(frozenset([a]))

    print("# Russell constraint satisfier (apiIntegrations bridge)")
    print("Constraints:")
    for c in DEFAULT_CONSTRAINTS:
        print(f"  - {c}")
    for a in args.assume:
        print(f"  - assume {a}")

    # Two queries from logicaConstraints.md
    queries = {
        "prefer_go_with_tbd": [frozenset(["Prefer_Go"]), frozenset(["Status_TBD"])],
        "go_iss_wildfire": [
            frozenset(["Status_Go"]),
            frozenset(["Sat_ISS"]),
            frozenset(["Track_ISS"]),
            frozenset(["OpenEvent_wildfires"]),
            frozenset(["Cat_wildfires"]),
        ],
    }

    results = {}
    for name, extra in queries.items():
        model = sat(list(clauses) + list(extra))
        results[name] = {"satisfiable": model is not None, "model": model}
        print(f"\nQuery {name}: {'SAT' if model else 'UNSAT'}")
        if model:
            # show relevant atoms
            keys = sorted(k for k in model if k.startswith(("Status_", "Sat_", "Track_", "Open", "Cat_", "Prefer")))
            print("  model:", {k: model[k] for k in keys})

    # Also: is the snapshot world itself consistent with hard constraints?
    # Evaluate by forcing snapshot atoms as unit clauses for known keys
    forced = []
    for k, v in snapshot.items():
        forced.append(frozenset([k if v else f"~{k}"]))
    snap_model = sat(list(clauses) + forced)
    results["snapshot_with_constraints"] = {
        "satisfiable": snap_model is not None,
        "note": "Prefer_Go => Status_Go may conflict if Prefer_Go and ~Status_Go",
    }
    print(f"\nSnapshot+constraints: {'SAT' if snap_model else 'UNSAT'}")
    print("Snapshot Prefer_Go / Status_Go:", snapshot.get("Prefer_Go"), snapshot.get("Status_Go"))

    out = OUT / "russell_sat.json"
    out.write_text(
        json.dumps(
            {
                "constraints": DEFAULT_CONSTRAINTS,
                "assumes": args.assume,
                "worlds_doc": "docs/apiIntegrations/logica/logicaWorlds.md",
                "default_world_keys": sorted(merged_default_world()),
                "queries": results,
                "snapshot_parts": {k: sorted(v) for k, v in DEFAULT_WORLDS.items()},
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"\nWrote {out}")


if __name__ == "__main__":
    main()
