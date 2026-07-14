#!/usr/bin/env python3
"""FS3 step 3 — Rank launches under simple weighted preferences (toy objective)."""
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import OUT

def main() -> None:
    src = OUT / "fs3_filtered.csv"
    if not src.exists():
        src = OUT / "fs3_upcoming.csv"
    df = pd.read_csv(src)
    if df.empty:
        print("No launches to rank.")
        return
    # Higher score: Go status, sooner NET, known window
    df["net_ts"] = pd.to_datetime(df["net"], errors="coerce", utc=True)
    soon = df["net_ts"].min()
    df["hours_until"] = (df["net_ts"] - soon).dt.total_seconds() / 3600.0
    df["score"] = 0.0
    df.loc[df["status_id"] == 1, "score"] += 3.0
    df.loc[df["lsp_id"] == 121, "score"] += 1.0
    df["score"] += 1.0 / (1.0 + df["hours_until"].fillna(999))
    ranked = df.sort_values("score", ascending=False)
    ranked.to_csv(OUT / "fs3_ranked.csv", index=False)
    print(ranked[["name", "status", "lsp", "score"]].head(8).to_string(index=False))
    print("Conceptual link: ranking under constraints without a CVX solver (EE364 framing).")

if __name__ == "__main__":
    main()
