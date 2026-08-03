import { flushPromises, shallowMount } from "@vue/test-utils";
import { ref } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { DashboardActivity, DashboardDocument } from "../app/types/dashboard";
import {
  dashboardActivityText,
  dashboardRoleLabel,
  dashboardUserLabel,
  formatDashboardTimestamp,
} from "../app/utils/dashboard";

afterEach(() => vi.unstubAllGlobals());

describe("dashboard formatting", () => {
  const activity: DashboardActivity = {
    kind: "namespace_member_role_changed",
    actor: {
      github_login: "owner",
      display_name: "Owner Name",
      avatar_url: null,
    },
    namespace: "Rux_Tools",
    package: null,
    version: null,
    target_user: {
      github_login: "member",
      display_name: null,
      avatar_url: null,
    },
    previous_role: "maintainer",
    role: "owner",
    occurred_at: "2026-08-02T12:00:00Z",
    package_url: null,
    version_url: null,
  };

  it("creates safe human-readable labels", () => {
    expect(dashboardActivityText(activity)).toBe("Owner Name changed member from maintainer to owner.");
    expect(dashboardUserLabel(null)).toBe("Former registry user");
    expect(dashboardRoleLabel("maintainer")).toBe("Maintainer");
    expect(formatDashboardTimestamp(activity.occurred_at)).toContain("Aug 2, 2026");
  });
});

describe("authenticated dashboard route", () => {
  it("redirects ended sessions while preserving the dashboard return path", async () => {
    const navigate = vi.fn();
    vi.stubGlobal("defineNuxtRouteMiddleware", (handler: unknown) => handler);
    vi.stubGlobal("navigateTo", navigate);
    vi.stubGlobal("useCurrentUser", () => ({
      status: ref("expired"),
      initialize: vi.fn(),
    }));
    const middleware = (await import("../app/middleware/authenticated")).default;

    await middleware({ fullPath: "/packages/-/dashboard" } as never, {} as never);

    expect(navigate).toHaveBeenCalledWith({
      path: "/packages/-/auth/sign-in",
      query: { return_to: "/packages/-/dashboard" },
    });
  });

  it("renders the owner snapshot and complete empty states", async () => {
    const document: DashboardDocument = {
      counts: { namespaces: 0, packages: 0, invitations: 0 },
      namespaces: [],
      packages: [],
      invitations: [],
      activity: [],
      downloads: {
        window_days: 30,
        total_30d: 0,
        total_all_time: 0,
        top_packages: [],
      },
    };
    const sessionGet = vi.fn().mockResolvedValue({ data: document });
    vi.stubGlobal("definePageMeta", vi.fn());
    vi.stubGlobal("useSeoMeta", vi.fn());
    vi.stubGlobal("useRegistryApi", () => ({ sessionGet }));
    vi.stubGlobal("useToast", () => ({ add: vi.fn() }));
    vi.stubGlobal("useCurrentUser", () => ({
      status: ref("authenticated"),
      session: ref({ csrf_token: "csrf-value" }),
      user: ref({ github_login: "owner" }),
      failure: ref(null),
      refresh: vi.fn(),
    }));
    const DashboardPage = (await import("../app/pages/packages/-/dashboard/index.vue")).default;
    const wrapper = shallowMount(DashboardPage, {
      global: {
        stubs: {
          UContainer: { template: "<main><slot /></main>" },
          UPageHeader: true,
          AppLoadingState: true,
          ApiProblemAlert: true,
          UCard: {
            template: '<section><slot /><slot name="header" /><slot name="footer" /></section>',
          },
          UEmpty: {
            props: ["title", "description"],
            template: "<section><h3>{{ title }}</h3><p>{{ description }}</p></section>",
          },
          UIcon: true,
          USeparator: true,
          UBadge: true,
          UPageCard: true,
          UButton: true,
          ClaimNamespaceModal: true,
          ConfirmActionModal: true,
          NuxtLink: true,
        },
      },
    });

    await flushPromises();

    expect(sessionGet).toHaveBeenCalledWith("/v1/dashboard");
    expect(wrapper.text()).toContain("No namespace memberships");
    expect(wrapper.text()).toContain("No pending invitations");
    expect(wrapper.text()).toContain("No published packages");
    expect(wrapper.text()).toContain("No recent activity");
    expect(wrapper.text()).toContain("No downloads recorded in this period");
  });

  it("accepts an incoming invitation with CSRF protection and refreshes the snapshot", async () => {
    const invitation = {
      namespace: "Rux_Labs",
      invited_by: {
        github_login: "owner",
        display_name: null,
        avatar_url: null,
      },
      role: "maintainer" as const,
      created_at: "2026-08-02T12:00:00Z",
      expires_at: "2026-08-09T12:00:00Z",
    };
    const document: DashboardDocument = {
      counts: { namespaces: 0, packages: 0, invitations: 1 },
      namespaces: [],
      packages: [],
      invitations: [invitation],
      activity: [],
      downloads: {
        window_days: 30,
        total_30d: 0,
        total_all_time: 0,
        top_packages: [],
      },
    };
    const refreshed = {
      ...document,
      counts: { namespaces: 1, packages: 0, invitations: 0 },
      invitations: [],
    };
    const sessionGet = vi.fn().mockResolvedValueOnce({ data: document }).mockResolvedValueOnce({ data: refreshed });
    const sessionMutation = vi.fn().mockResolvedValue({ data: {} });
    vi.stubGlobal("definePageMeta", vi.fn());
    vi.stubGlobal("useSeoMeta", vi.fn());
    vi.stubGlobal("useRegistryApi", () => ({ sessionGet, sessionMutation }));
    vi.stubGlobal("useToast", () => ({ add: vi.fn() }));
    vi.stubGlobal("useCurrentUser", () => ({
      status: ref("authenticated"),
      session: ref({ csrf_token: "csrf-value" }),
      user: ref({ github_login: "invitee" }),
      failure: ref(null),
      refresh: vi.fn(),
    }));
    const DashboardPage = (await import("../app/pages/packages/-/dashboard/index.vue")).default;
    const wrapper = shallowMount(DashboardPage, {
      global: {
        stubs: {
          UContainer: { template: "<main><slot /></main>" },
          UPageHeader: { template: '<header><slot name="links" /></header>' },
          AppLoadingState: true,
          ApiProblemAlert: true,
          UCard: { template: "<section><slot /></section>" },
          UEmpty: true,
          UIcon: true,
          USeparator: true,
          UBadge: { template: "<span><slot /></span>" },
          UPageCard: true,
          UButton: {
            props: ["label", "disabled", "ariaLabel"],
            emits: ["click"],
            template:
              '<button :disabled="disabled" :aria-label="ariaLabel" @click="$emit(\'click\')">{{ label }}</button>',
          },
          ClaimNamespaceModal: true,
          ConfirmActionModal: true,
          NuxtLink: true,
        },
      },
    });

    await flushPromises();
    await wrapper.get('button[aria-label="Accept invitation to Rux_Labs"]').trigger("click");
    await flushPromises();

    expect(sessionMutation).toHaveBeenCalledWith("/v1/invitations/rux-labs/accept", "POST", "csrf-value");
    expect(sessionGet).toHaveBeenCalledTimes(2);
  });
});
