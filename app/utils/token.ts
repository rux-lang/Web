import type { FormError } from "@nuxt/ui";
import type { ApiTokenExpiration, ApiTokenFormState, ApiTokenScope, ApiTokenStatus } from "~/types/token";

const dateTimeFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

const expirationDays: Partial<Record<ApiTokenExpiration, number>> = {
  "30_days": 30,
  "90_days": 90,
  "365_days": 365,
};

export const tokenScopeOptions: {
  label: string;
  description: string;
  value: ApiTokenScope;
}[] = [
  {
    label: "Publish",
    description: "Upload new immutable package versions.",
    value: "publish",
  },
  {
    label: "Yank",
    description: "Yank or restore existing package versions.",
    value: "yank",
  },
  {
    label: "Namespace",
    description: "Claim namespaces and manage namespace access.",
    value: "namespace",
  },
];

export const tokenExpirationOptions: {
  label: string;
  value: ApiTokenExpiration;
}[] = [
  {
    label: "90 days (recommended)",
    value: "90_days",
  },
  {
    label: "30 days",
    value: "30_days",
  },
  {
    label: "365 days",
    value: "365_days",
  },
  {
    label: "Custom date and time",
    value: "custom",
  },
  {
    label: "Never expires",
    value: "never",
  },
];

export function apiTokenFormErrors(state: ApiTokenFormState, now = new Date()): FormError[] {
  const errors: FormError[] = [];
  const displayName = state.display_name.trim();

  if (!displayName) {
    errors.push({ name: "display_name", message: "Enter a token name." });
  } else if (new TextEncoder().encode(displayName).length > 100) {
    errors.push({
      name: "display_name",
      message: "Use a name no longer than 100 UTF-8 bytes.",
    });
  }

  if (state.scopes.length === 0) {
    errors.push({ name: "scopes", message: "Select at least one scope." });
  } else if (state.scopes.length > 3 || new Set(state.scopes).size !== state.scopes.length) {
    errors.push({
      name: "scopes",
      message: "Select each supported scope at most once.",
    });
  }

  if (state.expiration === "custom") {
    const expiresAt = Date.parse(state.custom_expires_at);
    if (!state.custom_expires_at || !Number.isFinite(expiresAt)) {
      errors.push({
        name: "custom_expires_at",
        message: "Enter an expiration date and time.",
      });
    } else if (expiresAt <= now.getTime()) {
      errors.push({
        name: "custom_expires_at",
        message: "Choose a future expiration date and time.",
      });
    }
  }

  return errors;
}

export function apiTokenExpiration(
  state: Pick<ApiTokenFormState, "expiration" | "custom_expires_at">,
  now = new Date(),
): string | null {
  if (state.expiration === "never") return null;
  if (state.expiration === "custom") return new Date(state.custom_expires_at).toISOString();

  const days = expirationDays[state.expiration];
  if (days === undefined) throw new Error("Unsupported token expiration option");
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
}

export function apiTokenCustomExpirationMin(now = new Date()): string {
  const nextMinute = new Date(now.getTime() + 60_000);
  const local = new Date(nextMinute.getTime() - nextMinute.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function formatApiTokenTimestamp(value: string): string {
  return dateTimeFormatter.format(new Date(value));
}

export function apiTokenScopeLabel(scope: ApiTokenScope): string {
  return tokenScopeOptions.find((option) => option.value === scope)?.label ?? scope;
}

export function apiTokenStatusPresentation(status: ApiTokenStatus): {
  label: string;
  color: "success" | "warning" | "neutral";
} {
  switch (status) {
    case "active":
      return { label: "Active", color: "success" };
    case "expired":
      return { label: "Expired", color: "warning" };
    case "revoked":
      return { label: "Revoked", color: "neutral" };
  }
}
