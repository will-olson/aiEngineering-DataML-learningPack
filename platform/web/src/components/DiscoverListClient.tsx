"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ModuleSummary } from "@/lib/types";
import {
  readDiscoverKindFilters,
  writeDiscoverKindFilters,
  type DiscoverFilters,
} from "@/lib/progress";
import { CATEGORY_LABELS, categoryFromTags } from "@/lib/discover";
import { ResourceBadge } from "./ResourceBadge";

export function DiscoverListClient({
  kind,
  initialModules,
  categories,
  initialCategory = "",
}: {
  kind: "dataset" | "api";
  initialModules: ModuleSummary[];
  categories: string[];
  initialCategory?: string;
}) {
  const [filters, setFilters] = useState<DiscoverFilters>({
    category: "",
    availability: "",
    sort: "recommended",
    q: "",
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readDiscoverKindFilters(kind);
    const next =
      initialCategory && categories.includes(initialCategory)
        ? { ...stored, category: initialCategory }
        : stored;
    setFilters(next);
    if (initialCategory && categories.includes(initialCategory)) {
      writeDiscoverKindFilters(kind, next);
    }
    setHydrated(true);
  }, [kind, initialCategory, categories]);

  const update = (next: DiscoverFilters) => {
    setFilters(next);
    writeDiscoverKindFilters(kind, next);
  };

  const modules = useMemo(() => {
    let list = [...initialModules];
    if (filters.category) {
      list = list.filter((m) => m.tags?.includes(filters.category));
    }
    if (filters.availability) {
      list = list.filter((m) => m.availability === filters.availability);
    }
    if (filters.q.trim()) {
      const q = filters.q.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.summary ?? "").toLowerCase().includes(q) ||
          m.skills.some((s) => s.includes(q)),
      );
    }
    if (filters.sort === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [initialModules, filters]);

  const chips: { key: keyof DiscoverFilters; label: string }[] = [];
  if (filters.category) {
    chips.push({
      key: "category",
      label: `Category: ${CATEGORY_LABELS[filters.category] ?? filters.category}`,
    });
  }
  if (filters.availability === "local")
    chips.push({ key: "availability", label: "Offline only" });
  if (filters.availability === "link_only")
    chips.push({ key: "availability", label: "Needs network" });
  if (filters.sort !== "recommended")
    chips.push({ key: "sort", label: `Sort: ${filters.sort}` });
  if (filters.q.trim())
    chips.push({ key: "q", label: `Search: ${filters.q}` });

  const clearChip = (key: keyof DiscoverFilters) => {
    const next = { ...filters };
    if (key === "sort") next.sort = "recommended";
    else if (key === "category" || key === "q") next[key] = "";
    else next.availability = "";
    update(next);
  };

  return (
    <div>
      <div className="filter-bar" role="group" aria-label="Discover filters">
        <label className="field">
          <span>Category</span>
          <select
            className="field-select"
            value={filters.category}
            onChange={(e) => update({ ...filters, category: e.target.value })}
            aria-label="Filter by category"
          >
            <option value="">Any</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c] ?? c}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Availability</span>
          <select
            className="field-select"
            value={filters.availability}
            onChange={(e) =>
              update({
                ...filters,
                availability: e.target.value as DiscoverFilters["availability"],
              })
            }
            aria-label="Filter by availability"
          >
            <option value="">Any</option>
            <option value="local">Offline</option>
            <option value="link_only">Needs network</option>
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
                sort: e.target.value as DiscoverFilters["sort"],
              })
            }
            aria-label="Sort resources"
          >
            <option value="recommended">Recommended</option>
            <option value="title">A–Z</option>
          </select>
        </label>
        <label className="field field-grow">
          <span>Search</span>
          <input
            className="field-select"
            type="search"
            value={filters.q}
            onChange={(e) => update({ ...filters, q: e.target.value })}
            placeholder={`Search ${kind === "api" ? "APIs" : "datasets"}…`}
            aria-label="Search resources"
          />
        </label>
      </div>

      {hydrated && chips.length > 0 && (
        <div className="filter-chips" aria-label="Active filters">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              className="chip"
              onClick={() => clearChip(c.key)}
            >
              {c.label}
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}

      {modules.length === 0 ? (
        <div className="empty-state">
          <p>No resources match these filters.</p>
          <p>
            {filters.availability === "local"
              ? "Try clearing the offline filter—most catalog entries need network."
              : "Clear filters to see recommended picks."}
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              update({
                category: "",
                availability: "",
                sort: "recommended",
                q: "",
              })
            }
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="module-list">
          {modules.map((m) => {
            const cat = categoryFromTags(m.tags);
            return (
              <li key={m.id}>
                <Link href={`/discover/${m.id}`} className="module-row discover-row">
                  <div>
                    <h3>{m.title}</h3>
                    {m.summary && (
                      <p className="row-summary">{m.summary}</p>
                    )}
                    <div className="module-meta">
                      <ResourceBadge
                        availability={m.availability}
                        offlineOk={m.offline_ok}
                      />
                      {cat && (
                        <span className="badge">
                          {CATEGORY_LABELS[cat] ?? cat}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}