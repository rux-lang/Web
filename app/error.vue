<script setup lang="ts">
import type { NuxtError } from "#app";
defineProps<{ error: NuxtError }>();
useHead({ title: "Page not found" });
</script>
<template>
  <!--
    A fatal error replaces app.vue entirely, so this component supplies its own
    UApp. The chrome, though, comes from the same `default` layout every page
    uses — otherwise the header and footer here silently drift out of step with
    the rest of the site.
  -->
  <UApp :tooltip="{ delayDuration: 300 }">
    <NuxtLayout name="default">
      <UContainer class="py-24 text-center">
        <p class="text-primary font-semibold">
          {{ error?.statusCode ?? 404 }}
        </p>
        <h1 class="mt-2 text-4xl font-bold tracking-tight">
          {{ error?.statusCode === 404 ? "Page not found" : "Something went wrong" }}
        </h1>
        <p class="mt-4 text-muted">
          {{
            error?.statusCode === 404
              ? "The page you are looking for does not exist or has moved."
              : "An unexpected error occurred."
          }}
        </p>
        <div class="mt-8 flex justify-center gap-3">
          <UButton to="/" icon="i-lucide-house">Home</UButton>
          <UButton to="/docs" color="neutral" variant="subtle">Documentation</UButton>
        </div>
      </UContainer>
    </NuxtLayout>
  </UApp>
</template>
