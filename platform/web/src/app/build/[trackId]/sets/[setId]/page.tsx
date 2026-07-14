import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getFeatureSet,
  getModule,
  getTrack,
  loadModules,
  toSummary,
} from "@/lib/catalog";
import { API_KITS } from "@/lib/discover";
import { hrefForApiKit, hrefForModule } from "@/lib/routes";

export default async function FeatureSetHubPage({
  params,
}: {
  params: Promise<{ trackId: string; setId: string }>;
}) {
  const { trackId, setId } = await params;
  const track = getTrack(trackId);
  if (!track || track.product_area !== "build") notFound();

  const set = getFeatureSet(setId);
  if (!set) notFound();

  const byId = new Map(loadModules().map((m) => [m.id, m]));
  const steps = set.module_ids
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((m) => toSummary(m!));

  const apis = set.api_module_ids
    .map((id) => getModule(id))
    .filter(Boolean);

  const kitSlugs = Object.entries(API_KITS)
    .filter(([, kit]) =>
      kit.module_ids.some((id) => set.api_module_ids.includes(id)),
    )
    .map(([slug]) => slug);

  return (
    <>
      <header className="page-header">
        <p className="eyebrow">
          <Link href={`/build/${trackId}`}>{track.title}</Link>
          {" · "}
          Feature set
        </p>
        <h1>{set.title}</h1>
        <p>
          Principles: {set.principles.join(" · ")}. Courses:{" "}
          {set.course_ids.join(", ")}.
        </p>
      </header>

      {apis.length > 0 && (
        <section className="card-block" style={{ marginBottom: "1.5rem" }}>
          <h2>Discover APIs</h2>
          <ul className="module-list">
            {apis.map((m) => (
              <li key={m!.id}>
                <Link
                  href={hrefForModule("discover", m!.id)}
                  className="module-row"
                >
                  <div>
                    <h3>{m!.title}</h3>
                    <p className="module-meta">{m!.summary}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {kitSlugs.length > 0 && (
            <p style={{ marginTop: "0.75rem" }}>
              Kits:{" "}
              {kitSlugs.map((slug, i) => (
                <span key={slug}>
                  {i > 0 ? " · " : ""}
                  <Link href={hrefForApiKit(slug)}>
                    {API_KITS[slug]?.title ?? slug}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </section>
      )}

      <section>
        <h2>Lab steps</h2>
        <ol className="module-list">
          {steps.map((m, i) => (
            <li key={m.id}>
              <Link
                href={`/build/${trackId}/${m.id}`}
                className="module-row"
              >
                <span className="mins" aria-hidden>
                  {i + 1}
                </span>
                <div>
                  <h3>{m.title}</h3>
                  <div className="module-meta">
                    <span className="badge">{m.level}</span>
                    {m.estimated_minutes ? (
                      <span className="badge">{m.estimated_minutes} min</span>
                    ) : null}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
