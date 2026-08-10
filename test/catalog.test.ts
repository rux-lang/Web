import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import CatalogFilterForm from "../app/components/CatalogFilterForm.vue";
import CatalogPackageCard from "../app/components/CatalogPackageCard.vue";
import type { CatalogFilters, PackageSearchResult } from "../app/types/catalog";
import {
  CATALOG_PAGE_SIZE,
  DEFAULT_KEYWORD_SORT,
  catalogApiQuery,
  catalogKeywordPath,
  catalogNamespacePath,
  catalogPackagePath,
  catalogPageNumber,
  catalogRouteQuery,
  catalogSortOptions,
  canonicalSearchText,
  defaultCatalogSort,
  keywordApiQuery,
  keywordRouteQuery,
  keywordSortOptions,
  packageTypeOptions,
  scalarQueryValue,
} from "../app/utils/catalog";

const emptyFilters: CatalogFilters = {
  q: "",
  namespace: "",
  keyword: "",
  packageType: "",
  sort: "",
};

const packageResult: PackageSearchResult = {
  namespace: "Rux_Tools",
  package: "Json_Parser",
  version: "1.2.0",
  package_type: "library",
  description: "Literal JSON parsing",
  published_at: "2026-08-02T12:00:00Z",
  yanked: true,
  downloads_total: 4820,
  downloads_30d: 310,
  package_url: "/v1/packages/rux-tools/json-parser",
  version_url: "/v1/packages/rux-tools/json-parser/1.2.0",
};

describe("catalog URL helpers", () => {
  it("builds normalized frontend discovery paths", () => {
    expect(catalogPackagePath(packageResult)).toBe("/packages/rux-tools/json-parser");
    expect(catalogNamespacePath("Rux_Tools")).toBe("/packages/-/namespaces/rux-tools");
    expect(catalogKeywordPath("Data_Formats")).toBe("/packages/-/keywords/data-formats");
  });

  it("canonicalizes filters and keeps the page number URL-addressable", () => {
    const filters: CatalogFilters = {
      q: "  fast   json  ",
      namespace: " Rux_Tools ",
      keyword: " data ",
      packageType: "library",
      sort: "downloads",
    };

    expect(canonicalSearchText(filters.q)).toBe("fast json");
    expect(catalogRouteQuery(filters, 3)).toEqual({
      q: "fast json",
      namespace: "Rux_Tools",
      keyword: "data",
      package_type: "library",
      sort: "downloads",
      page: "3",
    });
    expect(catalogApiQuery(filters, 3)).toMatchObject({
      sort: "downloads",
      page: 3,
      per_page: CATALOG_PAGE_SIZE,
    });
  });

  it("omits empty and repeated query values", () => {
    expect(catalogRouteQuery(emptyFilters)).toEqual({});
    expect(scalarQueryValue(["one", "two"])).toBe("");
    expect(scalarQueryValue(null)).toBe("");
  });

  it("keeps the first page and the default ordering out of the URL", () => {
    expect(defaultCatalogSort("")).toBe("name");
    expect(defaultCatalogSort("json")).toBe("relevance");
    // The default depends on whether there is a query, so the same sort value
    // is canonical on one page and worth stating on the other.
    expect(catalogRouteQuery({ ...emptyFilters, sort: "name" })).toEqual({});
    expect(catalogRouteQuery({ ...emptyFilters, q: "json", sort: "name" })).toEqual({
      q: "json",
      sort: "name",
    });
    expect(catalogRouteQuery({ ...emptyFilters, q: "json", sort: "relevance" })).toEqual({ q: "json" });
    expect(catalogRouteQuery(emptyFilters, 1)).toEqual({});
    expect(catalogRouteQuery(emptyFilters, 2)).toEqual({ page: "2" });
  });

  it("states the effective ordering and page in the request even when the URL omits them", () => {
    expect(catalogApiQuery(emptyFilters)).toEqual({
      sort: "name",
      page: 1,
      per_page: CATALOG_PAGE_SIZE,
    });
    expect(catalogApiQuery({ ...emptyFilters, q: "json" })).toEqual({
      q: "json",
      sort: "relevance",
      page: 1,
      per_page: CATALOG_PAGE_SIZE,
    });
  });

  it("falls back to the first page for any unusable page parameter", () => {
    expect(catalogPageNumber("4")).toBe(4);
    expect(catalogPageNumber("0")).toBe(1);
    expect(catalogPageNumber("-2")).toBe(1);
    expect(catalogPageNumber("abc")).toBe(1);
    expect(catalogPageNumber(["2", "3"])).toBe(1);
    expect(catalogPageNumber(undefined)).toBe(1);
  });

  it("uses only non-empty select item values", () => {
    expect(packageTypeOptions.every((option) => option.value.length > 0)).toBe(true);
    expect(catalogSortOptions.every((option) => option.value.length > 0)).toBe(true);
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
          '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option value=""><slot /></option><option value="library">Library</option><option value="downloads">Total downloads</option></select>',
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

  it("applies a new ordering on change rather than waiting for a submit", async () => {
    const wrapper = shallowMount(CatalogFilterForm, {
      props: { initial: { ...emptyFilters } },
      global,
    });

    // Package type first, then Sort by — the order the fields are declared in.
    const sort = wrapper.findAll("select")[1];
    expect(sort).toBeDefined();
    await sort?.setValue("downloads");

    expect(wrapper.emitted("submit")?.[0]).toEqual([{ ...emptyFilters, sort: "downloads" }]);
  });

  it("clears the ordering along with the filters", async () => {
    const wrapper = shallowMount(CatalogFilterForm, {
      props: { initial: { ...emptyFilters, sort: "downloads" } },
      global,
    });

    const clear = wrapper.findAll("button").find((button) => button.text() === "Clear");
    expect(clear).toBeDefined();
    await clear?.trigger("click");
    expect(wrapper.emitted("submit")?.[0]).toEqual([emptyFilters]);
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

  it("reports an all-time total for a search row and a 30-day count for a highlight", () => {
    const search = mountCard(packageResult);
    expect(search.text()).toContain("4,820 downloads");
    expect(search.text()).not.toContain("in 30 days");

    // A highlight row has no `downloads_total` key at all, which is what the
    // card branches on — leaving the key present but undefined would not.
    const { yanked: _yanked, downloads_total: _total, ...highlightRow } = packageResult;
    const highlight = mountCard(highlightRow);
    expect(highlight.text()).toContain("310 downloads in 30 days");
  });

  function mountCard(item: unknown) {
    return shallowMount(CatalogPackageCard, {
      props: { item, showDownloads: true } as never,
      global: {
        stubs: {
          UPageCard: {
            props: ["to", "title", "description"],
            template: '<article><slot name="header" /><slot name="footer" /></article>',
          },
          UButton: { props: ["to", "label"], template: '<a :href="to">{{ label }}</a>' },
          UBadge: { template: "<span><slot /></span>" },
        },
      },
    });
  }
});

describe("catalog pagination links", () => {
  it("addresses every page through the filter-preserving route query", () => {
    const filters: CatalogFilters = { ...emptyFilters, q: "json", packageType: "library", sort: "downloads" };
    const pageTo = (page: number) => ({ path: "/packages", query: catalogRouteQuery(filters, page) });

    expect(pageTo(1)).toEqual({
      path: "/packages",
      query: { q: "json", package_type: "library", sort: "downloads" },
    });
    expect(pageTo(3)).toEqual({
      path: "/packages",
      query: { q: "json", package_type: "library", sort: "downloads", page: "3" },
    });
  });
});

describe("keyword index query", () => {
  it("keeps the default ordering and the first page out of the URL", () => {
    expect(keywordRouteQuery("")).toEqual({});
    expect(keywordRouteQuery(DEFAULT_KEYWORD_SORT)).toEqual({});
    expect(keywordRouteQuery("name")).toEqual({ sort: "name" });
    expect(keywordRouteQuery("name", 1)).toEqual({ sort: "name" });
    expect(keywordRouteQuery("name", 4)).toEqual({ sort: "name", page: "4" });
    expect(keywordRouteQuery("", 2)).toEqual({ page: "2" });
  });

  it("states the effective ordering and page in the request", () => {
    expect(keywordApiQuery("")).toEqual({
      sort: DEFAULT_KEYWORD_SORT,
      page: 1,
      per_page: CATALOG_PAGE_SIZE,
    });
    expect(keywordApiQuery("name", 3)).toEqual({
      sort: "name",
      page: 3,
      per_page: CATALOG_PAGE_SIZE,
    });
  });

  it("offers only the two orderings the API accepts", () => {
    expect(keywordSortOptions.map((option) => option.value)).toEqual(["packages", "name"]);
    expect(keywordSortOptions[0]?.value).toBe(DEFAULT_KEYWORD_SORT);
  });
});
