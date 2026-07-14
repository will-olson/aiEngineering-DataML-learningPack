#!/usr/bin/env python3
"""FS3 step 2 — Filter launches using LL2 config hints (not hardcoded 121/1)."""
import json
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

    hints_path = OUT / "fs3_filter_hints.json"
    lsp_id = 121
    go_ids = [1]
    if hints_path.exists():
        hints = json.loads(hints_path.read_text())
        lsp_id = hints.get("preferred_lsp_id") or lsp_id
        go_ids = hints.get("go_status_ids") or go_ids

    filtered = df[
        (df["lsp_id"] == lsp_id) | (df["status_id"].isin(go_ids))
    ].copy()
    filtered.to_csv(OUT / "fs3_filtered.csv", index=False)
    print(f"Feasible set size {len(filtered)} / {len(df)} (lsp={lsp_id}, status in {go_ids})")
    print("Next: 03_rank_under_prefs.py")


if __name__ == "__main__":
    main()
