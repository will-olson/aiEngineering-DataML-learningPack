#!/usr/bin/env python3
"""FS5 step 3 — Print Ask→Apply concept checklist (lecture principles ↔ fields)."""
CHECKLIST = """
Earth–Space Capstone — concept checklist
========================================
CS229  Features & labels     → eonet/ll2 rows in fs5_unified_features.csv
EE263  State over time       → tle ISS epoch + FS2 trajectory CSV
CS223A Tracking intuition    → satellite geodetic samples vs Earth events
EE364  Windows/constraints   → launch net / window_* / status (FS3)
EE261  Magnitudes as signals → FS4 quake/storm/rate series
CS106  Decomposition         → _common.get_json + per-step scripts

Ask a lecture question → Apply → run this track → Discover apiIntegrations kits:
  docs/apiIntegrations/nasa/
  docs/apiIntegrations/tle/
  docs/apiIntegrations/launch-library/
"""

def main() -> None:
    print(CHECKLIST)

if __name__ == "__main__":
    main()
