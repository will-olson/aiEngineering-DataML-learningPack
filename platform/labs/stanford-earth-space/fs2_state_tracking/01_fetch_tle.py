#!/usr/bin/env python3
"""FS2 step 1 — Search TLE for ISS + fetch by NORAD id (EE263/CS223A state acquisition)."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import TLE, get_json, save_json


def main() -> None:
    search = get_json(f"{TLE}/", {"search": "ISS"}, expect_keys=["member"], optional=True)
    if search:
        save_json("fs2_tle_search_iss.json", search)
    else:
        search = {"member": []}
        print("TLE search unavailable — using NORAD 25544", file=sys.stderr)
    members = search.get("member") or []
    norad = 25544
    if members:
        norad = int(members[0].get("satelliteId") or members[0].get("norad_id") or norad)
        print(f"Search hit: {members[0].get('name')} → NORAD {norad}")
    else:
        print("Search empty — falling back to ISS NORAD 25544", file=sys.stderr)

    tle = get_json(f"{TLE}/{norad}", expect_keys=["line1", "line2"])
    save_json("fs2_iss_tle.json", tle)
    # Also stash a second catalog hit for comparative work (CSS / HST)
    for label, sid in (("css", 48274), ("hst", 20580)):
        alt = get_json(f"{TLE}/{sid}", expect_keys=["line1", "line2"], optional=True)
        if alt:
            save_json(f"fs2_{label}_tle.json", alt)
            print(f"{label.upper()} TLE ok ({sid})")
        else:
            print(f"Optional {label} TLE unavailable", file=sys.stderr)

    print(f"ISS TLE epoch {tle.get('date')}")
    print("line1:", tle.get("line1"))
    print("Next: 02_propagate_sample.py")


if __name__ == "__main__":
    main()
