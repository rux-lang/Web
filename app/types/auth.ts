import type { ApiFailure } from "~/types/api";

export interface SessionUser {
  github_login: string;
  display_name: string | null;
  avatar_url: string | null;
}

export interface SessionDocument {
  user: SessionUser;
  expires_at: string;
  csrf_token: string;
}

export type AuthenticationStatus = "loading" | "anonymous" | "authenticated" | "expired" | "unavailable";

export interface CurrentUserState {
  status: AuthenticationStatus;
  session: SessionDocument | null;
  failure: ApiFailure | null;
  signing_out: boolean;
}

export interface AuthenticationFlowFailure {
  title: string;
  description: string;
  retryable: boolean;
}
