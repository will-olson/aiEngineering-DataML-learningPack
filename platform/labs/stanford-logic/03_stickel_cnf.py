#!/usr/bin/env python3
"""Stickel-inspired clausal form (CNF) converter (Logica analogue)."""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _common import OUT, ParseError, cnf_clauses, die, fmt, parse, to_cnf_ast  # noqa: E402


def main() -> None:
    formula = sys.argv[1] if len(sys.argv) > 1 else "(P => Q) & (Q => R)"
    try:
        node = parse(formula)
        cnf = to_cnf_ast(node)
        clauses = cnf_clauses(formula)
    except (ParseError, ValueError) as e:
        die(f"Error: {e}")
    print(f"# Stickel CNF for: {formula}")
    print(f"CNF AST: {fmt(cnf)}")
    print("Clauses:")
    for i, c in enumerate(clauses, 1):
        print(f"  {i}. {{{', '.join(sorted(c))}}}")
    out = OUT / "stickel_cnf.json"
    out.write_text(
        json.dumps(
            {
                "formula": formula,
                "cnf": fmt(cnf),
                "clauses": [sorted(c) for c in clauses],
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()
