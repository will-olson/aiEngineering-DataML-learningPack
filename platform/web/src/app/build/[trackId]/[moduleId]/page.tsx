import { existsSync } from "fs";
import { notFound } from "next/navigation";
import { BuildLabView } from "@/components/BuildLabView";
import {
  buildLaunchHints,
  featureSetForModule,
  getModule,
  getTrack,
  loadModules,
  resolveRepoPath,
} from "@/lib/catalog";
import { API_KITS } from "@/lib/discover";

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

  const featureSet = featureSetForModule(moduleId);
  const relatedApis = (featureSet?.api_module_ids ?? [])
    .map((id) => getModule(id))
    .filter(Boolean)
    .map((m) => ({ id: m!.id, title: m!.title }));

  const kitSlug =
    Object.entries(API_KITS).find(([, kit]) =>
      kit.module_ids.some((id) =>
        (featureSet?.api_module_ids ?? []).includes(id),
      ),
    )?.[0] ?? null;

  return (
    <BuildLabView
      trackId={trackId}
      trackTitle={track.title}
      module={mod}
      launch={launch}
      nextModule={next ? { id: next.id, title: next.title } : null}
      localExists={localExists}
      featureSet={featureSet ? { id: featureSet.id, title: featureSet.title } : null}
      relatedApis={relatedApis}
      kitSlug={kitSlug}
    />
  );
}
