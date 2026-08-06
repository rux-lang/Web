import { describe, expect, it } from "vitest";
import type { PlaygroundLimits } from "../app/types/playground";
import {
  buildRunRequest,
  defaultPlaygroundLimits,
  formatDuration,
  formatLimitBytes,
  normalizePlaygroundLimits,
  normalizePlaygroundResult,
  parseDiagnostics,
  truncationNotice,
} from "../app/utils/playground";

const smallLimits: PlaygroundLimits = {
  ...defaultPlaygroundLimits,
  max_source_bytes: 16,
  max_stdin_bytes: 8,
};

const successPayload = {
  data: {
    build: { success: true, diagnostics: "", diagnostics_truncated: false, duration_ms: 120 },
    program: {
      stdout: "hello\n",
      stdout_truncated: false,
      stderr: "",
      stderr_truncated: false,
      exit_code: 0,
      signal: null,
      timed_out: false,
      duration_ms: 7,
    },
  },
};

describe("playground request construction", () => {
  it("sends the buffer verbatim with the chosen mode and profile", () => {
    const { request, rejection } = buildRunRequest("Fn Main() {}\n", "build", "release", "");

    expect(rejection).toBeNull();
    expect(request).toEqual({
      mode: "build",
      profile: "release",
      source: "Fn Main() {}\n",
      stdin: "",
    });
  });

  it("refuses an empty program before it becomes a round trip", () => {
    const { request, rejection } = buildRunRequest("", "run", "debug", "");

    expect(request).toBeNull();
    expect(rejection?.field).toBe("source");
  });

  it("measures the documented bounds in bytes, not characters", () => {
    const withinBytes = buildRunRequest("ααααα", "run", "debug", "", smallLimits);
    const overBytes = buildRunRequest("ααααααααα", "run", "debug", "", smallLimits);

    expect(withinBytes.rejection).toBeNull();
    expect(overBytes.request).toBeNull();
    expect(overBytes.rejection?.message).toContain("18 B");
  });

  it("names standard input when it is standard input that is oversized", () => {
    const { rejection } = buildRunRequest("Fn Main()", "run", "debug", "123456789", smallLimits);

    expect(rejection).toEqual({
      field: "stdin",
      message: "Standard input is 9 B; the limit is 8 B.",
    });
  });

  it("rejects a NUL byte the sandbox would refuse anyway", () => {
    const { request, rejection } = buildRunRequest("Fn Main()\0", "run", "debug", "");

    expect(request).toBeNull();
    expect(rejection?.message).toContain("NUL");
  });
});

describe("playground response parsing", () => {
  it("reads a completed run out of the data envelope", () => {
    const result = normalizePlaygroundResult(successPayload);

    expect(result?.build.duration_ms).toBe(120);
    expect(result?.program?.stdout).toBe("hello\n");
    expect(result?.formatted).toBeNull();
  });

  it("treats an absent program as a build that produced no run", () => {
    const result = normalizePlaygroundResult({
      data: {
        build: { success: false, diagnostics: "error: nope", diagnostics_truncated: false, duration_ms: 4 },
      },
    });

    expect(result?.build.success).toBe(false);
    expect(result?.program).toBeNull();
  });

  it("keeps the reformatted source of a fmt run", () => {
    const result = normalizePlaygroundResult({
      data: {
        build: { success: true, diagnostics: "", diagnostics_truncated: false, duration_ms: 2 },
        formatted: "Fn Main() {}\n",
      },
    });

    expect(result?.formatted).toBe("Fn Main() {}\n");
  });

  it("carries a signalled program's null exit code through", () => {
    const result = normalizePlaygroundResult({
      data: {
        ...successPayload.data,
        program: { ...successPayload.data.program, exit_code: null, signal: 9, timed_out: true },
      },
    });

    expect(result?.program).toMatchObject({ exit_code: null, signal: 9, timed_out: true });
  });

  it("returns null instead of throwing at anything unexpected", () => {
    expect(normalizePlaygroundResult(null)).toBeNull();
    expect(normalizePlaygroundResult({})).toBeNull();
    expect(normalizePlaygroundResult({ data: {} })).toBeNull();
    expect(normalizePlaygroundResult({ data: { build: { success: "yes" } } })).toBeNull();
    expect(
      normalizePlaygroundResult({
        data: { ...successPayload.data, program: { ...successPayload.data.program, stdout: 12 } },
      }),
    ).toBeNull();
    expect(normalizePlaygroundResult({ data: { ...successPayload.data, formatted: 3 } })).toBeNull();
  });

  it("accepts the limits document only when every bound is present", () => {
    const payload = { data: { ...defaultPlaygroundLimits, compile_timeout_seconds: 9 } };

    expect(normalizePlaygroundLimits(payload)).toEqual({ ...defaultPlaygroundLimits, compile_timeout_seconds: 9 });
    expect(normalizePlaygroundLimits({ data: { max_source_bytes: 10 } })).toBeNull();
    expect(normalizePlaygroundLimits({ data: { ...defaultPlaygroundLimits, cpu_millis: 0 } })).toBeNull();
    expect(normalizePlaygroundLimits(undefined)).toBeNull();
  });
});

describe("diagnostic parsing", () => {
  it("splits a located diagnostic into fields the Build tab can link", () => {
    const [diagnostic] = parseDiagnostics("/job/main.rux:12:5: error: unknown identifier 'Foo'\n");

    expect(diagnostic).toEqual({
      severity: "error",
      path: "/job/main.rux",
      line: 12,
      column: 5,
      message: "unknown identifier 'Foo'",
      notes: [],
    });
  });

  it("keeps a Windows drive letter inside the path", () => {
    const [diagnostic] = parseDiagnostics("C:\\job\\main.rux:3:1: warning: unused variable");

    expect(diagnostic?.path).toBe("C:\\job\\main.rux");
    expect(diagnostic?.line).toBe(3);
  });

  it("accepts a diagnostic the compiler emitted without a location", () => {
    const [diagnostic] = parseDiagnostics("error: no entry point");

    expect(diagnostic).toMatchObject({ severity: "error", path: null, line: null, message: "no entry point" });
  });

  it("attaches notes and help to the diagnostic above them", () => {
    const diagnostics = parseDiagnostics(
      [
        "/job/main.rux:4:9: error: type mismatch",
        "/job/main.rux:2:5: note: declared here",
        "help: add an explicit cast",
        "/job/main.rux:9:1: warning: unreachable code",
      ].join("\n"),
    );

    expect(diagnostics).toHaveLength(2);
    expect(diagnostics[0]?.notes.map((note) => note.message)).toEqual(["declared here", "add an explicit cast"]);
    expect(diagnostics[0]?.notes[0]?.line).toBe(2);
    expect(diagnostics[1]?.severity).toBe("warning");
  });

  it("folds a wrapped message into the diagnostic it continues", () => {
    const diagnostics = parseDiagnostics(
      ["/job/main.rux:1:1: error: expected one of", "    ')', ',' or an expression"].join("\n"),
    );

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.message).toBe("expected one of\n')', ',' or an expression");
  });

  it("returns nothing when the text is not diagnostics at all", () => {
    expect(parseDiagnostics("")).toEqual([]);
    expect(parseDiagnostics("linking failed\n\nsee the log")).toEqual([]);
  });

  it("keeps an orphan note rather than dropping it", () => {
    const diagnostics = parseDiagnostics("note: compiled with the release profile");

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.severity).toBe("note");
  });
});

describe("playground formatting helpers", () => {
  it("switches from milliseconds to seconds at a second", () => {
    expect(formatDuration(0)).toBe("0 ms");
    expect(formatDuration(999)).toBe("999 ms");
    expect(formatDuration(1000)).toBe("1.00 s");
    expect(formatDuration(3456)).toBe("3.46 s");
    expect(formatDuration(Number.NaN)).toBe("—");
  });

  it("states sandbox bounds in the binary units the sandbox uses", () => {
    expect(formatLimitBytes(512)).toBe("512 B");
    expect(formatLimitBytes(16 * 1024)).toBe("16 KiB");
    expect(formatLimitBytes(128 * 1024 * 1024)).toBe("128 MiB");
  });

  it("names only the streams that were actually cut", () => {
    const program = successPayload.data.program;

    expect(truncationNotice(program, defaultPlaygroundLimits)).toBeNull();
    expect(truncationNotice({ ...program, stdout_truncated: true }, defaultPlaygroundLimits)).toBe(
      "Standard output stops at the 16 KiB per-stream output limit.",
    );
    expect(
      truncationNotice({ ...program, stdout_truncated: true, stderr_truncated: true }, defaultPlaygroundLimits),
    ).toContain("Standard output and standard error stop");
  });

  it("reports truncated diagnostics against the same cap", () => {
    const build = { success: false, diagnostics: "…", diagnostics_truncated: true, duration_ms: 5 };

    expect(truncationNotice(build, { ...defaultPlaygroundLimits, max_output_bytes: 8192 })).toBe(
      "Diagnostics stop at the 8 KiB output limit.",
    );
    expect(truncationNotice({ ...build, diagnostics_truncated: false }, defaultPlaygroundLimits)).toBeNull();
    expect(truncationNotice(null, defaultPlaygroundLimits)).toBeNull();
  });
});
