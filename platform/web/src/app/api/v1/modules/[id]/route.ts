import { NextResponse } from "next/server";
import { getModule } from "@/lib/catalog";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const catalogModule = getModule(id);
  if (!catalogModule) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }
  return NextResponse.json({ module: catalogModule });
}
