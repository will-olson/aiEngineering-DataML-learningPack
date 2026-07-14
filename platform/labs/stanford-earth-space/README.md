# Stanford Earth–Space labs

First-party **feature sets** that use live APIs documented under [`docs/apiIntegrations/`](../../../docs/apiIntegrations/) to demonstrate principles from Stanford lecture transcripts.

| Feature set | Principles | Courses | APIs | Folder |
|-------------|------------|---------|------|--------|
| FS1 Events & Labels | Features, labels, acquisition | CS229, CS106 | EONET (+ LL2) | `fs1_events_labels/` |
| FS2 State & Tracking | State trajectories | EE263, CS223A | TLE (+ EONET) | `fs2_state_tracking/` |
| FS3 Schedule & Constraints | Windows, ranking | EE364, CS106 | Launch Library 2 | `fs3_schedule_constraints/` |
| FS4 Signals & Magnitudes | 1-D signals, rates | EE261, CS229 | EONET | `fs4_signals_magnitudes/` |
| FS5 Capstone | Multi-source fusion | CS229+EE263+CS223A | All three | `fs5_capstone/` |

## Setup

```bash
cd platform/labs/stanford-earth-space
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

Network required (`runtime_fetch`). Outputs land in `out/` (gitignored).

## Starter links

- [nasaLinks.md](../../../docs/apiIntegrations/nasa/nasaLinks.md)
- [tleLinks.md](../../../docs/apiIntegrations/tle/tleLinks.md)
- [ll2Links.md](../../../docs/apiIntegrations/launch-library/ll2Links.md)

Do not mutate `forks/`. Catalog track: `stanford-earth-space`.
