# API integration kits

Local, offline-friendly documentation and endpoint snapshots for live APIs used by the learning platform. Pattern: fetch once → store markdown; refresh manually.

| Folder | API | Auth | Feature sets | In-app kit |
|--------|-----|------|----------------|------------|
| [nasa/](nasa/) | NASA EONET v3 | None | FS1, FS4, FS5 | `/discover/kits/nasa` · `?tag=eonet` |
| [tle/](tle/) | TLE (orbital elements) | None | FS2, FS5 | `/discover/kits/tle` · `?tag=tle` |
| [launch-library/](launch-library/) | Launch Library 2 | None (rate limits) | FS3, FS5 | `/discover/kits/launch-library` · `?tag=launch-library` |
| [logica/](logica/) | Logica-inspired logic tools (local CLI) | N/A | FS3 bridge + CS157 | `/discover/kits/logica` · `?tag=logica` |

Each API folder has `*Links.md` (starter URLs), `*Doc.md` (fields/params), and lookup/sample snapshots. The Logica kit documents interactive tools and worlds derived from those snapshots. See [STANFORD_EARTH_SPACE.md](../STANFORD_EARTH_SPACE.md) and [STANFORD_INTROLOGIC.md](../STANFORD_INTROLOGIC.md).
