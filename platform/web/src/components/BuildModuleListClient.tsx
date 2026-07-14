"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Level, ModuleSummary } from "@/lib/types";
import {
  readBuildFilters,
  readProgress,
  writeBuildFilters,
  type BuildFilters,
} from "@/lib/progress";
import { ResourceBadge } from "@/components/ResourceBadge";

type FeatureSetGroup = {
  id: string;
  title: string;
  module_ids: string[];
};

function ModuleRow({
  m,
  trackId,
  done,
}: {
  m: ModuleSummary;
  trackId: string;
  done: boolean;
}) {
  return (
    <Link href={`/build/${trackId}/${m.id}`} className="module-row">
      <span
        className={`tick${done ? " done" : ""}`}
        aria-label={done ? "Practiced" : "Not practiced"}
      />
      <div>
        <h3>{m.title}</h3>
        <div className="module-meta">
          <span className="badge">{m.level}</span>
          <span className="badge">{m.modality}</span>
          <ResourceBadge
            availability={m.availability}
            offlineOk={m.offline_ok}
          />
          {m.skills.slice(0, 2).map((s) => (
            <span key={s} className="badge">
              {s}
            </span>
          ))}
        </div>
      </div>
      <span className="mins" style={{ color: "var(--text-muted)" }}>
        {m.estimated_minutes ? `${m.estimated_minutes} min` : ""}
      </span>
    </Link>
  );
}

export function BuildModuleListClient({
  trackId,
  initialModules,
  featureSets = [],
}: {
  trackId: string;
  initialModules: ModuleSummary[];
  featureSets?: FeatureSetGroup[];
}) {
  const [filters, setFilters] = useState<BuildFilters>({
    level: "",
    modality: "",
    offline_ok: "",
    sort: "recommended",
  });
  const [completed, setCompleted] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFilters(readBuildFilters());
    setCompleted(readProgress().completed_ids);
    setHydrated(true);
    const onProgress = () => setCompleted(readProgress().completed_ids);
    window.addEventListener("learn-progress", onProgress);
    return () => window.removeEventListener("learn-progress", onProgress);
  }, []);

  const update = (next: BuildFilters) => {
    setFilters(next);
    writeBuildFilters(next);
  };

  const modules = useMemo(() => {
    let list = [...initialModules];
    if (filters.level) list = list.filter((m) => m.level === filters.level);
    if (filters.modality)
      list = list.filter((m) => m.modality === filters.modality);
    if (filters.offline_ok === "true") list = list.filter((m) => m.offline_ok);
    if (filters.offline_ok === "false")
      list = list.filter((m) => !m.offline_ok);
    if (filters.sort === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filters.sort === "duration") {
      list.sort(
        (a, b) => (a.estimated_minutes ?? 0) - (b.estimated_minutes ?? 0),
      );
    }
    return list;
  }, [initialModules, filters]);

  const byId = useMemo(
    () => new Map(modules.map((m) => [m.id, m])),
    [modules],
  );

  const grouped =
    featureSets.length > 0 && filters.sort === "recommended"
      ? featureSets
          .map((fs) => ({
            ...fs,
            modules: fs.module_ids
              .map((id) => byId.get(id))
              .filter(Boolean) as ModuleSummary[],
          }))
          .filter((g) => g.modules.length > 0)
      : null;

  const chips: { key: keyof BuildFilters; label: string }[] = [];
  if (filters.level)
    chips.push({ key: "level", label: `Level: ${filters.level}` });
  if (filters.modality)
    chips.push({ key: "modality", label: `Modality: ${filters.modality}` });
  if (filters.offline_ok === "true")
    chips.push({ key: "offline_ok", label: "Offline only" });
  if (filters.offline_ok === "false")
    chips.push({ key: "offline_ok", label: "Needs network" });
  if (filters.sort !== "recommended")
    chips.push({ key: "sort", label: `Sort: ${filters.sort}` });

  return (
    <div>
      <div className="filter-bar" role="group" aria-label="Filters">
        <label className="field">
          <span>Level</span>
          <select
            className="field-select"
            value={filters.level}
            onChange={(e) =>
              update({ ...filters, level: e.target.value as Level | "" })
            }
            aria-label="Filter by level"
          >
            <option value="">Any</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="production">Production</option>
          </select>
        </label>
        <label className="field">
          <span>Modality</span>
          <select
            className="field-select"
            value={filters.modality}
            onChange={(e) =>
              update({
                ...filters,
                modality: e.target.value as BuildFilters["modality"],
              })
            }
            aria-label="Filter by modality"
          >
            <option value="">Any</option>
            <option value="lab">Lab</option>
            <option value="project">Project</option>
          </select>
        </label>
        <label className="field">
          <span>Offline</span>
          <select
            className="field-select"
            value={filters.offline_ok}
            onChange={(e) =>
              update({
                ...filters,
                offline_ok: e.target.value as BuildFilters["offline_ok"],
              })
            }
            aria-label="Filter by offline availability"
          >
            <option value="">Any</option>
            <option value="true">Offline</option>
            <option value="false">Needs network</option>
          </select>
        </label>
        <label className="field">
          <span>Sort</span>
          <select
            className="field-select"
            value={filters.sort}
            onChange={(e) =>
              update({
                ...filters,
                sort: e.target.value as BuildFilters["sort"],
              })
            }
            aria-label="Sort modules"
          >
            <option value="recommended">Recommended</option>
            <option value="title">A–Z</option>
            <option value="duration">Duration</option>
          </select>
        </label>
      </div>

      {hydrated && chips.length > 0 && (
        <div className="filter-chips" aria-label="Active filters">
          {chips.map((c) => (
            <button
              key={c.key + c.label}
              type="button"
              className="chip"
              onClick={() => {
                if (c.key === "sort")
                  update({ ...filters, sort: "recommended" });
                else if (c.key === "level") update({ ...filters, level: "" });
                else if (c.key === "modality")
                  update({ ...filters, modality: "" });
                else update({ ...filters, offline_ok: "" });
              }}
            >
              {c.label} ×
            </button>
          ))}
        </div>
      )}

      {modules.length === 0 ? (
        <div className="empty-state">
          <p>No labs match these filters.</p>
          <p>Try clearing filters or switching to offline-available labs.</p>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginTop: "1rem" }}
            onClick={() =>
              update({
                level: "",
                modality: "",
                offline_ok: "",
                sort: "recommended",
              })
            }
          >
            Clear filters
          </button>
        </div>
      ) : grouped ? (
        <div className="feature-set-groups">
          {grouped.map((g) => (
            <section key={g.id} style={{ marginBottom: "1.75rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: "1rem",
                  marginBottom: "0.5rem",
                }}
              >
                <h2 style={{ fontSize: "1.1rem", margin: 0 }}>{g.title}</h2>
                <Link href={`/build/${trackId}/sets/${g.id}`}>
                  Feature-set hub →
                </Link>
              </div>
              <ul className="module-list">
                {g.modules.map((m) => (
                  <li key={m.id}>
                    <ModuleRow
                      m={m}
                      trackId={trackId}
                      done={completed.includes(m.id)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <ul className="module-list">
          {modules.map((m) => (
            <li key={m.id}>
              <ModuleRow
                m={m}
                trackId={trackId}
                done={completed.includes(m.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
