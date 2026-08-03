import { defineCollection, defineContentConfig, z } from "@nuxt/content";

/**
 * One `docs` collection over all 550 pages.
 *
 * VitePress's five sidebar route keys (/start/, /docs/, /api/, /cli/, /blog/)
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
        date: z.string().optional(),
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
