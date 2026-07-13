import Link from "next/link";
import { SuggestionRail } from "@/components/SuggestionRail";
import { loadTracks } from "@/lib/catalog";

export default function LearnIndexPage() {
  const tracks = loadTracks().filter((t) => t.product_area === "learn");

  return (
    <>
      <header className="page-header">
        <h1>Learn</h1>
        <p>Instructive modules in curated tracks—start with Python Data Science.</p>
      </header>
      <SuggestionRail />
      <ul style={{ listStyle: "none", display: "grid", gap: "0.75rem" }}>
        {tracks.map((t) => (
          <li key={t.id}>
            <Link href={`/learn/${t.id}`} className="track-card">
              <h2>{t.title}</h2>
              <p>{t.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
