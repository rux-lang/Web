import type { ContentNavigationItem } from "@nuxt/content";
import { AREAS, GENERATED, KIND_GROUPS, PACKAGES } from "~~/scripts/api-packages.mjs";

export interface ApiArea {
  slug: string;
  title: string;
  icon: string;
}

export interface ApiRegistryPackage {
  name: string;
  slug: string;
  folder: string;
  area: string;
  icon: string;
  description: string;
  platform?: string;
  path: string;
}

/** One card on the /docs/api hub, one row of the package switcher. */
export interface ApiCatalogPackage {
  name: string;
  slug: string;
  path: string;
  icon: string;
  description?: string;
  platform?: string;
  /** The navigation tree has a folder for it — generated or hand-written. */
  hasPages: boolean;
  /** Its pages are rendered from a `rux doc` snapshot (GENERATED). */
  generated: boolean;
  /** Filled in by useApiPackages() from the overview page. */
  version?: string;
}

export interface ApiCatalogArea extends ApiArea {
  packages: ApiCatalogPackage[];
}

// The registry is plain JavaScript; these casts give it the shapes the
// table in scripts/api-packages.mjs documents, as LearnRoadmap does for
// learn-course.mjs.
export const apiAreas = AREAS as ApiArea[];
export const apiRegistry = PACKAGES as ApiRegistryPackage[];
export const apiGenerated = GENERATED as Set<string>;
export const apiKindGroups = KIND_GROUPS as { folder: string; title: string; kinds: string[] }[];

/**
 * The trailing hub area for the 0.3-era folders the registry no longer names
 * (Bsd, the old name of FreeBSD). Their pages still build, so they stay reachable until the
 * generated reference replaces them.
 */
export const apiOtherArea: ApiArea = { slug: "other", title: "Other packages", icon: "i-lucide-package" };

/**
 * Every package of the API Reference, grouped by hub area in registry order.
 *
 * `book` is the /docs/api node of the navigation tree. A package "has pages"
 * when the tree holds a folder at its path, whether the renderer generated it
 * or it is one of the hand-written 0.3 folders (`08.math`, …) that share the
 * same URL scheme. Folders the registry does not list are appended as
 * `apiOtherArea`, titled and iconed from their own .navigation.yml.
 *
 * Areas with no package at all are dropped; an area whose packages are all
 * pending is kept, since the hub shows a card for every registry entry.
 */
export function apiPackageCatalog(book: ContentNavigationItem | undefined): ApiCatalogArea[] {
  const folders = new Map<string, ContentNavigationItem>();
  for (const item of book?.children ?? []) {
    if (item.children?.length) folders.set(item.path, item);
  }

  const areas: ApiCatalogArea[] = apiAreas.map((area) => ({
    ...area,
    packages: apiRegistry
      .filter((entry) => entry.area === area.slug)
      .map((entry) => ({
        name: entry.name,
        slug: entry.slug,
        path: entry.path,
        icon: entry.icon,
        description: entry.description,
        platform: entry.platform,
        hasPages: folders.has(entry.path),
        generated: apiGenerated.has(entry.slug),
      })),
  }));

  const known = new Set(apiRegistry.map((entry) => entry.path));
  const others: ApiCatalogPackage[] = [...folders.values()]
    .filter((item) => !known.has(item.path))
    .map((item) => ({
      name: item.title,
      slug: item.path.split("/").pop()!,
      path: item.path,
      icon: (item.icon as string | undefined) ?? apiOtherArea.icon,
      hasPages: true,
      generated: false,
    }));
  if (others.length) areas.push({ ...apiOtherArea, packages: others });

  return areas.filter((area) => area.packages.length);
}
