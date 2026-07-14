"""Shared helpers for Stanford Earth–Space labs."""
from __future__ import annotations

import json
import sys
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "out"
OUT.mkdir(exist_ok=True)

EONET = "https://eonet.gsfc.nasa.gov/api/v3"
TLE = "https://tle.ivanstanojevic.me/api/tle"
LL2 = "https://ll.thespacedevs.com/2.2.0"

SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "aiEngineering-DataML-learningPack/earth-space-labs"})


def get_json(url: str, params: dict | None = None, timeout: int = 45) -> dict | list:
    try:
        r = SESSION.get(url, params=params, timeout=timeout)
        r.raise_for_status()
        return r.json()
    except requests.RequestException as e:
        print(f"Network error fetching {url}: {e}", file=sys.stderr)
        print("These labs require network (runtime_fetch).", file=sys.stderr)
        raise SystemExit(1) from e


def save_json(name: str, data) -> Path:
    path = OUT / name
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"Wrote {path}")
    return path


def save_csv(name: str, rows: list[dict]) -> Path:
    import pandas as pd

    path = OUT / name
    pd.DataFrame(rows).to_csv(path, index=False)
    print(f"Wrote {path} ({len(rows)} rows)")
    return path
