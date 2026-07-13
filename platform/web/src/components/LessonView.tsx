"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LessonContent, SuggestionItem } from "@/lib/types";
import { markComplete, readProgress } from "@/lib/progress";
import { WhatNextPanel } from "@/components/WhatNextPanel";
import { ResourceBadge } from "@/components/ResourceBadge";

function simpleMarkdown(src: string): string {
  let s = src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  s = s.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  s = s.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  s = s.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return s;
}

export function LessonView({
  trackId,
  lesson,
}: {
  trackId: string;
  lesson: LessonContent;
}) {
  const { module: catalogModule, cells, toc } = lesson;
  const [done, setDone] = useState(false);
  const [tocId, setTocId] = useState("");
  const [crossLink, setCrossLink] = useState<SuggestionItem | null>(null);

  useEffect(() => {
    setDone(readProgress().completed_ids.includes(catalogModule.id));
  }, [catalogModule.id]);

  useEffect(() => {
    const p = readProgress();
    const params = new URLSearchParams({
      product_area: "learn",
      active_track_id: trackId,
      last_module_id: catalogModule.id,
      limit: "3",
    });
    if (p.completed_ids.length) {
      params.set(
        "completed_ids",
        [...p.completed_ids, catalogModule.id].join(","),
      );
    }
    fetch(`/api/v1/suggestions?${params}`)
      .then((r) => r.json())
      .then((data: { items?: SuggestionItem[] }) => {
        const secondary = (data.items ?? []).find(
          (i) =>
            i.kind === "related_lab" ||
            i.kind === "matching_dataset" ||
            i.kind === "matching_api",
        );
        setCrossLink(secondary ?? null);
      })
      .catch(() => setCrossLink(null));
  }, [catalogModule.id, trackId]);

  const nextId = catalogModule.next_ids[0];

  const onComplete = () => {
    markComplete(catalogModule.id, trackId, "learn");
    setDone(true);
  };

  const jump = (id: string) => {
    setTocId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const tocOptions = useMemo(() => toc, [toc]);

  return (
    <article>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/learn">Learn</Link>
        {" / "}
        <Link href={`/learn/${trackId}`}>Python Data Science</Link>
        {" / "}
        <span>{catalogModule.title}</span>
      </nav>

      <header className="lesson-header">
        <div className="module-meta">
          <span className="badge">{catalogModule.level}</span>
          <ResourceBadge
            availability={catalogModule.availability}
            offlineOk={catalogModule.offline_ok}
          />
          <span className="badge">{catalogModule.modality}</span>
        </div>
        <h1>{catalogModule.title}</h1>
        {catalogModule.summary && (
          <p style={{ color: "var(--text-muted)" }}>{catalogModule.summary}</p>
        )}
      </header>

      {tocOptions.length > 0 && (
        <div className="toc-wrap">
          <label className="field">
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              Jump to section
            </span>
            <select
              className="field-select"
              value={tocId}
              onChange={(e) => jump(e.target.value)}
              aria-label="Lesson table of contents"
            >
              <option value="">Select a heading…</option>
              {tocOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.text}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className="lesson-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onComplete}
          disabled={done}
        >
          {done ? "Completed" : "Mark complete"}
        </button>
        <Link className="btn btn-secondary" href={`/learn/${trackId}`}>
          Back to modules
        </Link>
      </div>

      <div className="notebook">
        {cells.map((cell) =>
          cell.cell_type === "code" ? (
            <pre key={cell.id} id={cell.id} className="nb-cell code">
              <code>{cell.source}</code>
            </pre>
          ) : (
            <div
              key={cell.id}
              id={cell.id}
              className="nb-cell markdown"
              dangerouslySetInnerHTML={{
                __html: simpleMarkdown(cell.source),
              }}
            />
          ),
        )}
      </div>

      {(done || nextId || crossLink) && (
        <WhatNextPanel
          layout="actions"
          primary={
            nextId
              ? {
                  href: `/learn/${trackId}/${nextId}`,
                  title: "Continue to next lesson",
                  actionLabel: "Continue to next lesson",
                }
              : null
          }
          emptyMessage={
            nextId ? undefined : "You reached the end of this track spine."
          }
          crossSuggestion={crossLink}
        />
      )}
    </article>
  );
}
