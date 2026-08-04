<!--
  The soft gradient wash that sits directly under the header on every page.

  Ported from nuxt.com (app/components/HeroBackground.vue). It is deliberately a
  static SVG rather than a CSS gradient: the top edge is a 2px hairline that
  fades out at both ends, which a single background-image cannot express. Every
  stop is `currentColor`, so the colour comes from the `text-primary` class the
  caller applies and it follows the Rux palette for free.

  Per-page opacity is driven from `route.meta.heroBackground` in app.vue — see
  the PageMeta augmentation in app/types/page-meta.d.ts.
-->
<template>
  <svg viewBox="0 0 1440 181" fill="none" xmlns="http://www.w3.org/2000/svg" class="pointer-events-none">
    <mask id="hero-bg-mask" fill="white">
      <path d="M0 0H1440V181H0V0Z" />
    </mask>
    <path d="M0 0H1440V181H0V0Z" fill="url(#hero-bg-wash)" fill-opacity="0.22" />
    <path d="M0 2H1440V-2H0V2Z" fill="url(#hero-bg-hairline)" mask="url(#hero-bg-mask)" />
    <defs>
      <linearGradient id="hero-bg-wash" x1="720" y1="0" x2="720" y2="181" gradientUnits="userSpaceOnUse">
        <stop stop-color="currentColor" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="hero-bg-hairline" x1="0" y1="90.5" x2="1440" y2="90.5" gradientUnits="userSpaceOnUse">
        <stop stop-color="currentColor" stop-opacity="0" />
        <stop offset="0.395" stop-color="currentColor" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0" />
      </linearGradient>
    </defs>
  </svg>
</template>
