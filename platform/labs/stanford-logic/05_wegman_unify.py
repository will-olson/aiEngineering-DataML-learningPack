#!/usr/bin/env python3
"""Wegman-inspired term unifier (Logica analogue).

Variables: identifiers starting with uppercase (X, Y, Foo).
Constants/functors: lowercase start (a, f, iss).
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _common import (  # noqa: E402
    OUT,
    ParseError,
    apply_subst,
    die,
    fmt_term,
    parse_term,
    unify,
)


def main() -> None:
    if len(sys.argv) >= 3:
        left_s, right_s = sys.argv[1], sys.argv[2]
    else:
        left_s, right_s = "f(X,a)", "f(b,Y)"
    try:
        left = parse_term(left_s)
        right = parse_term(right_s)
        subst = unify(left, right)
    except ParseError as e:
        die(f"Parse error: {e}")
    print("# Wegman unify")
    print(f"left:  {left_s}")
    print(f"right: {right_s}")
    if subst is None:
        print("result: FAIL (not unifiable)")
    else:
        pretty = {k: fmt_term(apply_subst(v, subst)) for k, v in subst.items()}
        print("result: OK")
        print("subst:", pretty)
        print("leftσ: ", fmt_term(apply_subst(left, subst)))
        print("rightσ:", fmt_term(apply_subst(right, subst)))
    out = OUT / "wegman_unify.json"
    out.write_text(
        json.dumps(
            {
                "left": left_s,
                "right": right_s,
                "ok": subst is not None,
                "subst": (
                    {k: fmt_term(apply_subst(v, subst)) for k, v in subst.items()}
                    if subst is not None
                    else None
                ),
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()
