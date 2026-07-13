import { notFound } from "next/navigation";
import { ModuleListClient } from "@/components/ModuleListClient";
import { SuggestionRail } from "@/components/SuggestionRail";
import { getTrack, loadModules, toSummary } from "@/lib/catalog";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ trackId: string }>;
}) {
  const { trackId } = await params;
  const track = getTrack(trackId);
  if (!track) notFound();

  const byId = new Map(loadModules().map((m) => [m.id, m]));
  const modules = track.module_ids
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((m) => toSummary(m!));

  return (
    <>
      <header className="page-header">
        <h1>{track.title}</h1>
        <p>{track.description}</p>
      </header>
      <SuggestionRail trackId={trackId} />
      <ModuleListClient trackId={trackId} initialModules={modules} />
    </>
  );
}
