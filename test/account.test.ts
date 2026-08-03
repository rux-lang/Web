import { flushPromises, shallowMount } from "@vue/test-utils";
import { ref } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import DeleteAccountModal from "../app/components/DeleteAccountModal.vue";
import { deleteAccountFormErrors, formatSessionExpiry } from "../app/utils/account";

afterEach(() => {
  vi.unstubAllGlobals();
});

const buttonStub = {
  props: ["label", "type", "form", "disabled"],
  emits: ["click"],
  template:
    '<button :type="type" :form="form" :disabled="disabled" @click="$emit(\'click\')">{{ label }}<slot /></button>',
};

const modalStubs = {
  UModal: {
    props: ["open", "title"],
    template: '<section v-if="open"><h2>{{ title }}</h2><slot name="body" /><slot name="footer" /></section>',
  },
  UForm: {
    props: ["state"],
    emits: ["submit"],
    template: "<form @submit.prevent=\"$emit('submit', { data: state })\"><slot /></form>",
  },
  UFormField: {
    props: ["label", "error"],
    template: "<label>{{ label }}<slot /><span>{{ error }}</span></label>",
  },
  UInput: {
    props: ["modelValue"],
    emits: ["update:modelValue"],
    template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)">',
  },
  UAlert: {
    props: ["title"],
    template: '<section><h3>{{ title }}</h3><slot name="description" /></section>',
  },
  UButton: buttonStub,
  ApiProblemAlert: {
    props: ["failure"],
    template: '<section role="alert">{{ failure.title }} {{ failure.detail }}</section>',
  },
};

function apiProblem(status: number, code: string, detail: string) {
  return {
    response: {
      status,
      headers: new Headers({ "content-type": "application/problem+json" }),
      _data: {
        type: `https://api.rux-lang.dev/problems/${code}`,
        title: code === "last_owner_required" ? "Every namespace must retain at least one owner" : "Invalid request",
        status,
        code,
        detail,
      },
    },
  };
}

describe("account lifecycle contracts", () => {
  it("requires the exact case-sensitive GitHub login and formats expiry in UTC", () => {
    expect(deleteAccountFormErrors({ github_login: "" }, "Octocat")[0]?.name).toBe("github_login");
    expect(deleteAccountFormErrors({ github_login: "octocat" }, "Octocat")[0]?.message).toContain("exactly");
    expect(deleteAccountFormErrors({ github_login: "Octocat" }, "Octocat")).toEqual([]);
    expect(formatSessionExpiry("2026-08-02T12:00:00Z")).toContain("Aug 2, 2026");
  });

  it("submits the exact confirmation with CSRF and clears local authentication after success", async () => {
    const sessionMutation = vi.fn().mockResolvedValue(undefined);
    const completeAccountDeletion = vi.fn();
    vi.stubGlobal("useRegistryApi", () => ({ sessionMutation }));
    vi.stubGlobal("useCurrentUser", () => ({
      session: ref({ csrf_token: "csrf-value" }),
      completeAccountDeletion,
    }));

    const wrapper = shallowMount(DeleteAccountModal, {
      props: { open: true, githubLogin: "Octocat" },
      global: { stubs: modalStubs },
    });
    await wrapper.get("input").setValue("Octocat");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(sessionMutation).toHaveBeenCalledWith("/v1/account", "DELETE", "csrf-value", {
      github_login: "Octocat",
    });
    expect(completeAccountDeletion).toHaveBeenCalledOnce();
    expect(wrapper.emitted("deleted")).toHaveLength(1);
    expect(wrapper.emitted("update:open")).toContainEqual([false]);
  });

  it("keeps final-owner conflicts visible without clearing the session", async () => {
    const sessionMutation = vi
      .fn()
      .mockRejectedValue(
        apiProblem(409, "last_owner_required", "Add or promote another owner before deleting your account."),
      );
    const completeAccountDeletion = vi.fn();
    vi.stubGlobal("useRegistryApi", () => ({ sessionMutation }));
    vi.stubGlobal("useCurrentUser", () => ({
      session: ref({ csrf_token: "csrf-value" }),
      completeAccountDeletion,
    }));

    const wrapper = shallowMount(DeleteAccountModal, {
      props: { open: true, githubLogin: "Octocat" },
      global: { stubs: modalStubs },
    });
    await wrapper.get("input").setValue("Octocat");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.text()).toContain("Every namespace must retain at least one owner");
    expect(wrapper.text()).toContain("Add or promote another owner");
    expect(completeAccountDeletion).not.toHaveBeenCalled();
    expect(wrapper.emitted("deleted")).toBeUndefined();
  });

  it("renders the authenticated settings overview and opens the danger-zone confirmation", async () => {
    vi.stubGlobal("definePageMeta", vi.fn());
    vi.stubGlobal("useSeoMeta", vi.fn());
    vi.stubGlobal("useToast", () => ({ add: vi.fn() }));
    vi.stubGlobal("useCurrentUser", () => ({
      status: ref("authenticated"),
      user: ref({
        github_login: "Octocat",
        display_name: "The Octocat",
        avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
      }),
      session: ref({
        expires_at: "2026-08-03T12:00:00Z",
        csrf_token: "csrf-value",
      }),
      failure: ref(null),
      refresh: vi.fn(),
    }));
    const SettingsPage = (await import("../app/pages/packages/-/dashboard/settings.vue")).default;
    const wrapper = shallowMount(SettingsPage, {
      global: {
        stubs: {
          UContainer: { template: "<main><slot /></main>" },
          UPageHeader: {
            props: ["title"],
            template: '<header><h1>{{ title }}</h1><slot name="links" /></header>',
          },
          ApiProblemAlert: true,
          UCard: { template: "<section><slot /></section>" },
          UAvatar: true,
          UBadge: { template: "<span><slot /></span>" },
          USeparator: true,
          UPageCard: {
            props: ["title", "to"],
            template: '<a :href="to">{{ title }}</a>',
          },
          UButton: buttonStub,
          DeleteAccountModal: {
            props: ["open", "githubLogin"],
            template: '<aside v-if="open">Confirm deletion for {{ githubLogin }}</aside>',
          },
        },
      },
    });

    expect(wrapper.text()).toContain("Account settings");
    expect(wrapper.text()).toContain("The Octocat");
    expect(wrapper.text()).toContain("Managed by GitHub");
    expect(wrapper.find('a[href="/packages/-/dashboard/tokens"]').exists()).toBe(true);

    const deleteButton = wrapper.findAll("button").find((button) => button.text().includes("Delete account"));
    await deleteButton?.trigger("click");
    expect(wrapper.text()).toContain("Confirm deletion for Octocat");
  });
});
