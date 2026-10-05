import type { ContentNavigationItem } from "@nuxt/content";

/**
 * Sidebar groups of the Learn Rux book that have no overview page of their own
 * to take a title and icon from. Every course part (`01.basics/`, …) has one —
 * its `00.index.md` plus `.navigation.yml` — so only the onboarding folder is
 * listed here.
 */
const learnGroups: Record<string, Pick<ContentNavigationItem, "title" | "icon">> = {
  "00.start": { title: "Getting Started", icon: "i-lucide-rocket" },
};

/**
 * Lessons are filed by part (`1.learn/03.control-flow/06.do-while.md`) but
 * served flat (`/docs/learn/do-while`) — the URLs every README in
 * rux-lang/Examples links to. Nuxt Content builds the navigation tree from
 * `path`, so it hands back the whole course as one flat run of 250 links.
 *
 * `stem` still carries the folder, and the list is already in stem (course)
 * order, so one pass regroups it: every page joins the group of its part
 * folder, which is the part's overview node when there is one and a synthetic
 * folder from `learnGroups` when there is not.
 */
function groupLearnBook(book: ContentNavigationItem): ContentNavigationItem {
  const groups = new Map<string, ContentNavigationItem>();
  const children: ContentNavigationItem[] = [];

  for (const item of book.children ?? []) {
    // docs/1.learn/<folder>/<page>. Folder nodes Nuxt Content invents for a
    // path with no page of its own (/docs/learn/install) carry the stem of
    // the folder itself, one segment shorter.
    const segments = item.stem?.split("/") ?? [];
    const folder = segments.length > 3 || item.page === false ? segments[2] : undefined;
    if (!folder) {
      // The book's own overview.
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
          title: learnGroups[folder]?.title ?? folder,
          icon: learnGroups[folder]?.icon,
          path: `${book.path}/${folder}`,
          stem: segments.slice(0, 3).join("/"),
          children: [item],
        };
    groups.set(folder, created);
    children.push(created);
  }

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
 */
export const useDocsSection = () => {
  const route = useRoute();
  const navigation = inject<Ref<ContentNavigationItem[] | null>>("navigation", ref([]));

  const book = computed<ContentNavigationItem | undefined>(() => {
    // The /docs hub itself has no book, and gets no sidebar.
    const slug = route.path.split("/")[2];
    if (!slug) return undefined;

    const docs = navigation.value?.find((item) => item.path === "/docs");
    const found = docs?.children?.find((item) => item.path === `/docs/${slug}`);
    return found?.path === "/docs/learn" ? groupLearnBook(found) : found;
  });

  // UContentNavigation takes a list. Wrapping the book in one keeps its title as
  // the collapsible group that heads the desktop sidebar; the mobile drawer
  // shows that title in its own header instead and renders `children` flat.
  const section = computed<ContentNavigationItem[]>(() => (book.value ? [book.value] : []));

  return { book, section };
};
