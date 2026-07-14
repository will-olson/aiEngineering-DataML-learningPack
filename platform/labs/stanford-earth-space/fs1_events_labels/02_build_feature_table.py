#!/usr/bin/env python3
"""FS1 step 2 — Engineer features from EONET open events (incl. category ids / coords)."""
import sys
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
    df["n_sources"] = df["sources"].fillna("").apply(
        lambda s: len([x for x in str(s).split(",") if x])
    )
    df["is_polygon"] = (df["geometry_type"] == "Polygon").astype(int)
    df["is_point"] = (df["geometry_type"] == "Point").astype(int)
    if "lon" in df.columns and "lat" in df.columns:
        df["has_coords"] = (df["lon"].notna() & df["lat"].notna()).astype(int)
    else:
        df["has_coords"] = 0
    df["category_primary"] = df["categories"].fillna("").apply(
        lambda s: str(s).split(",")[0].strip() if str(s).strip() else "Unknown"
    )
    # one-hot by category id when available
    if "category_ids" in df.columns:
        primary_id = df["category_ids"].fillna("").apply(
            lambda s: str(s).split(",")[0].strip() if str(s).strip() else ""
        )
        for cid in primary_id.value_counts().head(6).index.tolist():
            if not cid:
                continue
            col = "catid_" + "".join(ch if ch.isalnum() else "_" for ch in str(cid))[:24]
            df[col] = (primary_id == cid).astype(int)
    top = df["category_primary"].value_counts().head(6).index.tolist()
    for c in top:
        col = "cat_" + "".join(ch if ch.isalnum() else "_" for ch in c)[:24]
        df[col] = (df["category_primary"] == c).astype(int)
    df["dow"] = (
        pd.to_datetime(df["geometry_date"], errors="coerce").dt.dayofweek.fillna(-1).astype(int)
    )
    out = OUT / "fs1_features.csv"
    df.to_csv(out, index=False)
    print(f"Wrote {out} with engineered columns. Next: 03_label_and_split.py")


if __name__ == "__main__":
    main()
