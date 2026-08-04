<script setup lang="ts">
/**
 * One downloadable logo variant on /design-kit.
 *
 * Lives under app/components/content/ because @nuxt/content registers that
 * directory with `pathPrefix: false`, which is what makes
 * `:design-kit-image-card` resolvable from Markdown. The directory has to exist
 * when the module runs, so a fresh checkout needs `nuxt prepare` before the
 * component is found.
 *
 * `path` is the shared basename of the .svg and .png in public/assets/design-kit
 * — the two files must be named identically apart from the extension. The avatar
 * variants ship as PNG only (they are raster exports with a baked background),
 * hence `png-only`.
 */
defineProps<{
  name: string;
  path: string;
  background?: string;
  full?: boolean;
  pngOnly?: boolean;
}>();
</script>

<template>
  <div class="not-prose">
    <UCard :ui="{ body: full ? 'p-11 sm:p-11' : 'p-8 sm:p-8' }" :class="background">
      <img
        :src="`/assets/design-kit/${path}.${pngOnly ? 'png' : 'svg'}`"
        :alt="`Rux logo (${name})`"
        class="mx-auto"
        :class="full ? 'h-10' : 'h-16'"
      />
    </UCard>

    <div class="flex items-center justify-between pt-2">
      <h5 class="font-semibold text-highlighted text-base">
        {{ name }}
      </h5>

      <div class="flex items-center">
        <UButton
          v-if="!pngOnly"
          variant="link"
          label="svg"
          size="sm"
          :to="`/assets/design-kit/${path}.svg`"
          download
          external
          :aria-label="`Download the ${name} logo as SVG`"
        />
        <UButton
          variant="link"
          label="png"
          size="sm"
          :to="`/assets/design-kit/${path}.png`"
          download
          external
          :aria-label="`Download the ${name} logo as PNG`"
        />
      </div>
    </div>
  </div>
</template>
