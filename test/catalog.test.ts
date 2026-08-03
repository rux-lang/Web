import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import CatalogFilterForm from "../app/components/CatalogFilterForm.vue";
import CatalogPackageCard from "../app/components/CatalogPackageCard.vue";
import CursorPager from "../app/components/CursorPager.vue";
import type { CatalogFilters, PackageSearchResult } from "../app/types/catalog";
import {
  catalogApiQuery,
  catalogKeywordPath,
  catalogNamespacePath,
  catalogPackagePath,
  catalogRouteQuery,
  canonicalSearchText,
  packageTypeOptions,
  scalarQueryValue,
} from "../app/utils/catalog";

const emptyFilters: CatalogFilters = {
  q: "",
  namespace: "",
  keyword: "",
  packageType: "",
};

const packageResult: PackageSearchResult = {
  namespace: "Rux_Tools",
  package: "Json_Parser",
  version: "1.2.0",
  package_type: "library",
  description: "Literal JSON parsing",
  published_at: "2026-08-02T12:00:00Z",
  yanked: true,
  package_url: "/v1/packages/rux-tools/json-parser",
  version_url: "/v1/packages/rux-tools/json-parser/1.2.0",
};

describe("catalog URL helpers", () => {
  it("builds normalized frontend discovery paths", () => {
    expect(catalogPackagePath(packageResult)).toBe("/packages/rux-tools/json-parser");
    expect(catalogNamespacePath("Rux_Tools")).toBe("/packages/-/namespaces/rux-tools");
    expect(catalogKeywordPath("Data_Formats")).toBe("/packages/-/keywords/data-formats");
  });

  it("canonicalizes filters while keeping opaque cursors URL-addressable", () => {
    const filters: CatalogFilters = {
      q: "  fast   json  ",
      namespace: " Rux_Tools ",
      keyword: " data ",
      packageType: "library",
    };

    expect(canonicalSearchText(filters.q)).toBe("fast json");
    expect(catalogRouteQuery(filters, "opaque+cursor")).toEqual({
      q: "fast json",
      namespace: "Rux_Tools",
      keyword: "data",
      package_type: "library",
      cursor: "opaque+cursor",
    });
    expect(catalogApiQuery(filters)).toMatchObject({ limit: 20 });
  });

  it("omits empty and repeated query values", () => {
    expect(catalogRouteQuery(emptyFilters)).toEqual({});
    expect(scalarQueryValue(["one", "two"])).toBe("");
    expect(scalarQueryValue(null)).toBe("");
  });

  it("uses only non-empty select item values", () => {
    expect(packageTypeOptions.every((option) => option.value.length > 0)).toBe(true);
  });
});

describe("CatalogFilterForm", () => {
  const global = {
    stubs: {
      UForm: {
        emits: ["submit"],
        template: '<form aria-label="Catalog filters" @submit.prevent="$emit(\'submit\')"><slot /></form>',
      },
      UFormField: { template: "<label><slot /></label>" },
      UInput: {
        props: ["modelValue"],
        emits: ["update:modelValue"],
        template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)">',
      },
      USelect: {
        props: ["modelValue"],
        emits: ["update:modelValue"],
        template:
          '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option value=""><slot /></option><option value="library">Library</option></select>',
      },
      UButton: {
        props: ["label", "type"],
        emits: ["click"],
        template: '<button :type="type" @click="$emit(\'click\')">{{ label }}</button>',
      },
    },
  };

  it("emits the explicit filter state on submit and clears it on request", async () => {
    const wrapper = shallowMount(CatalogFilterForm, {
      props: {
        initial: { ...emptyFilters, q: "json" },
        showQuery: true,
      },
      global,
    });

    await wrapper.get("form").trigger("submit");
    expect(wrapper.emitted("submit")?.[0]).toEqual([{ ...emptyFilters, q: "json" }]);

    const clear = wrapper.findAll("button").find((button) => button.text() === "Clear");
    expect(clear).toBeDefined();
    await clear?.trigger("click");
    expect(wrapper.emitted("submit")?.[1]).toEqual([emptyFilters]);
  });
});

describe("CatalogPackageCard", () => {
  it("renders canonical links and visible representative metadata", () => {
    const wrapper = shallowMount(CatalogPackageCard, {
      props: { item: packageResult },
      global: {
        stubs: {
          UPageCard: {
            props: ["to", "title", "description"],
            template:
              '<article><a :href="to">{{ title }}</a><p>{{ description }}</p><slot name="header" /><slot name="footer" /></article>',
          },
          UButton: {
            props: ["to", "label"],
            template: '<a :href="to">{{ label }}</a>',
          },
          UBadge: { template: "<span><slot /></span>" },
        },
      },
    });

    expect(wrapper.get("article > a").attributes("href")).toBe("/packages/rux-tools/json-parser");
    expect(wrapper.findAll("a").some((link) => link.attributes("href") === "/packages/-/namespaces/rux-tools")).toBe(
      true,
    );
    expect(wrapper.text()).toContain("Library");
    expect(wrapper.text()).toContain("Yanked");
    expect(wrapper.text()).toContain("Aug 2, 2026");
  });
});

describe("CursorPager", () => {
  it("preserves filters in next and start-over links", () => {
    const wrapper = shallowMount(CursorPager, {
      props: {
        path: "/packages/-/search",
        query: { q: "json", package_type: "library" },
        cursor: "current",
        nextCursor: "next",
      },
      global: {
        stubs: {
          UButton: {
            props: ["to", "label"],
            template: '<a :data-to="JSON.stringify(to)">{{ label }}</a>',
          },
        },
      },
    });

    const links = wrapper.findAll("a");
    expect(JSON.parse(links[0]?.attributes("data-to") ?? "{}")).toEqual({
      path: "/packages/-/search",
      query: { q: "json", package_type: "library" },
    });
    expect(JSON.parse(links[1]?.attributes("data-to") ?? "{}")).toEqual({
      path: "/packages/-/search",
      query: { q: "json", package_type: "library", cursor: "next" },
    });
  });
});
