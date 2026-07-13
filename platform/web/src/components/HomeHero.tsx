"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ProductArea } from "@/lib/types";
import { readProgress } from "@/lib/progress";
import { hrefForModule } from "@/lib/routes";

export function HomeHero() {
  const [continueHref, setContinueHref] = useState<string | null>(null);

  useEffect(() => {
    const p = readProgress();
    if (!p.last_module_id) return;

    const area: ProductArea = p.last_product_area ?? "learn";
    const track =
      p.active_track_id ??
      (area === "discover"
        ? "discover-data"
        : area === "build"
          ? "python-practice"
          : "python-ds");
    setContinueHref(hrefForModule(area, p.last_module_id, track));
  }, []);

  return (
    <section className="hero">
      <p className="eyebrow">DataML Learning Pack</p>
      <h1>Learn data and ML with a guided path</h1>
      <p>
        A calm, curated Learn experience over local handbook lessons—filters and
        suggestions instead of raw repository trees.
      </p>
      <div className="hero-actions">
        {continueHref ? (
          <Link className="btn btn-primary" href={continueHref}>
            Continue
          </Link>
        ) : (
          <Link className="btn btn-primary" href="/learn/python-ds">
            Start a path
          </Link>
        )}
        <Link className="btn btn-secondary" href="/build/python-practice">
          Browse practice labs
        </Link>
      </div>
      <div className="path-picker">
        <label htmlFor="path-select">I am new to…</label>
        <select
          id="path-select"
          className="field-select"
          defaultValue="python"
          onChange={(e) => {
            if (e.target.value === "python") {
              window.location.href = "/learn/python-ds";
            }
          }}
          aria-label="Onboarding path picker"
        >
          <option value="python">Python</option>
          <option value="r" disabled>
            R (coming soon)
          </option>
          <option value="de" disabled>
            Data engineering (coming soon)
          </option>
          <option value="ml" disabled>
            Production ML (coming soon)
          </option>
        </select>
      </div>
    </section>
  );
}
