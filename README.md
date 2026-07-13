# aiEngineering-DataML-learningPack

Foundation for a **unified progressive-applied learning platform**: instructive modules and applied experiences for learners at every level, built on a curated aggregation of Data/ML engineering resources.

This repository is the **content substrate**. The product experience—catalog, progress, guided navigation across Learn / Build / Discover / Read—is designed to be built on top of it. See [docs/FRONTEND_EXPERIENCE.md](docs/FRONTEND_EXPERIENCE.md) for the UX source of truth.

## Experience vision

A sleek, responsive, polished **minimalist** product that guides users with suggestions and clear filters—hiding multi-repo complexity. Users explore product areas, not raw GitHub trees:

| Product area | User intent |
|--------------|-------------|
| **Learn** | Instructive modules and lessons |
| **Build** | Applied labs and practice projects |
| **Discover** | Datasets and APIs for projects |
| **Read** | Production ML case studies |
| **Progress** | Continue where you left off / next step |

## What this repo is today

Vendored snapshots under [`forks/`](forks/). These are **copies at HEAD** (not git submodules). Nested `.git` directories were removed so this remains a single repository. Shallow clone discarded history only; working-tree content matches upstream HEAD.

Upstream updates must be re-cloned manually into `forks/<name>/`.

Each fork retains its own `LICENSE` and `README` inside its subfolder. Product metadata must live in overlay indexes (see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md))—never rewrite fork contents for platform concerns.

## Learning pillars

| Pillar | Role | Path |
|--------|------|------|
| Fundamentals | R and Python data science books/notebooks | [`forks/r4ds/`](forks/r4ds/), [`forks/PythonDataScienceHandbook/`](forks/PythonDataScienceHandbook/) |
| Data engineering path | End-to-end pipeline course (9 weeks) | [`forks/data-engineering-zoomcamp/`](forks/data-engineering-zoomcamp/) |
| Production ML literacy | Curated papers and industry case studies | [`forks/applied-ml/`](forks/applied-ml/) |
| Hands-on practice | Beginner-to-intermediate Python project scripts | [`forks/Python-project-Scripts/`](forks/Python-project-Scripts/) |
| Discovery catalogs | Public APIs and public datasets indexes | [`forks/public-apis/`](forks/public-apis/), [`forks/awesome-public-datasets/`](forks/awesome-public-datasets/) |

## Content availability model

Thin-looking forks (e.g. `applied-ml`, `public-apis`, `awesome-public-datasets`) are **complete catalogs** on GitHub—not incomplete imports. They primarily link outward.

| Availability | Meaning | Examples |
|--------------|---------|----------|
| **Local** | Content usable offline from this repo | Book/notebook sources, many practice scripts, zoomcamp course materials |
| **Link-only** | Index local; payload on the open web | Most entries in `awesome-public-datasets` and `public-apis`; readings in `applied-ml` |
| **Runtime-fetch** | Labs download data when you run them | NYC TLC taxi CSVs referenced by data-engineering-zoomcamp |

**Rough scale:** ~1.3 GB on disk. Large footprint is mostly `Python-project-Scripts`; catalog forks are intentionally small.

Offline study ≠ fully self-contained. The platform should surface **offline available** vs **needs network** badges and filters (see frontend and architecture docs).

## Included forks

| Path | Source |
|------|--------|
| [`forks/r4ds/`](forks/r4ds/) | [will-olson/r4ds](https://github.com/will-olson/r4ds) |
| [`forks/public-apis/`](forks/public-apis/) | [will-olson/public-apis](https://github.com/will-olson/public-apis) |
| [`forks/awesome-public-datasets/`](forks/awesome-public-datasets/) | [will-olson/awesome-public-datasets](https://github.com/will-olson/awesome-public-datasets) |
| [`forks/data-engineering-zoomcamp/`](forks/data-engineering-zoomcamp/) | [will-olson/data-engineering-zoomcamp](https://github.com/will-olson/data-engineering-zoomcamp) |
| [`forks/applied-ml/`](forks/applied-ml/) | [will-olson/applied-ml](https://github.com/will-olson/applied-ml) |
| [`forks/Python-project-Scripts/`](forks/Python-project-Scripts/) | [will-olson/Python-project-Scripts](https://github.com/will-olson/Python-project-Scripts) |
| [`forks/PythonDataScienceHandbook/`](forks/PythonDataScienceHandbook/) | [will-olson/PythonDataScienceHandbook](https://github.com/will-olson/PythonDataScienceHandbook) |

## Platform documentation

| Document | Audience | Purpose |
|----------|----------|---------|
| [docs/CONTENT_CATALOG.md](docs/CONTENT_CATALOG.md) | Content / indexing agents | Fork → module ontology, levels, tracks, catalog schema |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Backend agents | Bounded contexts, filter/suggest APIs, overlay rules |
| [docs/FRONTEND_EXPERIENCE.md](docs/FRONTEND_EXPERIENCE.md) | Frontend agents | **UX source of truth**—minimalist guided experience, controls, product areas |
| [docs/AGENT_BUILDOUT.md](docs/AGENT_BUILDOUT.md) | All parallel agents | Workstreams, contracts, definitions of done |

## Roadmap stance

1. **Now:** Vendored learning pack + Learn / Build / Discover MVP UI in `platform/web`.
2. **Shared glue:** Cross-area suggestions close the loop—Learn/Discover → Build (`related_lab`), Build → Learn + Discover matches, Discover → **Use in a lab**, plus `last_product_area` bookmarks, shared `WhatNextPanel` / `ResourceBadge`, and per-area sticky filters.
3. **Later:** Read area, local dataset cache, richer lab runtime, mobile filter sheet.

Do not treat `forks/` as the primary user navigation surface. Curate through product areas and the catalog overlay.

## Run the Learn, Build & Discover MVP

Product slices in `platform/web`:

| Area | Track | Routes |
|------|-------|--------|
| **Learn** | `python-ds` | `/learn`, handbook lessons; What next can link Build/Discover |
| **Build** | `python-practice` | `/build`, `LabLauncher` (copyable commands + local-exists honesty); What next → next lab, Learn, or matching dataset/API |
| **Discover** | `discover-data` | `/discover`, Datasets \| APIs; Resource detail can **Use in a lab** |

```bash
cd platform/web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Catalog data lives in [`data/catalog/`](data/catalog/) (read-only over `forks/`). API contract: [`platform/web/openapi.yaml`](platform/web/openapi.yaml) (`GET /api/v1/modules`, `GET /api/v1/resolve/{id}` with `launch` for Build, suggestions including `related_lab` / Discover matches).
