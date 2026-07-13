import { NextResponse } from "next/server";
import { loadCourses } from "@/lib/ask";
import { loadModules, toSummary } from "@/lib/catalog";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("course_id");
  const q = searchParams.get("q")?.toLowerCase().trim();

  let list = loadModules().filter(
    (m) => m.source_fork === "stanfordLectureTranscripts",
  );
  if (courseId) {
    list = list.filter((m) => m.course_id === courseId);
  }
  if (q) {
    list = list.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.summary?.toLowerCase().includes(q) ||
        m.skills.some((s) => s.includes(q)),
    );
  }

  return NextResponse.json({
    courses: loadCourses(),
    items: list.map(toSummary),
  });
}
