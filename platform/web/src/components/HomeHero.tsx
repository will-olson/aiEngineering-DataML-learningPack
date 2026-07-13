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
          : area === "ask"
            ? "stanford-cs229"
            : "python-ds");
    setContinueHref(hrefForModule(area, p.last_module_id, track));
  }, []);

  return (
    <section className="hero">
      <p className="eyebrow">DataML Learning Pack</p>
      <h1>Ask lectures. Learn deeply. Build next.</h1>
      <p>
        Conversational search over open Stanford transcripts, plus guided Learn,
        Build, and Discover paths—without raw repository trees.
      </p>
      <div className="hero-actions">
        <Link className="btn btn-primary" href="/ask">
          Ask a question
        </Link>
        {continueHref ? (
          <Link className="btn btn-secondary" href={continueHref}>
            Continue
          </Link>
        ) : (
          <Link className="btn btn-secondary" href="/learn/python-ds">
            Start a path
          </Link>
        )}
      </div>
      <div className="path-picker">
        <label htmlFor="path-select">I am new to…</label>
        <select
          id="path-select"
          className="field-select"
          defaultValue=""
          onChange={(e) => {
            const v = e.target.value;
            if (v === "python") window.location.href = "/learn/python-ds";
            if (v === "ml") window.location.href = "/learn/stanford-cs229";
            if (v === "ask") window.location.href = "/ask";
          }}
          aria-label="Onboarding path picker"
        >
          <option value="" disabled>
            Choose a starting point
          </option>
          <option value="ask">Asking lecture questions</option>
          <option value="python">Python data science</option>
          <option value="ml">Machine learning (CS229)</option>
          <option value="r" disabled>
            R (coming soon)
          </option>
          <option value="de" disabled>
            Data engineering (coming soon)
          </option>
        </select>
      </div>
    </section>
  );
}
