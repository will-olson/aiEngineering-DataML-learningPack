import { NextResponse } from "next/server";
import { getTrack, loadModules, toSummary } from "@/lib/catalog";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const track = getTrack(id);
  if (!track) {
    return NextResponse.json({ error: "Track not found" }, { status: 404 });
  }
  const byId = new Map(loadModules().map((m) => [m.id, m]));
  const modules = track.module_ids
    .map((mid) => byId.get(mid))
    .filter(Boolean)
    .map((m) => toSummary(m!));
  return NextResponse.json({ track, modules });
}
