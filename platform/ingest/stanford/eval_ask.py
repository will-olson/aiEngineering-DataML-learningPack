#!/usr/bin/env python3
"""Offline Ask retrieval eval: Recall@5 and MRR against golden module ids.

Mirrors the hybrid FTS + dense RRF path used by platform/web/src/lib/ask.ts
(without optional LLM rewrite/rerank/synthesis).

Usage (from repo root):
  python3 platform/ingest/stanford/eval_ask.py
  python3 platform/ingest/stanford/eval_ask.py --limit 10
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
import sqlite3
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
ASK = REPO / "data" / "ask"
EVAL = ASK / "eval" / "queries.jsonl"
EMBED_DIM = 384
TOKEN_RE = re.compile(r"[a-z0-9]+")


def tokenize(text: str) -> list[str]:
    return TOKEN_RE.findall(text.lower())


def feature_hash_embed(text: str, dim: int = EMBED_DIM) -> list[float]:
    vec = [0.0] * dim
    tokens = tokenize(text)
    if not tokens:
        return vec
    tf: dict[str, int] = {}
    for t in tokens:
        tf[t] = tf.get(t, 0) + 1
    for tok, cnt in tf.items():
        h = hashlib.md5(tok.encode("utf-8")).digest()
        idx = int.from_bytes(h[0:4], "big") % dim
        sign = 1 if (h[4] & 1) else -1
        vec[idx] += sign * (1 + math.log(cnt))
    norm = math.sqrt(sum(v * v for v in vec)) or 1.0
    return [v / norm for v in vec]


def cosine(a: list[float], b: list[float]) -> float:
    n = min(len(a), len(b))
    return sum(a[i] * b[i] for i in range(n))


def fts_query(raw: str, extra_tokens: list[str] | None = None) -> str:
    tokens = [t for t in tokenize(raw) if len(t) > 1][:12]
    if extra_tokens:
        for t in extra_tokens:
            if t not in tokens and len(t) > 1:
                tokens.append(t)
            if len(tokens) >= 20:
                break
    if not tokens:
        return '""'
    return " OR ".join(f'"{t.replace(chr(34), "")}"' for t in tokens)


def load_embeddings(path: Path) -> tuple[str, dict[str, list[float]]]:
    raw = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(raw, dict) and "vectors" in raw:
        return str(raw.get("model", "unknown")), raw["vectors"]
    return "legacy-flat", raw


def load_glossary(path: Path) -> list[dict]:
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8"))


def expand_tokens(query: str, glossary: list[dict], cap: int = 8) -> list[str]:
    q_low = query.lower()
    q_toks = set(tokenize(query))
    extras: list[str] = []
    for g in glossary:
        term = g.get("term", "")
        if not term:
            continue
        hit = term in q_low or any(t in q_toks for t in tokenize(term))
        if not hit:
            continue
        for piece in [term, *g.get("aliases", [])]:
            for t in tokenize(piece):
                if t not in q_toks and t not in extras and len(t) > 1:
                    extras.append(t)
                if len(extras) >= cap:
                    return extras
    return extras


def search(
    conn: sqlite3.Connection,
    query: str,
    course_ids: list[str],
    embeddings: dict[str, list[float]],
    meta: dict[str, tuple[str, float]],
    glossary: list[dict],
    limit: int = 40,
) -> list[tuple[str, str, float]]:
    """Return ranked (chunk_id, module_id, fused_score)."""
    extras = expand_tokens(query, glossary)
    match = fts_query(query, extras)
    sql = """
      SELECT c.chunk_id, c.module_id, c.course_id, c.role, c.weight, c.text,
             bm25(chunks_fts) AS rank
      FROM chunks_fts
      JOIN chunks c ON c.chunk_id = chunks_fts.chunk_id
      WHERE chunks_fts MATCH ?
    """
    params: list = [match]
    if course_ids:
        placeholders = ",".join("?" for _ in course_ids)
        sql += f" AND c.course_id IN ({placeholders})"
        params.extend(course_ids)
    sql += " ORDER BY rank LIMIT ?"
    params.append(limit)

    fts_rows: list[dict] = []
    try:
        cur = conn.execute(sql, params)
        cols = [d[0] for d in cur.description]
        for row in cur.fetchall():
            fts_rows.append(dict(zip(cols, row)))
    except sqlite3.OperationalError:
        fts_rows = []

    q_vec = feature_hash_embed(query)
    course_filter = set(course_ids)
    dense: list[tuple[str, float]] = []
    if embeddings:
        for chunk_id, vec in embeddings.items():
            m = meta.get(chunk_id)
            if not m:
                continue
            course_id, weight = m
            if course_filter and course_id not in course_filter:
                continue
            dense.append((chunk_id, cosine(q_vec, vec) * weight))
        dense.sort(key=lambda x: -x[1])
        dense = dense[:limit]
    else:
        for row in fts_rows:
            dense.append(
                (
                    row["chunk_id"],
                    cosine(q_vec, feature_hash_embed(row["text"]))
                    * float(row["weight"] or 1),
                )
            )
        dense.sort(key=lambda x: -x[1])
        dense = dense[:limit]

    k = 60
    scores: dict[str, float] = {}
    modules: dict[str, str] = {}
    for i, row in enumerate(fts_rows):
        boost = 1.15 if row["role"] == "instructor" else 0.85
        cid = row["chunk_id"]
        scores[cid] = scores.get(cid, 0.0) + boost / (k + i + 1)
        modules[cid] = row["module_id"]
    for i, (cid, _) in enumerate(dense):
        scores[cid] = scores.get(cid, 0.0) + 1.0 / (k + i + 1)
        if cid not in modules:
            # resolve module from meta table
            row = conn.execute(
                "SELECT module_id FROM chunks WHERE chunk_id = ?", (cid,)
            ).fetchone()
            if row:
                modules[cid] = row[0]

    ranked = sorted(scores.items(), key=lambda x: -x[1])[:8]
    return [(cid, modules.get(cid, ""), sc) for cid, sc in ranked]


def evidence_strength(top_score: float | None) -> str:
    if top_score is None or top_score <= 0:
        return "weak"
    if top_score >= 0.045:
        return "strong"
    if top_score >= 0.025:
        return "moderate"
    return "weak"


def main() -> None:
    parser = argparse.ArgumentParser(description="Ask retrieval eval")
    parser.add_argument("--limit", type=int, default=0, help="Eval only first N queries")
    parser.add_argument(
        "--queries",
        type=Path,
        default=EVAL,
        help="Path to queries.jsonl",
    )
    args = parser.parse_args()

    db_path = ASK / "ask.sqlite"
    emb_path = ASK / "embeddings.json"
    if not db_path.exists():
        raise SystemExit(f"Missing {db_path}; run ingest first")

    model, embeddings = (
        load_embeddings(emb_path) if emb_path.exists() else ("none", {})
    )
    glossary = load_glossary(ASK / "glossary.json")

    conn = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)
    meta_rows = conn.execute("SELECT chunk_id, course_id, weight FROM chunks").fetchall()
    meta = {r[0]: (r[1], float(r[2] or 1.0)) for r in meta_rows}

    lines = [
        ln
        for ln in args.queries.read_text(encoding="utf-8").splitlines()
        if ln.strip()
    ]
    if args.limit:
        lines = lines[: args.limit]

    hits_at_5 = 0
    mrr_sum = 0.0
    scored_n = 0
    weak_ok = 0
    weak_n = 0

    print(f"Embeddings model: {model} ({len(embeddings)} vectors)")
    print(f"Queries: {len(lines)}\n")

    for ln in lines:
        item = json.loads(ln)
        qid = item["id"]
        query = item["query"]
        course_ids = item.get("course_ids") or []
        expected = item.get("expected_module_ids") or []

        ranked = search(conn, query, course_ids, embeddings, meta, glossary)
        top_modules: list[str] = []
        for _, mid, _ in ranked:
            if mid and mid not in top_modules:
                top_modules.append(mid)
        top5 = top_modules[:5]
        top_score = ranked[0][2] if ranked else None
        strength = evidence_strength(top_score)

        if not expected:
            weak_n += 1
            if strength == "weak" or not top5:
                weak_ok += 1
            print(f"{qid}: strength={strength} (noise query) top={top5[:3]}")
            continue

        scored_n += 1
        hit = any(m in expected for m in top5)
        if hit:
            hits_at_5 += 1
        rr = 0.0
        for i, m in enumerate(top5):
            if m in expected:
                rr = 1.0 / (i + 1)
                break
        mrr_sum += rr
        mark = "OK" if hit else "MISS"
        print(
            f"{qid}: {mark} strength={strength} rr={rr:.2f} "
            f"top={top5[:3]} expected={expected[:3]}"
        )

    conn.close()
    recall = hits_at_5 / scored_n if scored_n else 0.0
    mrr = mrr_sum / scored_n if scored_n else 0.0
    print("\n=== Summary ===")
    print(f"Recall@5: {recall:.3f} ({hits_at_5}/{scored_n})")
    print(f"MRR:      {mrr:.3f}")
    if weak_n:
        print(f"Weak/noise abstention: {weak_ok}/{weak_n}")
    # Write baseline snapshot for docs/CI comparison
    out = ASK / "eval" / "last_baseline.json"
    out.write_text(
        json.dumps(
            {
                "recall_at_5": round(recall, 4),
                "mrr": round(mrr, 4),
                "scored": scored_n,
                "hits": hits_at_5,
                "embeddings_model": model,
                "weak_ok": weak_ok,
                "weak_n": weak_n,
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()
