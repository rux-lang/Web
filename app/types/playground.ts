export type PlaygroundMode = "run" | "build" | "fmt";

export type PlaygroundProfile = "debug" | "release";

export type PlaygroundSeverity = "error" | "warning" | "note";

export interface PlaygroundRequest {
  mode: PlaygroundMode;
  profile: PlaygroundProfile;
  source: string;
  stdin: string;
}

export interface BuildOutcome {
  success: boolean;
  diagnostics: string;
  diagnostics_truncated: boolean;
  duration_ms: number;
}

export interface ProgramOutcome {
  stdout: string;
  stdout_truncated: boolean;
  stderr: string;
  stderr_truncated: boolean;
  exit_code: number | null;
  signal: number | null;
  timed_out: boolean;
  duration_ms: number;
}

export interface PlaygroundResult {
  build: BuildOutcome;
  program: ProgramOutcome | null;
  formatted: string | null;
}

export interface PlaygroundLimits {
  max_source_bytes: number;
  max_stdin_bytes: number;
  max_output_bytes: number;
  compile_timeout_seconds: number;
  run_timeout_seconds: number;
  memory_bytes: number;
  cpu_millis: number;
}

/**
 * One compiler diagnostic parsed out of `build.diagnostics`.
 *
 * `path`, `line` and `column` are null for a diagnostic the compiler emitted
 * without a source location — it prints `severity: message` in that case.
 * `notes` holds the `note:` and `help:` lines that followed a diagnostic and
 * belong to it; a note never carries notes of its own.
 */
export interface PlaygroundDiagnostic {
  severity: PlaygroundSeverity;
  path: string | null;
  line: number | null;
  column: number | null;
  message: string;
  notes: PlaygroundDiagnostic[];
}

/** One starter program in the toolbar's gallery. */
export interface PlaygroundExample {
  value: string;
  label: string;
  icon: string;
  description: string;
  source: string;
  stdin: string;
}

/** Why a submission was refused before it was sent. */
export interface PlaygroundRejection {
  field: "source" | "stdin";
  message: string;
}

export type PlaygroundRequestResult =
  { request: PlaygroundRequest; rejection: null } | { request: null; rejection: PlaygroundRejection };
