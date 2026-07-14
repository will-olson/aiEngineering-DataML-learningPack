# Logica integration kit

Local, offline-friendly documentation and sample “worlds” for **Logica-inspired** interactive logic tools, wired to Stanford Introduction to Logic (CS157 / Intrologic) and to existing Earth–Space API snapshots.

| | |
|--|--|
| **Auth** | N/A (local Python labs; upstream Logica is free online) |
| **Upstream tools** | [Logica homepage](http://intrologic.stanford.edu/logica/homepage/index.php) |
| **Lesson mirror** | [docs/stanfordLectureTranscripts/157_introToLogic/](../../stanfordLectureTranscripts/157_introToLogic/) |
| **Labs** | [platform/labs/stanford-logic/](../../../platform/labs/stanford-logic/) |
| **In-app kit** | `/discover/kits/logica` · `?tag=logica` |

## Artifacts

| File | Role |
|------|------|
| [logicaLinks.md](logicaLinks.md) | Upstream Logica URLs + local lab entrypoints |
| [logicaDoc.md](logicaDoc.md) | Tool → lesson map, syntax, CLI usage |
| [logicaWorlds.md](logicaWorlds.md) | Propositional worlds derived from nasa/tle/ll2 snapshots |
| [logicaConstraints.md](logicaConstraints.md) | Constraint encodings for FS3-style schedule reasoning |

## Pattern

Same as other kits: **document once → exercise in labs**. Labs load offline snapshots from sibling kits (`nasa/`, `tle/`, `launch-library/`) and optionally refresh live endpoints. Full Fitch / Hilbert / Robinson **web editors** stay upstream; this kit ships CLI analogues for truth tables, evaluation, CNF, SAT, and unification.
