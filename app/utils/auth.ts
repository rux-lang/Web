import type { AuthenticationFlowFailure, SessionDocument } from "~/types/auth";

export const AUTH_RETURN_STORAGE_KEY = "rux.auth.return";
export const AUTH_SESSION_MARKER_KEY = "rux.auth.session";
export const AUTH_RETURN_LIFETIME_MS = 10 * 60 * 1000;

interface StorageReader {
  getItem(key: string): string | null;
}

interface StorageWriter extends StorageReader {
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function nullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

export function parseSessionDocument(value: unknown): SessionDocument | null {
  if (!isRecord(value) || !isRecord(value.data)) return null;

  const { user, expires_at: expiresAt, csrf_token: csrfToken } = value.data;
  if (
    !isRecord(user) ||
    typeof user.github_login !== "string" ||
    user.github_login.length === 0 ||
    !nullableString(user.display_name) ||
    !nullableString(user.avatar_url) ||
    typeof expiresAt !== "string" ||
    !Number.isFinite(Date.parse(expiresAt)) ||
    typeof csrfToken !== "string" ||
    csrfToken.length === 0
  ) {
    return null;
  }

  return {
    user: {
      github_login: user.github_login,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
    },
    expires_at: expiresAt,
    csrf_token: csrfToken,
  };
}

export function safeReturnPath(candidate: unknown, origin: string): string {
  if (typeof candidate !== "string" || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return "/packages";
  }

  try {
    const url = new URL(candidate, origin);
    const routePath = decodeURIComponent(url.pathname).replace(/\/+$/u, "") || "/";
    if (
      url.origin !== origin ||
      url.username ||
      url.password ||
      routePath === "/packages/-/auth/sign-in" ||
      routePath === "/packages/-/auth/callback"
    ) {
      return "/packages";
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/packages";
  }
}

export function storeReturnPath(storage: StorageWriter, candidate: unknown, origin: string, now = Date.now()): string {
  const path = safeReturnPath(candidate, origin);
  storage.setItem(AUTH_RETURN_STORAGE_KEY, JSON.stringify({ path, stored_at: now }));
  return path;
}

export function storedReturnPath(storage: StorageReader, origin: string, now = Date.now()): string {
  const encoded = storage.getItem(AUTH_RETURN_STORAGE_KEY);
  if (!encoded) return "/packages";

  try {
    const parsed: unknown = JSON.parse(encoded);
    if (
      !isRecord(parsed) ||
      typeof parsed.path !== "string" ||
      typeof parsed.stored_at !== "number" ||
      !Number.isFinite(parsed.stored_at) ||
      parsed.stored_at > now ||
      now - parsed.stored_at > AUTH_RETURN_LIFETIME_MS
    ) {
      return "/packages";
    }
    return safeReturnPath(parsed.path, origin);
  } catch {
    return "/packages";
  }
}

export function consumeReturnPath(storage: StorageWriter, origin: string, now = Date.now()): string {
  const path = storedReturnPath(storage, origin, now);
  storage.removeItem(AUTH_RETURN_STORAGE_KEY);
  return path;
}

export function clearReturnPath(storage: StorageWriter) {
  storage.removeItem(AUTH_RETURN_STORAGE_KEY);
}

export function hasSessionMarker(storage: StorageReader): boolean {
  return storage.getItem(AUTH_SESSION_MARKER_KEY) !== null;
}

export function markSession(storage: StorageWriter, expiresAt: string) {
  storage.setItem(AUTH_SESSION_MARKER_KEY, expiresAt);
}

export function clearSessionMarker(storage: StorageWriter) {
  storage.removeItem(AUTH_SESSION_MARKER_KEY);
}

export function safeAvatarUrl(candidate: string | null): string | undefined {
  if (!candidate) return undefined;
  try {
    const url = new URL(candidate);
    if (url.origin !== "https://avatars.githubusercontent.com" || url.username || url.password) {
      return undefined;
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

export function callbackFailure(code: unknown): AuthenticationFlowFailure | null {
  if (code === undefined) return null;
  if (typeof code !== "string") {
    return {
      title: "Sign-in response was invalid",
      description: "The registry could not safely process the sign-in response. Start again to continue.",
      retryable: true,
    };
  }

  switch (code) {
    case "oauth_access_denied":
      return {
        title: "GitHub sign-in was cancelled",
        description: "No account changes were made. You can try again when you are ready.",
        retryable: true,
      };
    case "oauth_state_invalid":
    case "oauth_callback_invalid":
      return {
        title: "Sign-in could not be verified",
        description: "The sign-in request expired or did not match this browser. Start a new sign-in attempt.",
        retryable: true,
      };
    case "oauth_authorization_failed":
      return {
        title: "GitHub sign-in failed",
        description: "GitHub could not authorize this sign-in attempt. Try again.",
        retryable: true,
      };
    case "oauth_provider_unavailable":
    case "authentication_unavailable":
      return {
        title: "Sign-in is temporarily unavailable",
        description: "The registry or GitHub could not complete sign-in. Try again shortly.",
        retryable: true,
      };
    case "account_conflict":
      return {
        title: "This GitHub account cannot be linked",
        description: "The GitHub identity conflicts with an existing registry account. The account was not changed.",
        retryable: false,
      };
    default:
      return {
        title: "Sign-in response was invalid",
        description: "The registry could not safely process the sign-in response. Start again to continue.",
        retryable: true,
      };
  }
}

export function userInitials(displayName: string | null, githubLogin: string): string {
  const source = displayName?.trim() || githubLogin;
  const words = source.split(/\s+/u).filter(Boolean);
  return (
    words
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "?"
  );
}
