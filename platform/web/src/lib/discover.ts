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
  eonet: "EONET",
  tle: "TLE",
  "launch-library": "Launch Library 2",
  nasa: "NASA",
  logica: "Logica",
  logic: "Logic",
};

/** Discover API kit slug → related module ids / doc paths. */
export const API_KITS: Record<
  string,
  {
    title: string;
    blurb: string;
    module_ids: string[];
    doc_readme: string;
    links_doc: string;
    tags: string[];
  }
> = {
  nasa: {
    title: "NASA EONET kit",
    blurb:
      "Earth Observatory Natural Event Tracker — open natural events as JSON/GeoJSON for Earth–Space labs.",
    module_ids: ["papi-nasa-eonet"],
    doc_readme: "docs/apiIntegrations/nasa/README.md",
    links_doc: "docs/apiIntegrations/nasa/nasaLinks.md",
    tags: ["eonet", "nasa"],
  },
  tle: {
    title: "TLE kit",
    blurb:
      "Two-line element sets and on-orbit propagation for ISS and other satellites.",
    module_ids: ["papi-science-tle"],
    doc_readme: "docs/apiIntegrations/tle/README.md",
    links_doc: "docs/apiIntegrations/tle/tleLinks.md",
    tags: ["tle"],
  },
  "launch-library": {
    title: "Launch Library 2 kit",
    blurb:
      "Upcoming launches, statuses, agencies, and pads from The Space Devs.",
    module_ids: ["papi-science-launch-library"],
    doc_readme: "docs/apiIntegrations/launch-library/README.md",
    links_doc: "docs/apiIntegrations/launch-library/ll2Links.md",
    tags: ["launch-library"],
  },
  logica: {
    title: "Logica logic kit",
    blurb:
      "Logica-inspired CLI tools (truth tables, CNF, SAT, unify) over Earth–Space API snapshot worlds — pairs with CS157 Intrologic.",
    module_ids: ["papi-logic-logica"],
    doc_readme: "docs/apiIntegrations/logica/README.md",
    links_doc: "docs/apiIntegrations/logica/logicaLinks.md",
    tags: ["logica", "logic"],
  },
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
  cs157: ["logic", "python", "api"],
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

export function discoverListHref(
  kind: "dataset" | "api",
  category?: string | null,
  tag?: string | null,
): string {
  const base = kind === "api" ? "/discover/apis" : "/discover/datasets";
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (tag) params.set("tag", tag);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}
