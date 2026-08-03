import type { DataEnvelope } from "~/types/catalog";

export type NamespaceRole = "owner" | "maintainer";

export interface NamespaceUser {
  github_login: string;
  display_name: string | null;
  avatar_url: string | null;
}

export interface NamespaceDocument {
  name: string;
  role: NamespaceRole;
  created_at: string;
  updated_at: string;
}

export interface NamespaceMember {
  user: NamespaceUser;
  role: NamespaceRole;
  created_at: string;
}

export interface NamespaceInvitation {
  namespace: string;
  invited_user: NamespaceUser;
  invited_by: NamespaceUser | null;
  role: NamespaceRole;
  created_at: string;
  expires_at: string;
}

export type NamespaceListResponse = DataEnvelope<NamespaceDocument[]>;
export type NamespaceResponse = DataEnvelope<NamespaceDocument>;
export type NamespaceMembersResponse = DataEnvelope<NamespaceMember[]>;
export type NamespaceMemberResponse = DataEnvelope<NamespaceMember>;
export type NamespaceInvitationsResponse = DataEnvelope<NamespaceInvitation[]>;
export type NamespaceInvitationResponse = DataEnvelope<NamespaceInvitation>;
