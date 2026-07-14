/** Discover taxonomy labels and skill-bridge helpers for cross-area suggestions. */

export const CATEGORY_LABELS: Record<string, string> = {
  MachineLearning: "Machine learning",
  SocialSciences: "Social sciences",
  "Climate+Weather": "Climate & weather",
  Government: "Government",
  OpenData: "Open data",
  Weather: "Weather",
  Development: "Development",
  "Science & Math": "Science & math",
};

/** Map discover category tags → Learn/Build skill tokens for suggestion matching. */
export const DISCOVER_BRIDGE: Record<string, string[]> = {
  MachineLearning: ["ml", "scikit-learn", "python", "pandas", "recsys", "optimization"],
  SocialSciences: ["pandas", "python", "dataset", "social-science"],
  "Climate+Weather": ["weather", "climate", "api", "python", "geospatial"],
  Government: ["open-data", "dataset", "python"],
  OpenData: ["open-data", "api", "dataset", "python"],
  Weather: ["weather", "api", "python"],
  Development: ["api", "development", "python"],
  "Science & Math": ["python", "math", "numpy", "api", "geospatial", "dataset"],
};

/** Stanford lecture tags → Build/Discover skill bridges */
export const STANFORD_BRIDGE: Record<string, string[]> = {
  cs229: ["ml", "scikit-learn", "python", "numpy", "pandas", "geospatial"],
  cs106a: ["python", "programming", "algorithms", "api"],
  cs106b: ["python", "algorithms", "programming", "api"],
  cs107: ["programming", "algorithms"],
  ee364a: ["ml", "math", "optimization", "python", "api"],
  ee364b: ["ml", "math", "optimization", "api"],
  ee263: ["ml", "math", "python", "numpy", "api"],
  ee261: ["math", "signal-processing", "python"],
  cs223a: ["python", "robotics", "math", "numpy"],
};

/** Course id → preferred feature-set tag prefixes for Earth–Space Apply. */
export const COURSE_FEATURE_SETS: Record<string, string[]> = {
  cs229: ["feature-set:events-labels", "feature-set:earth-space-capstone", "feature-set:signals-magnitudes"],
  cs106a: ["feature-set:events-labels", "feature-set:schedule-constraints"],
  cs106b: ["feature-set:events-labels", "feature-set:schedule-constraints"],
  ee263: ["feature-set:state-tracking", "feature-set:earth-space-capstone"],
  cs223a: ["feature-set:state-tracking", "feature-set:earth-space-capstone"],
  ee364a: ["feature-set:schedule-constraints"],
  ee364b: ["feature-set:schedule-constraints"],
  ee261: ["feature-set:signals-magnitudes"],
};

export function categoryFromTags(tags: string[] | undefined): string | null {
  if (!tags?.length) return null;
  return (
    tags.find((t) => t !== "dataset" && t !== "api" && !t.startsWith("auth-")) ??
    null
  );
}

/** Expand a module's skills with bridge tokens from its category tags. */
export function bridgeSkillsForModule(skills: string[], tags: string[]): string[] {
  const out = new Set(skills);
  for (const tag of tags) {
    const bridged = DISCOVER_BRIDGE[tag];
    if (bridged) {
      for (const s of bridged) out.add(s);
    }
    const stanford = STANFORD_BRIDGE[tag];
    if (stanford) {
      for (const s of stanford) out.add(s);
    }
  }
  return [...out];
}

/** True if two modules share a skill, optionally using discover tag bridges. */
export function skillsOverlap(
  a: { skills: string[]; tags?: string[] },
  b: { skills: string[]; tags?: string[] },
): boolean {
  const aSkills = new Set(
    a.tags?.length ? bridgeSkillsForModule(a.skills, a.tags) : a.skills,
  );
  const bSkills = b.tags?.length
    ? bridgeSkillsForModule(b.skills, b.tags)
    : b.skills;
  return bSkills.some((s) => aSkills.has(s));
}

export function discoverListHref(kind: "dataset" | "api", category?: string | null): string {
  const base = kind === "api" ? "/discover/apis" : "/discover/datasets";
  if (!category) return base;
  return `${base}?category=${encodeURIComponent(category)}`;
}
