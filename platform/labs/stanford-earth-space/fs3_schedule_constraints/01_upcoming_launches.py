#!/usr/bin/env python3
"""FS3 step 1 — Upcoming launches + LL2 config (statuses, agencies, pads)."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import LL2, get_json, save_csv, save_json


def main() -> None:
    statuses = get_json(f"{LL2}/config/launchstatus/", expect_keys=["results"])
    save_json("fs3_launch_statuses.json", statuses)
    go_ids = [
        s.get("id")
        for s in statuses.get("results", [])
        if str(s.get("abbrev", "")).lower() in {"go", "tbd"}
        or "go" in str(s.get("name", "")).lower()
    ]
    featured = get_json(
        f"{LL2}/agencies/",
        {"featured": "true", "limit": 20},
        expect_keys=["results"],
    )
    save_json("fs3_featured_agencies.json", featured)
    spacex = next(
        (a for a in featured.get("results", []) if "spacex" in str(a.get("name", "")).lower()),
        None,
    )
    lsp_id = (spacex or {}).get("id") or 121

    pads = get_json(f"{LL2}/pad/", {"limit": 10}, expect_keys=["results"], optional=True)
    if pads:
        save_json("fs3_pads_sample.json", pads)

    # Server-side filter demo: featured LSP + Go-ish status when known
    params: dict = {"limit": 25, "lsp__id": lsp_id}
    if go_ids:
        params["status"] = go_ids[0]
    filtered_live = get_json(
        f"{LL2}/launch/upcoming/",
        params,
        expect_keys=["results"],
        optional=True,
    )
    if filtered_live:
        save_json("fs3_upcoming_server_filtered.json", filtered_live)

    data = get_json(f"{LL2}/launch/upcoming/", {"limit": 25}, expect_keys=["results"])
    save_json("fs3_upcoming_raw.json", data)
    rows = []
    for L in data.get("results", []):
        pad = L.get("pad") or {}
        loc = (pad.get("location") or {}).get("name")
        lsp = L.get("launch_service_provider") or {}
        st = L.get("status") or {}
        rocket = L.get("rocket") or {}
        cfg = rocket.get("configuration") or {}
        mission = L.get("mission") or {}
        rows.append(
            {
                "id": L.get("id"),
                "name": L.get("name"),
                "net": L.get("net"),
                "window_start": L.get("window_start"),
                "window_end": L.get("window_end"),
                "status_id": st.get("id"),
                "status": st.get("abbrev") or st.get("name"),
                "lsp_id": lsp.get("id"),
                "lsp": lsp.get("name"),
                "pad": pad.get("name"),
                "location": loc,
                "rocket": cfg.get("full_name") or cfg.get("name") or rocket.get("id"),
                "mission": mission.get("name"),
                "mission_type": mission.get("type"),
            }
        )
    save_csv("fs3_upcoming.csv", rows)
    save_json(
        "fs3_filter_hints.json",
        {"preferred_lsp_id": lsp_id, "go_status_ids": go_ids, "spacex_name": (spacex or {}).get("name")},
    )
    print(f"Upcoming launches: {len(rows)}; preferred LSP id={lsp_id}. Next: 02_window_filters.py")


if __name__ == "__main__":
    main()
