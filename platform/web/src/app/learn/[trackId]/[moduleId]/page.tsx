import { notFound } from "next/navigation";
import { LessonView } from "@/components/LessonView";
import { TranscriptReader } from "@/components/TranscriptReader";
import { getModule, getTrack, isStanfordModule } from "@/lib/catalog";
import { loadLessonContent } from "@/lib/notebook";
import { loadTranscriptContent } from "@/lib/transcript";

export default async function ModulePage({
  params,
  searchParams,
}: {
  params: Promise<{ trackId: string; moduleId: string }>;
  searchParams: Promise<{ chunk?: string }>;
}) {
  const { trackId, moduleId } = await params;
  const sp = await searchParams;
  const track = getTrack(trackId);
  if (!track) notFound();

  const mod = getModule(moduleId);
  if (!mod) notFound();

  if (isStanfordModule(mod)) {
    let transcript;
    try {
      transcript = loadTranscriptContent(moduleId, sp.chunk ?? null);
    } catch {
      notFound();
    }
    if (!transcript) notFound();
    return (
      <TranscriptReader
        trackId={trackId}
        trackTitle={track.title}
        transcript={transcript}
      />
    );
  }

  let lesson;
  try {
    lesson = loadLessonContent(moduleId);
  } catch {
    notFound();
  }
  if (!lesson) notFound();

  return <LessonView trackId={trackId} lesson={lesson} />;
}
