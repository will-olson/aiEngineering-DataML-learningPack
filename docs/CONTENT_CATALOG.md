# Content Catalog

Ontology and indexing contract for mapping vendored forks into progressive learning modules. Parallel agents use this document to build overlay catalog records—**not** to mutate files under `forks/`.

Related: [ARCHITECTURE.md](ARCHITECTURE.md) · [FRONTEND_EXPERIENCE.md](FRONTEND_EXPERIENCE.md) · [AGENT_BUILDOUT.md](AGENT_BUILDOUT.md)

## Goals

- Hide multi-repo structure behind tracks, modules, and product areas.
- Support guided suggestions (level, progress, product area, offline preference).
- Preserve honest availability: local vs link-only vs runtime-fetch.

## Non-goals

- Rehosting third-party datasets wholesale without explicit curation.
- Rewriting upstream READMEs/LICENSEs inside forks.
- Treating the full corpus as the default browse surface (curate “Recommended” first).

## Module types (`modality`)

| Value | Description |
|-------|-------------|
| `lesson` | Instructive chapter, notebook, or Quarto section |
| `lab` | Guided hands-on exercise (often with runtime fetch) |
| `project` | Open-ended or multi-step applied build |
| `reference` | Catalog entry, cheat-sheet style resource, or index |
| `reading` | Paper, blog, or case study (usually external URL) |

## Learner levels

Ordered progression used for filters and suggestions:

1. `beginner`
2. `intermediate`
3. `advanced`
4. `production`

UI labels may capitalize these; API values stay lowercase snake-case as above.

## Product areas

Every catalog record carries one primary `product_area`:

| Value | User intent | Typical modalities |
|-------|-------------|-------------------|
| `learn` | Instructive modules | `lesson` |
| `build` | Applied labs and projects | `lab`, `project` |
| `discover` | Datasets and APIs | `reference` |
| `read` | Production ML literacy | `reading` |

`Progress` is a UI surface over progress + suggestions, not a content `product_area` tag.

## Progressive tracks

Suggested tracks for onboarding path pickers and Track dropdowns:

| Track id | Title | Primary substrate | Default levels |
|----------|-------|-------------------|----------------|
| `python-ds` | Python Data Science | `PythonDataScienceHandbook` | beginner → advanced |
| `r-ds` | R for Data Science | `r4ds` | beginner → intermediate |
| `de-zoomcamp` | Data Engineering Zoomcamp | `data-engineering-zoomcamp` | intermediate → advanced |
| `applied-ml-reading` | Applied ML in Production | `applied-ml` | intermediate → production |
| `python-practice` | Python Practice Projects | `Python-project-Scripts` | beginner → intermediate |
| `discover-data` | Discover Datasets & APIs | `awesome-public-datasets`, `public-apis` | all |

Tracks are ordered lists of module `id`s in the overlay index (`tracks[].module_ids`).

## Per-fork inventory sketch

| Fork | Primary artifacts | Availability | Product areas |
|------|-------------------|--------------|---------------|
| `r4ds` | Quarto `.qmd` chapters, sample `data/`, diagrams | Mostly **local** | `learn` |
| `PythonDataScienceHandbook` | Jupyter notebooks, small CSVs under notebook data dirs | Mostly **local** | `learn` |
| `data-engineering-zoomcamp` | Week modules, workshops, scripts; labs reference external TLC data | Materials **local**; lab data **runtime-fetch** | `learn`, `build` |
| `applied-ml` | Large curated `README.md` of links | **Link-only** | `read` |
| `Python-project-Scripts` | Categorized Python apps/scripts | Mostly **local** (some call live APIs) | `build` |
| `public-apis` | Curated API list in `README.md` + validation scripts | **Link-only** (APIs need network) | `discover` |
| `awesome-public-datasets` | `README.rst` index + sample `Datasets/titanic.csv.zip` | Index **link-only**; titanic sample **local** | `discover` |

## Catalog record schema

Overlay records (JSON/YAML under e.g. `data/catalog/` or `platform/catalog/`) SHOULD include:

```json
{
  "id": "pdsh-05-02-introducing-sklearn",
  "title": "Introducing Scikit-Learn",
  "source_path": "forks/PythonDataScienceHandbook/notebooks_v1/05.02-Introducing-Scikit-Learn.ipynb",
  "source_fork": "PythonDataScienceHandbook",
  "product_area": "learn",
  "modality": "lesson",
  "level": "intermediate",
  "skills": ["python", "scikit-learn", "ml"],
  "prerequisites": ["pdsh-05-01-what-is-ml"],
  "offline_ok": true,
  "availability": "local",
  "estimated_minutes": 45,
  "track_ids": ["python-ds"],
  "next_ids": ["pdsh-05-03-hyperparameters"],
  "tags": ["supervised-learning"],
  "external_url": null,
  "license_note": "See fork LICENSE",
  "summary": "Optional one-line blurb for lists and suggestions"
}
```

### Field reference

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | Stable slug; never reuse for different content |
| `title` | string | yes | User-facing |
| `source_path` | string | yes* | Repo-relative path; *nullable if pure external reading |
| `source_fork` | string | yes | Folder name under `forks/` |
| `product_area` | enum | yes | `learn` \| `build` \| `discover` \| `read` |
| `modality` | enum | yes | See module types |
| `level` | enum | yes | See learner levels |
| `skills` | string[] | yes | Lowercase skill tags for filters |
| `prerequisites` | string[] | no | Other module `id`s |
| `offline_ok` | boolean | yes | True only if usable without network |
| `availability` | enum | yes | `local` \| `link_only` \| `runtime_fetch` |
| `estimated_minutes` | number | no | For sort and display |
| `track_ids` | string[] | no | Tracks this module belongs to |
| `next_ids` | string[] | no | Explicit succession for suggestions |
| `tags` | string[] | no | Extra facets (topic, tool) |
| `external_url` | string \| null | no | Canonical external link when applicable |
| `license_note` | string | no | Attribution hint |
| `summary` | string | no | Suggestion/list blurb |

### Track schema

```json
{
  "id": "python-ds",
  "title": "Python Data Science",
  "product_area": "learn",
  "description": "Core libraries via the Python Data Science Handbook",
  "module_ids": ["pdsh-index", "pdsh-02-01-understanding-data-types", "..."],
  "default_level": "beginner"
}
```

## Suggestion-oriented fields

Rule-based suggestion engines (see Architecture) consume:

- `level`, `product_area`, `offline_ok`
- `prerequisites`, `next_ids`, `track_ids`
- `skills` / `tags` for cross-area links (e.g. lesson → practice script → dataset)
- User progress: last completed `id`, selected level, sticky filters

Prefer explicit `next_ids` within a track; fall back to “next incomplete module in same `track_ids`.”

## Indexing guidance for agents

1. Start with **track spines**, not full fork crawls (handbook indexes, zoomcamp week folders, r4ds chapter list).
2. For `applied-ml` / `public-apis` / `awesome-public-datasets`, parse headings/categories into `reference`/`reading` records with `external_url`; set `offline_ok: false` unless a file is vendored locally.
3. Cap initial Recommended slices per track (e.g. first 5–10 modules) so the UI default stays curated.
4. Emit fixture JSON early so frontend agents can stub filters and suggestion rails.

## Example skill tags

`python`, `r`, `pandas`, `numpy`, `matplotlib`, `scikit-learn`, `docker`, `terraform`, `sql`, `spark`, `kafka`, `dbt`, `api`, `dataset`, `feature-store`, `recsys`, `nlp`, `mlops`
