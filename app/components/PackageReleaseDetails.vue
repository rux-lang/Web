<script setup lang="ts">
import type { PackageSummary, PackageVersion } from "~/types/package";
import { formatPublishedAt } from "~/utils/catalog";
import { formatBytes, normalizedManifestSource } from "~/utils/package";

const props = defineProps<{
  summary: PackageSummary;
  release: PackageVersion;
}>();

// The license text lives in a tab panel on the package page, so the link asks the page to select it
// rather than jumping to an id that may be inside a hidden panel.
const emit = defineEmits<{ showLicense: [] }>();

const manifestSource = computed(() => normalizedManifestSource(props.release.normalized_manifest));
</script>

<template>
  <UCard>
    <template #header>
      <div>
        <h2 class="font-semibold text-highlighted">Release details</h2>
        <p class="mt-1 text-sm text-muted">Immutable metadata for {{ release.version }}.</p>
      </div>
    </template>

    <dl class="space-y-4 text-sm">
      <div>
        <dt class="text-muted">Minimum Rux</dt>
        <dd class="mt-1 font-medium text-highlighted">
          {{ release.min_rux }}
        </dd>
      </div>
      <div>
        <dt class="text-muted">Published</dt>
        <dd class="mt-1 font-medium text-highlighted">
          {{ formatPublishedAt(release.published_at) }}
        </dd>
      </div>
      <div>
        <dt class="text-muted">Package created</dt>
        <dd class="mt-1 font-medium text-highlighted">
          {{ formatPublishedAt(summary.created_at) }}
        </dd>
      </div>
      <div>
        <dt class="text-muted">Manifest schema</dt>
        <dd class="mt-1 font-medium text-highlighted">Version {{ release.manifest_schema_version }}</dd>
      </div>
      <div v-if="release.authors.length">
        <dt class="text-muted">Authors</dt>
        <dd class="mt-1 text-highlighted">
          <ul class="space-y-1">
            <li v-for="author in release.authors" :key="author">
              {{ author }}
            </li>
          </ul>
        </dd>
      </div>
      <div>
        <dt class="text-muted">License</dt>
        <dd class="mt-1 font-medium text-highlighted">
          <template v-if="release.license">{{ release.license }}</template>
          <template v-else-if="!release.license_file">Not provided</template>
          <ULink v-if="release.license_file" to="#license" class="mt-1 block font-normal" @click="emit('showLicense')">
            {{ release.license_file.path }}
          </ULink>
        </dd>
      </div>
      <div>
        <dt class="text-muted">Artifact</dt>
        <dd class="mt-1 text-highlighted">
          {{ formatBytes(release.artifact_size) }} · {{ release.artifact_file_count.toLocaleString("en") }} files
        </dd>
      </div>
      <div>
        <dt class="text-muted">Expanded artifact</dt>
        <dd class="mt-1 text-highlighted">
          {{ formatBytes(release.artifact_expanded_bytes) }}
        </dd>
      </div>
      <div>
        <dt class="text-muted">Sources</dt>
        <dd class="mt-1 text-highlighted">
          {{ release.source_file_count.toLocaleString("en") }} files ·
          {{ release.source_line_count.toLocaleString("en") }} lines
        </dd>
      </div>
      <div>
        <dt class="text-muted">SHA-256</dt>
        <dd class="mt-1">
          <code class="break-all text-xs text-highlighted">{{ release.checksum.digest }}</code>
        </dd>
      </div>
    </dl>

    <template #footer>
      <div class="space-y-3">
        <details class="group">
          <summary class="inline-flex min-h-11 cursor-pointer items-center text-sm font-medium text-highlighted">
            View normalized manifest
          </summary>
          <pre class="mt-3 max-h-96 overflow-auto rounded-md bg-elevated p-3 text-xs text-default">{{
            manifestSource
          }}</pre>
        </details>
      </div>
    </template>
  </UCard>
</template>
