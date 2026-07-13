export type ProductArea = "learn" | "build" | "discover" | "read" | "ask";
export type Modality = "lesson" | "lab" | "project" | "reference" | "reading";
export type Level = "beginner" | "intermediate" | "advanced" | "production";
export type Availability = "local" | "link_only" | "runtime_fetch";

export interface CatalogModule {
  id: string;
  title: string;
  source_path: string;
  source_fork: string;
  product_area: ProductArea;
  modality: Modality;
  level: Level;
  skills: string[];
  prerequisites: string[];
  offline_ok: boolean;
  availability: Availability;
  estimated_minutes: number | null;
  track_ids: string[];
  next_ids: string[];
  tags: string[];
  external_url: string | null;
  license_note: string | null;
  summary: string | null;
  /** Build labs: primary script/notebook filename within cwd */
  entry_file?: string | null;
  /** Build labs: suggested shell commands (relative to cwd_hint) */
  launch_commands?: string[] | null;
  /** Build labs: optional requirements.txt path (repo-relative) */
  requirements_path?: string | null;
  /** Build labs: freeform launch notes */
  launch_notes?: string | null;
  /** Stanford lecture extras */
  pdf_path?: string | null;
  course_id?: string | null;
  lecture_number?: number | null;
  instructor?: string | null;
}

export interface LaunchHints {
  cwd_hint: string;
  commands: string[];
  requirements_path: string | null;
  entry_file: string | null;
  notes: string | null;
}

export interface Track {
  id: string;
  title: string;
  product_area: ProductArea;
  description: string;
  module_ids: string[];
  default_level: Level;
}

export interface ModuleSummary {
  id: string;
  title: string;
  level: Level;
  modality: Modality;
  offline_ok: boolean;
  availability: Availability;
  estimated_minutes: number | null;
  skills: string[];
  summary: string | null;
  tags?: string[];
  external_url?: string | null;
}

export interface ResolvePayload {
  module_id: string;
  title: string;
  source_fork: string;
  source_path: string;
  local_path: string | null;
  external_url: string | null;
  offline_ok: boolean;
  availability: Availability;
  attribution: string | null;
  license_note: string | null;
  skills: string[];
  tags: string[];
  product_area: ProductArea;
  local_exists: boolean;
  open_kind: "external" | "local" | "unavailable";
  /** Present for build modules; null otherwise */
  launch: LaunchHints | null;
}

export interface SuggestionItem {
  module_id: string;
  title: string;
  reason: string;
  kind: "next_lesson" | "related_lab" | "matching_dataset" | "matching_api" | "related_reading";
}

export interface LearnerProgress {
  selected_level: Level | null;
  active_track_id: string | null;
  completed_ids: string[];
  last_module_id: string | null;
  last_product_area: ProductArea | null;
  offline_preference: boolean;
}

export interface NotebookCellView {
  id: string;
  cell_type: "markdown" | "code" | "raw";
  source: string;
  heading?: string;
}

export interface LessonContent {
  module: CatalogModule;
  cells: NotebookCellView[];
  toc: { id: string; text: string }[];
}

export interface TranscriptTurn {
  id: string;
  speaker: string;
  role: string;
  text: string;
}

export interface TranscriptContent {
  module: CatalogModule;
  turns: TranscriptTurn[];
  duration_minutes: number | null;
  highlight_chunk_id?: string | null;
}

export interface AskDefinition {
  term: string;
  text: string;
  chunk_id: string;
  module_id: string;
}

export interface AskExcerpt {
  chunk_id: string;
  module_id: string;
  course_id: string;
  lecture: number;
  speaker: string;
  role: string;
  text: string;
  score: number;
  title?: string;
  track_id?: string;
}

export interface AskLectureHit {
  module_id: string;
  title: string;
  reason: string;
  course_id?: string;
  track_id?: string;
  lecture_number?: number | null;
}

export interface AskResponse {
  answer: string;
  definitions: AskDefinition[];
  excerpts: AskExcerpt[];
  lectures: AskLectureHit[];
  related_terms: string[];
  apply: SuggestionItem[];
  filters_applied: { course_ids: string[] };
  mode: "retrieval" | "synthesized";
  llm_available: boolean;
}

export interface GlossaryEntry {
  term: string;
  text: string;
  chunk_id: string;
  module_id: string;
  course_id: string;
  aliases: string[];
}

export interface AskCourse {
  course_id: string;
  track_id: string;
  title: string;
  instructor: string;
  lecture_count: number;
  folder: string;
}
