import { readFileSync } from "fs";
import type { CatalogModule, LessonContent, NotebookCellView } from "./types";
import { getModule, resolveRepoPath } from "./catalog";

interface RawCell {
  cell_type: string;
  source: string | string[];
  metadata?: { id?: string };
}

function cellSource(source: string | string[]): string {
  return Array.isArray(source) ? source.join("") : source;
}

function extractHeading(md: string): string | undefined {
  const m = md.match(/^#{1,3}\s+(.+)$/m);
  return m?.[1]?.trim();
}

export function loadLessonContent(moduleId: string): LessonContent | null {
  const catalogModule = getModule(moduleId);
  if (!catalogModule) return null;
  return loadLessonFromModule(catalogModule);
}

export function loadLessonFromModule(module: CatalogModule): LessonContent {
  const abs = resolveRepoPath(module.source_path);
  const raw = JSON.parse(readFileSync(abs, "utf8")) as { cells: RawCell[] };
  const cells: NotebookCellView[] = [];
  const toc: { id: string; text: string }[] = [];

  raw.cells.forEach((cell, i) => {
    const source = cellSource(cell.source);
    const id = cell.metadata?.id ?? `cell-${i}`;
    const type =
      cell.cell_type === "markdown" || cell.cell_type === "code"
        ? cell.cell_type
        : "raw";
    const view: NotebookCellView = {
      id,
      cell_type: type,
      source,
    };
    if (type === "markdown") {
      const heading = extractHeading(source);
      if (heading) {
        view.heading = heading;
        toc.push({ id, text: heading });
      }
    }
    cells.push(view);
  });

  return { module, cells, toc };
}
