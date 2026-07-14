"""Shared helpers for Stanford Earth–Space labs."""
from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Iterable

import requests

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "out"
OUT.mkdir(exist_ok=True)

EONET = "https://eonet.gsfc.nasa.gov/api/v3"
TLE = "https://tle.ivanstanojevic.me/api/tle"
LL2 = "https://ll.thespacedevs.com/2.2.0"

SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "aiEngineering-DataML-learningPack/earth-space-labs"})


def get_json(
    url: str,
    params: dict | None = None,
    timeout: int = 45,
    *,
    expect_keys: Iterable[str] | None = None,
    soft_empty_lists: bool = True,
    optional: bool = False,
):
    """GET JSON with status + decode + optional top-level key checks."""
    try:
        r = SESSION.get(url, params=params, timeout=timeout)
        r.raise_for_status()
    except requests.RequestException as e:
        print(f"Network error fetching {url}: {e}", file=sys.stderr)
        if optional:
            return None
        print("These labs require network (runtime_fetch).", file=sys.stderr)
        raise SystemExit(1) from e
    try:
        data = r.json()
    except json.JSONDecodeError as e:
        print(f"Invalid JSON from {url}: {e}", file=sys.stderr)
        if optional:
            return None
        raise SystemExit(1) from e
    if expect_keys:
        if not isinstance(data, dict):
            print(f"Expected object JSON from {url}, got {type(data).__name__}", file=sys.stderr)
            if optional:
                return None
            raise SystemExit(1)
        missing = [k for k in expect_keys if k not in data]
        if missing:
            print(f"Missing keys {missing} in response from {url}", file=sys.stderr)
            if optional:
                return None
            raise SystemExit(1)
        if soft_empty_lists:
            for k in expect_keys:
                val = data.get(k)
                if isinstance(val, list) and len(val) == 0:
                    print(f"Warning: empty list for key '{k}' from {url}", file=sys.stderr)
    return data


def load_json_out(name: str):
    path = OUT / name
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def load_csv_rows(name: str) -> list[dict] | None:
    path = OUT / name
    if not path.exists():
        return None
    import pandas as pd

    return pd.read_csv(path).to_dict(orient="records")


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
