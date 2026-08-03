export type ApiTokenScope = "publish" | "yank" | "namespace";

export type ApiTokenStatus = "active" | "expired" | "revoked";

export type ApiTokenExpiration = "30_days" | "90_days" | "365_days" | "custom" | "never";

export interface ApiTokenDocument {
  display_name: string;
  token_prefix: string;
  scopes: ApiTokenScope[];
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  status: ApiTokenStatus;
}

export interface IssuedApiTokenDocument extends ApiTokenDocument {
  credential: string;
}

export interface ApiTokenListResponse {
  data: ApiTokenDocument[];
}

export interface IssuedApiTokenResponse {
  data: IssuedApiTokenDocument;
}

export interface ApiTokenFormState {
  display_name: string;
  scopes: ApiTokenScope[];
  expiration: ApiTokenExpiration;
  custom_expires_at: string;
}
