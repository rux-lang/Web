import { ref } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CurrentUserState } from "../app/types/auth";
import { AUTH_SESSION_MARKER_KEY } from "../app/utils/auth";

const futureSession = (expiresAt = new Date(Date.now() + 60_000).toISOString()) => ({
  data: {
    user: {
      github_login: "octocat",
      display_name: "The Octocat",
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
    },
    expires_at: expiresAt,
    csrf_token: "csrf-value",
  },
});

function apiProblem(status: number, code: string) {
  return {
    response: {
      status,
      headers: new Headers({ "content-type": "application/problem+json" }),
      _data: {
        type: `https://api.rux-lang.dev/problems/${code}`,
        title: code === "authentication_required" ? "Authentication is required" : "Unavailable",
        status,
        code,
      },
    },
  };
}

describe("useCurrentUser", () => {
  let state: ReturnType<typeof ref<CurrentUserState>>;
  let sessionGet: ReturnType<typeof vi.fn>;
  let sessionMutation: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.fn>;
  let toastAdd: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-02T12:00:00Z"));
    sessionStorage.clear();
    state = ref({
      status: "loading",
      session: null,
      failure: null,
      signing_out: false,
    });
    sessionGet = vi.fn();
    sessionMutation = vi.fn();
    navigate = vi.fn();
    toastAdd = vi.fn();

    vi.stubGlobal("useState", (_key: string, _initialize: () => CurrentUserState) => state);
    vi.stubGlobal("useRegistryApi", () => ({
      absoluteUrl: (path: string) => `https://api.rux-lang.dev${path}`,
      sessionGet,
      sessionMutation,
    }));
    vi.stubGlobal("useToast", () => ({ add: toastAdd }));
    vi.stubGlobal("navigateTo", navigate);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("loads a valid session and expires it without navigating", async () => {
    const expiresAt = new Date(Date.now() + 1_000).toISOString();
    sessionGet.mockResolvedValue(futureSession(expiresAt));
    const { useCurrentUser } = await import("../app/composables/useCurrentUser");
    const auth = useCurrentUser();

    await auth.initialize();

    expect(sessionGet).toHaveBeenCalledWith("/v1/auth/session");
    expect(auth.status.value).toBe("authenticated");
    expect(auth.user.value?.github_login).toBe("octocat");
    expect(sessionStorage.getItem(AUTH_SESSION_MARKER_KEY)).toBe(expiresAt);

    await vi.advanceTimersByTimeAsync(1_000);
    expect(auth.status.value).toBe("expired");
    expect(auth.session.value).toBeNull();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("distinguishes a new anonymous visitor from a session that ended", async () => {
    sessionGet.mockRejectedValue(apiProblem(401, "authentication_required"));
    const { useCurrentUser } = await import("../app/composables/useCurrentUser");
    const auth = useCurrentUser();

    await auth.initialize();
    expect(auth.status.value).toBe("anonymous");

    state.value.status = "loading";
    sessionStorage.setItem(AUTH_SESSION_MARKER_KEY, "2026-08-03T12:00:00Z");
    await auth.refresh();
    expect(auth.status.value).toBe("expired");
  });

  it("reports malformed and unavailable session responses as retryable", async () => {
    sessionGet.mockResolvedValueOnce({ data: { user: {} } });
    const { useCurrentUser } = await import("../app/composables/useCurrentUser");
    const auth = useCurrentUser();

    await auth.initialize();
    expect(auth.status.value).toBe("unavailable");
    expect(auth.failure.value).toMatchObject({
      title: "Account status unavailable",
      retryable: true,
    });

    sessionGet.mockRejectedValueOnce(new TypeError("network details"));
    await auth.refresh();
    expect(auth.failure.value?.detail).toBe("Check your connection and try again.");
    expect(auth.failure.value?.detail).not.toContain("network details");
  });

  it("stores a safe return path and performs an external OAuth navigation", async () => {
    const { useCurrentUser } = await import("../app/composables/useCurrentUser");
    const auth = useCurrentUser();

    await auth.startSignIn("//evil.example/path");

    expect(navigate).toHaveBeenCalledWith("https://api.rux-lang.dev/v1/auth/github", {
      external: true,
    });
    expect(sessionStorage.getItem("rux.auth.return")).toContain('"path":"/packages"');
  });

  it("signs out with CSRF protection and clears only after success", async () => {
    state.value = {
      status: "authenticated",
      session: futureSession().data,
      failure: null,
      signing_out: false,
    };
    sessionStorage.setItem(AUTH_SESSION_MARKER_KEY, futureSession().data.expires_at);
    sessionMutation.mockRejectedValueOnce(new TypeError("offline")).mockResolvedValueOnce(undefined);
    const { useCurrentUser } = await import("../app/composables/useCurrentUser");
    const auth = useCurrentUser();

    await auth.signOut();
    expect(auth.status.value).toBe("authenticated");
    expect(auth.session.value).not.toBeNull();
    expect(sessionStorage.getItem(AUTH_SESSION_MARKER_KEY)).not.toBeNull();

    await auth.signOut();
    expect(sessionMutation).toHaveBeenLastCalledWith("/v1/auth/logout", "POST", "csrf-value");
    expect(auth.status.value).toBe("anonymous");
    expect(auth.session.value).toBeNull();
    expect(sessionStorage.getItem(AUTH_SESSION_MARKER_KEY)).toBeNull();
    expect(toastAdd).toHaveBeenLastCalledWith(expect.objectContaining({ title: "Signed out" }));
  });

  it("forgets the local session immediately after account deletion", async () => {
    state.value = {
      status: "authenticated",
      session: futureSession().data,
      failure: null,
      signing_out: false,
    };
    sessionStorage.setItem(AUTH_SESSION_MARKER_KEY, futureSession().data.expires_at);
    const { useCurrentUser } = await import("../app/composables/useCurrentUser");
    const auth = useCurrentUser();

    auth.completeAccountDeletion();

    expect(auth.status.value).toBe("anonymous");
    expect(auth.session.value).toBeNull();
    expect(sessionStorage.getItem(AUTH_SESSION_MARKER_KEY)).toBeNull();
    expect(sessionMutation).not.toHaveBeenCalled();
  });
});
