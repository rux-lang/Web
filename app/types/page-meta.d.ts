/**
 * `heroBackground` controls the per-page opacity/z-index of <HeroBackground> in
 * app.vue, as a Tailwind class string (e.g. "opacity-30 -z-10"). nuxt.com reads
 * the same key untyped; `nuxt typecheck` is a CI gate here, so it is declared.
 *
 * Augmenting `#app`'s PageMeta is enough for both call sites: Nuxt already
 * declares `RouteMeta extends UnwrapRef<PageMeta>`, so `definePageMeta()` and
 * `route.meta` pick this up together.
 */
declare module "#app" {
  interface PageMeta {
    heroBackground?: string;
  }
}

export {};
