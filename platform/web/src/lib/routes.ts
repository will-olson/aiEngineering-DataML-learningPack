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

export function hrefForModule(
  productArea: ProductArea,
  moduleId: string,
  trackId?: string,
): string {
  switch (productArea) {
    case "discover":
      return `/discover/${moduleId}`;
    case "build":
      return `/build/${trackId ?? DEFAULT_TRACK.build}/${moduleId}`;
    case "read":
      return `/read/${moduleId}`;
    case "ask":
      return `/ask`;
    case "learn":
    default: {
      const inferred =
        trackId ??
        (moduleId.startsWith("stanford-")
          ? `stanford-${moduleId.split("-")[1]}`
          : DEFAULT_TRACK.learn);
      return `/learn/${inferred}/${moduleId}`;
    }
  }
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
  return hrefForModule(area, item.module_id, trackForProductArea(area));
}
