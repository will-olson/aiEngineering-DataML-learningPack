#!/usr/bin/env python3
"""Quine-inspired sentence evaluator against a world (Logica analogue)."""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _common import (  # noqa: E402
    OUT,
    ParseError,
    atoms,
    die,
    eval_formula,
    merged_default_world,
    parse,
    parse_world_args,
)


def main() -> None:
    # Usage: 02_quine_evaluate.py 'FORMULA' [Atom=0|1 ...]
    # With no atom args, uses merged DEFAULT_WORLDS from API kit snapshots.
    if len(sys.argv) < 2:
        formula = "OpenEvent_wildfires => Cat_wildfires"
        world = merged_default_world()
    else:
        formula = sys.argv[1]
        if len(sys.argv) > 2:
            world = parse_world_args(sys.argv[2:])
        else:
            world = merged_default_world()
    try:
        node = parse(formula)
        needed = atoms(node)
        missing = needed - set(world)
        if missing:
            # default missing atoms to False with a warning
            for m in missing:
                world[m] = False
            print(f"Warning: defaulted missing atoms to False: {sorted(missing)}", file=sys.stderr)
        result = eval_formula(node, world)
    except ParseError as e:
        die(f"Parse error: {e}")
    except KeyError as e:
        die(str(e))
    print(f"# Quine evaluate")
    print(f"formula: {formula}")
    print(f"world:   { {k: world[k] for k in sorted(atoms(node))} }")
    print(f"value:   {result}")
    out = OUT / "quine_eval.json"
    out.write_text(
        json.dumps({"formula": formula, "world": world, "value": result}, indent=2),
        encoding="utf-8",
    )
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()
