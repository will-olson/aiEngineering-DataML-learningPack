# Stanford Logic labs (Logica-inspired)

CLI analogues of [Stanford Logica](http://intrologic.stanford.edu/logica/homepage/index.php) tools,
wired to offline worlds from [`docs/apiIntegrations/`](../../../docs/apiIntegrations/)
(NASA EONET, TLE, Launch Library 2).

Lesson mirror: [`docs/stanfordLectureTranscripts/157_introToLogic/`](../../../docs/stanfordLectureTranscripts/157_introToLogic/)  
Kit docs: [`docs/apiIntegrations/logica/`](../../../docs/apiIntegrations/logica/)

## Setup

```bash
cd platform/labs/stanford-logic
pip install -r requirements.txt   # only needed for --live network refresh
```

Offline demos need **no network** and no third-party packages beyond the stdlib
(except optional `requests` for `04_russell_constraints_from_apis.py --live`).

## Labs

| Script | Logica analogue | What it does |
|--------|-----------------|--------------|
| `01_babbage_truth_table.py` | Babbage | Print truth table for a propositional formula |
| `02_quine_evaluate.py` | Quine | Evaluate a formula under API-snapshot worlds |
| `03_stickel_cnf.py` | Stickel | Convert formula to CNF clauses |
| `04_russell_constraints_from_apis.py` | Russell | SAT over FS3-style constraints from kit facts |
| `05_wegman_unify.py` | Wegman | Unify first-order terms |

```bash
python3 01_babbage_truth_table.py 'P => Q'
python3 02_quine_evaluate.py 'OpenEvent_wildfires => Cat_wildfires'
python3 03_stickel_cnf.py '(P => Q) & (Q => R)'
python3 04_russell_constraints_from_apis.py
python3 05_wegman_unify.py 'f(X,a)' 'f(b,Y)'
```

Artifacts land in `out/`.

## Proof editors

Hilbert / Fitch / Robinson stay upstream — see [logicaLinks.md](../../../docs/apiIntegrations/logica/logicaLinks.md).
