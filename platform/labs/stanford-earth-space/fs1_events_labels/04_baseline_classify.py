#!/usr/bin/env python3
"""FS1 step 4 — Tiny sklearn baseline; handoff to pps-decision-tree."""
import sys
from pathlib import Path

import pandas as pd
from sklearn.metrics import accuracy_score, classification_report
from sklearn.tree import DecisionTreeClassifier

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import OUT

def main() -> None:
    train = pd.read_csv(OUT / "fs1_train.csv")
    test = pd.read_csv(OUT / "fs1_test.csv")
    feature_cols = [c for c in train.columns if c.startswith("cat_") or c in ("n_sources", "is_polygon", "is_point", "dow")]
    if test.empty or train["label_wildfire"].nunique() < 2:
        print("Insufficient data for baseline—inspect fs1_labeled.csv. Try again when more open wildfires exist.")
        print("WhatNext: Build lab pps-decision-tree for a fuller sklearn walkthrough.")
        return
    Xtr, ytr = train[feature_cols].fillna(0), train["label_wildfire"]
    Xte, yte = test[feature_cols].fillna(0), test["label_wildfire"]
    clf = DecisionTreeClassifier(max_depth=3, random_state=42)
    clf.fit(Xtr, ytr)
    pred = clf.predict(Xte)
    print("Accuracy:", round(accuracy_score(yte, pred), 3))
    print(classification_report(yte, pred, zero_division=0))
    print("WhatNext: /build/python-practice/pps-decision-tree or continue FS2.")

if __name__ == "__main__":
    main()
