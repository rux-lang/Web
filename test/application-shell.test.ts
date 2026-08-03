import { shallowMount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import PackagesLayout from "../app/layouts/packages.vue";

vi.stubGlobal("useRoute", () => ({ path: "/packages" }));
vi.stubGlobal("navigateTo", vi.fn());
vi.stubGlobal("useHead", vi.fn());

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
});
