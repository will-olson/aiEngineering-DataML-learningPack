import Link from "next/link";
import { SuggestionRail } from "@/components/SuggestionRail";
import { filterModules, getTrack } from "@/lib/catalog";

export default function DiscoverHubPage() {
  const track = getTrack("discover-data");
  const datasets = filterModules({
    product_area: "discover",
    skill: "dataset",
    track_id: "discover-data",
  });
  const apis = filterModules({
    product_area: "discover",
    skill: "api",
    track_id: "discover-data",
  });

  return (
    <>
      <header className="page-header">
        <h1>Discover</h1>
        <p>
          {track?.description ??
            "Browse curated public datasets and APIs for your projects."}
        </p>
      </header>

      <SuggestionRail trackId="discover-data" productArea="discover" />

      <div className="discover-hub">
        <Link href="/discover/datasets" className="track-card">
          <h2>Datasets</h2>
          <p>
            {datasets.length} curated references—including a local Titanic
            sample for offline exploration.
          </p>
        </Link>
        <Link href="/discover/apis" className="track-card">
          <h2>APIs</h2>
          <p>
            {apis.length} public APIs across machine learning, open data,
            weather, and development.
          </p>
        </Link>
      </div>
    </>
  );
}