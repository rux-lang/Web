<script setup lang="ts">
import type { ApiFailure } from "~/types/api";
import type { CursorPage } from "~/types/catalog";
import type { DependentPackage } from "~/types/package";
import { catalogPackagePath, formatPublishedAt, packageTypeLabel } from "~/utils/catalog";
import { normalizeApiError } from "~/utils/api-problem";
import { packageApiPath } from "~/utils/package";

const props = defineProps<{
  namespace: string;
  packageName: string;
}>();

const api = useRegistryApi();
const requestKey = computed(() => `package-dependents:${props.namespace}:${props.packageName}`);
const requestPath = computed(() => `${packageApiPath(props.namespace, props.packageName)}/dependents`);

const { data, error, status, refresh } = await useAsyncData<CursorPage<DependentPackage>>(
  requestKey,
  (_nuxtApp, { signal }) => api.get(requestPath.value, { limit: 20 }, signal),
  { server: false },
);

const items = ref<DependentPackage[]>([]);
const nextCursor = ref<string | null>(null);
const loadingMore = ref(false);
const loadMoreFailure = ref<ApiFailure | null>(null);
const failure = computed(() => (error.value ? normalizeApiError(error.value) : null));

watch(
  data,
  (page) => {
    items.value = page?.data ?? [];
    nextCursor.value = page?.meta?.next_cursor ?? null;
    loadMoreFailure.value = null;
  },
  { immediate: true },
);

async function loadMore() {
  if (!nextCursor.value || loadingMore.value) return;
  loadingMore.value = true;
  loadMoreFailure.value = null;
  try {
    const page = await api.get<CursorPage<DependentPackage>>(requestPath.value, {
      limit: 20,
      cursor: nextCursor.value,
    });
    items.value.push(...page.data);
    nextCursor.value = page.meta.next_cursor;
  } catch (cause) {
    loadMoreFailure.value = normalizeApiError(cause);
  } finally {
    loadingMore.value = false;
  }
}
</script>

<template>
  <section aria-labelledby="dependents-heading">
    <div class="mb-5">
      <h2 id="dependents-heading" class="text-2xl font-semibold text-highlighted">Dependents</h2>
      <p class="mt-2 text-muted">Representative releases that require this package.</p>
    </div>

    <AppLoadingState v-if="status === 'pending'" label="Loading dependents" />
    <ApiProblemAlert v-else-if="failure" :failure="failure" @retry="refresh" />

    <div v-else>
      <div v-if="items.length" class="grid gap-4 sm:grid-cols-2">
        <UPageCard
          v-for="item in items"
          :key="`${item.namespace}/${item.package}`"
          :to="catalogPackagePath(item)"
          :title="`${item.namespace}/${item.package}`"
          :description="item.description || 'No package description provided.'"
          variant="outline"
          :ui="{ title: 'break-all' }"
        >
          <template #footer>
            <div class="space-y-3 text-sm text-muted">
              <div class="flex flex-wrap items-center gap-2">
                <UBadge color="neutral" variant="subtle">
                  {{ packageTypeLabel(item.package_type) }}
                </UBadge>
                <UBadge v-if="item.yanked" color="warning" variant="subtle"> Yanked </UBadge>
                <span>{{ item.version }} · {{ formatPublishedAt(item.published_at) }}</span>
              </div>
              <ul class="space-y-1">
                <li v-for="requirement in item.requirements" :key="requirement.alias">
                  <code class="text-highlighted">{{ requirement.alias }}</code>
                  requires
                  <code class="text-highlighted">{{ requirement.version_range }}</code>
                </li>
              </ul>
            </div>
          </template>
        </UPageCard>
      </div>

      <UEmpty
        v-else
        icon="i-lucide-package-open"
        title="No dependents yet"
        description="No representative package release currently depends on this package."
        variant="subtle"
      />

      <ApiProblemAlert v-if="loadMoreFailure" class="mt-5" :failure="loadMoreFailure" @retry="loadMore" />
      <UButton
        v-else-if="nextCursor"
        class="mt-5"
        label="Load more dependents"
        color="neutral"
        variant="outline"
        icon="i-lucide-chevrons-down"
        :loading="loadingMore"
        @click="loadMore"
      />
    </div>
  </section>
</template>
