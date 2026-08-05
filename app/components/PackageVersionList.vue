<script setup lang="ts">
import type { ApiFailure } from "~/types/api";
import type { CursorPage } from "~/types/catalog";
import type { PackageVersionHistory } from "~/types/package";
import { formatPublishedAt, packageTypeLabel } from "~/utils/catalog";
import { normalizeApiError } from "~/utils/api-problem";
import { packageApiPath, packageVersionTarget } from "~/utils/package";

const props = defineProps<{
  namespace: string;
  packageName: string;
  selectedVersion: string;
  representativeVersion: string;
}>();

const api = useRegistryApi();
const requestKey = computed(() => `package-versions:${props.namespace}:${props.packageName}`);
const requestPath = computed(() => `${packageApiPath(props.namespace, props.packageName)}/versions`);

const { data, error, status, refresh } = useLazyAsyncData<CursorPage<PackageVersionHistory>>(
  requestKey,
  (_nuxtApp, { signal }) => api.get(requestPath.value, { limit: 20 }, signal),
  { server: false },
);

const items = ref<PackageVersionHistory[]>([]);
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

function versionTarget(version: string) {
  return packageVersionTarget(props.namespace, props.packageName, version, props.representativeVersion);
}

async function loadMore() {
  if (!nextCursor.value || loadingMore.value) return;
  loadingMore.value = true;
  loadMoreFailure.value = null;
  try {
    const page = await api.get<CursorPage<PackageVersionHistory>>(requestPath.value, {
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
  <UCard>
    <template #header>
      <div>
        <h2 class="font-semibold text-highlighted">Versions</h2>
        <p class="mt-1 text-sm text-muted">Newest releases first.</p>
      </div>
    </template>

    <AppLoadingState v-if="status === 'pending' || status === 'idle'" label="Loading versions" />
    <ApiProblemAlert v-else-if="failure" :failure="failure" @retry="refresh" />

    <div v-else>
      <ul v-if="items.length" class="space-y-1">
        <li v-for="item in items" :key="item.version">
          <UButton
            :to="versionTarget(item.version)"
            color="neutral"
            :variant="item.version === selectedVersion ? 'soft' : 'ghost'"
            block
            class="h-auto justify-start px-3 py-2 text-left"
            :aria-current="item.version === selectedVersion ? 'page' : undefined"
          >
            <span class="min-w-0 flex-1">
              <span class="flex flex-wrap items-center gap-2">
                <code class="font-semibold">{{ item.version }}</code>
                <UBadge v-if="item.yanked" color="warning" variant="subtle" size="xs"> Yanked </UBadge>
              </span>
              <span class="mt-1 block text-xs text-muted">
                {{ packageTypeLabel(item.package_type) }} ·
                {{ formatPublishedAt(item.published_at) }}
              </span>
            </span>
          </UButton>
        </li>
      </ul>

      <UEmpty
        v-else
        icon="i-lucide-package-x"
        title="No versions found"
        description="This package has no visible release history."
        variant="subtle"
      />

      <ApiProblemAlert v-if="loadMoreFailure" class="mt-4" :failure="loadMoreFailure" @retry="loadMore" />
      <UButton
        v-else-if="nextCursor"
        class="mt-4"
        block
        label="Load more versions"
        color="neutral"
        variant="outline"
        icon="i-lucide-chevrons-down"
        :loading="loadingMore"
        @click="loadMore"
      />
    </div>
  </UCard>
</template>
