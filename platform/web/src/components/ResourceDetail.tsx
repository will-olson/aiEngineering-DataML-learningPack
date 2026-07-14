"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CatalogModule, ResolvePayload, SuggestionItem } from "@/lib/types";
import {
  API_KITS,
  CATEGORY_LABELS,
  categoryFromTags,
  discoverListHref,
} from "@/lib/discover";
import { bookmarkDiscover, readProgress } from "@/lib/progress";
import {
  hrefForApiKit,
  hrefForFeatureSet,
  hrefForModule,
  hrefForSuggestion,
} from "@/lib/routes";
import { ResourceBadge } from "./ResourceBadge";
import { WhatNextPanel } from "./WhatNextPanel";

export function ResourceDetail({
  module,
  featureSetLinks = [],
}: {
  module: CatalogModule;
  featureSetLinks?: { id: string; title: string }[];
}) {
  const [resolved, setResolved] = useState<ResolvePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [labLink, setLabLink] = useState<SuggestionItem | null>(null);
  const [nextDiscover, setNextDiscover] = useState<{
    id: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    bookmarkDiscover(module.id);
  }, [module.id]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/v1/resolve/${module.id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Could not resolve this resource");
        return r.json();
      })
      .then((data: ResolvePayload) => {
        if (!cancelled) setResolved(data);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [module.id]);

  useEffect(() => {
    let cancelled = false;
    const p = readProgress();
    const params = new URLSearchParams({
      last_module_id: module.id,
      active_track_id: "discover-data",
      product_area: "discover",
      limit: "3",
    });
    if (p.completed_ids.length) {
      params.set("completed_ids", p.completed_ids.join(","));
    }
    fetch(`/api/v1/suggestions?${params}`)
      .then((r) => r.json())
      .then((data: { items?: SuggestionItem[] }) => {
        if (cancelled) return;
        const lab = (data.items ?? []).find((i) => i.kind === "related_lab");
        setLabLink(lab ?? null);
      })
      .catch(() => {
        if (!cancelled) setLabLink(null);
      });

    const nextId = module.next_ids[0];
    if (nextId) {
      fetch(`/api/v1/modules/${nextId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { module?: CatalogModule } | CatalogModule | null) => {
          if (cancelled || !data) return;
          const m =
            "module" in data && data.module
              ? data.module
              : (data as CatalogModule);
          if (m?.id && m.title) {
            setNextDiscover({ id: m.id, title: m.title });
          }
        })
        .catch(() => {
          if (!cancelled) setNextDiscover(null);
        });
    } else {
      setNextDiscover(null);
    }

    return () => {
      cancelled = true;
    };
  }, [module.id, module.next_ids]);

  const cat = categoryFromTags(module.tags);
  const openKind = resolved?.open_kind;
  const external = resolved?.external_url ?? module.external_url;
  const localPath =
    resolved?.local_path ??
    (module.availability === "local" ? module.source_path : null);
  const browseKind: "dataset" | "api" = module.skills.includes("dataset")
    ? "dataset"
    : "api";
  const similarHref = discoverListHref(browseKind, cat);

  const kitSlug = Object.entries(API_KITS).find(([, kit]) =>
    kit.module_ids.includes(module.id),
  )?.[0];

  return (
    <article className="resource-detail">
      <div className="lesson-header">
        <div className="module-meta">
          <ResourceBadge
            availability={module.availability}
            offlineOk={module.offline_ok}
          />
          {cat && (
            <span className="badge">{CATEGORY_LABELS[cat] ?? cat}</span>
          )}
          <span className="badge">{module.level}</span>
        </div>
        <h1>{module.title}</h1>
        {module.summary && <p className="resource-summary">{module.summary}</p>}
      </div>

      <div className="lesson-actions">
        {openKind === "external" && external ? (
          <a
            className="btn btn-primary"
            href={external}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open resource
          </a>
        ) : openKind === "local" && localPath ? (
          <span className="btn btn-primary" aria-disabled="true">
            Local sample ready
          </span>
        ) : error ? (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        ) : (
          <span className="btn btn-secondary" aria-busy="true">
            Resolving…
          </span>
        )}
      </div>

      {error && (
        <p className="resolve-error" role="alert">
          {error}.{" "}
          <Link href={similarHref}>Find similar</Link> in the same category, or
          retry.
        </p>
      )}

      {openKind === "local" && localPath && (
        <section className="local-sample-panel">
          <h2>View local sample</h2>
          <p>
            This dataset is vendored in the learning pack for offline use. Open
            it from your checkout (path shown for developers; learners use the
            catalog title above).
          </p>
          <p className="local-path-hint">
            <code>{localPath}</code>
          </p>
          {resolved && !resolved.local_exists && (
            <p className="resolve-error" role="status">
              File not found in this checkout—re-vendor the fork or pick another
              resource.
            </p>
          )}
        </section>
      )}

      <dl className="resource-meta-grid">
        <div>
          <dt>Skills</dt>
          <dd>{module.skills.join(", ")}</dd>
        </div>
        <div>
          <dt>Attribution</dt>
          <dd>
            {resolved?.attribution ?? module.license_note ?? "See fork LICENSE"}
          </dd>
        </div>
        <div>
          <dt>Source index</dt>
          <dd>{module.source_fork}</dd>
        </div>
      </dl>

      {(featureSetLinks.length > 0 || kitSlug) && (
        <section style={{ marginBottom: "1.25rem" }}>
          <h2>Earth–Space links</h2>
          <ul>
            {featureSetLinks.map((s) => (
              <li key={s.id}>
                <Link href={hrefForFeatureSet("stanford-earth-space", s.id)}>
                  Use in feature set: {s.title}
                </Link>
              </li>
            ))}
            {kitSlug && (
              <li>
                <Link href={hrefForApiKit(kitSlug)}>
                  API kit: {API_KITS[kitSlug]?.title ?? kitSlug}
                </Link>
              </li>
            )}
          </ul>
        </section>
      )}

      {(labLink || nextDiscover) && (
        <WhatNextPanel
          layout="prose"
          primary={
            labLink
              ? {
                  href: hrefForSuggestion(labLink),
                  title: labLink.title,
                  reason: labLink.reason,
                  prefix: "Use in a lab:",
                }
              : null
          }
          tertiary={
            nextDiscover
              ? {
                  href: hrefForModule("discover", nextDiscover.id),
                  title: nextDiscover.title,
                  prefix: "Continue exploring",
                }
              : null
          }
        />
      )}
    </article>
  );
}
