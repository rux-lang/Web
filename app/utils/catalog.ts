import type { CatalogFilters, CatalogPackage, PackageType } from "~/types/catalog";

export type CatalogQueryValue = string | null | (string | null)[] | undefined;

export const CATALOG_PAGE_SIZE = 15;
export const KEYWORD_PAGE_SIZE = 30;

/**
 * The orderings `GET /v1/search` accepts, in the order the Sort by menu lists
 * them. The values are the API's own `sort` names, so the select binds straight
 * to the URL and the request without a lookup table.
 */
export const catalogSortOptions: { label: string; value: string }[] = [
  {
    label: "Relevance",
    value: "relevance",
  },
  {
    label: "Alphabetical",
    value: "name",
  },
  {
    label: "Total downloads",
    value: "downloads",
  },
  {
    label: "Recent downloads",
    value: "recent_downloads",
  },
  {
    label: "Recently updated",
    value: "updated",
  },
  {
    label: "Recently added",
    value: "created",
  },
];

/**
 * The orderings `GET /v1/keywords` accepts. Its default is `packages` — the
 * busiest topics are the useful way into an unfamiliar registry — so that is
 * what {@link keywordRouteQuery} leaves out of the URL.
 */
export const keywordSortOptions: { label: string; value: string }[] = [
  {
    label: "Number of packages",
    value: "packages",
  },
  {
    label: "Alphabetical",
    value: "name",
  },
];

export const DEFAULT_KEYWORD_SORT = "packages";

export const packageTypeOptions: { label: string; value: string }[] = [
  {
    label: "Program",
    value: "program",
  },
  {
    label: "Library",
    value: "library",
  },
  {
    label: "Source",
    value: "source",
  },
];

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
});

export function scalarQueryValue(value: CatalogQueryValue): string {
  return typeof value === "string" ? value : "";
}

export function normalizedIdentity(value: string): string {
  return value.toLowerCase().replaceAll("_", "-");
}

export function catalogPackagePath(item: Pick<CatalogPackage, "namespace" | "package">): string {
  return `/packages/${encodeURIComponent(normalizedIdentity(item.namespace))}/${encodeURIComponent(normalizedIdentity(item.package))}`;
}

export function catalogNamespacePath(namespace: string): string {
  return `/packages/-/namespaces/${encodeURIComponent(normalizedIdentity(namespace))}`;
}

export function catalogKeywordPath(keyword: string): string {
  return `/packages/-/keywords/${encodeURIComponent(normalizedIdentity(keyword))}`;
}

export function formatPublishedAt(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function packageTypeLabel(value: PackageType): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function canonicalSearchText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

/**
 * The ordering the API picks when `sort` is absent. Restating it here is what
 * lets {@link catalogRouteQuery} leave the default out of the URL, so the
 * canonical catalog address stays `/packages`.
 */
export function defaultCatalogSort(query: string): string {
  return query ? "relevance" : "name";
}

export function defaultCatalogOrder(sort: string): string {
  return sort === "name" ? "asc" : "desc";
}

export function catalogPageNumber(value: CatalogQueryValue): number {
  const page = Number.parseInt(scalarQueryValue(value), 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function catalogRouteQuery(filters: CatalogFilters, page = 1): Record<string, string> {
  const query: Record<string, string> = {};
  const search = canonicalSearchText(filters.q);
  const namespace = filters.namespace.trim();
  const keyword = filters.keyword.trim();
  const sort = filters.sort || defaultCatalogSort(search);
  const order = filters.order || defaultCatalogOrder(sort);

  if (search) query.q = search;
  if (namespace) query.namespace = namespace;
  if (keyword) query.keyword = keyword;
  if (filters.packageType) query.package_type = filters.packageType;
  if (filters.sort && filters.sort !== defaultCatalogSort(search)) query.sort = filters.sort;
  if (order !== defaultCatalogOrder(sort)) query.order = order;
  if (page > 1) query.page = String(page);

  return query;
}

export function catalogApiQuery(filters: CatalogFilters, page = 1): Record<string, string | number> {
  return {
    ...catalogRouteQuery(filters, page),
    // The URL omits both when they match the default; the request states them,
    // so a page is never at the mercy of a server-side default changing.
    sort: filters.sort || defaultCatalogSort(canonicalSearchText(filters.q)),
    order: filters.order || defaultCatalogOrder(filters.sort || defaultCatalogSort(canonicalSearchText(filters.q))),
    page,
    per_page: CATALOG_PAGE_SIZE,
  };
}

export function catalogResultSummary(total: number, page: number, perPage: number, itemCount: number): string {
  if (total <= 0 || itemCount <= 0) return "";

  const start = (page - 1) * perPage + 1;
  const end = Math.min(total, start + itemCount - 1);
  const range =
    start === end ? start.toLocaleString("en") : `${start.toLocaleString("en")}–${end.toLocaleString("en")}`;
  return `Showing ${range} of ${total.toLocaleString("en")} ${total === 1 ? "package" : "packages"}`;
}

export function keywordResultSummary(total: number, page: number, perPage: number, itemCount: number): string {
  if (total <= 0 || itemCount <= 0) return "";

  const start = (page - 1) * perPage + 1;
  const end = Math.min(total, start + itemCount - 1);
  const range =
    start === end ? start.toLocaleString("en") : `${start.toLocaleString("en")}–${end.toLocaleString("en")}`;
  return `Showing ${range} of ${total.toLocaleString("en")} ${total === 1 ? "keyword" : "keywords"}`;
}

/**
 * The keyword index's URL state. Mirrors {@link catalogRouteQuery}: the default
 * ordering and the first page are left out, so the canonical address of the
 * index stays `/packages/-/keywords`.
 */
export function keywordRouteQuery(sort: string, page = 1): Record<string, string> {
  const query: Record<string, string> = {};
  if (sort && sort !== DEFAULT_KEYWORD_SORT) query.sort = sort;
  if (page > 1) query.page = String(page);
  return query;
}

export function keywordApiQuery(sort: string, page = 1): Record<string, string | number> {
  return {
    sort: sort || DEFAULT_KEYWORD_SORT,
    page,
    per_page: KEYWORD_PAGE_SIZE,
  };
}
