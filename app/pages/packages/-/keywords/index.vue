<script setup lang="ts">
import type { CursorPage, KeywordSummary } from "~/types/catalog";
import { catalogKeywordPath, scalarQueryValue } from "~/utils/catalog";
import { normalizeApiError } from "~/utils/api-problem";
definePageMeta({ layout: "packages" });

useSeoMeta({
  title: "Package keywords · Rux Package Registry",
  description: "Explore package keywords used across the Rux registry.",
});

const route = useRoute();
const api = useRegistryApi();
const cursor = computed(() => scalarQueryValue(route.query.cursor));
const requestQuery = computed<Record<string, string | number>>(() => ({
  limit: 20,
  ...(cursor.value ? { cursor: cursor.value } : {}),
}));
const requestKey = computed(() => `catalog-keywords:${cursor.value}`);

const { data, error, status, refresh } = await useAsyncData<CursorPage<KeywordSummary>>(
  requestKey,
  (_nuxtApp, { signal }) => api.get("/v1/keywords", requestQuery.value, signal),
  { server: false },
);

const failure = computed(() => (error.value ? normalizeApiError(error.value) : null));
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      headline="Catalog"
      title="Package keywords"
      description="Browse the topics package authors use to describe their work."
    />

    <div class="mt-8">
      <AppLoadingState v-if="status === 'pending'" label="Loading package keywords" />

      <ApiProblemAlert v-else-if="failure" :failure="failure" @retry="refresh" />

      <section v-else-if="data" aria-labelledby="keyword-list-heading">
        <div class="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="keyword-list-heading" class="text-xl font-semibold text-highlighted">Keywords</h2>
          <p v-if="data.data.length" class="text-sm text-muted">
            {{ data.data.length }}
            {{ data.data.length === 1 ? "keyword" : "keywords" }} on this page
          </p>
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

        <CursorPager path="/packages/-/keywords" :query="{}" :cursor="cursor" :next-cursor="data.meta.next_cursor" />
      </section>
    </div>
  </UContainer>
</template>
