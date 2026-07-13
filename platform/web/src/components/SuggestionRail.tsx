"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ProductArea, SuggestionItem } from "@/lib/types";
import { readProgress } from "@/lib/progress";
import { hrefForSuggestion, trackForProductArea } from "@/lib/routes";

export function SuggestionRail({
  trackId,
  productArea = "learn",
}: {
  trackId?: string;
  productArea?: ProductArea;
}) {
  const [items, setItems] = useState<SuggestionItem[]>([]);
  const areaTrack = trackId ?? trackForProductArea(productArea);

  useEffect(() => {
    const load = () => {
      const p = readProgress();
      const params = new URLSearchParams({
        product_area: productArea,
        // Always use the rail's product-area track — do not leak Learn progress track into Discover/Build
        active_track_id: areaTrack,
        limit: "3",
      });
      if (p.last_module_id) params.set("last_module_id", p.last_module_id);
      if (p.completed_ids.length) {
        params.set("completed_ids", p.completed_ids.join(","));
      }
      if (p.selected_level) params.set("selected_level", p.selected_level);
      if (p.offline_preference) params.set("offline_preference", "true");
      fetch(`/api/v1/suggestions?${params}`)
        .then((r) => r.json())
        .then((data) => setItems(data.items ?? []))
        .catch(() => setItems([]));
    };
    load();
    window.addEventListener("learn-progress", load);
    return () => window.removeEventListener("learn-progress", load);
  }, [areaTrack, productArea]);

  if (!items.length) return null;

  return (
    <section className="suggestion-rail" aria-label="Suggested for you">
      <h2>Suggested for you</h2>
      <ul className="suggestion-list">
        {items.map((item) => (
          <li key={item.module_id}>
            <Link href={hrefForSuggestion(item)}>
              <strong>{item.title}</strong>
              <span>{item.reason}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
