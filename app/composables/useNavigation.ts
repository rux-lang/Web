import type { FooterColumn, NavigationMenuItem } from "@nuxt/ui";

/**
 * Single source of truth for site navigation, ported from nuxt.com's
 * app/composables/useNavigation.ts. The upstream version also builds search
 * links and command-palette groups out of remote data (modules, hosting
 * providers, blog); this site's search is driven entirely by the Nuxt Content
 * collection in app.vue, so only the link definitions survive the port.
 *
 * Social links stay inline in AppHeader.vue / AppFooter.vue: the two lists
 * differ on purpose, and Nuxt Icon's client-bundle scanner only globs
 * `**\/*.{vue,jsx,tsx,md,mdc,mdx,yml,yaml}` — an icon name moved into this
 * `.ts` file is invisible to it and renders as a blank gap after prerender
 * unless it is also pinned in nuxt.config.ts.
 */

export const useHeaderLinks = () => {
  const route = useRoute();

  // Mirrors themeConfig.nav from the old .vitepress/config.mts.
  const headerLinks = computed<NavigationMenuItem[]>(() => [
    {
      // `to` matters even though this is a dropdown: AppHeader flattens the
      // children away inside the docs sections, leaving a plain link.
      label: "Docs",
      to: "/docs",
      active: /^\/(start|docs|cli|api|packaging)(\/|$)/.test(route.path),
      children: [
        {
          label: "Get Started",
          description: "Install Rux and build your first program",
          icon: "i-lucide-rocket",
          to: "/start",
        },
        {
          label: "Rux Reference",
          description: "The complete language reference",
          icon: "i-lucide-book-open",
          to: "/docs",
        },
        {
          label: "CLI Reference",
          description: "Every rux subcommand",
          icon: "i-lucide-square-terminal",
          to: "/cli",
        },
        {
          label: "API Reference",
          description: "Standard library and platform APIs",
          icon: "i-lucide-code-xml",
          to: "/api",
        },
        {
          label: "Packaging",
          description: "Manifests, dependencies, and publishing",
          icon: "i-lucide-package",
          to: "/packaging",
        },
      ],
    },
    { label: "Playground", to: "/playground" },
    {
      label: "Packages",
      to: "/packages",
      active: route.path.startsWith("/packages"),
    },
    { label: "Download", to: "/download" },
    {
      // The four standalone pages that are neither reference nor tooling,
      // grouped so the bar does not run to eight top-level items. `to` points
      // at Community as the most representative of the four, matching how Docs
      // opens onto the reference.
      label: "Resources",
      to: "/community",
      active: /^\/(blog|community|support|faq)(\/|$)/.test(route.path),
      children: [
        {
          label: "Blog",
          description: "Release notes and articles from the project",
          icon: "i-lucide-newspaper",
          to: "/blog",
        },
        {
          label: "Community",
          description: "Where Rux is discussed and built",
          icon: "i-lucide-messages-square",
          to: "/community",
        },
        {
          label: "Support",
          description: "Get help, report a bug, or sponsor the project",
          icon: "i-lucide-hand-heart",
          to: "/support",
        },
        {
          label: "FAQ",
          description: "Short answers to the questions asked most",
          icon: "i-lucide-circle-help",
          to: "/faq",
        },
      ],
    },
  ]);

  return { headerLinks };
};

// verify:links resolves every internal link on every prerendered page, so these
// have to stay in sync with content/ routes.
const footerLinks: FooterColumn[] = [
  {
    label: "Documentation",
    children: [
      { label: "Get Started", to: "/start" },
      { label: "Rux Reference", to: "/docs" },
      { label: "CLI Reference", to: "/cli" },
      { label: "API Reference", to: "/api" },
      { label: "Packaging", to: "/packaging" },
    ],
  },
  {
    label: "Explore",
    children: [
      { label: "Download", to: "/download" },
      { label: "Playground", to: "/playground" },
      { label: "Packages", to: "/packages" },
      { label: "Blog", to: "/blog" },
    ],
  },
  {
    label: "Community",
    children: [
      { label: "Community", to: "/community" },
      { label: "Support", to: "/support" },
      {
        label: "Report a Bug",
        to: "https://github.com/rux-lang/Rux/issues/new?template=bug_report.yml",
        target: "_blank",
      },
      { label: "Design Kit", to: "/design-kit" },
      { label: "FAQ", to: "/faq" },
    ],
  },
  {
    label: "Legal",
    children: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Use", to: "/terms" },
      { label: "Code of Conduct", to: "/code-of-conduct" },
      { label: "Security", to: "/security" },
    ],
  },
];

export const useFooterLinks = () => ({ footerLinks });

export const useNavigation = () => {
  const { headerLinks } = useHeaderLinks();
  const { footerLinks } = useFooterLinks();

  return { headerLinks, footerLinks };
};
