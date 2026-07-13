import { readFileSync } from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import type { CatalogModule, TranscriptContent, TranscriptTurn } from "./types";
import { askDir, getModule, resolveRepoPath } from "./catalog";

const SPEAKER_RE = /<b>\s*([^<:]+?)\s*:?\s*<\/b>\s*:?\s*/gi;
const DURATION_RE = /Duration:\s*(\d+)\s*minutes/i;

function decodeHtml(buf: Buffer): string {
  for (const enc of ["utf8", "latin1"] as const) {
    try {
      return buf.toString(enc);
    } catch {
      /* continue */
    }
  }
  return buf.toString("utf8");
}

function stripTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function speakerRole(label: string): string {
  const low = label.toLowerCase();
  if (low.includes("student")) return "student";
  if (low.includes("microphone") || low.includes("audience")) return "audience";
  if (low.includes("guest")) return "guest";
  if (low.includes("instructor") || low.includes("professor")) return "instructor";
  return "other";
}

export function parseTranscriptHtml(html: string): {
  turns: Omit<TranscriptTurn, "id">[];
  duration_minutes: number | null;
} {
  let body = html;
  if (body.toLowerCase().startsWith("<html>")) body = body.slice(6);
  if (body.toLowerCase().endsWith("</html>")) body = body.slice(0, -7);

  const durationMatch = body.match(DURATION_RE);
  const duration_minutes = durationMatch ? Number(durationMatch[1]) : null;

  const parts = body.split(SPEAKER_RE);
  const turns: Omit<TranscriptTurn, "id">[] = [];

  if (parts.length === 1) {
    let text = stripTags(parts[0]);
    text = text.replace(DURATION_RE, "").replace(/\[End of Audio\]/gi, "").trim();
    if (text) {
      turns.push({ speaker: "Instructor", role: "instructor", text });
    }
    return { turns, duration_minutes };
  }

  for (let i = 1; i + 1 < parts.length; i += 2) {
    const speaker = parts[i].trim();
    let text = stripTags(parts[i + 1]);
    text = text.replace(DURATION_RE, "").replace(/\[End of Audio\]/gi, "").trim();
    if (!text) continue;
    turns.push({ speaker, role: speakerRole(speaker), text });
  }

  return { turns, duration_minutes };
}

function chunkText(chunkId: string): string | null {
  try {
    const db = new DatabaseSync(path.join(askDir(), "ask.sqlite"), {
      readOnly: true,
    });
    const row = db
      .prepare("SELECT text FROM chunks WHERE chunk_id = ?")
      .get(chunkId) as { text: string } | undefined;
    return row?.text ?? null;
  } catch {
    return null;
  }
}

export function loadTranscriptContent(
  moduleId: string,
  highlightChunkId?: string | null,
): TranscriptContent | null {
  const catalogModule = getModule(moduleId);
  if (!catalogModule) return null;
  return loadTranscriptFromModule(catalogModule, highlightChunkId);
}

export function loadTranscriptFromModule(
  module: CatalogModule,
  highlightChunkId?: string | null,
): TranscriptContent {
  const abs = resolveRepoPath(module.source_path);
  const html = decodeHtml(readFileSync(abs));
  const parsed = parseTranscriptHtml(html);
  const needle = highlightChunkId
    ? chunkText(highlightChunkId)?.slice(0, 80).toLowerCase()
    : null;

  let highlightTurnId: string | null = null;
  const turns: TranscriptTurn[] = parsed.turns.map((t, i) => {
    const id = `${module.id}__t${String(i).padStart(3, "0")}`;
    if (
      needle &&
      !highlightTurnId &&
      t.text.toLowerCase().includes(needle.slice(0, 40))
    ) {
      highlightTurnId = id;
    }
    return { ...t, id };
  });

  return {
    module,
    turns,
    duration_minutes:
      parsed.duration_minutes ?? module.estimated_minutes ?? null,
    highlight_chunk_id: highlightTurnId ?? highlightChunkId ?? null,
  };
}
