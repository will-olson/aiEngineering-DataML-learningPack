# Sample TLE API responses

**Fetched:** 2026-07-13.

## Single TLE (ISS)

```json
{
  "@type": "Tle",
  "satelliteId": 25544,
  "name": "ISS (ZARYA)",
  "date": "2026-07-13T07:33:22+00:00",
  "line1": "1 25544U 98067A   26194.31484285  .00004029  00000+0  81266-4 0  9998",
  "line2": "2 25544  51.6305 170.7871 0006687 290.3592  69.6678 15.48997295575806"
}
```

## Propagate (truncated)

```json
{
  "@type": "SatellitePropagationResult",
  "algorithm": "SGP4",
  "vector": {
    "reference_frame": "ECI",
    "position": { "x": -4039.79, "y": 3847.50, "z": -3883.74, "unit": "km" },
    "velocity": { "x": -6.07, "y": -2.22, "z": 4.11, "unit": "km/s" }
  },
  "geodetic": {
    "latitude": -35.01,
    "longitude": 25.01,
    "altitude": 426.41
  },
  "parameters": { "date": "2026-07-13T12:00:00+00:00", "satelliteId": 25544 }
}
```
