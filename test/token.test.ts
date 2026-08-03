import { flushPromises, shallowMount } from "@vue/test-utils";
import { ref } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import CreateApiTokenModal from "../app/components/CreateApiTokenModal.vue";
import type { ApiTokenDocument, ApiTokenFormState } from "../app/types/token";
import {
  apiTokenExpiration,
  apiTokenFormErrors,
  apiTokenScopeLabel,
  apiTokenStatusPresentation,
  formatApiTokenTimestamp,
} from "../app/utils/token";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const buttonStub = {
  props: ["label", "type", "form", "disabled", "ariaLabel"],
  emits: ["click"],
  template:
    '<button :type="type" :form="form" :disabled="disabled" :aria-label="ariaLabel" @click="$emit(\'click\')">{{ label }}<slot /></button>',
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
  UFormField: { template: "<label><slot /></label>" },
  UInput: {
    props: ["modelValue", "type"],
    emits: ["update:modelValue"],
    template: '<input :type="type" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)">',
  },
  USelect: true,
  UCheckboxGroup: {
    props: ["modelValue"],
    emits: ["update:modelValue"],
    template:
      '<button data-scope="publish" type="button" @click="$emit(\'update:modelValue\', [...modelValue, \'publish\'])">Publish</button>',
  },
  UAlert: {
    props: ["title", "description"],
    template: "<section><h3>{{ title }}</h3><p>{{ description }}</p></section>",
  },
  UButton: buttonStub,
  ApiProblemAlert: true,
};

function token(status: ApiTokenDocument["status"] = "active"): ApiTokenDocument {
  return {
    display_name: `${status} workflow`,
    token_prefix: `rux_pat_${status}`,
    scopes: ["publish"],
    created_at: "2026-08-02T12:00:00Z",
    last_used_at: status === "active" ? null : "2026-08-03T12:00:00Z",
    expires_at: status === "expired" ? "2026-08-04T12:00:00Z" : null,
    revoked_at: status === "revoked" ? "2026-08-05T12:00:00Z" : null,
    status,
  };
}

describe("API token contracts", () => {
  const validState: ApiTokenFormState = {
    display_name: "release workflow",
    scopes: ["publish"],
    expiration: "90_days",
    custom_expires_at: "",
  };

  it("validates UTF-8 names, explicit scopes, and future custom expiration", () => {
    expect(apiTokenFormErrors(validState)).toEqual([]);
    expect(apiTokenFormErrors({ ...validState, display_name: "é".repeat(51) })[0]?.name).toBe("display_name");
    expect(apiTokenFormErrors({ ...validState, scopes: [] })[0]?.name).toBe("scopes");
    expect(
      apiTokenFormErrors(
        {
          ...validState,
          expiration: "custom",
          custom_expires_at: "2026-08-01T10:00",
        },
        new Date("2026-08-02T12:00:00Z"),
      )[0]?.name,
    ).toBe("custom_expires_at");
  });

  it("turns presets and local custom values into the API expiration contract", () => {
    const now = new Date("2026-08-02T12:00:00Z");
    expect(apiTokenExpiration(validState, now)).toBe("2026-10-31T12:00:00.000Z");
    expect(apiTokenExpiration({ expiration: "never", custom_expires_at: "" }, now)).toBeNull();

    const custom = "2026-12-01T09:30";
    expect(apiTokenExpiration({ expiration: "custom", custom_expires_at: custom }, now)).toBe(
      new Date(custom).toISOString(),
    );
  });

  it("formats safe labels and lifecycle status without relying on color alone", () => {
    expect(apiTokenScopeLabel("namespace")).toBe("Namespace");
    expect(apiTokenStatusPresentation("expired")).toEqual({
      label: "Expired",
      color: "warning",
    });
    expect(formatApiTokenTimestamp("2026-08-02T12:00:00Z")).toContain("Aug 2, 2026");
  });
});

describe("create API token modal", () => {
  it("submits the scoped token, isolates the one-time credential, and copies it", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-02T12:00:00Z"));
    const issued = {
      ...token(),
      credential: "rux_pat_complete-secret",
    };
    const sessionMutation = vi.fn().mockResolvedValue({ data: issued });
    const add = vi.fn();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("useRegistryApi", () => ({ sessionMutation }));
    vi.stubGlobal("useCurrentUser", () => ({
      session: ref({ csrf_token: "csrf-value" }),
    }));
    vi.stubGlobal("useToast", () => ({ add }));
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    const wrapper = shallowMount(CreateApiTokenModal, {
      props: { open: true },
      global: { stubs: modalStubs },
    });

    await wrapper.get("input").setValue(" active workflow ");
    await wrapper.get('[data-scope="publish"]').trigger("click");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(sessionMutation).toHaveBeenCalledWith("/v1/tokens", "POST", "csrf-value", {
      display_name: "active workflow",
      scopes: ["publish"],
      expires_at: "2026-10-31T12:00:00.000Z",
    });
    expect(wrapper.text()).toContain("rux_pat_complete-secret");
    expect(wrapper.emitted("created")?.[0]?.[0]).toEqual(token());
    expect(wrapper.emitted("created")?.[0]?.[0]).not.toHaveProperty("credential");

    await wrapper.get('button[aria-label="Copy API token"]').trigger("click");
    await flushPromises();
    expect(writeText).toHaveBeenCalledWith("rux_pat_complete-secret");
    expect(wrapper.text()).toContain("Copied to the clipboard");

    const saved = wrapper.findAll("button").find((item) => item.text().includes("I've saved this token"));
    expect(saved).toBeDefined();
    await saved?.trigger("click");
    expect(wrapper.text()).not.toContain("rux_pat_complete-secret");
    expect(wrapper.emitted("update:open")).toContainEqual([false]);
  });

  it("keeps the credential selectable when clipboard access fails", async () => {
    const sessionMutation = vi.fn().mockResolvedValue({
      data: { ...token(), credential: "rux_pat_manual-secret" },
    });
    vi.stubGlobal("useRegistryApi", () => ({ sessionMutation }));
    vi.stubGlobal("useCurrentUser", () => ({
      session: ref({ csrf_token: "csrf-value" }),
    }));
    vi.stubGlobal("useToast", () => ({ add: vi.fn() }));
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });

    const wrapper = shallowMount(CreateApiTokenModal, {
      props: { open: true },
      global: { stubs: modalStubs },
    });
    await wrapper.get("input").setValue("active workflow");
    await wrapper.get('[data-scope="publish"]').trigger("click");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    await wrapper.get('button[aria-label="Copy API token"]').trigger("click");
    await flushPromises();

    expect(wrapper.text()).toContain("rux_pat_manual-secret");
    expect(wrapper.text()).toContain("Clipboard access was blocked");
  });
});

describe("API token history page", () => {
  it("lists lifecycle history and revokes only an active token with CSRF protection", async () => {
    const records = [token("active"), token("expired"), token("revoked")];
    const sessionGet = vi.fn().mockResolvedValue({ data: records });
    const sessionMutation = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("definePageMeta", vi.fn());
    vi.stubGlobal("useSeoMeta", vi.fn());
    vi.stubGlobal("useRegistryApi", () => ({ sessionGet, sessionMutation }));
    vi.stubGlobal("useToast", () => ({ add: vi.fn() }));
    vi.stubGlobal("useCurrentUser", () => ({
      status: ref("authenticated"),
      session: ref({ csrf_token: "csrf-value" }),
      failure: ref(null),
      refresh: vi.fn(),
    }));
    const TokenPage = (await import("../app/pages/packages/-/dashboard/tokens.vue")).default;
    const wrapper = shallowMount(TokenPage, {
      global: {
        stubs: {
          UContainer: { template: "<main><slot /></main>" },
          UPageHeader: { template: '<header><slot name="links" /></header>' },
          AppLoadingState: true,
          ApiProblemAlert: true,
          UAlert: true,
          UEmpty: true,
          UCard: { template: "<section><slot /></section>" },
          UBadge: {
            props: ["label"],
            template: "<span>{{ label }}<slot /></span>",
          },
          UButton: buttonStub,
          CreateApiTokenModal: true,
          ConfirmActionModal: {
            props: ["open", "title", "confirmLabel"],
            emits: ["confirm", "update:open"],
            template:
              '<section v-if="open"><h2>{{ title }}</h2><button data-confirm @click="$emit(\'confirm\')">{{ confirmLabel }}</button></section>',
          },
        },
      },
    });

    await flushPromises();

    expect(sessionGet).toHaveBeenCalledWith("/v1/tokens");
    expect(wrapper.text()).toContain("active workflow");
    expect(wrapper.text()).toContain("Expired");
    expect(wrapper.text()).toContain("Revoked");
    expect(wrapper.findAll('button[aria-label^="Revoke API token"]')).toHaveLength(1);

    await wrapper.get('button[aria-label="Revoke API token active workflow"]').trigger("click");
    await wrapper.get("[data-confirm]").trigger("click");
    await flushPromises();

    expect(sessionMutation).toHaveBeenCalledWith("/v1/tokens/rux_pat_active", "DELETE", "csrf-value");
    expect(wrapper.findAll('button[aria-label^="Revoke API token"]')).toHaveLength(0);
  });
});
