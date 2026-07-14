#!/usr/bin/env python3
"""Babbage-inspired truth table generator (Logica analogue)."""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _common import OUT, ParseError, die, parse, truth_table  # noqa: E402


def main() -> None:
    formula = sys.argv[1] if len(sys.argv) > 1 else "(P => Q) & (Q => R)"
    try:
        names, rows = truth_table(formula)
    except ParseError as e:
        die(f"Parse error: {e}")
    print(f"# Babbage truth table for: {formula}")
    header = " | ".join(names + ["φ"])
    print(header)
    print("-|-".join(["---"] * (len(names) + 1)))
    for world, val in rows:
        bits = ["T" if world[n] else "F" for n in names]
        bits.append("T" if val else "F")
        print(" | ".join(bits))
    payload = {
        "formula": formula,
        "atoms": names,
        "rows": [{**{k: v for k, v in w.items()}, "phi": val} for w, val in rows],
    }
    out = OUT / "babbage_table.json"
    out.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"\nWrote {out}")


if __name__ == "__main__":
    main()
