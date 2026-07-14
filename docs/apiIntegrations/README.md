# API integration kits

Local, offline-friendly documentation and endpoint snapshots for live APIs used by the learning platform. Pattern: fetch once → store markdown; refresh manually.

| Folder | API | Auth | Feature sets |
|--------|-----|------|----------------|
| [nasa/](nasa/) | NASA EONET v3 | None | FS1, FS4, FS5 |
| [tle/](tle/) | TLE (orbital elements) | None | FS2, FS5 |
| [launch-library/](launch-library/) | Launch Library 2 | None (rate limits) | FS1 labels, FS3, FS5 |

Each folder has `*Links.md` (starter URLs), `*Doc.md` (fields/params), and lookup/sample snapshots. See [STANFORD_EARTH_SPACE.md](../STANFORD_EARTH_SPACE.md) for how these demonstrate Stanford lecture principles.
