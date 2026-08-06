import type {
  BuildOutcome,
  PlaygroundDiagnostic,
  PlaygroundLimits,
  PlaygroundMode,
  PlaygroundProfile,
  PlaygroundRequestResult,
  PlaygroundResult,
  PlaygroundSeverity,
  ProgramOutcome,
} from "~/types/playground";

export const playgroundRunPath = "/v1/playground/run";
export const playgroundLimitsPath = "/v1/playground/limits";

/**
 * The sandbox's documented envelope.
 *
 * Only a fallback for validating a submission before `GET /v1/playground/limits`
 * has answered — what is shown to the reader always comes from the server, which
 * is authoritative for what it actually enforces.
 */
export const defaultPlaygroundLimits: PlaygroundLimits = {
  max_source_bytes: 32 * 1024,
  max_stdin_bytes: 16 * 1024,
  max_output_bytes: 16 * 1024,
  compile_timeout_seconds: 5,
  run_timeout_seconds: 3,
  memory_bytes: 128 * 1024 * 1024,
  cpu_millis: 500,
};

const encoder = new TextEncoder();

function byteLength(value: string): number {
  return encoder.encode(value).length;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCount(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0;
}

/**
 * Validates a submission against the same bounds the server applies, so an
 * oversized buffer never becomes a round trip that can only end in `422`.
 */
export function buildRunRequest(
  source: string,
  mode: PlaygroundMode,
  profile: PlaygroundProfile,
  stdin: string,
  limits: PlaygroundLimits = defaultPlaygroundLimits,
): PlaygroundRequestResult {
  const sourceBytes = byteLength(source);
  const stdinBytes = byteLength(stdin);

  if (sourceBytes === 0) {
    return { request: null, rejection: { field: "source", message: "Write some Rux before running it." } };
  }
  if (sourceBytes > limits.max_source_bytes) {
    return {
      request: null,
      rejection: {
        field: "source",
        message: `The program is ${formatLimitBytes(sourceBytes)}; the limit is ${formatLimitBytes(limits.max_source_bytes)}.`,
      },
    };
  }
  if (stdinBytes > limits.max_stdin_bytes) {
    return {
      request: null,
      rejection: {
        field: "stdin",
        message: `Standard input is ${formatLimitBytes(stdinBytes)}; the limit is ${formatLimitBytes(limits.max_stdin_bytes)}.`,
      },
    };
  }
  if (source.includes("\0") || stdin.includes("\0")) {
    return { request: null, rejection: { field: "source", message: "The submission contains a NUL byte." } };
  }

  return { request: { mode, profile, source, stdin }, rejection: null };
}

function normalizeBuild(value: unknown): BuildOutcome | null {
  if (!isRecord(value)) return null;
  const { success, diagnostics, diagnostics_truncated, duration_ms } = value;
  if (typeof success !== "boolean" || typeof diagnostics !== "string") return null;
  if (typeof diagnostics_truncated !== "boolean" || !isCount(duration_ms)) return null;

  return { success, diagnostics, diagnostics_truncated, duration_ms };
}

function normalizeProgram(value: unknown): ProgramOutcome | null {
  if (!isRecord(value)) return null;
  const { stdout, stdout_truncated, stderr, stderr_truncated, exit_code, signal, timed_out, duration_ms } = value;
  if (typeof stdout !== "string" || typeof stderr !== "string") return null;
  if (typeof stdout_truncated !== "boolean" || typeof stderr_truncated !== "boolean") return null;
  if (exit_code !== null && !Number.isInteger(exit_code)) return null;
  if (signal !== null && !Number.isInteger(signal)) return null;
  if (typeof timed_out !== "boolean" || !isCount(duration_ms)) return null;

  return {
    stdout,
    stdout_truncated,
    stderr,
    stderr_truncated,
    exit_code: exit_code as number | null,
    signal: signal as number | null,
    timed_out,
    duration_ms,
  };
}

/**
 * Parses the `data` envelope of a run.
 *
 * Returns null rather than throwing, so a malformed body becomes an ordinary
 * "unexpected response" state in the page instead of an exception in a
 * component. `program` and `formatted` are optional by contract — absent for
 * `build`, for `fmt`, and for a `run` whose compile failed.
 */
export function normalizePlaygroundResult(payload: unknown): PlaygroundResult | null {
  if (!isRecord(payload) || !isRecord(payload.data)) return null;

  const { build, program, formatted } = payload.data;
  const normalizedBuild = normalizeBuild(build);
  if (!normalizedBuild) return null;

  let normalizedProgram: ProgramOutcome | null = null;
  if (program !== undefined && program !== null) {
    normalizedProgram = normalizeProgram(program);
    if (!normalizedProgram) return null;
  }

  if (formatted !== undefined && formatted !== null && typeof formatted !== "string") return null;

  return {
    build: normalizedBuild,
    program: normalizedProgram,
    formatted: typeof formatted === "string" ? formatted : null,
  };
}

export function normalizePlaygroundLimits(payload: unknown): PlaygroundLimits | null {
  if (!isRecord(payload) || !isRecord(payload.data)) return null;

  const keys: (keyof PlaygroundLimits)[] = [
    "max_source_bytes",
    "max_stdin_bytes",
    "max_output_bytes",
    "compile_timeout_seconds",
    "run_timeout_seconds",
    "memory_bytes",
    "cpu_millis",
  ];

  const limits = {} as PlaygroundLimits;
  for (const key of keys) {
    const value = payload.data[key];
    if (!isCount(value) || value === 0) return null;
    limits[key] = value;
  }

  return limits;
}

const locatedDiagnostic = /^(.+?):(\d+):(\d+): (error|warning|note|help): (.*)$/;
const bareDiagnostic = /^(error|warning|note|help): (.*)$/;

function severityOf(value: string): PlaygroundSeverity {
  if (value === "error" || value === "warning") return value;
  return "note";
}

/**
 * Turns `path:line:col: severity: message` diagnostics into records the Build
 * tab can render and link to a line.
 *
 * The compiler prints one diagnostic per line, but a message can wrap, and
 * `note:`/`help:` lines belong to the diagnostic above them. Anything that
 * matches no rule is kept as a continuation of the diagnostic in hand and
 * otherwise dropped, so the caller can fall back to the raw text when this
 * returns nothing.
 */
export function parseDiagnostics(text: string): PlaygroundDiagnostic[] {
  const diagnostics: PlaygroundDiagnostic[] = [];
  let current: PlaygroundDiagnostic | null = null;

  for (const line of text.split(/\r?\n/)) {
    if (line.trim().length === 0) {
      current = null;
      continue;
    }

    const located = locatedDiagnostic.exec(line);
    const bare = located ? null : bareDiagnostic.exec(line);
    if (!located && !bare) {
      if (current) current.message = `${current.message}\n${line.trim()}`;
      continue;
    }

    const severity = severityOf((located ? located[4] : bare?.[1]) ?? "note");
    const diagnostic: PlaygroundDiagnostic = {
      severity,
      path: located ? (located[1] ?? null) : null,
      line: located ? Number(located[2]) : null,
      column: located ? Number(located[3]) : null,
      message: ((located ? located[5] : bare?.[2]) ?? "").trim(),
      notes: [],
    };

    if (severity === "note" && current) {
      current.notes.push(diagnostic);
      continue;
    }

    diagnostics.push(diagnostic);
    current = diagnostic;
  }

  return diagnostics;
}

export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "—";
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

/** Renders a sandbox bound the way the sandbox states it: in binary units. */
export function formatLimitBytes(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "—";
  if (value < 1024) return `${value} B`;

  const units = ["KiB", "MiB", "GiB"];
  let amount = value / 1024;
  let unit = units[0];
  for (let index = 1; index < units.length && amount >= 1024; index += 1) {
    amount /= 1024;
    unit = units[index];
  }

  return `${Number(amount.toFixed(1))} ${unit}`;
}

/**
 * Explains a truncation flag in the reader's terms, naming the cap that was hit.
 *
 * Accepts either half of a result: the build's diagnostics and the program's two
 * streams are capped by the same `max_output_bytes`.
 */
export function truncationNotice(
  outcome: BuildOutcome | ProgramOutcome | null | undefined,
  limits: PlaygroundLimits | null | undefined,
): string | null {
  if (!outcome) return null;
  const cap = formatLimitBytes((limits ?? defaultPlaygroundLimits).max_output_bytes);

  if ("diagnostics_truncated" in outcome) {
    return outcome.diagnostics_truncated ? `Diagnostics stop at the ${cap} output limit.` : null;
  }

  const streams: string[] = [];
  if (outcome.stdout_truncated) streams.push("Standard output");
  if (outcome.stderr_truncated) streams.push("standard error");
  if (streams.length === 0) return null;

  const subject = streams.join(" and ");
  const verb = streams.length === 1 ? "stops" : "stop";
  return `${subject} ${verb} at the ${cap} per-stream output limit.`;
}
