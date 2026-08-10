<script setup lang="ts">
import type { PackageDependency } from "~/types/package";
import { dependencyPackagePath } from "~/utils/package";

defineProps<{
  dependencies: PackageDependency[];
}>();
</script>

<template>
  <section aria-labelledby="dependencies-heading">
    <div class="mb-5">
      <!-- The tab label names this section on screen; the heading stays for the accessibility tree. -->
      <h2 id="dependencies-heading" class="sr-only">Dependencies</h2>
      <p class="text-muted">Registry packages required by this exact release.</p>
    </div>

    <ul v-if="dependencies.length" class="divide-y divide-default rounded-lg border border-default">
      <li
        v-for="dependency in dependencies"
        :key="dependency.alias"
        class="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="min-w-0">
          <UButton
            :label="`${dependency.target_namespace}/${dependency.target_package}`"
            :to="dependencyPackagePath(dependency)"
            color="neutral"
            variant="link"
            class="min-h-6 p-0 font-semibold"
          />
          <p class="mt-1 text-sm text-muted">
            Imported as
            <code class="text-highlighted">{{ dependency.alias }}</code>
          </p>
          <div v-if="dependency.target_os?.length" class="mt-2 flex flex-wrap items-center gap-1.5">
            <span class="text-xs text-muted">Targets</span>
            <UBadge v-for="targetOs in dependency.target_os" :key="targetOs" color="neutral" variant="subtle" size="sm">
              {{ targetOs }}
            </UBadge>
          </div>
        </div>
        <code class="self-start rounded-md bg-elevated px-2 py-1 text-sm text-highlighted sm:self-center">
          {{ dependency.version_range }}
        </code>
      </li>
    </ul>

    <UEmpty
      v-else
      icon="i-lucide-package-check"
      title="No registry dependencies"
      description="This release does not declare any registry packages."
      variant="subtle"
    />
  </section>
</template>
