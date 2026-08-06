import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRegistryApi } from "../app/composables/useRegistryApi";

describe("registry API transport", () => {
  const fetch = vi.fn();

  beforeEach(() => {
    fetch.mockReset();
    vi.stubGlobal("$fetch", fetch);
    vi.stubGlobal("useRuntimeConfig", () => ({
      public: { apiBaseUrl: "https://api.rux-lang.dev/" },
    }));
  });

  afterEach(() => vi.unstubAllGlobals());

  it("keeps public reads credential-free", () => {
    useRegistryApi().get("/v1/highlights");

    expect(fetch).toHaveBeenCalledWith(
      "/v1/highlights",
      expect.objectContaining({
        baseURL: "https://api.rux-lang.dev",
        credentials: "omit",
      }),
    );
  });

  it("posts the playground submission without credentials", () => {
    const controller = new AbortController();
    useRegistryApi().post("/v1/playground/run", { mode: "run", source: "Fn Main() {}\n" }, controller.signal);

    expect(fetch).toHaveBeenCalledWith("/v1/playground/run", {
      baseURL: "https://api.rux-lang.dev",
      method: "POST",
      credentials: "omit",
      body: { mode: "run", source: "Fn Main() {}\n" },
      signal: controller.signal,
    });
  });

  it("includes browser credentials only for session requests", () => {
    const api = useRegistryApi();
    api.sessionGet("/v1/auth/session");
    api.sessionMutation("/v1/auth/logout", "POST", "csrf-value");

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "/v1/auth/session",
      expect.objectContaining({
        credentials: "include",
      }),
    );
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "/v1/auth/logout",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: { "X-CSRF-Token": "csrf-value" },
      }),
    );
  });
});
