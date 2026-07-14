# Constraint encodings over API kit facts

Russell-style constraint satisfaction for schedule / event reasoning. Complements Earth–Space **FS3** (Scheduling, Windows & Constraints).

## Hard vs soft (FS3 mapping)

| Kind | Logic form | API kit example |
|------|------------|-----------------|
| Hard | Must be true in every model | `Status_Go \| Status_TBD` (launch must have a known readiness class) |
| Soft | Prefer models that satisfy | `Prefer_Go` ranking → prefer worlds where `Status_Go` |
| Exclusion | Forbid combination | `~(Status_Hold & Prefer_Go)` when Go preference is active |

## Example constraint set (offline demo)

Premises (CNF-friendly):

1. `Status_Go | Status_TBD | Status_Hold` — readiness atom from LL2 status table
2. `Prefer_Go => Status_Go` — soft preference encoded as implication when Prefer_Go is assumed true
3. `Sat_ISS => Track_ISS` — TLE collection consistency
4. `OpenEvent_wildfires => Cat_wildfires` — EONET category consistency

Query (entailment / SAT):

- Is `{Prefer_Go, Status_TBD}` satisfiable with (2)? → **No** if Prefer_Go forces Status_Go.
- Is `{Status_Go, Sat_ISS, Track_ISS, OpenEvent_wildfires, Cat_wildfires}` satisfiable? → **Yes**.

## Lab entrypoint

```bash
cd platform/labs/stanford-logic
python3 04_russell_constraints_from_apis.py
# optional live peek (network):
python3 04_russell_constraints_from_apis.py --live
```

`--live` may refresh LL2 `/config/launchstatus/` and EONET `/categories` using the same base URLs as `platform/labs/stanford-earth-space/_common.py`; offline mode never requires network.

## Cross-links

- Kit statuses: [../launch-library/ll2Statuses.md](../launch-library/ll2Statuses.md)
- Feature set FS3: `schedule-constraints` in `data/catalog/feature-sets.json`
- Lessons: propositional analysis L3, model checking L9 — [157_introToLogic](../../stanfordLectureTranscripts/157_introToLogic/INDEX.md)
