/** Discover taxonomy labels and skill-bridge helpers for cross-area suggestions. */

export const CATEGORY_LABELS: Record<string, string> = {
  MachineLearning: "Machine learning",
  SocialSciences: "Social sciences",
  "Climate+Weather": "Climate & weather",
  Government: "Government",
  OpenData: "Open data",
  Weather: "Weather",
  Development: "Development",
};

/** Map discover category tags → Learn/Build skill tokens for suggestion matching. */
export const DISCOVER_BRIDGE: Record<string, string[]> = {
  MachineLearning: ["ml", "scikit-learn", "python", "pandas", "recsys", "optimization"],
  SocialSciences: ["pandas", "python", "dataset", "social-science"],
  "Climate+Weather": ["weather", "climate", "api", "python"],
  Government: ["open-data", "dataset", "python"],
  OpenData: ["open-data", "api", "dataset", "python"],
  Weather: ["weather", "api", "python"],
  Development: ["api", "development", "python"],
};

/** Stanford lecture tags → Build/Discover skill bridges */
export const STANFORD_BRIDGE: Record<string, string[]> = {
  cs229: ["ml", "scikit-learn", "python", "numpy", "pandas"],
  cs106a: ["python", "programming", "algorithms"],
  cs106b: ["python", "algorithms", "programming"],
  cs107: ["programming", "algorithms"],
  ee364a: ["ml", "math", "optimization", "python"],
  ee364b: ["ml", "math", "optimization"],
  ee263: ["ml", "math", "python"],
  ee261: ["math", "signal-processing"],
  cs223a: ["python", "robotics"],
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
