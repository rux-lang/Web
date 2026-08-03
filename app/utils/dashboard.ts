import type { DashboardActivity, DashboardRole, DashboardUser } from "~/types/dashboard";

const dateTimeFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

export function dashboardRoleLabel(role: DashboardRole): string {
  return role === "owner" ? "Owner" : "Maintainer";
}

export function dashboardUserLabel(user: DashboardUser | null): string {
  return user?.display_name?.trim() || user?.github_login || "Former registry user";
}

export function formatDashboardTimestamp(value: string): string {
  return dateTimeFormatter.format(new Date(value));
}

export function dashboardActivityText(activity: DashboardActivity): string {
  const actor = dashboardUserLabel(activity.actor);
  const target = dashboardUserLabel(activity.target_user);
  const role = activity.role ? dashboardRoleLabel(activity.role).toLowerCase() : "member";
  const previousRole = activity.previous_role ? dashboardRoleLabel(activity.previous_role).toLowerCase() : "member";
  const version = activity.version ? ` version ${activity.version}` : "";

  switch (activity.kind) {
    case "namespace_created":
      return `${actor} created the namespace.`;
    case "namespace_member_role_changed":
      return `${actor} changed ${target} from ${previousRole} to ${role}.`;
    case "namespace_member_removed":
      return `${actor} removed ${target}, previously a ${previousRole}.`;
    case "namespace_invitation_created":
      return `${actor} invited ${target} as a ${role}.`;
    case "namespace_invitation_accepted":
      return `${actor} accepted an invitation as a ${role}.`;
    case "namespace_invitation_revoked":
      return `${actor} removed the invitation for ${target}.`;
    case "package_version_published":
      return `${actor} published${version}.`;
    case "package_version_yanked":
      return `${actor} yanked${version}.`;
    case "package_version_unyanked":
      return `${actor} restored${version}.`;
  }
}
