#!/usr/bin/env python3
"""FS1 step 3 — Define labels and stratified train/test split narrative."""
import sys
from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import OUT

def main() -> None:
    src = OUT / "fs1_features.csv"
    if not src.exists():
        print("Run 02_build_feature_table.py first", file=sys.stderr)
        raise SystemExit(1)
    df = pd.read_csv(src)
    # Label: wildfire-like vs other (supervised framing demo)
    df["label_wildfire"] = df["category_primary"].str.contains("Wildfire", case=False, na=False).astype(int)
    feature_cols = [c for c in df.columns if c.startswith("cat_") or c in ("n_sources", "is_polygon", "is_point", "dow")]
    X = df[feature_cols].fillna(0)
    y = df["label_wildfire"]
    if y.nunique() < 2 or len(df) < 4:
        print("Not enough class diversity for a split; writing full table as train.")
        df["split"] = "train"
        train, test = df, df.iloc[0:0]
    else:
        train_idx, test_idx = train_test_split(
            df.index, test_size=0.25, random_state=42, stratify=y
        )
        df.loc[train_idx, "split"] = "train"
        df.loc[test_idx, "split"] = "test"
        train, test = df.loc[train_idx], df.loc[test_idx]
    df.to_csv(OUT / "fs1_labeled.csv", index=False)
    train.to_csv(OUT / "fs1_train.csv", index=False)
    test.to_csv(OUT / "fs1_test.csv", index=False)
    print(f"Train {len(train)} / Test {len(test)}. Positive wildfire rate train={train['label_wildfire'].mean():.2f}")
    print("Next: 04_baseline_classify.py")

if __name__ == "__main__":
    main()
