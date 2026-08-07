<script setup lang="ts">
import type { DataEnvelope, PackageHighlights } from "~/types/catalog";
import { canonicalSearchText } from "~/utils/catalog";
import { normalizeApiError } from "~/utils/api-problem";
definePageMeta({ layout: "packages" });

useSeoMeta({
  title: "Packages",
  description: "Discover and publish packages for the Rux programming language.",
});

const api = useRegistryApi();
const search = reactive({ q: "" });

/**
 * Lazy, not awaited. `await useAsyncData` suspends the component until the
 * request settles, so with `server: false` the whole page waited on the API
 * before painting anything. Lazy returns immediately, the shell renders, and
 * the highlights fill in — which is the point of loading them client-side.
 */
const { data, error, status, refresh } = useLazyAsyncData<DataEnvelope<PackageHighlights>>(
  "catalog-highlights",
  (_nuxtApp, { signal }) => api.get("/v1/highlights", undefined, signal),
  { server: false },
);

const failure = computed(() => (error.value ? normalizeApiError(error.value) : null));

// `idle` is the status before the client-side fetch starts. Without it the
// template falls through to the empty state for a frame and flashes
// "No package highlights yet" before the spinner appears.
const loading = computed(() => status.value === "pending" || status.value === "idle");
const hasHighlights = computed(() => Boolean(data.value?.data.recent.length || data.value?.data.popular.length));

function submitSearch() {
  const query = canonicalSearchText(search.q);
  if (!query) return;
  return navigateTo({ path: "/packages/-/search", query: { q: query } });
}
</script>

<template>
  <div>
    <UPageHero
      title="Rux Packages"
      description="Discover, publish, and download packages for the Rux programming language."
    >
      <UForm
        :state="search"
        aria-label="Search packages"
        class="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
        @submit="submitSearch"
      >
        <UFormField name="q" label="Search packages" class="flex-1 text-left">
          <UInput
            v-model="search.q"
            type="search"
            icon="i-lucide-search"
            placeholder="Package name, namespace, keyword, or description"
            autocomplete="off"
            class="w-full"
          />
        </UFormField>
        <UButton type="submit" label="Search" class="sm:mt-6" />
      </UForm>

      <template #links>
        <UButton
          label="Browse all packages"
          color="neutral"
          variant="outline"
          icon="i-lucide-package-search"
          to="/packages"
        />
        <UButton
          label="Explore keywords"
          color="neutral"
          variant="ghost"
          icon="i-lucide-tags"
          to="/packages/-/keywords"
        />
      </template>
    </UPageHero>

    <UContainer class="pb-16 sm:pb-24">
      <AppLoadingState v-if="loading" label="Loading package highlights" />

      <ApiProblemAlert v-else-if="failure" :failure="failure" @retry="refresh" />

      <UEmpty
        v-else-if="!hasHighlights"
        icon="i-lucide-package-open"
        title="No package highlights yet"
        description="Published packages will appear here as the registry grows."
        variant="subtle"
        size="xl"
      />

      <div v-else class="space-y-16">
        <section v-if="data?.data.recent.length" aria-labelledby="recent-packages-heading">
          <div class="mb-6">
            <h2 id="recent-packages-heading" class="text-2xl font-semibold text-highlighted">Recently published</h2>
            <p class="mt-2 text-muted">The latest active packages added to the registry.</p>
          </div>
          <CatalogPackageGrid :items="data.data.recent" />
        </section>

        <section v-if="data?.data.popular.length" aria-labelledby="popular-packages-heading">
          <div class="mb-6">
            <h2 id="popular-packages-heading" class="text-2xl font-semibold text-highlighted">Popular packages</h2>
            <p class="mt-2 text-muted">
              Most downloaded over the last
              {{ data.data.window_days }} days.
            </p>
          </div>
          <CatalogPackageGrid :items="data.data.popular" show-downloads />
        </section>
      </div>

      <section class="mt-16 border-t border-default pt-12" aria-labelledby="browse-packages-heading">
        <UPageHeader
          id="browse-packages-heading"
          headline="Catalog"
          title="Browse packages"
          description="Explore packages published by the Rux community."
        />
        <CatalogExplorer
          path="/packages"
          empty-title="No published packages"
          empty-description="No packages match the current catalog filters."
        />
      </section>
    </UContainer>
  </div>
</template>
