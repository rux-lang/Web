<script setup lang="ts">
/**
 * One typeface specimen on /design-kit.
 *
 * `mono` picks --font-mono over --font-sans (both declared in main.css and
 * self-hosted from public/fonts), so the specimen renders in the very face the
 * site ships rather than a look-alike.
 */
defineProps<{
  name: string;
  usage: string;
  mono?: boolean;
}>();
</script>

<template>
  <div class="not-prose">
    <UCard :ui="{ body: 'p-8 sm:p-8' }">
      <p class="text-6xl leading-none text-highlighted" :class="mono ? 'font-mono' : 'font-sans'">Aa</p>
      <p class="text-muted text-sm mt-4 break-words" :class="mono ? 'font-mono' : 'font-sans'">
        ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
      </p>
    </UCard>

    <div class="pt-2">
      <h5 class="font-semibold text-highlighted text-base">
        {{ name }}
      </h5>
      <p class="text-muted text-sm">
        {{ usage }}
      </p>
    </div>
  </div>
</template>
