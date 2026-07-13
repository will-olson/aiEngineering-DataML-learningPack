import type { Availability } from "@/lib/types";

export function ResourceBadge({
  availability,
  offlineOk,
}: {
  availability: Availability;
  offlineOk: boolean;
}) {
  if (availability === "local" || offlineOk) {
    return (
      <span className="badge badge-offline" title="Usable without network">
        Offline available
      </span>
    );
  }
  return (
    <span className="badge badge-network" title="Requires network access">
      Needs network
    </span>
  );
}