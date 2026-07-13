import Link from "next/link";
import { DiscoverListClient } from "@/components/DiscoverListClient";
import { filterModules, toSummary } from "@/lib/catalog";

export default async function DiscoverDatasetsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: initialCategory = "" } = await searchParams;
  const modules = filterModules({
    product_area: "discover",
    skill: "dataset",
    track_id: "discover-data",
    sort: "recommended",
  });
  const categories = Array.from(
    new Set(
      modules.flatMap((m) =>
        m.tags.filter(
          (t) => t !== "dataset" && t !== "api" && !t.startsWith("auth-"),
        ),
      ),
    ),
  ).sort();

  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/discover">Discover</Link>
        {" / "}
        <span>Datasets</span>
      </nav>
      <header className="page-header">
        <h1>Datasets</h1>
        <p>
          Curated public datasets from Awesome Public Datasets—plus one local
          sample.
        </p>
      </header>
      <DiscoverListClient
        kind="dataset"
        initialModules={modules.map((m) => ({
          ...toSummary(m),
          tags: m.tags,
          external_url: m.external_url,
        }))}
        categories={categories}
        initialCategory={initialCategory}
      />
    </>
  );
}