"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { AskContext, AskCourse, AskResponse } from "@/lib/types";
import { hrefForModule, hrefForSuggestion } from "@/lib/routes";

const EXAMPLES = [
  "How does CS229 turn raw observations into labeled features for classification?",
  "What is state evolution in a linear dynamical system (EE263)?",
  "How do constraints and feasible windows show up outside the homework (EE364)?",
  "How can event magnitudes be treated as a signal (EE261)?",
  "How do Earth events, orbits, and launches share one applied story?",
  "What is the dual of a convex optimization problem according to Boyd?",
];

export function AskClient({ courses }: { courses: AskCourse[] }) {
  const [query, setQuery] = useState("");
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AskResponse | null>(null);
  const [history, setHistory] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [askContext, setAskContext] = useState<AskContext | undefined>();

  const courseLabel = useMemo(() => {
    const map = new Map(courses.map((c) => [c.course_id, c.title]));
    return (id: string) => map.get(id) ?? id.toUpperCase();
  }, [courses]);

  const excerptIndex = useMemo(() => {
    if (!result?.excerpts.length) return new Map<string, number>();
    const m = new Map<string, number>();
    result.excerpts.forEach((e, i) => m.set(e.chunk_id, i + 1));
    return m;
  }, [result]);

  const toggleCourse = (id: string) => {
    setCourseIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const run = useCallback(
    async (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/v1/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: trimmed,
            course_ids: courseIds,
            history,
            context: askContext,
          }),
        });
        if (!res.ok) {
          throw new Error(`Ask failed (${res.status})`);
        }
        const data = (await res.json()) as AskResponse;
        setResult(data);
        setAskContext(data.context);
        setHistory((h) => [
          ...h,
          { role: "user", content: trimmed },
          { role: "assistant", content: data.answer },
        ]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Ask failed");
      } finally {
        setLoading(false);
      }
    },
    [courseIds, history, askContext],
  );

  const renderAnswer = (data: AskResponse) => {
    if (!data.citations.length) {
      return <p>{data.answer}</p>;
    }
    const parts: ReactNode[] = [];
    // Append footnote markers for each citation after the answer prose
    parts.push(<span key="body">{data.answer}</span>);
    parts.push(" ");
    data.citations.forEach((c, i) => {
      const n = excerptIndex.get(c.chunk_id) ?? i + 1;
      parts.push(
        <a
          key={c.chunk_id}
          className="ask-cite"
          href={`#excerpt-${c.chunk_id}`}
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById(`excerpt-${c.chunk_id}`)
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
        >
          [{n}]
        </a>,
      );
      parts.push(" ");
    });
    return <p>{parts}</p>;
  };

  return (
    <div className="ask-page">
      <header className="ask-header">
        <h1>Ask the lectures</h1>
        <p>
          PhD-style questions over open Stanford transcripts—definitions,
          excerpts, and lecture context with citations.
        </p>
      </header>

      <div className="ask-examples">
        <span className="ask-examples-label">Try an example</span>
        <ul>
          {EXAMPLES.map((ex) => (
            <li key={ex}>
              <button
                type="button"
                className="chip-btn"
                onClick={() => {
                  setQuery(ex);
                  void run(ex);
                }}
              >
                {ex}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-chips" role="group" aria-label="Course filters">
        {courses.map((c) => {
          const active = courseIds.includes(c.course_id);
          return (
            <button
              key={c.course_id}
              type="button"
              className={`chip-btn${active ? " active" : ""}`}
              aria-pressed={active}
              onClick={() => toggleCourse(c.course_id)}
            >
              {c.course_id.toUpperCase()}
            </button>
          );
        })}
        {courseIds.length > 0 && (
          <button
            type="button"
            className="chip-btn"
            onClick={() => setCourseIds([])}
          >
            Clear filters
          </button>
        )}
      </div>

      <form
        className="ask-form"
        onSubmit={(e) => {
          e.preventDefault();
          void run(query);
        }}
      >
        <label className="field" htmlFor="ask-query">
          <span className="sr-only">Question</span>
          <textarea
            id="ask-query"
            className="ask-input"
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a conceptual question…"
            aria-label="Ask a question"
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Searching…" : "Ask"}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {result && (
        <section className="ask-results" aria-live="polite">
          <div className="ask-badges">
            <div className="ask-mode-badge">
              {result.mode === "synthesized"
                ? "Synthesized answer (OpenAI)"
                : result.llm_available
                  ? "Grounded excerpts (synthesis unavailable)"
                  : "Grounded excerpts only — add OPENAI_API_KEY in .env for synthesized answers"}
            </div>
            <div
              className={`ask-evidence-badge evidence-${result.evidence_strength}`}
            >
              Evidence: {result.evidence_strength}
            </div>
          </div>

          {result.search_query_used &&
            result.search_query_used.trim() !== query.trim() && (
              <p className="ask-rewrite muted">
                Searching as: {result.search_query_used}
              </p>
            )}

          <section className="ask-section">
            <h2>Answer</h2>
            {renderAnswer(result)}
          </section>

          {result.needs_clarification && (
            <section className="ask-section ask-clarify">
              <h2>Try narrowing</h2>
              <p className="muted">
                Pick a course filter, ask to define a key term, or browse
                lectures.
              </p>
              <div className="filter-chips">
                {result.clarification_suggestions.map((s) => (
                  <button
                    key={s.course_id}
                    type="button"
                    className="chip-btn"
                    onClick={() => {
                      setCourseIds([s.course_id]);
                    }}
                  >
                    {s.label}
                  </button>
                ))}
                <Link className="chip-btn" href="/learn">
                  Browse Learn
                </Link>
              </div>
            </section>
          )}

          {result.definitions.length > 0 && (
            <section className="ask-section">
              <h2>Definitions</h2>
              <ul className="ask-list">
                {result.definitions.map((d) => (
                  <li key={`${d.term}-${d.chunk_id}`}>
                    <strong>{d.term}</strong>
                    <p>{d.text}</p>
                    <Link
                      href={`/learn/${getTrack(d.module_id)}/${d.module_id}#${d.chunk_id}`}
                    >
                      Open source lecture
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {result.excerpts.length > 0 && (
            <section className="ask-section">
              <h2>Conceptual excerpts</h2>
              <ul className="ask-list">
                {result.excerpts.map((e, i) => (
                  <li key={e.chunk_id} id={`excerpt-${e.chunk_id}`}>
                    <div className="ask-excerpt-meta">
                      [{i + 1}] {courseLabel(e.course_id)} · Lecture{" "}
                      {e.lecture} · {e.role}
                    </div>
                    <p>“{e.text}”</p>
                    <Link
                      href={`/learn/${e.track_id ?? getTrack(e.module_id)}/${e.module_id}?chunk=${encodeURIComponent(e.chunk_id)}#${e.chunk_id}`}
                    >
                      View in transcript
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {result.lectures.length > 0 && (
            <section className="ask-section">
              <h2>Relevant lectures</h2>
              <ul className="ask-list">
                {result.lectures.map((l) => (
                  <li key={l.module_id}>
                    <Link
                      href={hrefForModule(
                        "learn",
                        l.module_id,
                        l.track_id ?? getTrack(l.module_id),
                      )}
                    >
                      {l.title}
                    </Link>
                    <span className="muted"> — {l.reason}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {result.related_terms.length > 0 && (
            <section className="ask-section">
              <h2>Related terms</h2>
              <div className="filter-chips">
                {result.related_terms.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="chip-btn"
                    onClick={() => {
                      const q = `Define ${t}`;
                      setQuery(q);
                      void run(q);
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </section>
          )}

          {result.apply.length > 0 && (
            <section className="ask-section">
              <h2>Apply</h2>
              <ul className="ask-list">
                {result.apply.map((a) => (
                  <li key={a.module_id}>
                    <Link href={hrefForSuggestion(a)}>{a.title}</Link>
                    <span className="muted"> — {a.reason}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>
      )}
    </div>
  );
}

function getTrack(moduleId: string): string {
  const m = moduleId.match(/^stanford-([a-z0-9]+)-/);
  return m ? `stanford-${m[1]}` : "python-ds";
}
