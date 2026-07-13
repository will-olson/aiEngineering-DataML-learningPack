import { NextResponse } from "next/server";
import { loadLessonContent } from "@/lib/notebook";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  try {
    const lesson = loadLessonContent(id);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }
    return NextResponse.json(lesson);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load lesson";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
