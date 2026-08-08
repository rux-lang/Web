import { defineCollection, defineContentConfig, z } from "@nuxt/content";

/**
 * One `docs` collection over all 550 pages.
 *
 * VitePress's five sidebar route keys (/start/, /docs/, /docs/api/, /cli/, /blog/)
 * are five slices of ONE tree, which is exactly what queryCollectionNavigation
 * returns. Splitting per section would mean five navigation queries, five
 * search calls and branching in the catch-all page, for no gain.
 *
 * `source` must be '**' rather than '**\/*.md'. With a .md-only glob the
 * .navigation.yml files are never read, and every directory title silently
 * falls back to a title-cased folder name.
 */
export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: "page",
      source: {
        include: "**",
        exclude: ["partials/**"],
      },
      schema: z.object({
        // Sidebar label when it differs from the H1.
        navigation: z
          .union([
            z.boolean(),
            z.object({
              title: z.string().optional(),
              icon: z.string().optional(),
            }),
          ])
          .optional(),
        // Replaces VitePress's nested-array `head:` blocks.
        seo: z
          .object({
            title: z.string().optional(),
            description: z.string().optional(),
            ogImage: z.string().optional(),
            ogType: z.string().optional(),
            ogUrl: z.string().optional(),
          })
          .optional(),
        // `hideToc: true` drops the "On this page" nav for pages that read as a
        // single unit rather than a document to jump around in (/design-kit).
        // The body still carries body.toc; only the sidebar is suppressed.
        //
        // Stated as hide-rather-than-show on purpose. An optional boolean is
        // NOT undefined when the frontmatter omits it — it comes back out of the
        // SQL dump as `false` — so a `toc: z.boolean().optional()` field reads as
        // "toc: false" on all 550 pages and silently removes every TOC. The
        // negative form makes that default the harmless one.
        hideToc: z.boolean().optional(),
        date: z.string().optional(),
        // Blog card fields, read by app/pages/blog/index.vue and the RSS feed.
        // Only /blog/* sets them; the 540-odd docs pages leave them undefined.
        // The schema is not `.passthrough()`, so a frontmatter key that is not
        // declared here is dropped silently on the way into the SQL dump.
        category: z.string().optional(),
        image: z.string().optional(),
        authors: z
          .array(
            z.object({
              name: z.string(),
              avatar: z.object({ src: z.string() }).optional(),
              to: z.string().optional(),
            }),
          )
          .optional(),
      }),
    }),

    // Queryable but unroutable — routes come only from app/pages/.
    // Holds the generated home-page code samples.
    partials: defineCollection({
      type: "page",
      source: { include: "partials/**" },
    }),
  },
});
