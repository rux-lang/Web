import type { ContentNavigationItem } from "@nuxt/content";
import type { ApiCatalogArea } from "~/utils/api-catalog";

/**
 * The API Reference's package list for the /docs/api hub cards and the
 * package switcher: the registry grouped by area (`apiPackageCatalog`), plus
 * what only the pages themselves know.
 *
 * The navigation tree carries no frontmatter beyond titles, so one small query
 * reads every package overview's `api.version` (a generated package) and its
 * description (the registry has none for a 0.3 folder it does not list). A
 * hand-written overview has no `api` block; `apiPageInfo` still knows its
 * version. Both consumers share the key, so a page fetches it once.
 */
export const useApiPackages = () => {
  const navigation = inject<Ref<ContentNavigationItem[] | null>>("navigation", ref([]));

  const catalog = computed(() =>
    apiPackageCatalog(
      navigation.value?.find((item) => item.path === "/docs")?.children?.find((item) => item.path === "/docs/api"),
    ),
  );

  const paths = computed(() =>
    catalog.value.flatMap((area) => area.packages.filter((entry) => entry.hasPages).map((entry) => entry.path)),
  );

  const { data: overviews } = useAsyncData("api-package-overviews", () =>
    paths.value.length
      ? queryCollection("docs").where("path", "IN", paths.value).select("path", "description", "api").all()
      : Promise.resolve([]),
  );

  const areas = computed<ApiCatalogArea[]>(() => {
    const byPath = new Map(overviews.value?.map((page) => [page.path, page]));
    return catalog.value.map((area) => ({
      ...area,
      packages: area.packages.map((entry) => {
        if (!entry.hasPages) return entry;
        const page = byPath.get(entry.path);
        return {
          ...entry,
          description: entry.description ?? page?.description,
          version: page?.api?.version ?? apiPageInfo(entry.path).version,
        };
      }),
    }));
  });

  return { areas };
};
