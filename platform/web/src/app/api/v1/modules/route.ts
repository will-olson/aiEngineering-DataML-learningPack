import { NextRequest, NextResponse } from "next/server";
import { filterModules, toSummary } from "@/lib/catalog";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const skills = sp.getAll("skill");
  const tags = sp.getAll("tag");
  const list = filterModules({
    product_area: sp.get("product_area") ?? undefined,
    level: sp.get("level") ?? undefined,
    offline_ok: sp.get("offline_ok") ?? undefined,
    skill: skills.length ? skills : undefined,
    modality: sp.get("modality") ?? undefined,
    track_id: sp.get("track_id") ?? undefined,
    availability: sp.get("availability") ?? undefined,
    tag: tags.length ? tags : undefined,
    q: sp.get("q") ?? undefined,
    sort: sp.get("sort") ?? undefined,
    limit: sp.get("limit") ?? undefined,
  });
  return NextResponse.json({
    modules: list.map((m) => ({
      ...toSummary(m),
      tags: m.tags,
      external_url: m.external_url,
    })),
  });
}
