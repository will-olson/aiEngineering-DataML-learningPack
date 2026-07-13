"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Level, ModuleSummary } from "@/lib/types";
import {
  readAreaFilters,
  readProgress,
  writeAreaFilters,
  type LearnFilters,
} from "@/lib/progress";

export function ModuleListClient({
  trackId,
  initialModules,
}: {
  trackId: string;
  initialModules: ModuleSummary[];
}) {
  const [filters, setFilters] = useState<LearnFilters>({
    level: "",
    offline_ok: "",
    sort: "recommended",
  });
  const [completed, setCompleted] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFilters(readAreaFilters("learn"));
    setCompleted(readProgress().completed_ids);
    setHydrated(true);
    const onProgress = () => setCompleted(readProgress().completed_ids);
    window.addEventListener("learn-progress", onProgress);
    return () => window.removeEventListener("learn-progress", onProgress);
  }, []);

  const update = (next: LearnFilters) => {
    setFilters(next);
    writeAreaFilters("learn", next);
  };

  const modules = useMemo(() => {
    let list = [...initialModules];
    if (filters.level) list = list.filter((m) => m.level === filters.level);
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

  const chips: { key: keyof LearnFilters; label: string }[] = [];
  if (filters.level)
    chips.push({ key: "level", label: `Level: ${filters.level}` });
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
          <span>Availability</span>
          <select
            className="field-select"
            value={filters.offline_ok}
            onChange={(e) =>
              update({
                ...filters,
                offline_ok: e.target.value as LearnFilters["offline_ok"],
              })
            }
            aria-label="Filter by availability"
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
                sort: e.target.value as LearnFilters["sort"],
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
          <p>No modules match these filters.</p>
          <p>Try lowering the level filter or clearing chips.</p>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginTop: "1rem" }}
            onClick={() =>
              update({ level: "", offline_ok: "", sort: "recommended" })
            }
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="module-list">
          {modules.map((m) => {
            const done = completed.includes(m.id);
            return (
              <li key={m.id}>
                <Link
                  href={`/learn/${trackId}/${m.id}`}
                  className="module-row"
                >
                  <span
                    className={`tick${done ? " done" : ""}`}
                    aria-label={done ? "Completed" : "Not completed"}
                  />
                  <div>
                    <h3>{m.title}</h3>
                    <div className="module-meta">
                      <span className="badge">{m.level}</span>
                      {m.offline_ok ? (
                        <span className="badge">Offline</span>
                      ) : (
                        <span className="badge">Needs network</span>
                      )}
                      {m.skills.slice(0, 2).map((s) => (
                        <span key={s} className="badge">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="mins" style={{ color: "var(--text-muted)" }}>
                    {m.estimated_minutes
                      ? `${m.estimated_minutes} min`
                      : ""}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
