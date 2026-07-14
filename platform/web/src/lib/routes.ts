import type { ProductArea, SuggestionItem } from "./types";

export const DEFAULT_TRACK: Record<ProductArea, string> = {
  learn: "python-ds",
  discover: "discover-data",
  build: "python-practice",
  read: "applied-ml-reading",
  ask: "stanford-cs229",
};

export function trackForProductArea(area: ProductArea): string {
  return DEFAULT_TRACK[area];
}

/**
 * Resolve build/learn track without reading the catalog (safe for client).
 * Prefer explicit trackId; else infer from module id prefixes.
 */
export function resolveTrackId(
  productArea: ProductArea,
  moduleId: string,
  trackId?: string | null,
): string {
  if (trackId) return trackId;
  if (productArea === "build") {
    if (moduleId.startsWith("ses-")) return "stanford-earth-space";
    return DEFAULT_TRACK.build;
  }
  if (productArea === "learn") {
    if (moduleId.startsWith("stanford-")) {
      return `stanford-${moduleId.split("-")[1]}`;
    }
    return DEFAULT_TRACK.learn;
  }
  return DEFAULT_TRACK[productArea];
}

export function hrefForModule(
  productArea: ProductArea,
  moduleId: string,
  trackId?: string | null,
): string {
  switch (productArea) {
    case "discover":
      return `/discover/${moduleId}`;
    case "build":
      return `/build/${resolveTrackId("build", moduleId, trackId)}/${moduleId}`;
    case "read":
      return `/read/${moduleId}`;
    case "ask":
      return `/ask`;
    case "learn":
    default:
      return `/learn/${resolveTrackId("learn", moduleId, trackId)}/${moduleId}`;
  }
}

export function hrefForFeatureSet(trackId: string, setId: string): string {
  return `/build/${trackId}/sets/${setId}`;
}

export function hrefForApiKit(slug: string): string {
  return `/discover/kits/${slug}`;
}

/** Map suggestion kind → product area for routing. */
export function productAreaForSuggestionKind(
  kind: SuggestionItem["kind"],
): ProductArea {
  switch (kind) {
    case "matching_dataset":
    case "matching_api":
      return "discover";
    case "related_lab":
      return "build";
    case "related_reading":
      return "read";
    case "next_lesson":
    default:
      return "learn";
  }
}

export function hrefForSuggestion(item: SuggestionItem): string {
  const area = productAreaForSuggestionKind(item.kind);
  return hrefForModule(area, item.module_id, item.track_id);
}
