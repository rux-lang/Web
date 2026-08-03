import { flushPromises, shallowMount } from "@vue/test-utils";
import { ref } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import ClaimNamespaceModal from "../app/components/ClaimNamespaceModal.vue";
import type { NamespaceDocument, NamespaceMember } from "../app/types/namespace";
import { invitationErrors, namespaceManagementPath, namespaceNameErrors } from "../app/utils/namespace";

afterEach(() => vi.unstubAllGlobals());

const buttonStub = {
  props: ["label", "type", "form", "disabled", "ariaLabel"],
  emits: ["click"],
  template:
    '<button :type="type" :form="form" :disabled="disabled" :aria-label="ariaLabel" @click="$emit(\'click\')">{{ label }}</button>',
};

const managementStubs = {
  UContainer: { template: "<main><slot /></main>" },
  UPageHeader: {
    props: ["title"],
    template: '<header><h1>{{ title }}</h1><slot name="links" /></header>',
  },
  AppLoadingState: true,
  ApiProblemAlert: true,
  UAlert: {
    props: ["title", "description"],
    template: "<section><h2>{{ title }}</h2><p>{{ description }}</p></section>",
  },
  UBadge: { template: "<span><slot /></span>" },
  UCard: { template: "<section><slot /></section>" },
  UEmpty: true,
  UAvatar: true,
  USelect: {
    props: ["modelValue", "disabled", "ariaLabel"],
    emits: ["update:modelValue"],
    template:
      '<select :disabled="disabled" :aria-label="ariaLabel"><option :value="modelValue">{{ modelValue }}</option></select>',
  },
  UButton: buttonStub,
  InviteNamespaceMemberModal: true,
  ConfirmActionModal: {
    props: ["open", "title", "confirmLabel"],
    emits: ["confirm", "update:open"],
    template:
      '<section v-if="open"><h2>{{ title }}</h2><button data-confirm @click="$emit(\'confirm\')">{{ confirmLabel }}</button></section>',
  },
};

function namespaceDocument(role: "owner" | "maintainer"): NamespaceDocument {
  return {
    name: "Rux_Tools",
    role,
    created_at: "2026-08-01T12:00:00Z",
    updated_at: "2026-08-01T12:00:00Z",
  };
}

function namespaceMember(login: string, role: "owner" | "maintainer"): NamespaceMember {
  return {
    user: { github_login: login, display_name: login, avatar_url: null },
    role,
    created_at: "2026-08-01T12:00:00Z",
  };
}

function stubManagementGlobals(role: "owner" | "maintainer", members: NamespaceMember[], sessionMutation = vi.fn()) {
  const sessionGet = vi.fn(async (path: string) => {
    if (path === "/v1/namespaces") return { data: [namespaceDocument(role)] };
    if (path.endsWith("/members")) return { data: members };
    if (path.endsWith("/invitations")) return { data: [] };
    throw new Error(`Unexpected path: ${path}`);
  });
  vi.stubGlobal("definePageMeta", vi.fn());
  vi.stubGlobal("useSeoMeta", vi.fn());
  vi.stubGlobal("useRoute", () => ({
    params: { namespace: "rux-tools" },
    fullPath: "/packages/-/dashboard/namespaces/rux-tools",
  }));
  vi.stubGlobal("useRegistryApi", () => ({ sessionGet, sessionMutation }));
  vi.stubGlobal("useToast", () => ({ add: vi.fn() }));
  vi.stubGlobal("useCurrentUser", () => ({
    status: ref("authenticated"),
    session: ref({ csrf_token: "csrf-value" }),
    user: ref({ github_login: role === "owner" ? "owner" : "maintainer" }),
    failure: ref(null),
    refresh: vi.fn(),
  }));
  vi.stubGlobal("navigateTo", vi.fn());
  return { sessionGet, sessionMutation };
}

describe("namespace input contracts", () => {
  it("normalizes management paths and mirrors server validation", () => {
    expect(namespaceManagementPath("Rux_Tools")).toBe("/packages/-/dashboard/namespaces/rux-tools");
    expect(namespaceNameErrors({ name: " Rux_Tools " })).toEqual([]);
    expect(namespaceNameErrors({ name: "rux--tools" })[0]?.name).toBe("name");
    expect(invitationErrors({ github_login: "octo-cat" })).toEqual([]);
    expect(invitationErrors({ github_login: "octo--cat" })[0]?.name).toBe("github_login");
  });
});

describe("claim namespace modal", () => {
  it("submits a trimmed name with the current CSRF token", async () => {
    const sessionMutation = vi.fn().mockResolvedValue({ data: namespaceDocument("owner") });
    vi.stubGlobal("useRegistryApi", () => ({ sessionMutation }));
    vi.stubGlobal("useRoute", () => ({ fullPath: "/packages/-/dashboard" }));
    vi.stubGlobal("navigateTo", vi.fn());
    vi.stubGlobal("useCurrentUser", () => ({
      session: ref({ csrf_token: "csrf-value" }),
      refresh: vi.fn(),
    }));

    const wrapper = shallowMount(ClaimNamespaceModal, {
      props: { open: true },
      global: {
        stubs: {
          UModal: {
            props: ["open", "title"],
            template: '<section v-if="open"><h2>{{ title }}</h2><slot name="body" /><slot name="footer" /></section>',
          },
          UForm: {
            props: ["state"],
            emits: ["submit"],
            template: "<form @submit.prevent=\"$emit('submit', { data: state })\"><slot /></form>",
          },
          UFormField: { template: "<label><slot /></label>" },
          UInput: {
            props: ["modelValue"],
            emits: ["update:modelValue"],
            template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)">',
          },
          UButton: buttonStub,
          ApiProblemAlert: true,
        },
      },
    });

    await wrapper.get("input").setValue(" Rux_Tools ");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(sessionMutation).toHaveBeenCalledWith("/v1/namespaces", "POST", "csrf-value", {
      name: "Rux_Tools",
    });
    expect(wrapper.emitted("claimed")).toEqual([["Rux_Tools"]]);
  });
});

describe("namespace management page", () => {
  it("loads owner-only invitations and enables owner administration", async () => {
    const members = [namespaceMember("owner", "owner"), namespaceMember("member", "maintainer")];
    const { sessionGet } = stubManagementGlobals("owner", members);
    const NamespacePage = (await import("../app/pages/packages/-/dashboard/namespaces/[namespace].vue")).default;
    const wrapper = shallowMount(NamespacePage, {
      global: { stubs: managementStubs },
    });

    await flushPromises();

    expect(sessionGet).toHaveBeenCalledWith("/v1/namespaces");
    expect(sessionGet).toHaveBeenCalledWith("/v1/namespaces/rux-tools/members");
    expect(sessionGet).toHaveBeenCalledWith("/v1/namespaces/rux-tools/invitations");
    expect(wrapper.get('button[aria-label="Remove member from Rux_Tools"]').attributes("disabled")).toBeUndefined();
  });

  it("keeps owner controls visible but disabled for maintainers while allowing self-leave", async () => {
    const members = [namespaceMember("owner", "owner"), namespaceMember("maintainer", "maintainer")];
    const { sessionGet } = stubManagementGlobals("maintainer", members);
    const NamespacePage = (await import("../app/pages/packages/-/dashboard/namespaces/[namespace].vue")).default;
    const wrapper = shallowMount(NamespacePage, {
      global: { stubs: managementStubs },
    });

    await flushPromises();

    expect(sessionGet.mock.calls.some(([path]) => String(path).endsWith("/invitations"))).toBe(false);
    expect(wrapper.text()).toContain("Owner access required");
    expect(wrapper.get('button[aria-label="Remove owner from Rux_Tools"]').attributes("disabled")).toBeDefined();
    expect(wrapper.get('button[aria-label="Leave maintainer from Rux_Tools"]').attributes("disabled")).toBeUndefined();
  });

  it("confirms and removes another member with the session contract", async () => {
    const members = [namespaceMember("owner", "owner"), namespaceMember("member", "maintainer")];
    const sessionMutation = vi.fn().mockResolvedValue(undefined);
    stubManagementGlobals("owner", members, sessionMutation);
    const NamespacePage = (await import("../app/pages/packages/-/dashboard/namespaces/[namespace].vue")).default;
    const wrapper = shallowMount(NamespacePage, {
      global: { stubs: managementStubs },
    });
    await flushPromises();

    await wrapper.get('button[aria-label="Remove member from Rux_Tools"]').trigger("click");
    await wrapper.get("[data-confirm]").trigger("click");
    await flushPromises();

    expect(sessionMutation).toHaveBeenCalledWith("/v1/namespaces/rux-tools/members/member", "DELETE", "csrf-value");
    expect(wrapper.text()).not.toContain("@member");
  });
});
