import { shallowMount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import PackagesLayout from "../app/layouts/packages.vue";

import { computed, ref } from "vue";

vi.stubGlobal("useRoute", () => ({ path: "/packages" }));
vi.stubGlobal("navigateTo", vi.fn());
vi.stubGlobal("useHead", vi.fn());

// Signed out by default; the Dashboard entry is asserted to be absent below.
const currentUser = ref<{ github_login: string } | null>(null);
vi.stubGlobal("useCurrentUser", () => ({ user: computed(() => currentUser.value) }));

describe("packages layout", () => {
  it("provides registry navigation and a focused content landmark", () => {
    const wrapper = shallowMount(PackagesLayout, {
      slots: {
        default: "<p>Route content</p>",
      },
      global: {
        stubs: {
          UNavigationMenu: {
            props: ["items"],
            template: '<nav><a v-for="item in items" :key="item.to" :href="item.to">{{ item.label }}</a></nav>',
          },
          // The layout nests itself inside `default` for the site chrome; this
          // test is about the registry shell, so render the slot straight
          // through rather than pulling the header and footer in.
          NuxtLayout: { template: "<div><slot /></div>" },
          NuxtErrorBoundary: { template: "<div><slot /></div>" },
          UContainer: { template: "<div><slot /></div>" },
          AppErrorState: true,
          AppAccountMenu: true,
        },
      },
    });

    expect(wrapper.get(".skip-link").attributes("href")).toBe("#registry-content");
    expect(wrapper.get("#registry-content").attributes("tabindex")).toBe("-1");
    expect(wrapper.get("#registry-content").text()).toContain("Route content");

    const links = wrapper.findAll("a");
    expect(links.some((link) => link.attributes("href") === "/packages")).toBe(true);
    expect(links.some((link) => link.attributes("href") === "/packages/-/search")).toBe(true);
    expect(links.some((link) => link.attributes("href") === "/packages/-/keywords")).toBe(true);
    expect(wrapper.find('[aria-label="Package registry navigation"]').exists()).toBe(true);
    expect(wrapper.findAllComponents({ name: "AppAccountMenu" })).toHaveLength(1);
  });

  it("hides Dashboard until there is a session", () => {
    currentUser.value = null;
    expect(navigationHrefs()).not.toContain("/packages/-/dashboard");

    currentUser.value = { github_login: "octocat" };
    expect(navigationHrefs()).toContain("/packages/-/dashboard");

    currentUser.value = null;
  });
});

/** Mounts the layout and returns the hrefs its registry nav renders. */
function navigationHrefs() {
  const wrapper = shallowMount(PackagesLayout, {
    global: {
      stubs: {
        UNavigationMenu: {
          props: ["items"],
          template: '<nav><a v-for="item in items" :key="item.to" :href="item.to">{{ item.label }}</a></nav>',
        },
        NuxtLayout: { template: "<div><slot /></div>" },
        NuxtErrorBoundary: { template: "<div><slot /></div>" },
        UContainer: { template: "<div><slot /></div>" },
        AppErrorState: true,
        AppAccountMenu: true,
      },
    },
  });

  return wrapper.findAll("a").map((link) => link.attributes("href"));
}
