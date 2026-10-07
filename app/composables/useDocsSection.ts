import type { ContentNavigationItem } from "@nuxt/content";
import { apiGenerated, apiKindGroups, apiPackageCatalog } from "~/utils/api-catalog";

/**
 * Sidebar groups of the Learn Rux book that have no overview page of their own
 * to take a title and icon from. Every course part (`01.basics/`, …) has one —
 * its `00.index.md` plus `.navigation.yml` — so only the onboarding folder is
 * listed here.
 */
const learnGroups: Record<string, { title: string; icon?: string }> = {
  "00.start": { title: "Getting Started", icon: "i-lucide-rocket" },
};

/**
 * API Reference groups inside one generated package, keyed by the group
 * folder the renderer files each page under (`1.interfaces/`, …). Every group
 * folder carries a .navigation.yml with the same title, but Nuxt Content only
 * reads a folder's title onto a node *at that folder's path* — and no page
 * lives at /docs/api/allocator/interfaces — so the registry's KIND_GROUPS is
 * where the sidebar takes it from.
 */
const apiGroups = Object.fromEntries(apiKindGroups.map((group) => [group.folder, { title: group.title }]));

/**
 * Some books file their pages by folder but serve them flat: a Learn lesson
 * (`1.learn/03.control-flow/06.do-while.md`) is /docs/learn/do-while — the
 * URL every README in rux-lang/Examples links to — and a generated API page
 * (`5.api/03.allocator/2.types/arena.md`) is /docs/api/allocator/arena. Nuxt
 * Content builds the navigation tree from `path`, so it hands back the whole
 * book (or package) as one flat run of links.
 *
 * `stem` still carries the folder, at segment `depth`, and the list is already
 * in stem order, so one pass regroups it: every page joins the group of its
 * folder, which is the folder's overview node when there is one and a
 * synthetic group from `syntheticGroups` when there is not. Pages directly in
 * `node`'s own folder — its overview — stay ungrouped, ahead of the groups.
 */
export function groupByStemFolder(
  node: ContentNavigationItem,
  depth: number,
  syntheticGroups: Record<string, { title: string; icon?: string }> = {},
): ContentNavigationItem {
  const groups = new Map<string, ContentNavigationItem>();
  const children: ContentNavigationItem[] = [];

  for (const item of node.children ?? []) {
    // e.g. docs/1.learn/<folder>/<page> at depth 2. Folder nodes Nuxt Content
    // invents for a path with no page of its own (/docs/learn/install) carry
    // the stem of the folder itself, one segment shorter.
    const segments = item.stem?.split("/") ?? [];
    const folder = segments.length > depth + 1 || item.page === false ? segments[depth] : undefined;
    if (!folder) {
      // The node's own overview.
      children.push(item);
      continue;
    }

    const group = groups.get(folder);
    if (group) {
      group.children!.push(item);
      continue;
    }

    // A part's overview page arrives as a folder node already titled from its
    // .navigation.yml, holding the overview itself as its first child.
    const isOverview = !!item.children?.length && /\/(\d+\.)?index$/.test(item.stem ?? "");
    const created: ContentNavigationItem = isOverview
      ? { ...item, children: [...item.children!] }
      : {
          title: syntheticGroups[folder]?.title ?? folder,
          icon: syntheticGroups[folder]?.icon,
          path: `${node.path}/${folder}`,
          stem: segments.slice(0, depth + 1).join("/"),
          children: [item],
        };
    groups.set(folder, created);
    children.push(created);
  }

  return { ...node, children };
}

/**
 * The /docs/api hub's own sidebar: no package's pages, just the packages that
 * have any, one collapsible group per hub area in registry order — the same
 * outline as the `:api-packages` cards on the page.
 */
export function apiHubBook(book: ContentNavigationItem): ContentNavigationItem {
  const children = apiPackageCatalog(book)
    .map((area) => ({
      title: area.title,
      icon: area.icon,
      path: `${book.path}#${area.slug}`,
      children: area.packages
        .filter((entry) => entry.hasPages)
        .map((entry) => ({ title: entry.name, icon: entry.icon, path: entry.path })),
    }))
    .filter((area) => area.children.length);
  return { ...book, children };
}

/**
 * Resolves the documentation book the current route belongs to.
 *
 * Every documentation page is /docs/<book>/<page>, so the branch is always the
 * `/docs` child matching the second path segment — one rule for all five books,
 * with no section names written down anywhere.
 *
 * It used to key off the *first* segment, back when /start, /cli and /packaging
 * were top-level siblings of /docs; nesting them removed the special case that
 * had to dig /docs/api out of the /docs subtree on its own.
 *
 * Two consumers need this: `app/layouts/docs.vue` for the desktop aside and
 * `AppDocsMobileNav.vue` for the phone drawer, which sits inside the page
 * component rather than the layout and so cannot read the layout's state.
 *
 * Blog posts never reach either: they render through app/pages/blog/[slug].vue,
 * which follows nuxt.com in giving an article no sidebar at all.
 *
 * The API Reference is the one book with a third level. Inside
 * /docs/api/<package>/… the book is that package alone — regrouped by kind for
 * a generated one, its plain children for a hand-written 0.3 folder — and the
 * package switcher above the sidebar stands in for the other 24. On /docs/api
 * itself it is the hub's outline of packages by area.
 */
export const useDocsSection = () => {
  const route = useRoute();
  const navigation = inject<Ref<ContentNavigationItem[] | null>>("navigation", ref([]));

  const segments = computed(() => route.path.split("/"));

  // The /docs/api/<package> folder node the route is inside, if any.
  const apiPackage = computed<ContentNavigationItem | undefined>(() => {
    const [, , slug, packageSlug] = segments.value;
    if (slug !== "api" || !packageSlug) return undefined;
    const api = navigation.value
      ?.find((item) => item.path === "/docs")
      ?.children?.find((item) => item.path === "/docs/api");
    return api?.children?.find((item) => item.path === `/docs/api/${packageSlug}` && item.children?.length);
  });

  const book = computed<ContentNavigationItem | undefined>(() => {
    // The /docs hub itself has no book, and gets no sidebar.
    const slug = segments.value[2];
    if (!slug) return undefined;

    const docs = navigation.value?.find((item) => item.path === "/docs");
    const found = docs?.children?.find((item) => item.path === `/docs/${slug}`);
    if (found?.path === "/docs/learn") return groupByStemFolder(found, 2, learnGroups);
    if (found?.path !== "/docs/api") return found;

    const pkg = apiPackage.value;
    if (!pkg) return apiHubBook(found);
    // docs/5.api/<package>/<group>/<page>: the group folder is segment 3.
    return apiGenerated.has(pkg.path.split("/")[3]!) ? groupByStemFolder(pkg, 3, apiGroups) : pkg;
  });

  // UContentNavigation takes a list. Wrapping the book in one keeps its title as
  // the collapsible group that heads the desktop sidebar; the mobile drawer
  // shows that title in its own header instead and renders `children` flat.
  // The API Reference lists `children` on the desktop too: inside a package
  // the switcher already names it, and on the hub the areas are the outline.
  const section = computed<ContentNavigationItem[]>(() => {
    if (!book.value) return [];
    return book.value.path === "/docs/api" || apiPackage.value ? (book.value.children ?? []) : [book.value];
  });

  // UContentNavigation's `default-open`: `true` opens the groups that hold the
  // current page, `undefined` every group, `false` none. The hub's areas start
  // collapsed, a generated package's handful of kind groups all start open.
  const defaultOpen = computed<boolean | undefined>(() => {
    if (book.value?.path === "/docs/api") return false;
    if (apiPackage.value && apiGenerated.has(apiPackage.value.path.split("/")[3]!)) return undefined;
    return true;
  });

  return { book, section, defaultOpen, apiPackage };
};
