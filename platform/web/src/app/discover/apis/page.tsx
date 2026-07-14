import Link from "next/link";
import { DiscoverListClient } from "@/components/DiscoverListClient";
import { filterModules, toSummary } from "@/lib/catalog";

export default async function DiscoverApisPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const { category: initialCategory = "", tag: initialTag = "" } =
    await searchParams;
  const modules = filterModules({
    product_area: "discover",
    skill: "api",
    track_id: "discover-data",
    sort: "recommended",
  });
  const categories = Array.from(
    new Set(
      modules.flatMap((m) =>
        m.tags.filter(
          (t) =>
            t !== "dataset" &&
            t !== "api" &&
            !t.startsWith("auth-") &&
            t !== "eonet" &&
            t !== "tle" &&
            t !== "launch-library" &&
            t !== "nasa" &&
            t !== "logica" &&
            t !== "logic",
        ),
      ),
    ),
  ).sort();

  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/discover">Discover</Link>
        {" / "}
        <span>APIs</span>
      </nav>
      <header className="page-header">
        <h1>APIs</h1>
        <p>
          Curated public APIs from public-apis—prefer no-auth entries for easy
          demos. Earth–Space kits:{" "}
          <Link href="/discover/kits/nasa">NASA</Link>
          {" · "}
          <Link href="/discover/kits/tle">TLE</Link>
          {" · "}
          <Link href="/discover/kits/launch-library">Launch Library</Link>
          {" · "}
          <Link href="/discover/kits/logica">Logica</Link>
          {" · "}
          <Link href="/discover/apis?tag=eonet">?tag=eonet</Link>
        </p>
      </header>
      <DiscoverListClient
        kind="api"
        initialModules={modules.map((m) => ({
          ...toSummary(m),
          tags: m.tags,
          external_url: m.external_url,
        }))}
        categories={categories}
        initialCategory={initialCategory}
        initialTag={initialTag}
      />
    </>
  );
}
