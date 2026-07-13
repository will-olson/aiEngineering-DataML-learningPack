import { notFound } from "next/navigation";
import { LessonView } from "@/components/LessonView";
import { getTrack } from "@/lib/catalog";
import { loadLessonContent } from "@/lib/notebook";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ trackId: string; moduleId: string }>;
}) {
  const { trackId, moduleId } = await params;
  if (!getTrack(trackId)) notFound();
  let lesson;
  try {
    lesson = loadLessonContent(moduleId);
  } catch {
    notFound();
  }
  if (!lesson) notFound();

  return <LessonView trackId={trackId} lesson={lesson} />;
}
