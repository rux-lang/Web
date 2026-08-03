import type { FormError } from "@nuxt/ui";
import type { NamespaceRole, NamespaceUser } from "~/types/namespace";
import { normalizedIdentity } from "~/utils/catalog";

export const namespaceRoleOptions: { label: string; value: NamespaceRole }[] = [
  {
    label: "Owner",
    value: "owner",
  },
  {
    label: "Maintainer",
    value: "maintainer",
  },
];

const identityPattern = /^[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*$/;
const githubLoginPattern = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?!-)){0,37}[A-Za-z0-9]$|^[A-Za-z0-9]$/;

export function namespaceManagementPath(namespace: string): string {
  return `/packages/-/dashboard/namespaces/${encodeURIComponent(normalizedIdentity(namespace))}`;
}

export function namespaceApiPath(namespace: string): string {
  return `/v1/namespaces/${encodeURIComponent(normalizedIdentity(namespace))}`;
}

export function namespaceNameErrors(state: { name: string }): FormError[] {
  const name = state.name.trim();
  if (!name) return [{ name: "name", message: "Enter a namespace name." }];
  if (name.length > 64 || !identityPattern.test(name)) {
    return [
      {
        name: "name",
        message: "Use 1–64 ASCII letters or digits separated by single hyphens or underscores.",
      },
    ];
  }
  return [];
}

export function invitationErrors(state: { github_login: string }): FormError[] {
  const githubLogin = state.github_login.trim();
  if (!githubLogin) return [{ name: "github_login", message: "Enter a GitHub login." }];
  if (githubLogin.length > 39 || !githubLoginPattern.test(githubLogin)) {
    return [
      {
        name: "github_login",
        message: "Use a valid GitHub login with letters, digits, or single hyphens.",
      },
    ];
  }
  return [];
}

export function namespaceUserLabel(user: NamespaceUser | null): string {
  return user?.display_name?.trim() || user?.github_login || "Former registry user";
}
