import Link from "next/link";
import { SuggestionRail } from "@/components/SuggestionRail";
import { loadTracks } from "@/lib/catalog";

export default function BuildIndexPage() {
  const tracks = loadTracks().filter((t) => t.product_area === "build");

  return (
    <>
      <header className="page-header">
        <h1>Build</h1>
        <p>
          Applied labs and practice projects—open with path and command hints,
          not a fake IDE.
        </p>
      </header>
      <SuggestionRail trackId="python-practice" productArea="build" />
      <ul style={{ listStyle: "none", display: "grid", gap: "0.75rem" }}>
        {tracks.map((t) => (
          <li key={t.id}>
            <Link href={`/build/${t.id}`} className="track-card">
              <h2>{t.title}</h2>
              <p>{t.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
