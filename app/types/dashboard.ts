import type { DataEnvelope } from "~/types/catalog";
import type { NamespaceRole, NamespaceUser } from "~/types/namespace";

export type DashboardRole = NamespaceRole;
export type DashboardUser = NamespaceUser;

export interface DashboardNamespace {
  namespace: string;
  role: DashboardRole;
  package_count: number;
}

export interface DashboardPackage {
  namespace: string;
  package: string;
  version: string;
  published_at: string;
  yanked: boolean;
  version_count: number;
  package_url: string;
  version_url: string;
}

export interface DashboardInvitation {
  namespace: string;
  invited_by: DashboardUser | null;
  role: DashboardRole;
  created_at: string;
  expires_at: string;
}

export type DashboardActivityKind =
  | "namespace_created"
  | "namespace_member_role_changed"
  | "namespace_member_removed"
  | "namespace_invitation_created"
  | "namespace_invitation_accepted"
  | "namespace_invitation_revoked"
  | "package_version_published"
  | "package_version_yanked"
  | "package_version_unyanked";

export interface DashboardActivity {
  kind: DashboardActivityKind;
  actor: DashboardUser | null;
  namespace: string;
  package: string | null;
  version: string | null;
  target_user: DashboardUser | null;
  previous_role: DashboardRole | null;
  role: DashboardRole | null;
  occurred_at: string;
  package_url: string | null;
  version_url: string | null;
}

export interface DashboardDownloadLeader {
  namespace: string;
  package: string;
  downloads_30d: number;
  package_url: string;
}

export interface DashboardDocument {
  counts: {
    namespaces: number;
    packages: number;
    invitations: number;
  };
  namespaces: DashboardNamespace[];
  packages: DashboardPackage[];
  invitations: DashboardInvitation[];
  activity: DashboardActivity[];
  downloads: {
    window_days: number;
    total_30d: number;
    total_all_time: number;
    top_packages: DashboardDownloadLeader[];
  };
}

export type DashboardResponse = DataEnvelope<DashboardDocument>;
