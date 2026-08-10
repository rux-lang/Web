<script setup lang="ts">
import type { CatalogFilters, OffsetPage, PackageSearchResult } from "~/types/catalog";
import {
  CATALOG_PAGE_SIZE,
  catalogApiQuery,
  catalogPageNumber,
  catalogRouteQuery,
  scalarQueryValue,
} from "~/utils/catalog";
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

// `q` is read whether or not the input is rendered: `showQuery` decides where
// the search box lives, not whether the term survives. Gating the read here
// would drop the active search from the URL the moment any other filter was
// applied on a page that hosts its search elsewhere, such as /packages.
const editableFilters = computed<CatalogFilters>(() => ({
  q: scalarQueryValue(route.query.q),
  namespace: props.showNamespace ? scalarQueryValue(route.query.namespace) : "",
  keyword: props.showKeyword ? scalarQueryValue(route.query.keyword) : "",
  packageType: scalarQueryValue(route.query.package_type),
  sort: scalarQueryValue(route.query.sort),
}));

const requestFilters = computed<CatalogFilters>(() => ({
  ...editableFilters.value,
  namespace: props.fixedNamespace || editableFilters.value.namespace,
  keyword: props.fixedKeyword || editableFilters.value.keyword,
}));

const page = computed(() => catalogPageNumber(route.query.page));
const requestQuery = computed(() => catalogApiQuery(requestFilters.value, page.value));
const requestEnabled = computed(() => !props.requireQuery || Boolean(requestFilters.value.q.trim()));
const requestKey = computed(() => `catalog:${props.path}:${JSON.stringify(requestQuery.value)}`);

// Lazy so the surrounding page paints before the catalog request settles; see
// the note in app/pages/packages/index.vue.
const { data, error, status, refresh } = useLazyAsyncData<OffsetPage<PackageSearchResult>>(
  requestKey,
  (_nuxtApp, { signal }) => api.get("/v1/search", requestQuery.value, signal),
  { enabled: requestEnabled, server: false },
);

const failure = computed(() => (error.value ? normalizeApiError(error.value) : null));

// Rendering the pager as links keeps every page a real address, which the back
// button and a shared URL both need on a statically hosted site.
function pageTo(target: number) {
  return { path: props.path, query: catalogRouteQuery(editableFilters.value, target) };
}

function applyFilters(filters: CatalogFilters) {
  // No page argument, so any filter change lands back on page one — a page
  // number carried over from a wider result set usually points past the end.
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
        <p v-if="data.meta.total" class="text-sm text-muted">
          {{ data.meta.total.toLocaleString("en") }}
          {{ data.meta.total === 1 ? "package" : "packages" }}
        </p>
      </div>

      <CatalogPackageGrid v-if="data.data.length" :items="data.data" show-downloads />
      <UEmpty
        v-else
        icon="i-lucide-package-x"
        :title="emptyTitle"
        :description="emptyDescription"
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
</template>
