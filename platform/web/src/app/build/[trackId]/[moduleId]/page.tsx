import { existsSync } from "fs";
import { notFound } from "next/navigation";
import { BuildLabView } from "@/components/BuildLabView";
import {
  buildLaunchHints,
  getModule,
  getTrack,
  loadModules,
  resolveRepoPath,
} from "@/lib/catalog";

export default async function BuildModulePage({
  params,
}: {
  params: Promise<{ trackId: string; moduleId: string }>;
}) {
  const { trackId, moduleId } = await params;
  const track = getTrack(trackId);
  if (!track || track.product_area !== "build") notFound();

  const mod = getModule(moduleId);
  if (!mod || mod.product_area !== "build") notFound();
  if (!mod.track_ids.includes(trackId)) notFound();

  const launch = buildLaunchHints(mod);
  if (!launch) notFound();

  let localExists = false;
  try {
    localExists = existsSync(resolveRepoPath(mod.source_path));
  } catch {
    localExists = false;
  }

  const byId = new Map(loadModules().map((m) => [m.id, m]));
  const nextId = mod.next_ids[0];
  const next = nextId ? byId.get(nextId) : undefined;

  return (
    <BuildLabView
      trackId={trackId}
      trackTitle={track.title}
      module={mod}
      launch={launch}
      nextModule={next ? { id: next.id, title: next.title } : null}
      localExists={localExists}
    />
  );
}
