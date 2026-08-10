<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import type { CatalogFilters } from "~/types/catalog";
import { catalogSortOptions, packageTypeOptions } from "~/utils/catalog";

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
  Boolean(state.q || state.namespace || state.keyword || state.packageType || state.sort),
);

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
  });
  submit();
}
</script>

<template>
  <UForm
    :state="state"
    class="grid items-end gap-4 rounded-lg bg-elevated/50 p-4 ring ring-default sm:grid-cols-2 lg:grid-cols-3"
    :aria-label="showQuery ? 'Search and filter packages' : 'Catalog filters'"
    @submit="submit"
  >
    <!--
      The search term leads the block on its own row: it is the control most
      requests start from, and the narrower filters below read as refinements
      of it rather than as five peers.
    -->
    <UFormField v-if="showQuery" name="q" label="Search" class="sm:col-span-2 lg:col-span-3">
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
      <!--
        Applied on change rather than on submit: an ordering that needs a second
        click to take effect reads as a broken control.
      -->
      <USelect
        v-model="state.sort"
        :items="catalogSortOptions"
        value-key="value"
        label-key="label"
        :placeholder="state.q ? 'Relevance' : 'Alphabetical'"
        class="w-full"
        :ui="{ placeholder: 'text-default' }"
        @update:model-value="submit"
      />
    </UFormField>

    <div class="flex flex-wrap gap-2">
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
