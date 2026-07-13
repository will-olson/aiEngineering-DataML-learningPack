import { NextResponse } from "next/server";
import { buildLaunchHints, getModule, resolveRepoPath } from "@/lib/catalog";
import { existsSync } from "fs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const catalogModule = getModule(id);
  if (!catalogModule) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }

  const isLocal = catalogModule.availability === "local";
  const localRelative = isLocal ? catalogModule.source_path : null;
  let local_exists = false;
  if (localRelative) {
    try {
      local_exists = existsSync(resolveRepoPath(localRelative));
    } catch {
      local_exists = false;
    }
  } else if (catalogModule.source_path) {
    try {
      local_exists = existsSync(resolveRepoPath(catalogModule.source_path));
    } catch {
      local_exists = false;
    }
  }

  const launch = buildLaunchHints(catalogModule);

  return NextResponse.json({
    module_id: catalogModule.id,
    title: catalogModule.title,
    source_fork: catalogModule.source_fork,
    source_path: catalogModule.source_path,
    local_path: isLocal ? catalogModule.source_path : null,
    external_url: catalogModule.external_url,
    offline_ok: catalogModule.offline_ok,
    availability: catalogModule.availability,
    attribution: catalogModule.license_note,
    license_note: catalogModule.license_note,
    skills: catalogModule.skills,
    tags: catalogModule.tags,
    product_area: catalogModule.product_area,
    local_exists,
    open_kind: catalogModule.external_url
      ? "external"
      : isLocal
        ? "local"
        : "unavailable",
    launch,
  });
}
