<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import type { CatalogFilters } from "~/types/catalog";
import {
  canonicalSearchText,
  catalogSortOptions,
  defaultCatalogOrder,
  defaultCatalogSort,
  packageTypeOptions,
} from "~/utils/catalog";

const props = withDefaults(
  defineProps<{
    initial: CatalogFilters;
    showQuery?: boolean;
    showNamespace?: boolean;
    showKeyword?: boolean;
    showPackageType?: boolean;
    submitLabel?: string;
  }>(),
  {
    showQuery: false,
    showNamespace: true,
    showKeyword: true,
    showPackageType: true,
    submitLabel: "Apply filters",
  },
);

const emit = defineEmits<{
  submit: [filters: CatalogFilters];
}>();

const state = reactive<CatalogFilters>({ ...props.initial });

watch(
  () => props.initial,
  (initial) => {
    Object.assign(state, initial);
  },
  { deep: true },
);

const hasValues = computed(() =>
  Boolean(state.q || state.namespace || state.keyword || state.packageType || state.sort || state.order),
);
const effectiveSort = computed(() => state.sort || defaultCatalogSort(canonicalSearchText(state.q)));
const effectiveOrder = computed(() => state.order || defaultCatalogOrder(effectiveSort.value));
const directionLocked = computed(() => effectiveSort.value === "relevance");
const directionIcon = computed(() => (effectiveOrder.value === "asc" ? "i-lucide-arrow-up" : "i-lucide-arrow-down"));
const directionLabel = computed(() => {
  if (directionLocked.value) return "Relevance is sorted by best match first";
  return effectiveOrder.value === "asc" ? "Sort ascending" : "Sort descending";
});
const directionTooltip = computed(() => {
  if (directionLocked.value) return "Relevance always shows best matches first";
  return effectiveOrder.value === "asc" ? "Ascending" : "Descending";
});

function submit() {
  emit("submit", { ...state });
}

function clear() {
  Object.assign(state, {
    q: "",
    namespace: "",
    keyword: "",
    packageType: "",
    sort: "",
    order: "",
  });
  submit();
}

function changeSort(value: string) {
  state.sort = value;
  state.order = defaultCatalogOrder(value || defaultCatalogSort(canonicalSearchText(state.q)));
  submit();
}

function toggleOrder() {
  if (directionLocked.value) return;
  state.order = effectiveOrder.value === "asc" ? "desc" : "asc";
  submit();
}
</script>

<template>
  <UForm
    :state="state"
    class="grid items-end gap-4 rounded-lg bg-elevated/50 p-4 ring ring-default sm:grid-cols-2 lg:grid-cols-4"
    :aria-label="showQuery ? 'Search and filter packages' : 'Catalog filters'"
    @submit="submit"
  >
    <!-- Search stays the widest control without pushing every filter below it. -->
    <UFormField v-if="showQuery" name="q" label="Search" class="sm:col-span-2">
      <UInput
        v-model="state.q"
        type="search"
        icon="i-lucide-search"
        placeholder="Package name, namespace, keyword, or description"
        autocomplete="off"
        class="w-full"
      />
    </UFormField>

    <UFormField v-if="showNamespace" name="namespace" label="Namespace">
      <UInput v-model="state.namespace" placeholder="For example, rux" autocomplete="off" class="w-full" />
    </UFormField>

    <UFormField v-if="showKeyword" name="keyword" label="Keyword">
      <UInput v-model="state.keyword" placeholder="For example, json" autocomplete="off" class="w-full" />
    </UFormField>

    <UFormField v-if="showPackageType" name="packageType" label="Package type">
      <USelect
        v-model="state.packageType"
        :items="packageTypeOptions"
        value-key="value"
        label-key="label"
        placeholder="All types"
        class="w-full"
        :ui="{ placeholder: 'text-default' }"
      />
    </UFormField>

    <UFormField name="sort" label="Sort by">
      <!-- Sort and direction changes apply immediately and return to page one. -->
      <UFieldGroup class="w-full">
        <USelect
          :model-value="state.sort"
          :items="catalogSortOptions"
          value-key="value"
          label-key="label"
          :placeholder="state.q ? 'Relevance' : 'Alphabetical'"
          class="min-w-0 flex-1"
          :ui="{ placeholder: 'text-default' }"
          @update:model-value="changeSort"
        />
        <UTooltip :text="directionTooltip">
          <UButton
            type="button"
            :icon="directionIcon"
            color="neutral"
            variant="outline"
            :aria-label="directionLabel"
            :aria-disabled="directionLocked"
            @click="toggleOrder"
          />
        </UTooltip>
      </UFieldGroup>
    </UFormField>

    <div class="flex flex-wrap gap-2 sm:col-span-2">
      <UButton type="submit" :label="submitLabel" :icon="showQuery ? 'i-lucide-search' : 'i-lucide-filter'" />
      <UButton
        v-if="hasValues"
        type="button"
        label="Clear"
        color="neutral"
        variant="outline"
        icon="i-lucide-x"
        @click="clear"
      />
    </div>
  </UForm>
</template>
