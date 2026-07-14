# Sample propositional worlds (from API kits)

Offline “possible worlds” for Quine / Babbage / Russell labs. Atoms are Boolean; values reflect curated snapshots in sibling kits (not live API state).

## World A — Earth watch (EONET categories + sources)

Derived from EONET category vocabulary and [nasaSources.md](../nasa/nasaSources.md) (source ids exist).

| Atom | Value | Meaning |
|------|-------|---------|
| `Cat_wildfires` | true | Category wildfires is tracked |
| `Cat_severeStorms` | true | Category severeStorms is tracked |
| `Cat_volcanoes` | true | Category volcanoes is tracked |
| `Src_AVO` | true | Alaska Volcano Observatory is a registered source |
| `Src_ABFIRE` | true | Alberta Wildfire is a registered source |
| `OpenEvent_wildfires` | true | Example: open wildfire events exist (lab demo) |
| `OpenEvent_volcanoes` | false | Example: no open volcano events in demo world |

### Sample sentences

- `OpenEvent_wildfires => Cat_wildfires`
- `Src_AVO => Cat_volcanoes`
- `~(OpenEvent_volcanoes & ~Cat_volcanoes)`

## World B — Orbit board (TLE)

Derived from [tleCollections.md](../tle/tleCollections.md).

| Atom | Value | Meaning |
|------|-------|---------|
| `Sat_ISS` | true | NORAD 25544 in curated collection |
| `Sat_HST` | true | Hubble (20580) in collection |
| `Sat_TERRA` | true | TERRA (25994) in collection |
| `Track_ISS` | true | Lab prefers ISS as demo track |
| `Prop_available` | true | Propagate endpoint documented |

### Sample sentences

- `Track_ISS <=> Sat_ISS`
- `Sat_ISS & Prop_available`

## World C — Launch desk (Launch Library 2)

Derived from [ll2Statuses.md](../launch-library/ll2Statuses.md).

| Atom | Value | Meaning |
|------|-------|---------|
| `Status_Go` | true | Status id 1 present in config |
| `Status_TBD` | true | Status id 2 present |
| `Status_Hold` | true | Status id 5 present |
| `Status_Success` | true | Status id 3 present |
| `Prefer_Go` | true | Soft preference: Go over TBD (FS3) |
| `Hard_not_Hold` | false | Example soft constraint flag |

### Sample sentences

- `Prefer_Go => Status_Go`
- `Status_Go | Status_TBD`
- `~(Prefer_Go & Status_Hold)`  (when Prefer_Go is enforced)

## Machine-readable default (labs)

Labs embed the same atoms in `_common.py` as `DEFAULT_WORLDS`. Refresh by re-reading sibling `*Links.md` / snapshots when kits update.
