import { createHash } from "crypto";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import { askDir, getModule, loadModules } from "./catalog";
import { skillsOverlap, COURSE_FEATURE_SETS } from "./discover";
import type {
  AskContext,
  AskCourse,
  AskCitation,
  AskDefinition,
  AskExcerpt,
  AskLectureHit,
  AskResponse,
  CatalogModule,
  EvidenceStrength,
  GlossaryEntry,
  SuggestionItem,
} from "./types";

const EMBED_DIM = 384;
const OPENAI_EMBED_MODEL = "text-embedding-3-small";

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

type EmbeddingsStore = {
  model: string;
  dim: number;
  vectors: Record<string, number[]>;
};

let db: DatabaseSync | null = null;
let glossaryCache: GlossaryEntry[] | null = null;
let coursesCache: AskCourse[] | null = null;
let embeddingsStore: EmbeddingsStore | null | undefined;
let denseIndexCache:
  | { ids: string[]; courseIds: string[]; weights: number[]; vectors: number[][] }
  | null
  | undefined;

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

function loadEmbeddingsStore(): EmbeddingsStore | null {
  if (embeddingsStore !== undefined) return embeddingsStore;
  const p = path.join(askDir(), "embeddings.json");
  if (!existsSync(p)) {
    embeddingsStore = null;
    return null;
  }
  const raw = JSON.parse(readFileSync(p, "utf8")) as unknown;
  if (
    raw &&
    typeof raw === "object" &&
    "vectors" in raw &&
    (raw as { vectors?: unknown }).vectors &&
    typeof (raw as { vectors: unknown }).vectors === "object"
  ) {
    const wrapped = raw as {
      model?: string;
      dim?: number;
      vectors: Record<string, number[]>;
    };
    embeddingsStore = {
      model: wrapped.model ?? "unknown",
      dim:
        wrapped.dim ??
        Object.values(wrapped.vectors)[0]?.length ??
        EMBED_DIM,
      vectors: wrapped.vectors,
    };
  } else {
    const vectors = raw as Record<string, number[]>;
    const first = Object.values(vectors)[0];
    embeddingsStore = {
      model: "legacy-flat",
      dim: first?.length ?? EMBED_DIM,
      vectors,
    };
  }
  return embeddingsStore;
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

/** Glossary alias / multi-word expansion tokens for FTS (capped). */
export function expandQueryTokens(query: string, cap = 8): string[] {
  const qLow = query.toLowerCase();
  const qToks = new Set(tokenize(query));
  const extras: string[] = [];
  for (const g of loadGlossary()) {
    const gToks = tokenize(g.term);
    const hit =
      qLow.includes(g.term) || gToks.some((t) => qToks.has(t));
    if (!hit) continue;
    for (const piece of [g.term, ...(g.aliases ?? [])]) {
      for (const t of tokenize(piece)) {
        if (!qToks.has(t) && !extras.includes(t) && t.length > 1) {
          extras.push(t);
        }
        if (extras.length >= cap) return extras;
      }
    }
  }
  return extras;
}

function ftsQuery(raw: string, extraTokens: string[] = []): string {
  const tokens = tokenize(raw).filter((t) => t.length > 1).slice(0, 12);
  for (const t of extraTokens) {
    if (!tokens.includes(t) && t.length > 1) tokens.push(t);
    if (tokens.length >= 20) break;
  }
  if (!tokens.length) return '""';
  return tokens.map((t) => `"${t.replace(/"/g, "")}"`).join(" OR ");
}

function searchFts(
  query: string,
  courseIds: string[],
  limit: number,
  extraTokens: string[] = [],
): ChunkRow[] {
  const match = ftsQuery(query, extraTokens);
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

function getDenseIndex(): {
  ids: string[];
  courseIds: string[];
  weights: number[];
  vectors: number[][];
} | null {
  if (denseIndexCache !== undefined) return denseIndexCache;
  const store = loadEmbeddingsStore();
  if (!store) {
    denseIndexCache = null;
    return null;
  }
  const meta = chunkMeta();
  const ids: string[] = [];
  const courseIds: string[] = [];
  const weights: number[] = [];
  const vectors: number[][] = [];
  for (const [chunkId, vec] of Object.entries(store.vectors)) {
    const m = meta.get(chunkId);
    if (!m) continue;
    ids.push(chunkId);
    courseIds.push(m.course_id);
    weights.push(m.weight ?? 1);
    vectors.push(vec);
  }
  denseIndexCache = { ids, courseIds, weights, vectors };
  return denseIndexCache;
}

async function embedQuery(text: string): Promise<number[]> {
  const store = loadEmbeddingsStore();
  const model = store?.model ?? "feature-hash-384";
  const useOpenAI =
    llmConfigured() &&
    (model === OPENAI_EMBED_MODEL || model.startsWith("text-embedding"));
  if (useOpenAI) {
    const vec = await openaiEmbed(text);
    if (vec) return vec;
  }
  return featureHashEmbed(text, store?.dim ?? EMBED_DIM);
}

async function openaiEmbed(text: string): Promise<number[] | null> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_EMBED_MODEL,
        input: text.slice(0, 8000),
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      data?: { embedding?: number[] }[];
    };
    return data.data?.[0]?.embedding ?? null;
  } catch {
    return null;
  }
}

/** Exact top-k dense search over all embeddings (course-filtered). */
async function denseCandidates(
  query: string,
  courseIds: string[],
  limit: number,
  ftsRows: ChunkRow[],
): Promise<{ chunk_id: string; score: number }[]> {
  const q = await embedQuery(query);
  const index = getDenseIndex();
  const scored: { chunk_id: string; score: number }[] = [];
  const courseFilter = new Set(courseIds);

  if (index) {
    for (let i = 0; i < index.ids.length; i++) {
      if (courseFilter.size && !courseFilter.has(index.courseIds[i])) continue;
      scored.push({
        chunk_id: index.ids[i],
        score: cosine(q, index.vectors[i]) * index.weights[i],
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

export function evidenceStrengthFromScore(
  topScore: number | undefined,
): EvidenceStrength {
  if (topScore === undefined || topScore <= 0) return "weak";
  if (topScore >= 0.045) return "strong";
  if (topScore >= 0.025) return "moderate";
  return "weak";
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

  const scored: {
    m: CatalogModule;
    score: number;
    kind: SuggestionItem["kind"];
  }[] = [];
  for (const m of loadModules()) {
    if (m.product_area !== "build" && m.product_area !== "discover") continue;
    if (
      !skillsOverlap(seed, m) &&
      !m.track_ids.includes("stanford-earth-space")
    ) {
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
    track_id:
      m.track_ids.find((t) => t === "stanford-earth-space") ??
      m.track_ids[0] ??
      null,
  }));
}

function clarificationAnswer(query: string, courseIds: string[]): string {
  const courses = loadCourses();
  const suggestions = (courseIds.length
    ? courses.filter((c) => courseIds.includes(c.course_id))
    : courses.slice(0, 4)
  )
    .map((c) => c.course_id.toUpperCase())
    .join(", ");
  return (
    `No strong lecture matches for “${query}”. ` +
    `Try a course filter (${suggestions || "CS229, EE364A"}), ask to define a key term, ` +
    `or browse Stanford tracks under Learn.`
  );
}

function templateAnswer(
  query: string,
  excerpts: AskExcerpt[],
  definitions: AskDefinition[],
): string {
  if (!excerpts.length && !definitions.length) {
    return clarificationAnswer(query, []);
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

function heuristicRewrite(
  query: string,
  history: { role: string; content: string }[],
  context?: AskContext,
): string {
  const lastUser = [...history]
    .reverse()
    .find((h) => h.role === "user" && h.content.trim() !== query);
  const parts: string[] = [];
  if (context?.last_module_ids?.length) {
    const mod = getModule(context.last_module_ids[0]);
    if (mod?.course_id) {
      parts.push(mod.course_id.toUpperCase());
    }
    if (mod?.title) parts.push(mod.title);
  }
  if (lastUser) {
    const prior = lastUser.content.trim().slice(0, 160);
    if (prior) parts.push(prior);
  }
  parts.push(query);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

async function llmRewriteQuery(
  query: string,
  history: { role: string; content: string }[],
  context?: AskContext,
): Promise<string | null> {
  if (!llmConfigured()) return null;
  const key = process.env.OPENAI_API_KEY!.trim();
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const hist = history
    .slice(-6)
    .map((h) => `${h.role}: ${h.content.slice(0, 400)}`)
    .join("\n");
  const ctx = context?.last_module_ids?.length
    ? `Prior modules: ${context.last_module_ids.join(", ")}`
    : "";
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              "Rewrite the latest user question into a standalone search query over Stanford lecture transcripts. Resolve pronouns using history. Output only the rewritten query, no quotes.",
          },
          {
            role: "user",
            content: `${ctx}\nHistory:\n${hist}\n\nLatest question: ${query}`,
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const out = data.choices?.[0]?.message?.content?.trim();
    return out || null;
  } catch {
    return null;
  }
}

async function llmRerank(
  query: string,
  candidates: AskExcerpt[],
): Promise<AskExcerpt[]> {
  if (!llmConfigured() || candidates.length < 2) return candidates;
  const key = process.env.OPENAI_API_KEY!.trim();
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const payload = candidates.slice(0, 20).map((c, i) => ({
    i,
    chunk_id: c.chunk_id,
    preview: c.text.slice(0, 280),
  }));
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              'Score each excerpt 0-1 for relevance to the question. Return JSON {"scores":[{"i":0,"score":0.9},...]}.',
          },
          {
            role: "user",
            content: `Question: ${query}\n\nExcerpts:\n${JSON.stringify(payload)}`,
          },
        ],
      }),
    });
    if (!res.ok) return candidates;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content?.trim();
    if (!raw) return candidates;
    const parsed = JSON.parse(raw) as {
      scores?: { i: number; score: number }[];
    };
    const scoreMap = new Map<number, number>();
    for (const s of parsed.scores ?? []) {
      scoreMap.set(s.i, s.score);
    }
    return [...candidates]
      .map((c, i) => ({
        ...c,
        score: scoreMap.has(i)
          ? c.score * 0.3 + (scoreMap.get(i) ?? 0) * 0.7
          : c.score,
      }))
      .sort((a, b) => b.score - a.score);
  } catch {
    return candidates;
  }
}

export async function synthesizeAnswer(
  query: string,
  excerpts: AskExcerpt[],
  definitions: AskDefinition[],
): Promise<{ answer: string; citations: AskCitation[] } | null> {
  if (!llmConfigured()) return null;
  const key = process.env.OPENAI_API_KEY!.trim();
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const allowed = new Set(excerpts.map((e) => e.chunk_id));
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
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'Answer using only the provided Stanford lecture excerpts and definitions. Return JSON {"answer":"2-4 sentences","citations":[{"chunk_id":"..."}]}. Only cite chunk_ids from the evidence. If evidence is insufficient, say so in answer and use an empty citations array.',
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
  const raw = data.choices?.[0]?.message?.content?.trim();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as {
      answer?: string;
      citations?: { chunk_id?: string }[];
    };
    const answer = parsed.answer?.trim();
    if (!answer) return null;
    const citations: AskCitation[] = [];
    for (const c of parsed.citations ?? []) {
      const id = c.chunk_id?.trim();
      if (id && allowed.has(id) && !citations.some((x) => x.chunk_id === id)) {
        citations.push({ chunk_id: id });
      }
    }
    return { answer, citations };
  } catch {
    return null;
  }
}

function boostFromContext(
  scores: Map<string, number>,
  context?: AskContext,
): void {
  if (!context) return;
  const preferredChunks = new Set(context.last_chunk_ids ?? []);
  const preferredMods = new Set(context.last_module_ids ?? []);
  for (const [chunkId, score] of scores) {
    const row = chunkById(chunkId);
    if (!row) continue;
    let boost = 1;
    if (preferredChunks.has(chunkId)) boost *= 1.25;
    else if (preferredMods.has(row.module_id)) boost *= 1.12;
    if (boost !== 1) scores.set(chunkId, score * boost);
  }
}

export async function runAsk(params: {
  query: string;
  course_ids?: string[];
  history?: { role: string; content: string }[];
  context?: AskContext;
}): Promise<AskResponse> {
  const originalQuery = params.query.trim();
  const courseIds = params.course_ids?.filter(Boolean) ?? [];
  const history = params.history ?? [];
  const context = params.context;

  let searchQuery = originalQuery;
  if (history.length > 0 || context?.last_module_ids?.length) {
    const rewritten = await llmRewriteQuery(originalQuery, history, context);
    searchQuery = rewritten ?? heuristicRewrite(originalQuery, history, context);
  }

  const extraTokens = expandQueryTokens(searchQuery);
  const fts = searchFts(searchQuery, courseIds, 40, extraTokens);
  const dense = await denseCandidates(searchQuery, courseIds, 40, fts);
  const fused = fuse(fts, dense);
  boostFromContext(fused, context);

  const ranked = [...fused.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([chunk_id, score]) => ({ chunk_id, score }));

  let excerpts: AskExcerpt[] = [];
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

  excerpts = await llmRerank(originalQuery, excerpts);
  excerpts = excerpts.slice(0, 5);

  const topScore = excerpts[0]?.score;
  const evidence_strength = evidenceStrengthFromScore(topScore);
  const needs_clarification =
    evidence_strength === "weak" || excerpts.length === 0;

  const definitions = glossaryHits(searchQuery, 3);
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
    getModule(excerpts[0]?.module_id ?? definitions[0]?.module_id ?? "") ??
    null;
  const apply = needs_clarification ? [] : applySuggestions(seed);

  const nextContext: AskContext = {
    last_module_ids: excerpts
      .map((e) => e.module_id)
      .filter((id, i, arr) => arr.indexOf(id) === i)
      .slice(0, 5),
    last_chunk_ids: excerpts.map((e) => e.chunk_id).slice(0, 5),
  };

  const clarification_suggestions = needs_clarification
    ? loadCourses()
        .slice(0, 6)
        .map((c) => ({
          course_id: c.course_id,
          label: c.course_id.toUpperCase(),
          title: c.title,
        }))
    : [];

  let answer = needs_clarification
    ? clarificationAnswer(originalQuery, courseIds)
    : templateAnswer(originalQuery, excerpts, definitions);
  let mode: AskResponse["mode"] = "retrieval";
  let citations: AskCitation[] = excerpts.slice(0, 3).map((e) => ({
    chunk_id: e.chunk_id,
  }));
  const available = llmConfigured();

  if (available && !needs_clarification) {
    const synth = await synthesizeAnswer(
      originalQuery,
      excerpts.slice(0, 4),
      definitions,
    );
    if (synth) {
      answer = synth.answer;
      mode = "synthesized";
      citations =
        synth.citations.length > 0
          ? synth.citations
          : excerpts.slice(0, 3).map((e) => ({ chunk_id: e.chunk_id }));
    }
  }

  return {
    answer,
    definitions: needs_clarification ? [] : definitions,
    excerpts: needs_clarification ? [] : excerpts,
    lectures: needs_clarification
      ? []
      : [...lectureMap.values()].slice(0, 5),
    related_terms: needs_clarification
      ? []
      : relatedTerms(searchQuery, definitions),
    apply,
    filters_applied: { course_ids: courseIds },
    mode,
    llm_available: available,
    evidence_strength,
    needs_clarification,
    search_query_used: searchQuery,
    context: nextContext,
    citations: needs_clarification ? [] : citations,
    clarification_suggestions,
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
