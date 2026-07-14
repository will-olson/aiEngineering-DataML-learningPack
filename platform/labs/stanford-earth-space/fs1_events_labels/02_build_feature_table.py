#!/usr/bin/env python3
"""FS1 step 2 — Engineer features from EONET open events."""
import sys
from datetime import datetime
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import OUT

def main() -> None:
    src = OUT / "fs1_open_events.csv"
    if not src.exists():
        print("Run 01_fetch_open_events.py first", file=sys.stderr)
        raise SystemExit(1)
    df = pd.read_csv(src)
    df["n_sources"] = df["sources"].fillna("").apply(lambda s: len([x for x in str(s).split(",") if x]))
    df["is_polygon"] = (df["geometry_type"] == "Polygon").astype(int)
    df["is_point"] = (df["geometry_type"] == "Point").astype(int)
    # category family: first category token
    df["category_primary"] = df["categories"].fillna("").apply(
        lambda s: str(s).split(",")[0].strip() if str(s).strip() else "Unknown"
    )
    # one-hot top categories
    top = df["category_primary"].value_counts().head(6).index.tolist()
    for c in top:
        col = "cat_" + "".join(ch if ch.isalnum() else "_" for ch in c)[:24]
        df[col] = (df["category_primary"] == c).astype(int)
    df["dow"] = pd.to_datetime(df["geometry_date"], errors="coerce").dt.dayofweek.fillna(-1).astype(int)
    out = OUT / "fs1_features.csv"
    df.to_csv(out, index=False)
    print(f"Wrote {out} with engineered columns. Next: 03_label_and_split.py")

if __name__ == "__main__":
    main()
