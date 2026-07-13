"use client";

import type { LearnerProgress, Level, ProductArea } from "./types";

const KEY = "learn-mvp-progress";

const FILTER_KEYS: Record<"learn" | "build" | "discover", string> = {
  learn: "learn-mvp-filters",
  build: "build-mvp-filters",
  discover: "discover-mvp-filters",
};

const DISCOVER_KIND_KEYS = {
  dataset: "discover-datasets-filters",
  api: "discover-apis-filters",
} as const;

const LEGACY_DISCOVER_KEY = "discover-mvp-filters";

const defaultProgress = (): LearnerProgress => ({
  selected_level: null,
  active_track_id: "python-ds",
  completed_ids: [],
  last_module_id: null,
  last_product_area: null,
  offline_preference: false,
});

export function readProgress(): LearnerProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProgress();
    return { ...defaultProgress(), ...JSON.parse(raw) };
  } catch {
    return defaultProgress();
  }
}

export function writeProgress(p: LearnerProgress): void {
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("learn-progress"));
}

export function markComplete(
  moduleId: string,
  trackId: string,
  productArea: ProductArea = "learn",
): LearnerProgress {
  const p = readProgress();
  if (!p.completed_ids.includes(moduleId)) {
    p.completed_ids = [...p.completed_ids, moduleId];
  }
  p.last_module_id = moduleId;
  p.active_track_id = trackId;
  p.last_product_area = productArea;
  writeProgress(p);
  return p;
}

/** Browse bookmark for Discover (does not mark complete). */
export function bookmarkDiscover(moduleId: string): LearnerProgress {
  const p = readProgress();
  p.last_module_id = moduleId;
  p.last_product_area = "discover";
  p.active_track_id = "discover-data";
  writeProgress(p);
  return p;
}

export interface LearnFilters {
  level: Level | "";
  offline_ok: "" | "true" | "false";
  sort: "recommended" | "title" | "duration";
}

export interface BuildFilters {
  level: Level | "";
  modality: "" | "lab" | "project";
  offline_ok: "" | "true" | "false";
  sort: "recommended" | "title" | "duration";
}

export interface DiscoverFilters {
  category: string;
  availability: "" | "local" | "link_only";
  sort: "recommended" | "title";
  q: string;
}

type AreaFilters = {
  learn: LearnFilters;
  build: BuildFilters;
  discover: DiscoverFilters;
};

const defaultAreaFilters: AreaFilters = {
  learn: { level: "", offline_ok: "", sort: "recommended" },
  build: { level: "", modality: "", offline_ok: "", sort: "recommended" },
  discover: { category: "", availability: "", sort: "recommended", q: "" },
};

export function readAreaFilters<A extends keyof AreaFilters>(
  area: A,
): AreaFilters[A] {
  const defaults = defaultAreaFilters[area];
  if (typeof window === "undefined") return { ...defaults };
  try {
    const raw = localStorage.getItem(FILTER_KEYS[area]);
    if (!raw) return { ...defaults };
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return { ...defaults };
  }
}

export function writeAreaFilters<A extends keyof AreaFilters>(
  area: A,
  filters: AreaFilters[A],
): void {
  localStorage.setItem(FILTER_KEYS[area], JSON.stringify(filters));
}

/** @deprecated Prefer readAreaFilters("learn") */
export function readLearnFilters(): LearnFilters {
  return readAreaFilters("learn");
}

/** @deprecated Prefer writeAreaFilters("learn", f) */
export function writeLearnFilters(f: LearnFilters): void {
  writeAreaFilters("learn", f);
}

export function readBuildFilters(): BuildFilters {
  return readAreaFilters("build");
}

export function writeBuildFilters(f: BuildFilters): void {
  writeAreaFilters("build", f);
}

export function readDiscoverFilters(): DiscoverFilters {
  return readAreaFilters("discover");
}

export function writeDiscoverFilters(f: DiscoverFilters): void {
  writeAreaFilters("discover", f);
}

const defaultDiscoverFilters = (): DiscoverFilters => ({
  category: "",
  availability: "",
  sort: "recommended",
  q: "",
});

/** Sticky filters scoped per Discover browse kind (datasets vs apis). */
export function readDiscoverKindFilters(
  kind: "dataset" | "api",
): DiscoverFilters {
  const defaults = defaultDiscoverFilters();
  if (typeof window === "undefined") return defaults;
  try {
    const key = DISCOVER_KIND_KEYS[kind];
    const raw = localStorage.getItem(key);
    if (raw) return { ...defaults, ...JSON.parse(raw) };

    // One-time migrate from legacy shared discover key
    const legacy = localStorage.getItem(LEGACY_DISCOVER_KEY);
    if (legacy) {
      const parsed = { ...defaults, ...JSON.parse(legacy) } as DiscoverFilters;
      localStorage.setItem(key, JSON.stringify(parsed));
      return parsed;
    }
    return defaults;
  } catch {
    return defaults;
  }
}

export function writeDiscoverKindFilters(
  kind: "dataset" | "api",
  filters: DiscoverFilters,
): void {
  localStorage.setItem(DISCOVER_KIND_KEYS[kind], JSON.stringify(filters));
}
