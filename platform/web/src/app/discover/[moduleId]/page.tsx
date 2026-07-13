import Link from "next/link";
import { notFound } from "next/navigation";
import { ResourceDetail } from "@/components/ResourceDetail";
import { getModule } from "@/lib/catalog";

export default async function DiscoverResourcePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const catalogModule = getModule(moduleId);
  if (!catalogModule || catalogModule.product_area !== "discover") {
    notFound();
  }

  const isApi = catalogModule.skills.includes("api");
  const listHref = isApi ? "/discover/apis" : "/discover/datasets";
  const listLabel = isApi ? "APIs" : "Datasets";

  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/discover">Discover</Link>
        {" / "}
        <Link href={listHref}>{listLabel}</Link>
        {" / "}
        <span>{catalogModule.title}</span>
      </nav>
      <ResourceDetail module={catalogModule} />
    </>
  );
}