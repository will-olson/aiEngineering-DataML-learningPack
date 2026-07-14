"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CatalogModule, LaunchHints, SuggestionItem } from "@/lib/types";
import { LabLauncher } from "@/components/LabLauncher";
import { WhatNextPanel } from "@/components/WhatNextPanel";
import { ResourceBadge } from "@/components/ResourceBadge";
import { markComplete, readProgress } from "@/lib/progress";
import { hrefForApiKit, hrefForFeatureSet, hrefForModule } from "@/lib/routes";

export function BuildLabView({
  trackId,
  trackTitle,
  module,
  launch,
  nextModule,
  localExists,
  featureSet,
  relatedApis = [],
  kitSlug,
}: {
  trackId: string;
  trackTitle: string;
  module: CatalogModule;
  launch: LaunchHints;
  nextModule: { id: string; title: string } | null;
  localExists: boolean;
  featureSet?: { id: string; title: string } | null;
  relatedApis?: { id: string; title: string }[];
  kitSlug?: string | null;
}) {
  const [done, setDone] = useState(false);
  const [showLauncher, setShowLauncher] = useState(true);
  const [crossLink, setCrossLink] = useState<SuggestionItem | null>(null);

  useEffect(() => {
    setDone(readProgress().completed_ids.includes(module.id));
  }, [module.id]);

  useEffect(() => {
    let cancelled = false;
    const p = readProgress();
    // No product_area lock so Learn next_lesson + Discover matches can surface
    const params = new URLSearchParams({
      last_module_id: module.id,
      active_track_id: trackId,
      limit: "3",
    });
    if (p.completed_ids.length) {
      params.set("completed_ids", p.completed_ids.join(","));
    }
    fetch(`/api/v1/suggestions?${params}`)
      .then((r) => r.json())
      .then((data: { items?: SuggestionItem[] }) => {
        if (cancelled) return;
        const items = data.items ?? [];
        const match =
          items.find((i) => i.kind === "next_lesson") ??
          items.find(
            (i) =>
              i.kind === "matching_dataset" || i.kind === "matching_api",
          );
        setCrossLink(match ?? null);
      })
      .catch(() => {
        if (!cancelled) setCrossLink(null);
      });
    return () => {
      cancelled = true;
    };
  }, [module.id, trackId]);

  const onPracticed = () => {
    markComplete(module.id, trackId, "build");
    setDone(true);
  };

  const showWhatNext = Boolean(nextModule) || done;

  return (
    <article>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/build">Build</Link>
        {" / "}
        <Link href={`/build/${trackId}`}>{trackTitle}</Link>
        {" / "}
        <span>{module.title}</span>
      </nav>

      <header className="lesson-header">
        <div className="module-meta">
          <span className="badge">{module.level}</span>
          <ResourceBadge
            availability={module.availability}
            offlineOk={module.offline_ok}
          />
          <span className="badge">{module.modality}</span>
        </div>
        <h1>{module.title}</h1>
        {module.summary && (
          <p style={{ color: "var(--text-muted)" }}>{module.summary}</p>
        )}
        <div className="hero-actions" style={{ marginTop: "1rem" }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowLauncher((v) => !v)}
            aria-expanded={showLauncher}
          >
            {showLauncher ? "Hide lab" : "Open lab"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onPracticed}
            disabled={done}
          >
            {done ? "Practiced" : "Mark practiced"}
          </button>
        </div>
      </header>

      {showLauncher && (
        <LabLauncher
          title={module.title}
          launch={launch}
          offlineOk={module.offline_ok}
          availability={module.availability}
          localExists={localExists}
        />
      )}

      {(featureSet || relatedApis.length > 0 || kitSlug) && (
        <section style={{ marginBottom: "1.25rem" }}>
          <h2>Related Discover / kits</h2>
          <ul>
            {featureSet && (
              <li>
                <Link href={hrefForFeatureSet(trackId, featureSet.id)}>
                  Feature set: {featureSet.title}
                </Link>
              </li>
            )}
            {relatedApis.map((a) => (
              <li key={a.id}>
                <Link href={hrefForModule("discover", a.id)}>{a.title}</Link>
              </li>
            ))}
            {kitSlug && (
              <li>
                <Link href={hrefForApiKit(kitSlug)}>API kit ({kitSlug})</Link>
              </li>
            )}
          </ul>
        </section>
      )}

      {showWhatNext && (
        <WhatNextPanel
          layout="prose"
          primary={
            nextModule
              ? {
                  href: `/build/${trackId}/${nextModule.id}`,
                  title: nextModule.title,
                  prefix: "Continue with",
                }
              : null
          }
          browseFallback={
            nextModule
              ? null
              : { href: `/build/${trackId}`, label: trackTitle }
          }
          crossSuggestion={done ? crossLink : null}
        />
      )}
    </article>
  );
}
