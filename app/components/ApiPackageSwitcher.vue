<script setup lang="ts">
/**
 * The package picker that heads the API Reference sidebar inside
 * /docs/api/<package>/…, where the sidebar lists that one package only.
 *
 * It offers every package that has pages — a generated one or a 0.3 folder —
 * grouped by hub area, and choosing one opens its overview. The pending
 * packages are left out: they have nowhere to go, and the hub already shows
 * them. Rendered by app/layouts/docs.vue on the desktop and by
 * AppDocsMobileNav.vue in the phone drawer.
 *
 * The menu content carries `z-50` for the drawer's sake: reka-ui's popper
 * wrapper copies its z-index from the content, which has none, so in the
 * drawer the sidebar's own positioned links painted over the open menu and
 * took the click meant for a package.
 */
const props = defineProps<{ current: string }>();

const { areas } = useApiPackages();

interface PackageItem {
  label: string;
  value: string;
  icon: string;
  version?: string;
  platform?: string;
}

const items = computed(() =>
  areas.value.flatMap((area) => {
    const packages = area.packages.filter((entry) => entry.hasPages);
    if (!packages.length) return [];
    return [
      [
        { type: "label" as const, label: area.title },
        ...packages.map<PackageItem>((entry) => ({
          label: entry.name,
          value: entry.path,
          icon: entry.icon,
          version: entry.version,
          platform: entry.platform,
        })),
      ],
    ];
  }),
);

const selected = computed(() =>
  items.value.flat().find((item): item is PackageItem => "value" in item && item.value === props.current),
);

// The slots type `item` as any of the menu's item shapes, label rows included.
const details = (item: unknown) => item as PackageItem;

function open(item: unknown) {
  const path = item ? details(item).value : undefined;
  if (path && path !== props.current) navigateTo(path);
}
</script>

<template>
  <USelectMenu
    :model-value="selected"
    :items="items"
    :icon="selected?.icon"
    :search-input="{ placeholder: 'Find a package…' }"
    color="neutral"
    variant="outline"
    aria-label="Switch package"
    class="w-full"
    :ui="{ content: 'min-w-fit max-h-96 z-50' }"
    @update:model-value="open"
  >
    <span v-if="selected" class="flex min-w-0 items-center gap-1.5">
      <span class="truncate font-medium text-highlighted">{{ selected.label }}</span>
      <span v-if="selected.version" class="text-xs text-muted">v{{ selected.version }}</span>
    </span>

    <template #item-label="{ item }">
      <span class="flex items-center gap-1.5">
        {{ item.label }}
        <span v-if="details(item).version" class="text-xs text-muted">v{{ details(item).version }}</span>
        <UBadge
          v-if="details(item).platform"
          :label="details(item).platform"
          color="neutral"
          variant="subtle"
          size="sm"
        />
      </span>
    </template>
  </USelectMenu>
</template>
