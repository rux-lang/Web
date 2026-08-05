<script setup lang="ts">
import type { VariantType } from "motion-v";
import { motion } from "motion-v";

/**
 * The mobile menu button, ported from nuxt.com's HeaderToggle.vue.
 *
 * Nuxt UI's default #toggle is a UButton that swaps one icon for another, which
 * pops. This draws the three bars as SVG lines and springs them into an X: the
 * outer two rotate ±45° and slide to the centre, the middle one fades out.
 */
const props = defineProps<{
  open: boolean;
}>();

const variants: { [k: string]: VariantType | ((custom: unknown) => VariantType) } = {
  normal: {
    rotate: 0,
    y: 0,
    opacity: 1,
  },
  close: (custom: unknown) => {
    const bar = custom as number;
    return {
      rotate: bar === 1 ? 45 : bar === 3 ? -45 : 0,
      y: bar === 1 ? 6 : bar === 3 ? -6 : 0,
      opacity: bar === 2 ? 0 : 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    };
  },
};

const state = computed(() => (props.open ? "close" : "normal"));
</script>

<template>
  <UButton
    size="sm"
    variant="ghost"
    color="neutral"
    class="relative -me-1.5"
    square
    :aria-label="open ? 'Close menu' : 'Open menu'"
  >
    <!-- Widens the tap target to 48px on touch devices without changing the
         button's visual size. Pointer devices don't need it. -->
    <span class="absolute top-1/2 left-1/2 size-12 -translate-1/2 [@media(pointer:fine)]:hidden" />

    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <motion.line
        x1="4"
        y1="6"
        x2="20"
        y2="6"
        :variants="variants"
        :animate="state"
        :custom="1"
        class="outline-none"
      />
      <motion.line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        :variants="variants"
        :animate="state"
        :custom="2"
        class="outline-none"
      />
      <motion.line
        x1="4"
        y1="18"
        x2="20"
        y2="18"
        :variants="variants"
        :animate="state"
        :custom="3"
        class="outline-none"
      />
    </svg>
  </UButton>
</template>
