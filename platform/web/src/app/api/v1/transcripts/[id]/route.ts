import { NextResponse } from "next/server";
import { getModule, isStanfordModule } from "@/lib/catalog";
import { loadTranscriptContent } from "@/lib/transcript";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const mod = getModule(id);
  if (!mod || !isStanfordModule(mod)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const { searchParams } = new URL(req.url);
  const chunk = searchParams.get("chunk");
  try {
    const transcript = loadTranscriptContent(id, chunk);
    return NextResponse.json(transcript);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load transcript";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
