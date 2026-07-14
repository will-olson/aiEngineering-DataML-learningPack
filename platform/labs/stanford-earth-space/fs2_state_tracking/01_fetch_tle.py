#!/usr/bin/env python3
"""FS2 step 1 — Fetch ISS TLE (EE263/CS223A state acquisition)."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import TLE, get_json, save_json

def main() -> None:
    tle = get_json(f"{TLE}/25544")
    save_json("fs2_iss_tle.json", tle)
    print(f"ISS TLE epoch {tle.get('date')}")
    print("line1:", tle.get("line1"))
    print("Next: 02_propagate_sample.py")

if __name__ == "__main__":
    main()
