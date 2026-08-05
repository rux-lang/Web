<script setup lang="ts">
const route = useRoute();

// Pages opt into an opacity with `definePageMeta({ heroBackground: "opacity-30" })`.
// Absent the key, the gradient renders at full strength.
const heroBackgroundClass = computed(() => route.meta?.heroBackground ?? "");

// Ported from nuxt.com's default.vue. Three states drive the wash:
//   - before mount it is fully transparent, so the gradient wipes in rather
//     than being painted into the first frame;
//   - `appeared` flips a second later, dropping the entrance duration from 1s
//     to 400ms so subsequent route changes re-tint quickly instead of drifting;
//   - during navigation it pulses, which is what makes the header area feel
//     alive while a page is being fetched.
const { isLoading } = useLoadingIndicator();

const appear = ref(false);
const appeared = ref(false);

onMounted(() => {
  setTimeout(() => {
    appear.value = true;
    setTimeout(() => {
      appeared.value = true;
    }, 1000);
  }, 0);
});
</script>

<template>
  <div>
    <AppHeader />

    <UMain class="relative">
      <HeroBackground
        class="text-primary absolute -top-px -z-10 w-full shrink-0 transition-all"
        :class="[
          isLoading ? 'animate-pulse' : appear ? heroBackgroundClass : 'opacity-0',
          appeared ? 'duration-[400ms]' : 'duration-1000',
        ]"
      />

      <slot />
    </UMain>

    <AppFooter />
  </div>
</template>
