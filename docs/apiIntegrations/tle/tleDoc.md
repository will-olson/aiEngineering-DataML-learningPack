# TLE API documentation (local kit)

Fetched / summarized for lab use. Upstream: https://tle.ivanstanojevic.me/#/docs  
**Auth:** none. Prefer calling from Python labs (CORS: No).

## Fields (Tle)

| Name | Description |
|------|-------------|
| satelliteId | NORAD catalog id (integer) |
| name | Common / catalog name |
| date | Epoch of the TLE element set (ISO-8601) |
| line1 / line2 | Classical two-line element strings |

## Collection response (Hydra)

| Name | Description |
|------|-------------|
| totalItems | Total matching satellites |
| member | Array of `Tle` objects (paged) |

Query params include `search` (name substring) and Hydra pagination (`page`).

## Propagation result (`SatellitePropagationResult`)

| Name | Description |
|------|-------------|
| algorithm | Propagator used (e.g. `SGP4`) |
| vector.position / velocity | ECI state (km, km/s) |
| geodetic | latitude, longitude, altitude |
| parameters.date | Propagation instant |

## Endpoints

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/tle/` | List / search |
| GET | `/api/tle/{id}` | One TLE |
| GET | `/api/tle/{id}/propagate?date=` | State at time (UTC) |

## Examples (labs FS2 / FS5)

```bash
curl -s "https://tle.ivanstanojevic.me/api/tle/?search=ISS" | head
curl -s "https://tle.ivanstanojevic.me/api/tle/25544/propagate?date=2026-07-13T12:00:00Z"
```

Attribution: data derived from public TLE sources via this API; follow upstream terms.
