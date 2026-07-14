#!/usr/bin/env python3
"""FS1 step 1 — Fetch open EONET events + categories / GeoJSON / layers metadata."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from _common import EONET, get_json, save_csv, save_json


def main() -> None:
    cats = get_json(f"{EONET}/categories", expect_keys=["categories"])
    save_json("fs1_categories.json", cats)

    # Prefer wildfires category id when present for one-hot / GeoJSON demos
    wildfire_id = None
    for c in cats.get("categories", []):
        if str(c.get("id", "")).lower() == "wildfires" or "wildfire" in str(c.get("title", "")).lower():
            wildfire_id = c.get("id")
            break

    data = get_json(
        f"{EONET}/events",
        {"status": "open", "limit": 50},
        expect_keys=["events"],
    )
    save_json("fs1_open_events.json", data)

    geo_params = {"category": "wildfires", "status": "open"}
    if wildfire_id and wildfire_id != "wildfires":
        geo_params["category"] = wildfire_id
    geo = get_json(f"{EONET}/events/geojson", geo_params, expect_keys=["features"])
    save_json("fs1_wildfires_geojson.json", geo)

    layers = get_json(f"{EONET}/layers/wildfires", optional=True)
    if layers is not None:
        if isinstance(layers, dict):
            trimmed = {k: layers[k] for k in list(layers)[:8]}
            save_json("fs1_layers_wildfires_trim.json", trimmed)
        else:
            save_json("fs1_layers_wildfires_trim.json", layers)
    else:
        print("Layers endpoint optional — continuing without it", file=sys.stderr)

    # Sample regional bbox (CONUS-ish) for FS2-style overlays
    bbox = get_json(
        f"{EONET}/events",
        {"bbox": "-125,-50,-66,49", "status": "open", "limit": 25},
        expect_keys=["events"],
    )
    save_json("fs1_bbox_open_events.json", bbox)

    rows = []
    for ev in data.get("events", []):
        cats_s = ",".join(c.get("title", "") for c in ev.get("categories", []))
        cat_ids = ",".join(str(c.get("id", "")) for c in ev.get("categories", []))
        srcs = ",".join(s.get("id", "") for s in ev.get("sources", []))
        geoms = ev.get("geometry") or []
        g0 = geoms[0] if geoms else {}
        coords = g0.get("coordinates") if isinstance(g0, dict) else None
        lon = lat = None
        if isinstance(coords, list) and len(coords) >= 2 and not isinstance(coords[0], list):
            lon, lat = coords[0], coords[1]
        rows.append(
            {
                "id": ev.get("id"),
                "title": ev.get("title"),
                "categories": cats_s,
                "category_ids": cat_ids,
                "sources": srcs,
                "geometry_type": (g0.get("type") if isinstance(g0, dict) else None),
                "geometry_date": g0.get("date") if isinstance(g0, dict) else None,
                "lon": lon,
                "lat": lat,
                "closed": ev.get("closed"),
            }
        )
    save_csv("fs1_open_events.csv", rows)
    print(
        f"Open events: {len(rows)}; GeoJSON features: {len(geo.get('features', []))}. "
        "Next: 02_build_feature_table.py"
    )


if __name__ == "__main__":
    main()
