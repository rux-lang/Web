<!--
  The Rux brand mark on its own — the `R` glyph from RuxLogo, without the wordmark beside it. Drawn in `currentColor` rather than the logo's baked violet/amber gradients so the caller sets the colour. That is what the footer seam needs: nuxt.com marks it with a monochrome `i-simple-icons-nuxtdotjs` that sits back in the muted grey, and a full-strength colour logo there reads as a second header instead of a divider. Same geometry as public/assets/design-kit/icon-*.svg, kept on that file's square 512 viewBox so it drops into a square icon slot without extra padding.
-->
<template>
  <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M102.4,204.8v102.4H0v-102.4h102.4ZM307.2,204.8h-102.4v102.4h102.4v-102.4ZM102.4,307.2v102.4h102.4v-102.4h-102.4ZM0,512h102.4v-102.4H0v102.4ZM307.2,512v-102.4h-102.4v102.4h102.4Z"
      fill="currentColor"
    />
    <path
      d="M442.65,358.4c42.52-37.53,69.35-92.43,69.35-153.6C512,91.69,420.31,0,307.2,0H102.4v204.8h102.4v-102.4h102.4c56.46,0,102.4,45.94,102.4,102.4s-45.94,102.4-102.4,102.4v102.4c56.46,0,102.4,45.94,102.4,102.4h102.4c0-61.17-26.83-116.07-69.35-153.6Z"
      fill="currentColor"
    />
  </svg>
</template>
