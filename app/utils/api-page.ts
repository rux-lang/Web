const RUX_REPOSITORY = "https://github.com/rux-lang/Rux";
const PACKAGES_ROOT = "Packages";

/** Where every package's sources live; the Source button of the /docs/api hub. */
export const apiPackagesTreeUrl = `${RUX_REPOSITORY}/tree/main/${PACKAGES_ROOT}`;

/** The `api` frontmatter object of a generated page (content.config.ts). */
export interface ApiFrontmatter {
  package: string;
  kind: string;
  version: string;
  source?: string;
  line?: number;
}

/**
 * The Source button of a generated page: the declaration's line in its file
 * under `Packages/<package>/`, or the package tree for an overview (and for a
 * page whose snapshot names no file).
 */
export function apiSourceUrl(api: ApiFrontmatter): string {
  const packagePath = `${PACKAGES_ROOT}/${api.package}`;
  if (api.kind === "package" || !api.source) return `${RUX_REPOSITORY}/tree/main/${packagePath}`;
  return `${RUX_REPOSITORY}/blob/main/${packagePath}/${api.source}${api.line ? `#L${api.line}` : ""}`;
}
