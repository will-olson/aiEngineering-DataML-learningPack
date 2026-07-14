import { notFound } from "next/navigation";
import { BuildModuleListClient } from "@/components/BuildModuleListClient";
import { SuggestionRail } from "@/components/SuggestionRail";
import {
  getTrack,
  loadFeatureSets,
  loadModules,
  toSummary,
} from "@/lib/catalog";

export default async function BuildTrackPage({
  params,
}: {
  params: Promise<{ trackId: string }>;
}) {
  const { trackId } = await params;
  const track = getTrack(trackId);
  if (!track || track.product_area !== "build") notFound();

  const byId = new Map(loadModules().map((m) => [m.id, m]));
  const modules = track.module_ids
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((m) => toSummary(m!));

  const featureSets =
    trackId === "stanford-earth-space"
      ? loadFeatureSets().map((s) => ({
          id: s.id,
          title: s.title,
          module_ids: s.module_ids,
        }))
      : [];

  return (
    <>
      <header className="page-header">
        <h1>{track.title}</h1>
        <p>{track.description}</p>
      </header>
      <SuggestionRail trackId={trackId} productArea="build" />
      <BuildModuleListClient
        trackId={trackId}
        initialModules={modules}
        featureSets={featureSets}
      />
    </>
  );
}
