import { AskClient } from "@/components/AskClient";
import { loadCourses } from "@/lib/ask";

export default function AskPage() {
  const courses = loadCourses();
  return <AskClient courses={courses} />;
}
