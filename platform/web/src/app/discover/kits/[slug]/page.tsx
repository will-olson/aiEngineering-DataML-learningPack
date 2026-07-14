import Link from "next/link";
import { notFound } from "next/navigation";
import {
  featureSetsForApiModule,
  getModule,
  toSummary,
} from "@/lib/catalog";
import { API_KITS } from "@/lib/discover";
import { hrefForFeatureSet, hrefForModule } from "@/lib/routes";

export default async function DiscoverKitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kit = API_KITS[slug];
  if (!kit) notFound();

  const modules = kit.module_ids
    .map((id) => getModule(id))
    .filter(Boolean)
    .map((m) => toSummary(m!));

  const relatedSets = kit.module_ids.flatMap((id) =>
    featureSetsForApiModule(id),
  );
  const uniqueSets = Array.from(
    new Map(relatedSets.map((s) => [s.id, s])).values(),
  );

  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/discover">Discover</Link>
        {" / "}
        <Link href="/discover/apis">APIs</Link>
        {" / "}
        <span>{kit.title}</span>
      </nav>
      <header className="page-header">
        <h1>{kit.title}</h1>
        <p>{kit.blurb}</p>
        <p>
          Docs in-repo: <code>{kit.doc_readme}</code> ·{" "}
          <code>{kit.links_doc}</code>
        </p>
        <p>
          Browse tagged APIs:{" "}
          {kit.tags.map((t, i) => (
            <span key={t}>
              {i > 0 ? " · " : ""}
              <Link href={`/discover/apis?tag=${encodeURIComponent(t)}`}>
                {t}
              </Link>
            </span>
          ))}
        </p>
      </header>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Discover modules</h2>
        <ul className="module-list">
          {modules.map((m) => (
            <li key={m.id}>
              <Link
                href={hrefForModule("discover", m.id)}
                className="module-row"
              >
                <div>
                  <h3>{m.title}</h3>
                  {m.summary && <p className="row-summary">{m.summary}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {uniqueSets.length > 0 && (
        <section>
          <h2>Related feature sets</h2>
          <ul className="module-list">
            {uniqueSets.map((s) => (
              <li key={s.id}>
                <Link
                  href={hrefForFeatureSet("stanford-earth-space", s.id)}
                  className="module-row"
                >
                  <div>
                    <h3>{s.title}</h3>
                    <p className="row-summary">
                      {s.principles.slice(0, 3).join(" · ")}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
