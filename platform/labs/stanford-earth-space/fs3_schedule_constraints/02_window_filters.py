#!/usr/bin/env python3
"""FS3 step 2 — Filter launches by agency / date window (feasible set)."""
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import OUT

def main() -> None:
    src = OUT / "fs3_upcoming.csv"
    if not src.exists():
        print("Run 01_upcoming_launches.py first", file=sys.stderr)
        raise SystemExit(1)
    df = pd.read_csv(src)
    df["net_ts"] = pd.to_datetime(df["net"], errors="coerce", utc=True)
    # Soft constraints: SpaceX (121) OR status Go (1)
    filtered = df[(df["lsp_id"] == 121) | (df["status_id"] == 1)].copy()
    filtered.to_csv(OUT / "fs3_filtered.csv", index=False)
    print(f"Feasible set size {len(filtered)} / {len(df)}")
    print("Next: 03_rank_under_prefs.py")

if __name__ == "__main__":
    main()
