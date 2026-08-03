import { shallowMount, flushPromises } from "@vue/test-utils";
import { ref } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ApiFailure } from "../app/types/api";
import type { AuthenticationStatus, SessionDocument, SessionUser } from "../app/types/auth";
import { storeReturnPath } from "../app/utils/auth";

function authState(status: AuthenticationStatus, user: SessionUser | null = null) {
  const session = ref<SessionDocument | null>(
    user
      ? {
          user,
          expires_at: "2026-08-20T12:00:00Z",
          csrf_token: "csrf",
        }
      : null,
  );
  return {
    status: ref(status),
    session,
    user: ref(user),
    expiresAt: ref(session.value?.expires_at ?? null),
    failure: ref<ApiFailure | null>(null),
    signingOut: ref(false),
    initialize: vi.fn().mockResolvedValue(session.value),
    refresh: vi.fn().mockResolvedValue(session.value),
    startSignIn: vi.fn(),
    signOut: vi.fn(),
  };
}

const buttonStub = {
  name: "UButton",
  props: ["label", "to", "ariaLabel"],
  emits: ["click"],
  template: `
    <a v-if="to" :data-path="typeof to === 'string' ? to : to.path">{{ label }}<slot /></a>
    <button v-else :aria-label="ariaLabel" @click="$emit('click')">{{ label }}<slot /></button>
  `,
};

describe("authentication UI", () => {
  beforeEach(() => {
    vi.resetModules();
    sessionStorage.clear();
    vi.stubGlobal("definePageMeta", vi.fn());
    vi.stubGlobal("useSeoMeta", vi.fn());
  });

  afterEach(() => vi.unstubAllGlobals());

  it("renders anonymous, expired, and authenticated account controls", async () => {
    const route = { path: "/packages", fullPath: "/packages?sort=recent" };
    vi.stubGlobal("useRoute", () => route);

    let auth = authState("anonymous");
    vi.stubGlobal("useCurrentUser", () => auth);
    const AccountMenu = (await import("../app/components/AppAccountMenu.vue")).default;
    const stubs = {
      UButton: buttonStub,
      USkeleton: true,
      UDropdownMenu: {
        name: "UDropdownMenu",
        props: ["items"],
        template: "<div data-menu><slot /></div>",
      },
      UAvatar: {
        name: "UAvatar",
        props: ["src", "text", "alt"],
        template: '<span data-avatar :data-src="src" :data-text="text" />',
      },
      UIcon: true,
    };

    const anonymous = shallowMount(AccountMenu, { global: { stubs } });
    expect(anonymous.text()).toContain("Sign in");
    expect(anonymous.get("a").attributes("data-path")).toBe("/packages/-/auth/sign-in");

    auth = authState("expired");
    const expired = shallowMount(AccountMenu, {
      props: { mobile: true },
      global: { stubs },
    });
    expect(expired.text()).toContain("Sign in again");

    auth = authState("authenticated", {
      github_login: "octocat",
      display_name: "The Octocat",
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
    });
    const authenticated = shallowMount(AccountMenu, {
      props: { mobile: true },
      global: { stubs },
    });
    expect(authenticated.get("button").attributes("aria-label")).toBe("TO The Octocat account menu");
    expect(authenticated.get("[data-avatar]").attributes("data-src")).toBe(
      "https://avatars.githubusercontent.com/u/1?v=4",
    );
    const menu = authenticated.getComponent({ name: "UDropdownMenu" });
    expect(menu.props("items")[1][0]).toMatchObject({
      label: "Dashboard",
      icon: "i-lucide-layout-dashboard",
      to: "/packages/-/dashboard",
    });
    expect(menu.props("items")[1][1]).toMatchObject({
      label: "API tokens",
      icon: "i-lucide-key-round",
      to: "/packages/-/dashboard/tokens",
    });
    expect(menu.props("items")[1][2]).toMatchObject({
      label: "Settings",
      icon: "i-lucide-settings",
      to: "/packages/-/dashboard/settings",
    });
    expect(menu.props("items")[1][3]).toMatchObject({
      label: "Sign out",
      icon: "i-lucide-log-out",
    });
  });

  it("uses initials when an authenticated avatar is not trusted", async () => {
    vi.stubGlobal("useRoute", () => ({ path: "/", fullPath: "/" }));
    vi.stubGlobal("useCurrentUser", () =>
      authState("authenticated", {
        github_login: "octocat",
        display_name: "The Octocat",
        avatar_url: "https://tracking.example/octocat.png",
      }),
    );
    const AccountMenu = (await import("../app/components/AppAccountMenu.vue")).default;
    const wrapper = shallowMount(AccountMenu, {
      global: {
        stubs: {
          UButton: buttonStub,
          USkeleton: true,
          UDropdownMenu: { props: ["items"], template: "<div><slot /></div>" },
          UAvatar: {
            props: ["src", "text"],
            template: '<span data-avatar :data-src="src" :data-text="text" />',
          },
          UIcon: true,
        },
      },
    });

    expect(wrapper.get("[data-avatar]").attributes("data-src")).toBeUndefined();
    expect(wrapper.get("[data-avatar]").attributes("data-text")).toBe("TO");
  });

  it("shows a safe callback error and retries without reflecting query input", async () => {
    const auth = authState("anonymous");
    vi.stubGlobal("useCurrentUser", () => auth);
    vi.stubGlobal("useRoute", () => ({
      query: { error: "provider_secret_message" },
    }));
    vi.stubGlobal("navigateTo", vi.fn());
    const CallbackPage = (await import("../app/pages/packages/-/auth/callback.vue")).default;
    const wrapper = shallowMount(CallbackPage, {
      global: {
        stubs: {
          UContainer: { template: "<main><slot /></main>" },
          AppLoadingState: true,
          ApiProblemAlert: true,
          UAlert: {
            props: ["title", "description"],
            template: '<section><h1>{{ title }}</h1><p>{{ description }}</p><slot name="actions" /></section>',
          },
          UButton: buttonStub,
        },
      },
    });

    expect(wrapper.text()).toContain("Sign-in response was invalid");
    expect(wrapper.text()).not.toContain("provider_secret_message");
    await wrapper.findAll("button")[0]?.trigger("click");
    expect(auth.startSignIn).toHaveBeenCalledWith("/packages");
  });

  it("refreshes the callback session and replaces it with the stored route", async () => {
    const auth = authState("authenticated", {
      github_login: "octocat",
      display_name: null,
      avatar_url: null,
    });
    auth.refresh.mockResolvedValue(auth.session.value);
    const navigate = vi.fn();
    vi.stubGlobal("useCurrentUser", () => auth);
    vi.stubGlobal("useRoute", () => ({ query: {} }));
    vi.stubGlobal("navigateTo", navigate);
    storeReturnPath(sessionStorage, "/packages/rux/json", window.location.origin);
    const CallbackPage = (await import("../app/pages/packages/-/auth/callback.vue")).default;
    shallowMount(CallbackPage, {
      global: {
        stubs: {
          UContainer: { template: "<main><slot /></main>" },
          AppLoadingState: true,
          ApiProblemAlert: true,
          UAlert: true,
          UButton: buttonStub,
        },
      },
    });

    await flushPromises();
    expect(auth.refresh).toHaveBeenCalledOnce();
    expect(navigate).toHaveBeenCalledWith("/packages/rux/json", {
      replace: true,
    });
    expect(sessionStorage.getItem("rux.auth.return")).toBeNull();
  });
});
