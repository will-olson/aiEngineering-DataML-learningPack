import { NextResponse } from "next/server";
import { searchGlossary } from "@/lib/ask";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const limit = Number(searchParams.get("limit") ?? "20");
  return NextResponse.json({
    items: searchGlossary(q, Number.isFinite(limit) ? limit : 20),
  });
}
