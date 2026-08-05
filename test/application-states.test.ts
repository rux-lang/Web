import { mount, shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ApiProblemAlert from "../app/components/ApiProblemAlert.vue";
import AppErrorState from "../app/components/AppErrorState.vue";
import AppLoadingState from "../app/components/AppLoadingState.vue";

describe("AppLoadingState", () => {
  it("announces an accessible busy state while hiding decorative skeletons", () => {
    const wrapper = mount(AppLoadingState, {
      props: { label: "Loading packages" },
      global: {
        stubs: {
          USkeleton: { template: "<div data-skeleton />" },
          UIcon: { props: ["name"], template: '<i data-icon :data-name="name" />' },
        },
      },
    });

    const status = wrapper.get('[role="status"]');
    expect(status.attributes("aria-live")).toBe("polite");
    expect(status.attributes("aria-busy")).toBe("true");
    expect(status.text()).toContain("Loading packages");

    // The spinner is decorative — the label is what gets announced.
    const spinner = status.get("[data-icon]");
    expect(spinner.attributes("data-name")).toBe("i-lucide-loader-circle");
    expect(spinner.attributes("aria-hidden")).toBe("true");

    // Skeletons are placeholders, so they sit inside an aria-hidden container.
    const skeletons = status.findAll("[data-skeleton]");
    expect(skeletons).toHaveLength(6);
    for (const skeleton of skeletons) {
      expect(skeleton.element.closest('[aria-hidden="true"]')).not.toBeNull();
    }
  });
});

describe("ApiProblemAlert", () => {
  it("renders human-facing problem details and emits retry", async () => {
    const wrapper = shallowMount(ApiProblemAlert, {
      props: {
        failure: {
          title: "Search unavailable",
          detail: "Search is temporarily unavailable.",
          errors: ["Use a shorter query."],
          retryable: true,
          problem: {
            type: "https://api.rux-lang.dev/problems/search_unavailable",
            title: "Search unavailable",
            status: 503,
            code: "search_unavailable",
            instance: "/requests/private-id",
          },
        },
      },
      global: {
        stubs: {
          UAlert: {
            props: ["title"],
            template: '<section><h2>{{ title }}</h2><slot name="description" /><slot name="actions" /></section>',
          },
          UButton: {
            props: ["label"],
            emits: ["click"],
            template: "<button @click=\"$emit('click')\">{{ label }}</button>",
          },
        },
      },
    });

    const alert = wrapper.get('[role="alert"]');
    expect(alert.text()).toContain("Search unavailable");
    expect(alert.text()).toContain("Search is temporarily unavailable.");
    expect(alert.text()).toContain("Use a shorter query.");
    expect(alert.text()).not.toContain("search_unavailable");
    expect(alert.text()).not.toContain("/requests/private-id");

    await wrapper.get("button").trigger("click");
    expect(wrapper.emitted("retry")).toHaveLength(1);
  });

  it("omits retry for a non-retryable client problem", () => {
    const wrapper = shallowMount(ApiProblemAlert, {
      props: {
        failure: {
          title: "Not Found",
          detail: "The package was not found.",
          errors: [],
          retryable: false,
        },
      },
      global: {
        stubs: {
          UAlert: {
            props: ["title"],
            template: '<section><h2>{{ title }}</h2><slot name="description" /><slot name="actions" /></section>',
          },
          UButton: {
            props: ["label"],
            template: "<button>{{ label }}</button>",
          },
        },
      },
    });

    expect(wrapper.find("button").exists()).toBe(false);
  });
});

describe("AppErrorState", () => {
  it("offers recovery without displaying an exception", async () => {
    const wrapper = shallowMount(AppErrorState, {
      props: {
        title: "This page could not be displayed",
        description: "Try again, or return home.",
        retryable: true,
      },
      global: {
        stubs: {
          UEmpty: {
            props: ["title", "description"],
            template: '<section><h2>{{ title }}</h2><p>{{ description }}</p><slot name="actions" /></section>',
          },
          UButton: {
            props: ["label"],
            emits: ["click"],
            template: "<button @click=\"$emit('click')\">{{ label }}</button>",
          },
        },
      },
    });

    const buttons = wrapper.findAll("button");
    expect(buttons.map((button) => button.text())).toEqual(["Try again", "Return home"]);

    await buttons[0]?.trigger("click");
    await buttons[1]?.trigger("click");
    expect(wrapper.emitted("retry")).toHaveLength(1);
    expect(wrapper.emitted("home")).toHaveLength(1);
  });
});
