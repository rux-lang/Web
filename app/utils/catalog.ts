import type { CatalogFilters, CatalogPackage, PackageType } from "~/types/catalog";

export type CatalogQueryValue = string | null | (string | null)[] | undefined;

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

export function catalogRouteQuery(filters: CatalogFilters, cursor?: string): Record<string, string> {
  const query: Record<string, string> = {};
  const search = canonicalSearchText(filters.q);
  const namespace = filters.namespace.trim();
  const keyword = filters.keyword.trim();

  if (search) query.q = search;
  if (namespace) query.namespace = namespace;
  if (keyword) query.keyword = keyword;
  if (filters.packageType) query.package_type = filters.packageType;
  if (cursor) query.cursor = cursor;

  return query;
}

export function catalogApiQuery(filters: CatalogFilters, cursor?: string): Record<string, string | number> {
  return {
    ...catalogRouteQuery(filters, cursor),
    limit: 20,
  };
}
