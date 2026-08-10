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
  <div>
    <UPageHero
      title="Rux Packages"
      description="Discover, publish, and download packages for the Rux programming language."
    >
      <template #links>
        <UButton
          label="Explore keywords"
          color="neutral"
          variant="outline"
          icon="i-lucide-tags"
          to="/packages/-/keywords"
        />
      </template>
    </UPageHero>

    <UContainer class="pb-16 sm:pb-24">
      <section aria-labelledby="browse-packages-heading">
        <UPageHeader
          id="browse-packages-heading"
          headline="Catalog"
          title="Browse packages"
          description="Search the registry, then narrow and order the results."
        />
        <!--
          `show-query` puts the search box inside the filter block rather than in
          the hero: one control group owns every part of the query, so a term and
          a filter are set and cleared together instead of from two places.
        -->
        <CatalogExplorer
          path="/packages"
          show-query
          empty-title="No published packages"
          empty-description="No packages match the current search and filters."
        />
      </section>
    </UContainer>
  </div>
</template>
