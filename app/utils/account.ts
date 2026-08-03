import type { FormError } from "@nuxt/ui";
import type { DeleteAccountFormState } from "~/types/account";

export function deleteAccountFormErrors(state: DeleteAccountFormState, expectedLogin: string): FormError[] {
  if (!state.github_login) {
    return [{ name: "github_login", message: "Enter your current GitHub login." }];
  }
  if (state.github_login !== expectedLogin) {
    return [
      {
        name: "github_login",
        message: `Enter ${expectedLogin} exactly, including capitalization.`,
      },
    ];
  }
  return [];
}

export function formatSessionExpiry(value: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}
