import { NextRequest, NextResponse } from "next/server";
import { buildSuggestions } from "@/lib/catalog";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const completedRaw = sp.get("completed_ids") ?? "";
  const completed_ids = completedRaw
    ? completedRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const items = buildSuggestions({
    product_area: sp.get("product_area") ?? undefined,
    selected_level: sp.get("selected_level") ?? undefined,
    active_track_id: sp.get("active_track_id") ?? undefined,
    last_module_id: sp.get("last_module_id") ?? undefined,
    completed_ids,
    offline_preference: sp.get("offline_preference") === "true",
    limit: sp.get("limit") ? parseInt(sp.get("limit")!, 10) : 3,
  });
  return NextResponse.json({ items });
}
