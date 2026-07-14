# Logica kit — tool documentation

Inspired by [Stanford Logica](http://intrologic.stanford.edu/logica/homepage/index.php). Local labs implement CLI analogues; proof editors remain upstream.

## Tool → lesson map

| Tool | Role | Lessons | Local lab | Upstream |
|------|------|---------|-----------|----------|
| **Babbage** | Truth table generator | L2–L3, L9 | `01_babbage_truth_table.py` | [babbage.php](http://intrologic.stanford.edu/logica/homepage/babbage.php) |
| **Quine** | Sentence evaluator | L2–L3, L8 | `02_quine_evaluate.py` | [quine.php](http://intrologic.stanford.edu/logica/homepage/quine.php) |
| **Stickel** | Clausal form (CNF) | L6, L14 | `03_stickel_cnf.py` | [stickel.php](http://intrologic.stanford.edu/logica/homepage/stickel.php) |
| **Russell** | Constraint satisfier | L3, L9 + FS3 | `04_russell_constraints_from_apis.py` | [russell.php](http://intrologic.stanford.edu/logica/homepage/russell.php) |
| **Wegman** | Unifier | L14 | `05_wegman_unify.py` | [wegman.php](http://intrologic.stanford.edu/logica/homepage/wegman.php) |
| **Herbrand** | Sentence analyzer | L7–L8 | Doc only | [herbrand.php](http://intrologic.stanford.edu/logica/homepage/herbrand.php) |
| **Clarke** | Logic grid editor | L9, L12 | Doc only | [clarke.php](http://intrologic.stanford.edu/logica/homepage/clarke.php) |
| **Hilbert** | Hilbert proof editor | L4 | Upstream | [hilbert](http://intrologic.stanford.edu/logica/documentation/hilbert.html) |
| **Fitch** | Fitch proof editor | L5, L10+ | Upstream | [fitch.php](http://intrologic.stanford.edu/logica/homepage/fitch.php) |
| **Robinson** | Resolution proof editor | L6, L14 | Upstream | [robinson.php](http://intrologic.stanford.edu/logica/homepage/robinson.php) |

## Propositional syntax (labs)

Operators (ASCII, case-insensitive keywords also accepted):

| Form | Meaning |
|------|---------|
| `P`, `Q`, `OpenEvent_wildfires` | Atoms (letters, digits, `_`) |
| `~P` or `not P` | Negation |
| `P & Q` or `P and Q` | Conjunction |
| `P \| Q` or `P or Q` | Disjunction |
| `P => Q` or `P -> Q` | Implication |
| `P <=> Q` or `P <-> Q` | Biconditional |
| `( ... )` | Grouping |

## CLI examples

```bash
# Truth table for implication
python3 01_babbage_truth_table.py 'P => Q'

# Evaluate under a world (atom=true/false pairs)
python3 02_quine_evaluate.py '(P & Q) | ~R' P=1 Q=0 R=0

# Convert to CNF clauses
python3 03_stickel_cnf.py '(P => Q) & (Q => R)'

# SAT over API-derived constraints (offline snapshots by default)
python3 04_russell_constraints_from_apis.py

# Unify two terms
python3 05_wegman_unify.py 'f(X,a)' 'f(b,Y)'
```

## Integration with apiIntegrations

Labs read sibling kit markdown / embedded JSON facts (see [logicaWorlds.md](logicaWorlds.md) and [logicaConstraints.md](logicaConstraints.md)). Atoms such as `LaunchStatus_Go` and `Sat_ISS` mirror fields documented in Launch Library and TLE kits — the same surface Earth–Space FS3/FS2 labs use at runtime.
