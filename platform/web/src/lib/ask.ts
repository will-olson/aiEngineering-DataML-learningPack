import { createHash } from "crypto";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import { askDir, getModule, loadModules } from "./catalog";
import { skillsOverlap, COURSE_FEATURE_SETS } from "./discover";
import type {
  AskCourse,
  AskDefinition,
  AskExcerpt,
  AskLectureHit,
  AskResponse,
  CatalogModule,
  GlossaryEntry,
  SuggestionItem,
} from "./types";

const EMBED_DIM = 384;

type ChunkRow = {
  chunk_id: string;
  module_id: string;
  course_id: string;
  lecture: number;
  speaker: string;
  role: string;
  weight: number;
  text: string;
};

let db: DatabaseSync | null = null;
let glossaryCache: GlossaryEntry[] | null = null;
let coursesCache: AskCourse[] | null = null;
let embeddingsCache: Record<string, number[]> | null | undefined;

function getDb(): DatabaseSync {
  if (!db) {
    const dbPath = path.join(askDir(), "ask.sqlite");
    db = new DatabaseSync(dbPath, { readOnly: true });
  }
  return db;
}

export function loadCourses(): AskCourse[] {
  if (!coursesCache) {
    const p = path.join(askDir(), "courses.json");
    coursesCache = existsSync(p)
      ? (JSON.parse(readFileSync(p, "utf8")) as AskCourse[])
      : [];
  }
  return coursesCache;
}

export function loadGlossary(): GlossaryEntry[] {
  if (!glossaryCache) {
    const p = path.join(askDir(), "glossary.json");
    glossaryCache = existsSync(p)
      ? (JSON.parse(readFileSync(p, "utf8")) as GlossaryEntry[])
      : [];
  }
  return glossaryCache;
}

function loadEmbeddings(): Record<string, number[]> | null {
  if (embeddingsCache !== undefined) return embeddingsCache;
  const p = path.join(askDir(), "embeddings.json");
  if (!existsSync(p)) {
    embeddingsCache = null;
    return null;
  }
  embeddingsCache = JSON.parse(readFileSync(p, "utf8")) as Record<
    string,
    number[]
  >;
  return embeddingsCache;
}

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

export function featureHashEmbed(text: string, dim = EMBED_DIM): number[] {
  const vec = new Array(dim).fill(0);
  const tokens = tokenize(text);
  if (!tokens.length) return vec;
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  for (const [tok, cnt] of tf) {
    const h = createHash("md5").update(tok).digest();
    const idx = h.readUInt32BE(0) % dim;
    const sign = h[4] & 1 ? 1 : -1;
    vec[idx] += sign * (1 + Math.log(cnt));
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

function cosine(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  let s = 0;
  for (let i = 0; i < n; i++) s += a[i] * b[i];
  return s;
}

function ftsQuery(raw: string): string {
  const tokens = tokenize(raw).filter((t) => t.length > 1).slice(0, 12);
  if (!tokens.length) return '""';
  return tokens.map((t) => `"${t.replace(/"/g, "")}"`).join(" OR ");
}

function searchFts(
  query: string,
  courseIds: string[],
  limit: number,
): ChunkRow[] {
  const match = ftsQuery(query);
  const database = getDb();
  let sql = `
    SELECT c.chunk_id, c.module_id, c.course_id, c.lecture, c.speaker, c.role, c.weight, c.text,
           bm25(chunks_fts) AS rank
    FROM chunks_fts
    JOIN chunks c ON c.chunk_id = chunks_fts.chunk_id
    WHERE chunks_fts MATCH ?
  `;
  const params: (string | number)[] = [match];
  if (courseIds.length) {
    sql += ` AND c.course_id IN (${courseIds.map(() => "?").join(",")})`;
    params.push(...courseIds);
  }
  sql += " ORDER BY rank LIMIT ?";
  params.push(limit);
  try {
    return database.prepare(sql).all(...params) as unknown as ChunkRow[];
  } catch {
    return [];
  }
}

let chunkMetaCache: Map<
  string,
  { course_id: string; weight: number }
> | null = null;

function chunkMeta(): Map<string, { course_id: string; weight: number }> {
  if (!chunkMetaCache) {
    chunkMetaCache = new Map();
    const rows = getDb()
      .prepare("SELECT chunk_id, course_id, weight FROM chunks")
      .all() as { chunk_id: string; course_id: string; weight: number }[];
    for (const r of rows) {
      chunkMetaCache.set(r.chunk_id, {
        course_id: r.course_id,
        weight: r.weight,
      });
    }
  }
  return chunkMetaCache;
}

/** Dense scores: prefer precomputed embeddings; else hash-embed FTS candidate texts. */
function denseCandidates(
  query: string,
  courseIds: string[],
  limit: number,
  ftsRows: ChunkRow[],
): { chunk_id: string; score: number }[] {
  const q = featureHashEmbed(query);
  const embeddings = loadEmbeddings();
  const scored: { chunk_id: string; score: number }[] = [];

  if (embeddings) {
    const meta = chunkMeta();
    const courseFilter = new Set(courseIds);
    // Score embedding space but only keep top `limit` (sample via FTS-first + global top)
    const candidateIds = new Set(ftsRows.map((r) => r.chunk_id));
    // Add a sparse global pass: every 17th embedding for recall without full scan cost
    let i = 0;
    for (const chunkId of Object.keys(embeddings)) {
      i += 1;
      if (!candidateIds.has(chunkId) && i % 17 !== 0) continue;
      const m = meta.get(chunkId);
      if (!m) continue;
      if (courseFilter.size && !courseFilter.has(m.course_id)) continue;
      scored.push({
        chunk_id: chunkId,
        score: cosine(q, embeddings[chunkId]) * (m.weight ?? 1),
      });
    }
  } else {
    for (const row of ftsRows) {
      scored.push({
        chunk_id: row.chunk_id,
        score: cosine(q, featureHashEmbed(row.text)) * (row.weight ?? 1),
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

/** Reciprocal rank fusion of FTS + dense lists. */
function fuse(
  fts: ChunkRow[],
  dense: { chunk_id: string; score: number }[],
  k = 60,
): Map<string, number> {
  const scores = new Map<string, number>();
  fts.forEach((row, i) => {
    const boost = row.role === "instructor" ? 1.15 : 0.85;
    scores.set(
      row.chunk_id,
      (scores.get(row.chunk_id) ?? 0) + (boost * 1) / (k + i + 1),
    );
  });
  dense.forEach((row, i) => {
    scores.set(
      row.chunk_id,
      (scores.get(row.chunk_id) ?? 0) + 1 / (k + i + 1),
    );
  });
  return scores;
}

function chunkById(chunkId: string): ChunkRow | null {
  const row = getDb()
    .prepare(
      "SELECT chunk_id, module_id, course_id, lecture, speaker, role, weight, text FROM chunks WHERE chunk_id = ?",
    )
    .get(chunkId) as ChunkRow | undefined;
  return row ?? null;
}

function trackForModule(m: CatalogModule): string | undefined {
  return m.track_ids[0];
}

function glossaryHits(query: string, limit = 3): AskDefinition[] {
  const qLow = query.toLowerCase();
  const terms = tokenize(query);
  const glossary = loadGlossary();
  const hits: { score: number; entry: GlossaryEntry }[] = [];
  for (const g of glossary) {
    let score = 0;
    if (qLow.includes(g.term)) score += 5;
    const gTokens = tokenize(g.term);
    if (!gTokens.length) continue;
    let overlap = 0;
    for (const t of gTokens) {
      if (terms.includes(t)) overlap += 1;
    }
    if (overlap === gTokens.length && gTokens.length >= 1) score += 3;
    else if (overlap > 0) score += overlap * 0.75;
    // Require at least a meaningful hit
    if (score >= 3) hits.push({ score, entry: g });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit).map(({ entry }) => ({
    term: entry.term,
    text: entry.text,
    chunk_id: entry.chunk_id,
    module_id: entry.module_id,
  }));
}

function relatedTerms(query: string, definitions: AskDefinition[]): string[] {
  const out = new Set<string>();
  for (const d of definitions) out.add(d.term);
  const tokens = tokenize(query).filter((t) => t.length > 4).slice(0, 4);
  for (const t of tokens) {
    for (const g of loadGlossary()) {
      if (g.term.includes(t) && g.term !== t) out.add(g.term);
      if (out.size >= 8) break;
    }
  }
  return [...out].slice(0, 8);
}

function applySuggestions(seed: CatalogModule | null): SuggestionItem[] {
  if (!seed) return [];
  const course = seed.course_id ?? "";
  const preferSets = COURSE_FEATURE_SETS[course] ?? [];
  const prefer =
    course === "cs229" ||
    course === "ee364a" ||
    course === "ee364b" ||
    course === "ee263"
      ? ["ml", "scikit-learn", "numpy", "pandas", "api", "geospatial", "math"]
      : course.startsWith("cs106") || course === "cs107"
        ? ["algorithms", "python", "programming", "api"]
        : course === "cs223a"
          ? ["python", "robotics", "math", "numpy", "api"]
          : course === "ee261"
            ? ["math", "signal-processing", "python", "api"]
            : seed.skills;

  const scored: { m: CatalogModule; score: number; kind: SuggestionItem["kind"] }[] =
    [];
  for (const m of loadModules()) {
    if (m.product_area !== "build" && m.product_area !== "discover") continue;
    if (!skillsOverlap(seed, m) && !m.track_ids.includes("stanford-earth-space")) {
      // Still allow earth-space labs tagged for this course
      if (!preferSets.some((fs) => m.tags?.includes(fs))) continue;
    }
    const overlap = m.skills.filter((s) => prefer.includes(s)).length;
    let score = overlap * 2 + (m.product_area === "build" ? 1 : 0);
    if (m.tags?.includes("stanford-applied")) score += 2;
    if (m.track_ids.includes("stanford-earth-space")) score += 3;
    if (preferSets.some((fs) => m.tags?.includes(fs))) score += 4;
    if (
      m.tags?.some((t) => ["eonet", "tle", "launch-library"].includes(t)) &&
      preferSets.length
    ) {
      score += 2;
    }
    scored.push({
      m,
      score,
      kind:
        m.product_area === "build"
          ? "related_lab"
          : m.tags.includes("api")
            ? "matching_api"
            : "matching_dataset",
    });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 2).map(({ m, kind }) => ({
    module_id: m.id,
    title: m.title,
    reason:
      kind === "related_lab"
        ? m.track_ids.includes("stanford-earth-space")
          ? "Earth & Space feature-set lab for this lecture grouping"
          : `Practice ${prefer.slice(0, 2).join(" / ")} from this lecture path`
        : "Related dataset or API for applied work",
    kind,
  }));
}

function templateAnswer(
  query: string,
  excerpts: AskExcerpt[],
  definitions: AskDefinition[],
): string {
  if (!excerpts.length && !definitions.length) {
    return `No strong matches for “${query}”. Try narrowing to a course (e.g. CS229) or asking for a definition of a key term.`;
  }
  const parts: string[] = [];
  if (excerpts.length) {
    const e = excerpts[0];
    const mod = getModule(e.module_id);
    parts.push(
      `Most relevant context is from ${mod?.title ?? e.module_id} (${e.course_id.toUpperCase()} L${e.lecture}), where the instructor discusses: “${e.text.slice(0, 220)}${e.text.length > 220 ? "…" : ""}”`,
    );
  }
  if (definitions.length) {
    parts.push(
      `Related definition — ${definitions[0].term}: ${definitions[0].text.slice(0, 160)}${definitions[0].text.length > 160 ? "…" : ""}`,
    );
  }
  parts.push("See cited excerpts below for full wording and lecture context.");
  return parts.join(" ");
}

export function llmConfigured(): boolean {
  const key = process.env.OPENAI_API_KEY?.trim();
  const enabled = process.env.ASK_LLM_ENABLED?.trim();
  if (enabled === "false") return false;
  return Boolean(key);
}

export async function synthesizeAnswer(
  query: string,
  excerpts: AskExcerpt[],
  definitions: AskDefinition[],
): Promise<string | null> {
  if (!llmConfigured()) return null;
  const key = process.env.OPENAI_API_KEY!.trim();
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const context = [
    ...definitions.map(
      (d) => `DEFINITION (${d.term}) [chunk ${d.chunk_id}]: ${d.text}`,
    ),
    ...excerpts.map(
      (e) =>
        `EXCERPT [${e.chunk_id}] ${e.course_id} L${e.lecture}: ${e.text.slice(0, 900)}`,
    ),
  ].join("\n\n");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You answer questions using only the provided Stanford lecture transcript excerpts and definitions. Cite chunk ids in parentheses. Keep answers to 2–4 sentences. If evidence is insufficient, say so.",
        },
        {
          role: "user",
          content: `Question: ${query}\n\nEvidence:\n${context}`,
        },
      ],
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() || null;
}

export async function runAsk(params: {
  query: string;
  course_ids?: string[];
  history?: { role: string; content: string }[];
}): Promise<AskResponse> {
  const query = params.query.trim();
  const courseIds = params.course_ids?.filter(Boolean) ?? [];
  const fts = searchFts(query, courseIds, 40);
  const dense = denseCandidates(query, courseIds, 40, fts);
  const fused = fuse(fts, dense);
  const ranked = [...fused.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([chunk_id, score]) => ({ chunk_id, score }));

  const excerpts: AskExcerpt[] = [];
  for (const { chunk_id, score } of ranked) {
    const row = chunkById(chunk_id);
    if (!row) continue;
    const mod = getModule(row.module_id);
    excerpts.push({
      chunk_id: row.chunk_id,
      module_id: row.module_id,
      course_id: row.course_id,
      lecture: row.lecture,
      speaker: row.speaker,
      role: row.role,
      text: row.text.slice(0, 1200),
      score,
      title: mod?.title,
      track_id: mod ? trackForModule(mod) : undefined,
    });
  }

  const definitions = glossaryHits(query, 3);
  const lectureMap = new Map<string, AskLectureHit>();
  for (const e of excerpts) {
    if (lectureMap.has(e.module_id)) continue;
    const mod = getModule(e.module_id);
    lectureMap.set(e.module_id, {
      module_id: e.module_id,
      title: mod?.title ?? e.module_id,
      reason: `Contains a high-ranking excerpt for this question`,
      course_id: e.course_id,
      track_id: e.track_id,
      lecture_number: e.lecture,
    });
  }

  const seed =
    getModule(excerpts[0]?.module_id ?? definitions[0]?.module_id ?? "") ?? null;
  const apply = applySuggestions(seed);

  let answer = templateAnswer(query, excerpts, definitions);
  let mode: AskResponse["mode"] = "retrieval";
  const available = llmConfigured();
  if (available) {
    const synth = await synthesizeAnswer(query, excerpts.slice(0, 4), definitions);
    if (synth) {
      answer = synth;
      mode = "synthesized";
    }
  }

  return {
    answer,
    definitions,
    excerpts: excerpts.slice(0, 5),
    lectures: [...lectureMap.values()].slice(0, 5),
    related_terms: relatedTerms(query, definitions),
    apply,
    filters_applied: { course_ids: courseIds },
    mode,
    llm_available: available,
  };
}

export function searchGlossary(q: string, limit = 20): GlossaryEntry[] {
  const query = q.trim().toLowerCase();
  if (!query) return loadGlossary().slice(0, limit);
  return loadGlossary()
    .filter(
      (g) =>
        g.term.includes(query) ||
        g.text.toLowerCase().includes(query) ||
        g.aliases.some((a) => a.includes(query)),
    )
    .slice(0, limit);
}
