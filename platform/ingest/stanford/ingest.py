#!/usr/bin/env python3
"""Ingest Stanford lecture HTML transcripts into catalog + Ask retrieval assets.

Writes:
  data/catalog/stanford-modules.json
  data/catalog/stanford-tracks.json
  data/ask/chunks.jsonl
  data/ask/glossary.json
  data/ask/courses.json
  data/ask/ask.sqlite  (FTS5)
  data/ask/embeddings.json  (dense vectors: OpenAI text-embedding-3-small when OPENAI_API_KEY set, else feature-hash-384)

Run from repo root: python3 platform/ingest/stanford/ingest.py
"""

from __future__ import annotations

import hashlib
import json
import math
import os
import re
import sqlite3
from collections import Counter, defaultdict
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
TRANSCRIPTS = REPO / "docs" / "stanfordLectureTranscripts"
OUT_ASK = REPO / "data" / "ask"
OUT_CATALOG = REPO / "data" / "catalog"

COURSES = {
    "106A_programmingMethodology": {
        "course_id": "cs106a",
        "track_id": "stanford-cs106a",
        "title": "CS106A Programming Methodology",
        "instructor": "Mehran Sahami",
        "level": "beginner",
        "skills": ["python", "programming", "algorithms"],
        "tags": ["stanford", "cs106a"],
        "prefix": "ProgrammingMethodology",
    },
    "106B_programmingAbstractions": {
        "course_id": "cs106b",
        "track_id": "stanford-cs106b",
        "title": "CS106B Programming Abstractions",
        "instructor": "Julie Zelenski",
        "level": "beginner",
        "skills": ["python", "algorithms", "programming"],
        "tags": ["stanford", "cs106b"],
        "prefix": "ProgrammingAbstractions",
    },
    "107_programmingParadigms": {
        "course_id": "cs107",
        "track_id": "stanford-cs107",
        "title": "CS107 Programming Paradigms",
        "instructor": "Jerry Cain",
        "level": "intermediate",
        "skills": ["programming", "algorithms", "systems"],
        "tags": ["stanford", "cs107"],
        "prefix": "ProgrammingParadigms",
    },
    "223A_introRobotics": {
        "course_id": "cs223a",
        "track_id": "stanford-cs223a",
        "title": "CS223A Introduction to Robotics",
        "instructor": "Oussama Khatib",
        "level": "advanced",
        "skills": ["robotics", "python"],
        "tags": ["stanford", "cs223a"],
        "prefix": "IntroductionToRobotics",
    },
    "229_machineLearning": {
        "course_id": "cs229",
        "track_id": "stanford-cs229",
        "title": "CS229 Machine Learning",
        "instructor": "Andrew Ng",
        "level": "advanced",
        "skills": ["ml", "scikit-learn", "python", "numpy"],
        "tags": ["stanford", "cs229"],
        "prefix": "MachineLearning",
    },
    "261EE_fourierTransformApplications": {
        "course_id": "ee261",
        "track_id": "stanford-ee261",
        "title": "EE261 Fourier Transform and Applications",
        "instructor": "Brad Osgood",
        "level": "advanced",
        "skills": ["signal-processing", "math"],
        "tags": ["stanford", "ee261"],
        "prefix": "TheFourierTransformAndItsApplications",
    },
    "263EE_linearDynamicalSystems": {
        "course_id": "ee263",
        "track_id": "stanford-ee263",
        "title": "EE263 Linear Dynamical Systems",
        "instructor": "Stephen Boyd",
        "level": "advanced",
        "skills": ["math", "ml", "python"],
        "tags": ["stanford", "ee263"],
        "prefix": "LinearDynamicalSystems",
    },
    "346AEE_convexOptimization1": {
        "course_id": "ee364a",
        "track_id": "stanford-ee364a",
        "title": "EE364A Convex Optimization I",
        "instructor": "Stephen Boyd",
        "level": "advanced",
        "skills": ["ml", "math", "optimization"],
        "tags": ["stanford", "ee364a"],
        "prefix": "ConvexOptimizationI",
    },
    "346AEE_convexOptimization2": {
        "course_id": "ee364b",
        "track_id": "stanford-ee364b",
        "title": "EE364B Convex Optimization II",
        "instructor": "Stephen Boyd",
        "level": "advanced",
        "skills": ["ml", "math", "optimization"],
        "tags": ["stanford", "ee364b"],
        "prefix": "ConvexOptimizationII",
    },
}

SPEAKER_RE = re.compile(
    r"<b>\s*([^<:]+?)\s*:?\s*</b>\s*:?\s*",
    re.IGNORECASE,
)
DURATION_RE = re.compile(r"Duration:\s*(\d+)\s*minutes", re.IGNORECASE)
DEF_PATTERNS = [
    re.compile(
        r"\b(?:we\s+(?:will\s+)?define|let\s+us\s+define|define)\s+"
        r"([A-Za-z][A-Za-z0-9\-]{2,40}(?:\s+[A-Za-z][A-Za-z0-9\-]{2,40}){0,3})"
        r"\s+(?:as|to be|by)\b",
        re.IGNORECASE,
    ),
    re.compile(
        r"\b([A-Za-z][A-Za-z0-9\-]{2,40}(?:\s+[A-Za-z][A-Za-z0-9\-]{2,40}){0,2})"
        r"\s+is\s+(?:a|an|the)\s+(?:algorithm|method|technique|model|loss|function|"
        r"problem|matrix|vector|classifier|regression|distribution|transform|"
        r"system|optimization|constraint|set|space|kernel|feature)\b",
        re.IGNORECASE,
    ),
    re.compile(
        r"\bso[- ]called\s+([A-Za-z][A-Za-z0-9\-]{2,40}(?:\s+[A-Za-z][A-Za-z0-9\-]{2,40}){0,2})\b",
        re.IGNORECASE,
    ),
]
LOGISTICS_RE = re.compile(
    r"\b(homework|office hours|midterm|final exam|scp?d|grader|syllabus|"
    r"handout|registration|quarter|coursework|tardy|late days)\b",
    re.IGNORECASE,
)
TOKEN_RE = re.compile(r"[a-z0-9]+")
EMBED_DIM = 384
MAX_CHUNK_CHARS = 2200
MIN_CHUNK_CHARS = 280


def decode_html(raw: bytes) -> str:
    for enc in ("utf-8", "cp1252", "latin-1"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", errors="replace")


def strip_tags(html: str) -> str:
    text = re.sub(r"<br\s*/?>", "\n", html, flags=re.IGNORECASE)
    text = re.sub(r"</p>", "\n", text, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", text)
    text = text.replace("&nbsp;", " ").replace("&amp;", "&")
    text = text.replace("&lt;", "<").replace("&gt;", ">")
    text = text.replace("\xa0", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def speaker_role(label: str) -> str:
    low = label.lower()
    if "student" in low:
        return "student"
    if "microphone" in low or "audience" in low:
        return "audience"
    if "guest" in low:
        return "guest"
    if "instructor" in low or "professor" in low:
        return "instructor"
    return "other"


def parse_turns(html: str) -> tuple[str, list[dict], int | None]:
    body = html
    if body.lower().startswith("<html>"):
        body = body[6:]
    if body.lower().endswith("</html>"):
        body = body[:-7]

    title_line = ""
    for line in body.splitlines():
        cleaned = strip_tags(line).strip()
        if cleaned:
            title_line = cleaned
            break

    duration = None
    m = DURATION_RE.search(body)
    if m:
        duration = int(m.group(1))

    # Split on bold speaker labels while keeping the label
    parts = SPEAKER_RE.split(body)
    turns: list[dict] = []
    if len(parts) == 1:
        text = strip_tags(parts[0])
        text = DURATION_RE.sub("", text)
        text = re.sub(r"\[End of Audio\]", "", text, flags=re.IGNORECASE).strip()
        if text:
            turns.append(
                {
                    "speaker": "Instructor",
                    "role": "instructor",
                    "text": text,
                }
            )
        return title_line, turns, duration

    # SPEAKER_RE.split yields [preamble, speaker1, text1, speaker2, text2, ...]
    preamble = strip_tags(parts[0]).strip()
    if preamble and preamble != title_line:
        # often empty after title
        pass

    i = 1
    while i + 1 < len(parts):
        label = parts[i].strip()
        chunk_html = parts[i + 1]
        text = strip_tags(chunk_html)
        text = DURATION_RE.sub("", text)
        text = re.sub(r"\[End of Audio\]", "", text, flags=re.IGNORECASE).strip()
        if text:
            turns.append(
                {
                    "speaker": label,
                    "role": speaker_role(label),
                    "text": text,
                }
            )
        i += 2
    return title_line, turns, duration


def tokenize(text: str) -> list[str]:
    return TOKEN_RE.findall(text.lower())


def is_logistics(text: str) -> bool:
    tokens = tokenize(text)
    if len(tokens) < 12:
        return False
    hits = len(LOGISTICS_RE.findall(text))
    return hits >= 2 and hits / max(len(tokens), 1) > 0.02


def chunk_turns(
    module_id: str,
    course_id: str,
    lecture_num: int,
    turns: list[dict],
) -> list[dict]:
    chunks: list[dict] = []
    buf_text: list[str] = []
    buf_role = "instructor"
    buf_speaker = "Instructor"
    chunk_idx = 0

    def flush() -> None:
        nonlocal chunk_idx, buf_text, buf_role, buf_speaker
        text = " ".join(buf_text).strip()
        buf_text = []
        if len(text) < 80:
            return
        if is_logistics(text) and len(text) < 600:
            return
        weight = 1.0
        if buf_role != "instructor":
            weight = 0.55
        if "[inaudible]" in text.lower():
            weight *= 0.7
        cid = f"{module_id}__c{chunk_idx:03d}"
        chunks.append(
            {
                "chunk_id": cid,
                "module_id": module_id,
                "course_id": course_id,
                "lecture": lecture_num,
                "speaker": buf_speaker,
                "role": buf_role,
                "text": text,
                "weight": weight,
            }
        )
        chunk_idx += 1

    for turn in turns:
        t = turn["text"].strip()
        if not t:
            continue
        # Split very long monologues on sentence-ish boundaries
        pieces = [t]
        if len(t) > MAX_CHUNK_CHARS * 1.5:
            pieces = []
            cur = ""
            for sent in re.split(r"(?<=[.!?])\s+", t):
                if len(cur) + len(sent) > MAX_CHUNK_CHARS and cur:
                    pieces.append(cur.strip())
                    cur = sent
                else:
                    cur = f"{cur} {sent}".strip()
            if cur:
                pieces.append(cur.strip())

        for piece in pieces:
            if buf_text and (
                turn["role"] != buf_role
                or sum(len(x) for x in buf_text) + len(piece) > MAX_CHUNK_CHARS
            ):
                if sum(len(x) for x in buf_text) >= MIN_CHUNK_CHARS or turn["role"] != buf_role:
                    flush()
            if not buf_text:
                buf_role = turn["role"]
                buf_speaker = turn["speaker"]
            buf_text.append(piece)

    flush()
    return chunks


def feature_hash_embed(text: str, dim: int = EMBED_DIM) -> list[float]:
    vec = [0.0] * dim
    tokens = tokenize(text)
    if not tokens:
        return vec
    tf = Counter(tokens)
    for tok, cnt in tf.items():
        h = int(hashlib.md5(tok.encode()).hexdigest(), 16)
        idx = h % dim
        sign = 1.0 if (h >> 8) & 1 else -1.0
        vec[idx] += sign * (1.0 + math.log(cnt))
    # L2 normalize
    norm = math.sqrt(sum(v * v for v in vec)) or 1.0
    return [v / norm for v in vec]


OPENAI_EMBED_MODEL = "text-embedding-3-small"


def openai_embed_batch(texts: list[str], api_key: str) -> list[list[float]] | None:
    """Embed texts with OpenAI; returns None on failure."""
    import json as _json
    import urllib.error
    import urllib.request

    out: list[list[float]] = []
    # Batch in chunks of 64
    for i in range(0, len(texts), 64):
        batch = [t[:8000] for t in texts[i : i + 64]]
        body = _json.dumps({"model": OPENAI_EMBED_MODEL, "input": batch}).encode(
            "utf-8"
        )
        req = urllib.request.Request(
            "https://api.openai.com/v1/embeddings",
            data=body,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                payload = _json.loads(resp.read().decode("utf-8"))
        except (urllib.error.URLError, TimeoutError, _json.JSONDecodeError) as e:
            print(f"OpenAI embeddings failed: {e}")
            return None
        data = sorted(payload.get("data") or [], key=lambda d: d.get("index", 0))
        if len(data) != len(batch):
            print("OpenAI embeddings: unexpected batch size")
            return None
        for item in data:
            emb = item.get("embedding")
            if not emb:
                return None
            out.append(emb)
    return out


def build_embeddings(chunks: list[dict]) -> tuple[str, int, dict[str, list[float]]]:
    """Return (model, dim, vectors). Prefer OpenAI when OPENAI_API_KEY is set."""
    api_key = (os.environ.get("OPENAI_API_KEY") or "").strip()
    if api_key:
        print(f"Embedding {len(chunks)} chunks with {OPENAI_EMBED_MODEL}…")
        texts = [ch["text"] for ch in chunks]
        vectors_list = openai_embed_batch(texts, api_key)
        if vectors_list is not None:
            vectors = {
                ch["chunk_id"]: vectors_list[i] for i, ch in enumerate(chunks)
            }
            dim = len(vectors_list[0]) if vectors_list else 0
            return OPENAI_EMBED_MODEL, dim, vectors
        print("Falling back to feature-hash embeddings")

    vectors = {ch["chunk_id"]: feature_hash_embed(ch["text"]) for ch in chunks}
    return "feature-hash-384", EMBED_DIM, vectors


def extract_glossary(chunks: list[dict]) -> list[dict]:
    # term -> best (score, entry)
    best: dict[str, tuple[float, dict]] = {}
    for ch in chunks:
        if ch["role"] != "instructor":
            continue
        text = ch["text"]
        for pat in DEF_PATTERNS:
            for m in pat.finditer(text):
                term = m.group(1).strip(" .,;:\"'").lower()
                term = re.sub(r"\s+", " ", term)
                if len(term) < 3 or len(term) > 48:
                    continue
                if term.startswith(("the ", "a ", "an ", "this ", "that ", "what ")):
                    continue
                stop = {
                    "it",
                    "this",
                    "that",
                    "there",
                    "here",
                    "what",
                    "which",
                    "when",
                    "where",
                    "how",
                    "why",
                    "you",
                    "we",
                    "i",
                    "they",
                    "he",
                    "she",
                    "one",
                    "thing",
                    "things",
                    "way",
                    "sort",
                    "kind",
                    "lot",
                    "bit",
                    "example",
                    "class",
                    "lecture",
                    "course",
                    "homework",
                    "so",
                    "and",
                    "but",
                    "or",
                    "if",
                    "then",
                    "now",
                    "okay",
                    "right",
                    "well",
                    "just",
                    "also",
                    "very",
                    "really",
                    "actually",
                    "basically",
                    "something",
                    "anything",
                    "everything",
                    "someone",
                    "anyone",
                    "people",
                    "stuff",
                    "question",
                    "philosophical",
                    "comment",
                }
                first = term.split()[0] if term else ""
                if term in stop or first in stop:
                    continue
                if any(ch.isdigit() for ch in term):
                    continue
                if len(term.split()) > 4:
                    continue
                # snippet around match
                start = max(0, m.start() - 40)
                end = min(len(text), m.end() + 180)
                snippet = text[start:end].strip()
                score = ch["weight"] * (1.2 if "define" in m.group(0).lower() else 1.0)
                prev = best.get(term)
                if not prev or score > prev[0]:
                    best[term] = (
                        score,
                        {
                            "term": term,
                            "text": snippet,
                            "chunk_id": ch["chunk_id"],
                            "module_id": ch["module_id"],
                            "course_id": ch["course_id"],
                            "aliases": [],
                        },
                    )
    entries = [v[1] for v in sorted(best.values(), key=lambda x: -x[0])]
    # Cap glossary size for UX
    return entries[:2500]


def lecture_num_from_name(name: str) -> int:
    m = re.search(r"Lecture0*(\d+)", name, re.IGNORECASE)
    return int(m.group(1)) if m else 0


def build_sqlite(chunks: list[dict], db_path: Path) -> None:
    if db_path.exists():
        db_path.unlink()
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE chunks (
          chunk_id TEXT PRIMARY KEY,
          module_id TEXT NOT NULL,
          course_id TEXT NOT NULL,
          lecture INTEGER NOT NULL,
          speaker TEXT,
          role TEXT,
          weight REAL,
          text TEXT NOT NULL
        )
        """
    )
    cur.execute(
        """
        CREATE VIRTUAL TABLE chunks_fts USING fts5(
          chunk_id UNINDEXED,
          module_id UNINDEXED,
          course_id UNINDEXED,
          role UNINDEXED,
          text,
          tokenize = 'porter'
        )
        """
    )
    for ch in chunks:
        cur.execute(
            "INSERT INTO chunks VALUES (?,?,?,?,?,?,?,?)",
            (
                ch["chunk_id"],
                ch["module_id"],
                ch["course_id"],
                ch["lecture"],
                ch["speaker"],
                ch["role"],
                ch["weight"],
                ch["text"],
            ),
        )
        cur.execute(
            "INSERT INTO chunks_fts(chunk_id, module_id, course_id, role, text) VALUES (?,?,?,?,?)",
            (
                ch["chunk_id"],
                ch["module_id"],
                ch["course_id"],
                ch["role"],
                ch["text"],
            ),
        )
    conn.commit()
    conn.close()


def main() -> None:
    OUT_ASK.mkdir(parents=True, exist_ok=True)
    OUT_CATALOG.mkdir(parents=True, exist_ok=True)

    modules: list[dict] = []
    tracks: list[dict] = []
    courses_meta: list[dict] = []
    all_chunks: list[dict] = []

    for folder, meta in COURSES.items():
        course_dir = TRANSCRIPTS / folder
        if not course_dir.is_dir():
            print(f"skip missing {folder}")
            continue
        html_files = sorted(course_dir.glob("*.html"))
        module_ids: list[str] = []
        for html_path in html_files:
            lec = lecture_num_from_name(html_path.stem)
            module_id = f"stanford-{meta['course_id']}-l{lec:02d}"
            raw = html_path.read_bytes()
            html = decode_html(raw)
            title_line, turns, duration = parse_turns(html)
            title = f"{meta['title']} — Lecture {lec}"
            summary = None
            if turns:
                first = turns[0]["text"]
                summary = (first[:180] + "…") if len(first) > 180 else first

            rel = str(html_path.relative_to(REPO)).replace("\\", "/")
            pdf_path = html_path.with_suffix(".pdf")
            pdf_rel = (
                str(pdf_path.relative_to(REPO)).replace("\\", "/")
                if pdf_path.exists()
                else None
            )

            next_ids: list[str] = []
            module_ids.append(module_id)
            modules.append(
                {
                    "id": module_id,
                    "title": title,
                    "source_path": rel,
                    "source_fork": "stanfordLectureTranscripts",
                    "product_area": "learn",
                    "modality": "lesson",
                    "level": meta["level"],
                    "skills": list(meta["skills"]),
                    "prerequisites": [],
                    "offline_ok": True,
                    "availability": "local",
                    "estimated_minutes": duration,
                    "track_ids": [meta["track_id"]],
                    "next_ids": next_ids,
                    "tags": list(meta["tags"]) + [f"lecture-{lec}"],
                    "external_url": None,
                    "license_note": "Stanford Engineering Everywhere open courseware; attribute Stanford University / instructor.",
                    "summary": summary,
                    "pdf_path": pdf_rel,
                    "course_id": meta["course_id"],
                    "lecture_number": lec,
                    "instructor": meta["instructor"],
                }
            )

            chunks = chunk_turns(module_id, meta["course_id"], lec, turns)
            all_chunks.extend(chunks)

        course_mods = [m for m in modules if meta["track_id"] in m["track_ids"]]
        course_mods.sort(key=lambda m: m["lecture_number"])
        for i, m in enumerate(course_mods):
            m["next_ids"] = (
                [course_mods[i + 1]["id"]] if i + 1 < len(course_mods) else []
            )

        tracks.append(
            {
                "id": meta["track_id"],
                "title": meta["title"],
                "product_area": "learn",
                "description": f"Open Stanford lecture transcripts ({meta['instructor']}).",
                "module_ids": [m["id"] for m in course_mods],
                "default_level": meta["level"],
            }
        )
        courses_meta.append(
            {
                "course_id": meta["course_id"],
                "track_id": meta["track_id"],
                "title": meta["title"],
                "instructor": meta["instructor"],
                "lecture_count": len(course_mods),
                "folder": folder,
            }
        )
        print(f"{meta['course_id']}: {len(course_mods)} lectures, chunks so far {len(all_chunks)}")

    glossary = extract_glossary(all_chunks)

    # Persist
    (OUT_CATALOG / "stanford-modules.json").write_text(
        json.dumps(modules, indent=2) + "\n", encoding="utf-8"
    )
    (OUT_CATALOG / "stanford-tracks.json").write_text(
        json.dumps(tracks, indent=2) + "\n", encoding="utf-8"
    )
    (OUT_ASK / "courses.json").write_text(
        json.dumps(courses_meta, indent=2) + "\n", encoding="utf-8"
    )
    (OUT_ASK / "glossary.json").write_text(
        json.dumps(glossary, indent=2) + "\n", encoding="utf-8"
    )

    with (OUT_ASK / "chunks.jsonl").open("w", encoding="utf-8") as f:
        for ch in all_chunks:
            f.write(json.dumps(ch, ensure_ascii=False) + "\n")

    emb_model, emb_dim, embeddings = build_embeddings(all_chunks)
    (OUT_ASK / "embeddings.json").write_text(
        json.dumps(
            {"model": emb_model, "dim": emb_dim, "vectors": embeddings},
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )

    build_sqlite(all_chunks, OUT_ASK / "ask.sqlite")

    print(
        f"Done: {len(modules)} modules, {len(all_chunks)} chunks, "
        f"{len(glossary)} glossary terms, embeddings={emb_model} → {OUT_ASK}"
    )


if __name__ == "__main__":
    main()
