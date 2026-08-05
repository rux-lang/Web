<script setup lang="ts">
import type { CatalogFilters, CursorPage, PackageSearchResult } from "~/types/catalog";
import { catalogApiQuery, catalogRouteQuery, scalarQueryValue } from "~/utils/catalog";
import { normalizeApiError } from "~/utils/api-problem";

const props = withDefaults(
  defineProps<{
    path: string;
    fixedNamespace?: string;
    fixedKeyword?: string;
    showQuery?: boolean;
    showNamespace?: boolean;
    showKeyword?: boolean;
    requireQuery?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
  }>(),
  {
    fixedNamespace: "",
    fixedKeyword: "",
    showQuery: false,
    showNamespace: true,
    showKeyword: true,
    requireQuery: false,
    emptyTitle: "No packages found",
    emptyDescription: "Try changing or clearing the current filters.",
  },
);

const route = useRoute();
const api = useRegistryApi();

const editableFilters = computed<CatalogFilters>(() => ({
  q: props.showQuery ? scalarQueryValue(route.query.q) : "",
  namespace: props.showNamespace ? scalarQueryValue(route.query.namespace) : "",
  keyword: props.showKeyword ? scalarQueryValue(route.query.keyword) : "",
  packageType: scalarQueryValue(route.query.package_type),
}));

const requestFilters = computed<CatalogFilters>(() => ({
  ...editableFilters.value,
  namespace: props.fixedNamespace || editableFilters.value.namespace,
  keyword: props.fixedKeyword || editableFilters.value.keyword,
}));

const cursor = computed(() => scalarQueryValue(route.query.cursor));
const requestQuery = computed(() => catalogApiQuery(requestFilters.value, cursor.value));
const requestEnabled = computed(() => !props.requireQuery || Boolean(requestFilters.value.q.trim()));
const requestKey = computed(() => `catalog:${props.path}:${JSON.stringify(requestQuery.value)}`);

// Lazy so the surrounding page paints before the catalog request settles; see
// the note in app/pages/packages/index.vue.
const { data, error, status, refresh } = useLazyAsyncData<CursorPage<PackageSearchResult>>(
  requestKey,
  (_nuxtApp, { signal }) => api.get("/v1/search", requestQuery.value, signal),
  { enabled: requestEnabled, server: false },
);

const failure = computed(() => (error.value ? normalizeApiError(error.value) : null));
const paginationQuery = computed(() => catalogRouteQuery(editableFilters.value));

function applyFilters(filters: CatalogFilters) {
  return navigateTo({
    path: props.path,
    query: catalogRouteQuery(filters),
  });
}
</script>

<template>
  <div class="mt-8 space-y-8">
    <CatalogFilterForm
      :initial="editableFilters"
      :show-query="showQuery"
      :show-namespace="showNamespace"
      :show-keyword="showKeyword"
      :submit-label="showQuery ? 'Search' : 'Apply filters'"
      @submit="applyFilters"
    />

    <UEmpty
      v-if="requireQuery && !requestEnabled"
      icon="i-lucide-search"
      title="Start with a search"
      description="Enter a package name, namespace, keyword, or description to search the registry."
      variant="subtle"
      size="xl"
    />

    <AppLoadingState v-else-if="status === 'pending' || status === 'idle'" label="Loading packages" />

    <ApiProblemAlert v-else-if="failure" :failure="failure" @retry="refresh" />

    <section v-else-if="data" aria-labelledby="catalog-results-heading">
      <div class="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="catalog-results-heading" class="text-xl font-semibold text-highlighted">Packages</h2>
        <p v-if="data.data.length" class="text-sm text-muted">
          {{ data.data.length }}
          {{ data.data.length === 1 ? "result" : "results" }} on this page
        </p>
      </div>

      <CatalogPackageGrid v-if="data.data.length" :items="data.data" />
      <UEmpty
        v-else
        icon="i-lucide-package-x"
        :title="emptyTitle"
        :description="emptyDescription"
        variant="subtle"
        size="xl"
      />

      <CursorPager :path="path" :query="paginationQuery" :cursor="cursor" :next-cursor="data.meta.next_cursor" />
    </section>
  </div>
</template>
