<!--
  The Rux brand mark on its own — the omega glyph from RuxLogo, without the
  wordmark beside it.

  Drawn in `currentColor` rather than the logo's baked purple so the caller sets
  the colour. That is what the footer seam needs: nuxt.com marks it with a
  monochrome `i-simple-icons-nuxtdotjs` that sits back in the muted grey, and a
  full-strength purple logo there reads as a second header instead of a divider.

  Same geometry as public/assets/design-kit/icon-*.svg, kept on that file's
  square 512 viewBox so it drops into a square icon slot without extra padding.
-->
<template>
  <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M464,364c0,5.52-2.24,10.52-5.86,14.14-3.62,3.62-8.62,5.86-14.14,5.86h-132l-41.24-41.24c41.57-7.01,73.24-43.19,73.24-86.76,0-48.6-39.4-88-88-88s-88,39.4-88,88c0,43.57,31.67,79.75,73.24,86.76l-41.24,41.24H68c-11.05,0-20-8.95-20-20,0-5.52,2.24-10.52,5.86-14.14s8.62-5.86,14.14-5.86h95.05c-21.72-22.94-35.05-53.92-35.05-88,0-70.69,57.31-128,128-128s128,57.31,128,128c0,34.08-13.33,65.06-35.05,88h95.05c11.05,0,20,8.95,20,20Z"
      fill="currentColor"
    />
    <circle cx="224" cy="272" r="20" fill="currentColor" />
    <circle cx="288" cy="272" r="20" fill="currentColor" />
  </svg>
</template>
