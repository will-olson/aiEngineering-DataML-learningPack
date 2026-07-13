import Link from "next/link";
import type { SuggestionItem } from "@/lib/types";
import { hrefForSuggestion } from "@/lib/routes";

export type WhatNextLink = {
  href: string;
  title: string;
  reason?: string;
  /** Prose prefix before the link, e.g. "Use in a lab:" */
  prefix?: string;
  /** Button label override when layout is "actions" */
  actionLabel?: string;
};

function suggestionToLink(item: SuggestionItem): WhatNextLink {
  return {
    href: hrefForSuggestion(item),
    title: item.title,
    reason: item.reason,
    actionLabel:
      item.kind === "related_lab"
        ? `Practice: ${item.title}`
        : item.kind === "next_lesson"
          ? `Lesson: ${item.title}`
          : `Related: ${item.title}`,
    prefix:
      item.kind === "related_lab"
        ? "Use in a lab:"
        : item.kind === "next_lesson"
          ? "Related lesson:"
          : item.kind === "matching_dataset" || item.kind === "matching_api"
            ? "Looking for data? Try"
            : "Related:",
  };
}

export function WhatNextPanel({
  primary,
  secondary,
  tertiary,
  crossSuggestion,
  emptyMessage,
  browseFallback,
  layout = "prose",
}: {
  primary?: WhatNextLink | null;
  secondary?: WhatNextLink | null;
  tertiary?: WhatNextLink | null;
  /** Convenience: maps a SuggestionItem into secondary prose/action link */
  crossSuggestion?: SuggestionItem | null;
  emptyMessage?: string;
  /** When no primary next, optional browse link used with emptyMessage */
  browseFallback?: { href: string; label: string } | null;
  layout?: "actions" | "prose";
}) {
  const cross = crossSuggestion ? suggestionToLink(crossSuggestion) : null;
  const second = secondary ?? cross;
  const hasContent =
    primary || second || tertiary || emptyMessage || browseFallback;
  if (!hasContent) return null;

  if (layout === "actions") {
    return (
      <section className="what-next" aria-label="What next">
        <h2>What next</h2>
        <div className="what-next-actions">
          {primary ? (
            <Link className="btn btn-primary" href={primary.href}>
              {primary.actionLabel ?? primary.title}
            </Link>
          ) : emptyMessage ? (
            <p style={{ color: "var(--text-muted)" }}>{emptyMessage}</p>
          ) : null}
          {second && (
            <Link className="btn btn-secondary" href={second.href}>
              {second.actionLabel ?? second.title}
            </Link>
          )}
        </div>
        {second?.reason && (
          <p className="what-next-reason">{second.reason}</p>
        )}
      </section>
    );
  }

  return (
    <aside className="what-next" aria-label="What next">
      <h2>What next</h2>
      {primary && (
        <p>
          {primary.prefix ? `${primary.prefix} ` : null}
          <Link href={primary.href}>{primary.title}</Link>
          {primary.reason ? (
            <span style={{ color: "var(--text-muted)" }}>
              {" "}
              — {primary.reason}
            </span>
          ) : (
            "."
          )}
        </p>
      )}
      {!primary && browseFallback && (
        <p>
          Browse more practice in{" "}
          <Link href={browseFallback.href}>{browseFallback.label}</Link>.
        </p>
      )}
      {!primary && !browseFallback && emptyMessage && (
        <p style={{ color: "var(--text-muted)" }}>{emptyMessage}</p>
      )}
      {second && (
        <p
          style={{
            marginTop: primary || browseFallback || emptyMessage ? "0.5rem" : 0,
          }}
        >
          {second.prefix ? `${second.prefix} ` : null}
          <Link href={second.href}>{second.title}</Link>
          {second.reason ? (
            <span style={{ color: "var(--text-muted)" }}>
              {" "}
              — {second.reason}
            </span>
          ) : (
            "."
          )}
        </p>
      )}
      {tertiary && (
        <p style={{ marginTop: "0.5rem" }}>
          {tertiary.prefix ? `${tertiary.prefix} ` : null}
          <Link href={tertiary.href}>{tertiary.title}</Link>
          .
        </p>
      )}
    </aside>
  );
}
