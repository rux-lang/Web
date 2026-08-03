export type PackageType = "program" | "library" | "source";

export interface DataEnvelope<T> {
  data: T;
}

export interface CursorPage<T> {
  data: T[];
  meta: {
    next_cursor: string | null;
  };
}

export interface CatalogPackage {
  namespace: string;
  package: string;
  version: string;
  package_type: PackageType;
  description: string | null;
  published_at: string;
  package_url: string;
  version_url: string;
}

export interface PackageSearchResult extends CatalogPackage {
  yanked: boolean;
}

export interface HighlightPackage extends CatalogPackage {
  downloads_30d: number | null;
}

export interface PackageHighlights {
  window_days: number;
  recent: HighlightPackage[];
  popular: HighlightPackage[];
}

export interface KeywordSummary {
  keyword: string;
  normalized_keyword: string;
  package_count: number;
}

export interface CatalogFilters {
  q: string;
  namespace: string;
  keyword: string;
  packageType: string;
}
