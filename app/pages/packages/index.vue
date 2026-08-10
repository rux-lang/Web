<script setup lang="ts">
definePageMeta({ layout: "packages" });

useSeoMeta({
  title: "Packages",
  description: "Discover and publish packages for the Rux programming language.",
  ogTitle: "Rux Packages",
  ogDescription: "Discover and publish packages for the Rux programming language.",
  ogType: "website",
  ogUrl: "https://rux-lang.dev/packages",
  ogImage: "https://rux-lang.dev/images/og-packages.png",
  twitterCard: "summary_large_image",
  twitterTitle: "Rux Packages",
  twitterImage: "https://rux-lang.dev/images/og-packages.png",
});

useHead({
  link: [{ rel: "canonical", href: "https://rux-lang.dev/packages" }],
});
</script>

<template>
  <UContainer class="pb-16 sm:pb-24">
    <UPageHeader
      title="Rux Packages"
      description="Discover, publish, and download packages for the Rux programming language."
    />

    <CatalogExplorer
      path="/packages"
      show-query
      empty-title="No published packages"
      empty-description="No packages match the current search and filters."
    />
  </UContainer>
</template>
