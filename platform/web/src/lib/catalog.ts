import { existsSync, readFileSync, statSync } from "fs";
import path from "path";
import type {
  CatalogModule,
  FeatureSet,
  LaunchHints,
  ModuleSummary,
  SuggestionItem,
  Track,
} from "./types";
import { skillsOverlap } from "./discover";

function repoRoot(): string {
  // platform/web -> repo root
  return path.resolve(process.cwd(), "../..");
}

export function catalogDir(): string {
  return path.join(repoRoot(), "data", "catalog");
}

export function resolveRepoPath(relativePath: string): string {
  const abs = path.resolve(repoRoot(), relativePath);
  const root = repoRoot();
  if (!abs.startsWith(root + path.sep) && abs !== root) {
    throw new Error("Path escapes repository root");
  }
  return abs;
}

let tracksCache: Track[] | null = null;
let modulesCache: CatalogModule[] | null = null;
let featureSetsCache: FeatureSet[] | null = null;

function readJsonArray<T>(filePath: string): T[] {
  if (!existsSync(filePath)) return [];
  return JSON.parse(readFileSync(filePath, "utf8")) as T[];
}

export function loadTracks(): Track[] {
  if (!tracksCache) {
    const base = readJsonArray<Track>(path.join(catalogDir(), "tracks.json"));
    const stanford = readJsonArray<Track>(
      path.join(catalogDir(), "stanford-tracks.json"),
    );
    tracksCache = [...base, ...stanford];
  }
  return tracksCache;
}

export function loadModules(): CatalogModule[] {
  if (!modulesCache) {
    const base = readJsonArray<CatalogModule>(
      path.join(catalogDir(), "modules.json"),
    );
    const stanford = readJsonArray<CatalogModule>(
      path.join(catalogDir(), "stanford-modules.json"),
    );
    modulesCache = [...base, ...stanford];
  }
  return modulesCache;
}

export function askDir(): string {
  return path.join(repoRoot(), "data", "ask");
}

export function isStanfordModule(m: CatalogModule): boolean {
  return (
    m.source_fork === "stanfordLectureTranscripts" ||
    m.id.startsWith("stanford-")
  );
}

export function getTrack(id: string): Track | undefined {
  return loadTracks().find((t) => t.id === id);
}

export function getModule(id: string): CatalogModule | undefined {
  return loadModules().find((m) => m.id === id);
}

export function loadFeatureSets(): FeatureSet[] {
  if (!featureSetsCache) {
    featureSetsCache = readJsonArray<FeatureSet>(
      path.join(catalogDir(), "feature-sets.json"),
    );
  }
  return featureSetsCache;
}

export function getFeatureSet(id: string): FeatureSet | undefined {
  return loadFeatureSets().find((s) => s.id === id);
}

/** Feature sets that list this Discover API module in api_module_ids. */
export function featureSetsForApiModule(moduleId: string): FeatureSet[] {
  return loadFeatureSets().filter((s) => s.api_module_ids.includes(moduleId));
}

/** Feature set that owns a build lab module_id, if any. */
export function featureSetForModule(moduleId: string): FeatureSet | undefined {
  return loadFeatureSets().find((s) => s.module_ids.includes(moduleId));
}

export function toSummary(m: CatalogModule): ModuleSummary {
  return {
    id: m.id,
    title: m.title,
    level: m.level,
    modality: m.modality,
    offline_ok: m.offline_ok,
    availability: m.availability,
    estimated_minutes: m.estimated_minutes,
    skills: m.skills,
    summary: m.summary,
  };
}

/** Derive LabLauncher hints from catalog fields (never executes paths). */
export function buildLaunchHints(m: CatalogModule): LaunchHints | null {
  if (m.product_area !== "build" || !m.source_path) return null;

  let cwd_hint = m.source_path;
  try {
    const abs = resolveRepoPath(m.source_path);
    if (existsSync(abs) && statSync(abs).isFile()) {
      cwd_hint = path.dirname(m.source_path);
    }
  } catch {
    // keep source_path as cwd_hint
  }

  const entry =
    m.entry_file ??
    (cwd_hint !== m.source_path ? path.basename(m.source_path) : null);

  const commands =
    m.launch_commands && m.launch_commands.length > 0
      ? [...m.launch_commands]
      : entry
        ? [`python ${entry.includes(" ") ? `"${entry}"` : entry}`]
        : [];

  return {
    cwd_hint,
    commands,
    requirements_path: m.requirements_path ?? null,
    entry_file: entry,
    notes: m.launch_notes ?? null,
  };
}

function suggestionKind(m: CatalogModule): SuggestionItem["kind"] {
  if (m.product_area === "build") return "related_lab";
  if (m.product_area === "discover") {
    return m.skills.includes("api") ? "matching_api" : "matching_dataset";
  }
  if (m.product_area === "read") return "related_reading";
  return "next_lesson";
}

export interface ModuleFilters {
  product_area?: string;
  level?: string;
  offline_ok?: string;
  skill?: string | string[];
  modality?: string;
  track_id?: string;
  availability?: string;
  tag?: string | string[];
  q?: string;
  sort?: string;
  limit?: string;
}

export function filterModules(filters: ModuleFilters): CatalogModule[] {
  let list = [...loadModules()];

  if (filters.product_area) {
    list = list.filter((m) => m.product_area === filters.product_area);
  }
  if (filters.level) {
    list = list.filter((m) => m.level === filters.level);
  }
  if (filters.offline_ok === "true") {
    list = list.filter((m) => m.offline_ok);
  } else if (filters.offline_ok === "false") {
    list = list.filter((m) => !m.offline_ok);
  }
  if (filters.modality) {
    list = list.filter((m) => m.modality === filters.modality);
  }
  if (filters.track_id) {
    list = list.filter((m) => m.track_ids.includes(filters.track_id!));
  }
  if (filters.availability) {
    list = list.filter((m) => m.availability === filters.availability);
  }
  if (filters.skill) {
    const skills = Array.isArray(filters.skill)
      ? filters.skill
      : [filters.skill];
    list = list.filter((m) => skills.some((s) => m.skills.includes(s)));
  }
  if (filters.tag) {
    const tags = Array.isArray(filters.tag) ? filters.tag : [filters.tag];
    list = list.filter((m) => tags.some((t) => m.tags.includes(t)));
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.summary ?? "").toLowerCase().includes(q) ||
        m.skills.some((s) => s.includes(q)) ||
        m.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  const sort = filters.sort ?? "recommended";
  if (sort === "title") {
    list.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "duration") {
    list.sort(
      (a, b) => (a.estimated_minutes ?? 0) - (b.estimated_minutes ?? 0),
    );
  } else {
    // recommended: preserve track order when track_id set, else catalog order
    if (filters.track_id) {
      const track = getTrack(filters.track_id);
      if (track) {
        const order = new Map(track.module_ids.map((id, i) => [id, i]));
        list.sort(
          (a, b) => (order.get(a.id) ?? 9999) - (order.get(b.id) ?? 9999),
        );
      }
    }
  }

  const limit = filters.limit ? parseInt(filters.limit, 10) : undefined;
  if (limit && Number.isFinite(limit)) {
    list = list.slice(0, limit);
  }

  return list;
}

export function buildSuggestions(params: {
  product_area?: string;
  selected_level?: string;
  active_track_id?: string;
  last_module_id?: string;
  completed_ids?: string[];
  offline_preference?: boolean;
  limit?: number;
}): SuggestionItem[] {
  const limit = Math.min(params.limit ?? 3, 3);
  const completed = new Set(params.completed_ids ?? []);
  const items: SuggestionItem[] = [];
  const modules = loadModules();
  const byId = new Map(modules.map((m) => [m.id, m]));

  const push = (
    m: CatalogModule,
    reason: string,
    kind: SuggestionItem["kind"],
  ) => {
    if (items.length >= limit) return;
    if (completed.has(m.id)) return;
    if (params.last_module_id && m.id === params.last_module_id) return;
    if (items.some((i) => i.module_id === m.id)) return;
    if (params.offline_preference && !m.offline_ok) return;
    if (params.selected_level && m.level !== params.selected_level) {
      // soft: still allow if next in track
    }
    items.push({
      module_id: m.id,
      title: m.title,
      reason,
      kind,
      track_id:
        m.track_ids.find((t) => t === "stanford-earth-space") ??
        m.track_ids[0] ??
        null,
    });
  };

  const area = params.product_area;
  const defaultTrack =
    area === "discover"
      ? "discover-data"
      : area === "build"
        ? "python-practice"
        : "python-ds";
  const trackId = params.active_track_id ?? defaultTrack;
  const track = getTrack(trackId);

  const last = params.last_module_id
    ? byId.get(params.last_module_id)
    : undefined;
  // When last context is Build, prefer cross-area Learn/Discover before track rail
  const deferTrackNext = last?.product_area === "build";

  if (track && !deferTrackNext) {
    for (const id of track.module_ids) {
      if (completed.has(id)) continue;
      const m = byId.get(id);
      if (m && (!area || m.product_area === area || track.product_area === area)) {
        push(m, `Continues your ${track.title} path`, suggestionKind(m));
        break;
      }
    }
  }

  if (last) {
      for (const nid of last.next_ids) {
        const m = byId.get(nid);
        if (m) push(m, `Next after “${last.title}”`, suggestionKind(m));
      }

      // Cross-area before soft related-learn so Discover↔Build links surface
      if (
        items.length < limit &&
        (last.product_area === "learn" || last.product_area === "discover")
      ) {
        const relatedLab = modules.find(
          (m) =>
            m.product_area === "build" &&
            !completed.has(m.id) &&
            skillsOverlap(m, last),
        );
        if (relatedLab) {
          const reason =
            last.product_area === "discover"
              ? `Practice with this ${last.skills.includes("api") ? "API" : "dataset"}`
              : `Practice ${relatedLab.skills.find((s) => last.skills.includes(s)) ?? "skills"} with a lab`;
          push(relatedLab, reason, "related_lab");
        }
      }

      if (
        items.length < limit &&
        last.product_area !== "discover"
      ) {
        const relatedDiscover = modules.find(
          (m) =>
            m.product_area === "discover" &&
            !completed.has(m.id) &&
            skillsOverlap(m, last),
        );
        if (relatedDiscover) {
          push(
            relatedDiscover,
            `Dataset/API matching your ${last.skills[0] ?? "recent"} work`,
            suggestionKind(relatedDiscover),
          );
        }
      }

      // Build-last → Learn (symmetric to Learn→Build); soft level match
      if (items.length < limit && last.product_area === "build") {
        const learnCandidates = modules.filter(
          (m) =>
            m.product_area === "learn" &&
            !completed.has(m.id) &&
            skillsOverlap(m, last),
        );
        learnCandidates.sort((a, b) => {
          const score = (m: typeof a) =>
            m.skills.filter((s) => last.skills.includes(s) && s !== "python")
              .length;
          return score(b) - score(a);
        });
        const relatedLesson = learnCandidates[0];
        if (relatedLesson) {
          push(
            relatedLesson,
            `Related lesson for ${relatedLesson.skills.find((s) => last.skills.includes(s) && s !== "python") ?? relatedLesson.skills.find((s) => last.skills.includes(s)) ?? "these"} skills`,
            "next_lesson",
          );
        }
      }

      const relatedLearn = modules.find(
        (m) =>
          m.product_area === "learn" &&
          !completed.has(m.id) &&
          m.id !== last.id &&
          skillsOverlap(m, last) &&
          m.level === last.level,
      );
      if (relatedLearn) {
        push(
          relatedLearn,
          `Related ${relatedLearn.skills[0] ?? "topic"} lesson`,
          "next_lesson",
        );
      }
  }

  if (items.length < limit && track) {
    for (const id of track.module_ids) {
      const m = byId.get(id);
      if (!m) continue;
      if (area && m.product_area !== area && track.product_area !== area) continue;
      push(m, `Recommended in ${track.title}`, suggestionKind(m));
      if (items.length >= limit) break;
    }
  }

  return items.slice(0, limit);
}
