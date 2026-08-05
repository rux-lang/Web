/**
 * The blog feed, served at /blog/rss.xml (the path nuxt.com uses).
 *
 * This is the only server route in the repo — the registry API is a separate
 * Rust service, and everything else here is a prerendered page. It exists as a
 * nitro route rather than a post-build script so that `queryCollection` is the
 * one thing reading the blog, exactly as app/pages/blog/index.vue does; the
 * route is listed in `nitro.prerender.routes`, so `nuxt generate` bakes it to
 * .output/public/blog/rss.xml and nothing serves it at runtime.
 */
// Imported explicitly rather than auto-imported: `queryCollection` is declared
// as a global twice — once by .nuxt/types/imports.d.ts (the app's one-argument
// client version) and once by .nuxt/types/nitro-imports.d.ts (this one, which
// takes the H3Event first). The app declaration is the one in scope when
// vue-tsc checks this file, so relying on the auto-import fails typecheck with
// "Expected 1 arguments, but got 2" even though it runs correctly.
import { queryCollection } from "@nuxt/content/nitro";

import { buildRssFeed, type FeedItem } from "../../utils/feed";

// Hardcoded like every other absolute URL on the site (canonicals, og:url).
// `useSiteConfig` is a client-side auto-import; its nitro counterpart is not
// worth a second source of truth for one string.
const SITE_URL = "https://rux-lang.dev";

const FEED_TITLE = "Rux Blog";
const FEED_DESCRIPTION = "Release notes and articles from the Rux programming language project.";

export default defineEventHandler(async (event) => {
  // Mirrors the blog index query: the collection source is '**' so that
  // .navigation.yml is read for directory titles, which also makes those files
  // queryable — hence the explicit extension filter.
  const posts = await queryCollection(event, "docs")
    .where("path", "LIKE", "/blog/%")
    .where("extension", "=", "md")
    .order("date", "DESC")
    .all();

  const items: FeedItem[] = posts.map((post) => ({
    // Posts carry an seo block for the share cards; its title and description
    // are written for a reader arriving cold, which is also the feed's
    // audience. `title`/`description` are Nuxt Content's derivations from the
    // H1 and first paragraph and are the fallback.
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.description,
    url: SITE_URL + post.path,
    date: post.date,
  }));

  setHeader(event, "content-type", "application/rss+xml; charset=utf-8");

  return buildRssFeed({
    title: FEED_TITLE,
    description: FEED_DESCRIPTION,
    link: `${SITE_URL}/blog`,
    self: `${SITE_URL}/blog/rss.xml`,
    items,
  });
});
