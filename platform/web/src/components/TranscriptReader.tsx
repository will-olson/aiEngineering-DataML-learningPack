"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { SuggestionItem, TranscriptContent } from "@/lib/types";
import { markComplete, readProgress } from "@/lib/progress";
import { WhatNextPanel } from "@/components/WhatNextPanel";
import { ResourceBadge } from "@/components/ResourceBadge";
import { hrefForSuggestion } from "@/lib/routes";

export function TranscriptReader({
  trackId,
  trackTitle,
  transcript,
}: {
  trackId: string;
  trackTitle: string;
  transcript: TranscriptContent;
}) {
  const { module: catalogModule, turns, duration_minutes, highlight_chunk_id } =
    transcript;
  const [done, setDone] = useState(false);
  const [crossLink, setCrossLink] = useState<SuggestionItem | null>(null);

  useEffect(() => {
    setDone(readProgress().completed_ids.includes(catalogModule.id));
  }, [catalogModule.id]);

  useEffect(() => {
    if (!highlight_chunk_id) return;
    const el = document.getElementById(highlight_chunk_id);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.classList.add("highlight");
  }, [highlight_chunk_id]);

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
  const previewTurns = useMemo(() => turns, [turns]);

  const onComplete = () => {
    markComplete(catalogModule.id, trackId, "learn");
    setDone(true);
  };

  return (
    <article>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/learn">Learn</Link>
        {" / "}
        <Link href={`/learn/${trackId}`}>{trackTitle}</Link>
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
          {catalogModule.course_id && (
            <span className="badge">{catalogModule.course_id.toUpperCase()}</span>
          )}
          {duration_minutes != null && (
            <span className="badge">{duration_minutes} min</span>
          )}
        </div>
        <h1>{catalogModule.title}</h1>
        {catalogModule.instructor && (
          <p style={{ color: "var(--text-muted)" }}>
            Instructor: {catalogModule.instructor}
          </p>
        )}
        {catalogModule.summary && (
          <p style={{ color: "var(--text-muted)" }}>{catalogModule.summary}</p>
        )}
        {catalogModule.license_note && (
          <p className="attribution">{catalogModule.license_note}</p>
        )}
      </header>

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
          Back to lectures
        </Link>
        <Link className="btn btn-secondary" href="/ask">
          Ask about this course
        </Link>
      </div>

      <div className="transcript">
        {previewTurns.map((turn) => (
          <div
            key={turn.id}
            id={turn.id}
            className={`transcript-turn role-${turn.role}${
              highlight_chunk_id === turn.id ? " highlight" : ""
            }`}
          >
            <div className="transcript-speaker">{turn.speaker}</div>
            <p>{turn.text}</p>
          </div>
        ))}
      </div>

      {(done || nextId || crossLink) && (
        <WhatNextPanel
          layout="actions"
          primary={
            nextId
              ? {
                  href: `/learn/${trackId}/${nextId}`,
                  title: "Continue to next lecture",
                  actionLabel: "Continue to next lecture",
                }
              : null
          }
          emptyMessage={
            nextId ? undefined : "You reached the end of this lecture track."
          }
          crossSuggestion={crossLink}
        />
      )}

      {crossLink && (
        <p className="ask-apply-hint">
          <Link href={hrefForSuggestion(crossLink)}>Try related lab</Link>
          {" — explain then build from this lecture."}
        </p>
      )}
    </article>
  );
}
