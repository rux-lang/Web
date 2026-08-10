<script setup lang="ts">
import type { KeywordSummary, OffsetPage } from "~/types/catalog";
import {
  CATALOG_PAGE_SIZE,
  catalogKeywordPath,
  catalogPageNumber,
  keywordApiQuery,
  keywordRouteQuery,
  keywordSortOptions,
  scalarQueryValue,
} from "~/utils/catalog";
import { normalizeApiError } from "~/utils/api-problem";
definePageMeta({ layout: "packages" });

useSeoMeta({
  title: "Package keywords · Rux Package Registry",
  description: "Explore package keywords used across the Rux registry.",
});

const route = useRoute();
const api = useRegistryApi();

// The URL is the single source of truth for both controls, as it is on the
// catalog: a shared link reproduces the exact page and ordering.
const sort = computed(() => scalarQueryValue(route.query.sort));
const page = computed(() => catalogPageNumber(route.query.page));
const requestQuery = computed(() => keywordApiQuery(sort.value, page.value));
const requestKey = computed(() => `catalog-keywords:${JSON.stringify(requestQuery.value)}`);

const { data, error, status, refresh } = useLazyAsyncData<OffsetPage<KeywordSummary>>(
  requestKey,
  (_nuxtApp, { signal }) => api.get("/v1/keywords", requestQuery.value, signal),
  { server: false },
);

const failure = computed(() => (error.value ? normalizeApiError(error.value) : null));

// Reordering drops the page: a page number from one ordering means nothing in
// the next, and page 4 of a re-sorted list is rarely where the reader wants to
// land.
function applySort(value: string) {
  return navigateTo({ path: "/packages/-/keywords", query: keywordRouteQuery(value) });
}

function pageTo(target: number) {
  return { path: "/packages/-/keywords", query: keywordRouteQuery(sort.value, target) };
}
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      headline="Catalog"
      title="Package keywords"
      description="Browse the topics package authors use to describe their work."
    />

    <div class="mt-8">
      <AppLoadingState v-if="status === 'pending' || status === 'idle'" label="Loading package keywords" />

      <ApiProblemAlert v-else-if="failure" :failure="failure" @retry="refresh" />

      <section v-else-if="data" aria-labelledby="keyword-list-heading">
        <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 id="keyword-list-heading" class="text-xl font-semibold text-highlighted">Keywords</h2>
          <div class="flex flex-wrap items-center gap-3">
            <p v-if="data.meta.total" class="text-sm text-muted">
              {{ data.meta.total.toLocaleString("en") }}
              {{ data.meta.total === 1 ? "keyword" : "keywords" }}
            </p>
            <USelect
              :model-value="sort"
              :items="keywordSortOptions"
              value-key="value"
              label-key="label"
              placeholder="Number of packages"
              aria-label="Sort keywords by"
              icon="i-lucide-arrow-down-wide-narrow"
              class="w-56"
              :ui="{ placeholder: 'text-default' }"
              @update:model-value="applySort"
            />
          </div>
        </div>

        <UPageGrid v-if="data.data.length">
          <UPageCard
            v-for="keyword in data.data"
            :key="keyword.normalized_keyword"
            :to="catalogKeywordPath(keyword.normalized_keyword)"
            :title="keyword.keyword"
            :description="`${keyword.package_count.toLocaleString('en')} ${keyword.package_count === 1 ? 'package' : 'packages'}`"
            icon="i-lucide-tag"
          />
        </UPageGrid>

        <UEmpty
          v-else
          icon="i-lucide-tags"
          title="No package keywords yet"
          description="Keywords will appear after packages using them are published."
          variant="subtle"
          size="xl"
        />

        <UPagination
          v-if="data.meta.total > CATALOG_PAGE_SIZE"
          :page="page"
          :items-per-page="CATALOG_PAGE_SIZE"
          :total="data.meta.total"
          :to="pageTo"
          show-edges
          class="mt-8 flex justify-center"
        />
      </section>
    </div>
  </UContainer>
</template>
