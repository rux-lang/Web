import type { ContentNavigationItem } from "@nuxt/content";

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
    return docs?.children?.find((item) => item.path === `/docs/${slug}`);
  });

  // UContentNavigation takes a list. Wrapping the book in one keeps its title as
  // the collapsible group that heads the desktop sidebar; the mobile drawer
  // shows that title in its own header instead and renders `children` flat.
  const section = computed<ContentNavigationItem[]>(() => (book.value ? [book.value] : []));

  return { book, section };
};
