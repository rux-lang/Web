import { beforeEach, describe, expect, it } from "vitest";
import {
  AUTH_RETURN_LIFETIME_MS,
  AUTH_RETURN_STORAGE_KEY,
  callbackFailure,
  consumeReturnPath,
  parseSessionDocument,
  safeAvatarUrl,
  safeReturnPath,
  storeReturnPath,
  storedReturnPath,
  userInitials,
} from "../app/utils/auth";

const origin = "https://rux-lang.dev";

describe("authentication data", () => {
  beforeEach(() => sessionStorage.clear());

  it("accepts only complete session envelopes", () => {
    const document = {
      data: {
        user: {
          github_login: "octocat",
          display_name: "The Octocat",
          avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
        },
        expires_at: "2026-08-20T12:00:00Z",
        csrf_token: "csrf-value",
      },
    };

    expect(parseSessionDocument(document)).toEqual(document.data);
    expect(parseSessionDocument({ data: { ...document.data, csrf_token: "" } })).toBeNull();
    expect(
      parseSessionDocument({
        data: { ...document.data, expires_at: "not-a-date" },
      }),
    ).toBeNull();
    expect(
      parseSessionDocument({
        data: { ...document.data, user: { github_login: "octocat" } },
      }),
    ).toBeNull();
  });

  it("allows only non-looping routes on the catalog origin", () => {
    expect(safeReturnPath("/packages/rux/json?version=1.0.0#readme", origin)).toBe(
      "/packages/rux/json?version=1.0.0#readme",
    );

    for (const candidate of [
      "https://evil.example/path",
      "//evil.example/path",
      "/packages/-/auth/sign-in?return_to=/packages",
      "/packages/-/auth/callback",
      "/packages/-/auth/callback/",
      "/packages/-/auth/%63allback",
      "packages",
    ]) {
      expect(safeReturnPath(candidate, origin)).toBe("/packages");
    }
  });

  it("expires and consumes one-time return paths", () => {
    storeReturnPath(sessionStorage, "/packages/-/search?q=json", origin, 1_000);
    expect(storedReturnPath(sessionStorage, origin, 2_000)).toBe("/packages/-/search?q=json");
    expect(consumeReturnPath(sessionStorage, origin, 2_000)).toBe("/packages/-/search?q=json");
    expect(sessionStorage.getItem(AUTH_RETURN_STORAGE_KEY)).toBeNull();

    storeReturnPath(sessionStorage, "/packages", origin, 1_000);
    expect(storedReturnPath(sessionStorage, origin, 1_000 + AUTH_RETURN_LIFETIME_MS + 1)).toBe("/packages");
    expect(storedReturnPath(sessionStorage, origin, 999)).toBe("/packages");

    sessionStorage.setItem(AUTH_RETURN_STORAGE_KEY, "{invalid");
    expect(storedReturnPath(sessionStorage, origin, 2_000)).toBe("/packages");
  });

  it("maps callback errors without reflecting unknown input", () => {
    expect(callbackFailure(undefined)).toBeNull();
    expect(callbackFailure("oauth_access_denied")).toMatchObject({
      title: "GitHub sign-in was cancelled",
      retryable: true,
    });
    expect(callbackFailure("account_conflict")).toMatchObject({
      retryable: false,
    });

    const unknown = callbackFailure("provider_secret_message");
    expect(unknown?.title).toBe("Sign-in response was invalid");
    expect(JSON.stringify(unknown)).not.toContain("provider_secret_message");
    expect(callbackFailure(["oauth_access_denied"])).toEqual(unknown);
  });

  it("allows only GitHub avatar CDN images and derives safe initials", () => {
    expect(safeAvatarUrl("https://avatars.githubusercontent.com/u/1?v=4")).toBe(
      "https://avatars.githubusercontent.com/u/1?v=4",
    );
    expect(safeAvatarUrl("http://avatars.githubusercontent.com/u/1")).toBeUndefined();
    expect(safeAvatarUrl("https://example.com/avatar.png")).toBeUndefined();
    expect(safeAvatarUrl("https://user@avatars.githubusercontent.com/u/1")).toBeUndefined();
    expect(userInitials("The Octocat", "octocat")).toBe("TO");
    expect(userInitials(null, "octocat")).toBe("O");
  });
});
