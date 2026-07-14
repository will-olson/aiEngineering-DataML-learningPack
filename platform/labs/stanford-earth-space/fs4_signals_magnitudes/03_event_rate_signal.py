#!/usr/bin/env python3
"""FS4 step 3 — Event-rate signal (daily counts + moving average)."""
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import EONET, OUT, get_json, save_csv

def main() -> None:
    data = get_json(f"{EONET}/events", {"status": "all", "days": 30, "limit": 200})
    dates = []
    for ev in data.get("events", []):
        for g in ev.get("geometry") or []:
            d = g.get("date")
            if d:
                dates.append(d[:10])
    if not dates:
        print("No dated geometries.")
        return
    s = pd.Series(dates).value_counts().sort_index()
    df = s.rename("event_count").to_frame()
    df["ma3"] = df["event_count"].rolling(3, min_periods=1).mean()
    df.to_csv(OUT / "fs4_event_rate.csv")
    print(df.tail(10).to_string())
    print(f"Wrote {OUT / 'fs4_event_rate.csv'} — treat counts as a 1-D signal (EE261 intuition).")

if __name__ == "__main__":
    main()
