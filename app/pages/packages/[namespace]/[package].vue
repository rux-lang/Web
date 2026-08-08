<script setup lang="ts">
import type { DataEnvelope, CursorPage, PackageSearchResult } from "~/types/catalog";
import type { PackagePageDocument, PackageSummary, PackageVersion } from "~/types/package";
import { catalogKeywordPath, catalogNamespacePath, packageTypeLabel, scalarQueryValue } from "~/utils/catalog";
import { normalizeApiError } from "~/utils/api-problem";
import { packageApiPath, packageVersionApiPath, representativePackage } from "~/utils/package";
definePageMeta({ layout: "packages" });

const route = useRoute();
const api = useRegistryApi();

const namespace = computed(() => String(route.params.namespace));
const packageName = computed(() => String(route.params.package));
const requestedVersion = computed(() => scalarQueryValue(route.query.version));
const requestKey = computed(() => `package-page:${namespace.value}:${packageName.value}:${requestedVersion.value}`);

// Lazy so the breadcrumb and shell paint before the API responds; see the note
// in app/pages/packages/index.vue.
const { data, error, status, refresh } = useLazyAsyncData<PackagePageDocument>(
  requestKey,
  async (_nuxtApp, { signal }) => {
    const summaryRequest = api.get<DataEnvelope<PackageSummary>>(
      packageApiPath(namespace.value, packageName.value),
      undefined,
      signal,
    );
    const representativeRequest = api.get<CursorPage<PackageSearchResult>>(
      "/v1/search",
      {
        q: packageName.value,
        namespace: namespace.value,
        limit: 1,
      },
      signal,
    );

    if (requestedVersion.value) {
      const [summary, search, metadata] = await Promise.all([
        summaryRequest,
        representativeRequest,
        api.get<DataEnvelope<PackageVersion>>(
          packageVersionApiPath(namespace.value, packageName.value, requestedVersion.value),
          undefined,
          signal,
        ),
      ]);
      const representative = representativePackage(search.data, namespace.value, packageName.value);
      return {
        summary: summary.data,
        release: metadata.data,
        representative_version: representative?.version ?? null,
      };
    }

    const [summary, search] = await Promise.all([summaryRequest, representativeRequest]);
    const representative = representativePackage(search.data, namespace.value, packageName.value);
    if (!representative) {
      return {
        summary: summary.data,
        release: null,
        representative_version: null,
      };
    }

    const metadata = await api.get<DataEnvelope<PackageVersion>>(
      packageVersionApiPath(namespace.value, packageName.value, representative.version),
      undefined,
      signal,
    );
    return {
      summary: summary.data,
      release: metadata.data,
      representative_version: representative.version,
    };
  },
  { server: false },
);

const failure = computed(() => (error.value ? normalizeApiError(error.value) : null));
const release = computed(() => data.value?.release ?? null);
const readmeFile = computed(() => release.value?.readme_file ?? null);
const licenseFile = computed(() => release.value?.license_file ?? null);
// A LICENSE.md goes through the same sanitizer as the README; a plain LICENSE file is not Markdown
// and is shown verbatim instead.
const licenseIsMarkdown = computed(() => Boolean(licenseFile.value?.path.toLowerCase().endsWith(".md")));
const pageTitle = computed(() =>
  release.value
    ? `${release.value.namespace}/${release.value.package} ${release.value.version} · Rux Package Registry`
    : `${namespace.value}/${packageName.value} · Rux Package Registry`,
);
const pageDescription = computed(
  () => release.value?.description ?? `Package metadata and releases for ${namespace.value}/${packageName.value}.`,
);

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
});

const breadcrumbItems = computed(() => [
  {
    label: "Packages",
    to: "/packages",
  },
  {
    label: release.value?.namespace ?? namespace.value,
    to: release.value ? catalogNamespacePath(release.value.namespace) : undefined,
  },
  {
    label: release.value?.package ?? packageName.value,
  },
]);
</script>

<template>
  <UContainer class="py-10 sm:py-14">
    <UBreadcrumb :items="breadcrumbItems" class="mb-6" />

    <AppLoadingState v-if="status === 'pending' || status === 'idle'" label="Loading package details" />

    <ApiProblemAlert v-else-if="failure" :failure="failure" @retry="refresh" />

    <UEmpty
      v-else-if="data && !release"
      icon="i-lucide-package-x"
      title="No published release found"
      description="The package exists, but no representative release is available."
      variant="subtle"
      size="xl"
    >
      <template #actions>
        <UButton label="Browse packages" to="/packages" color="neutral" variant="outline" />
      </template>
    </UEmpty>

    <template v-else-if="data && release">
      <header class="border-b border-default pb-8">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div class="min-w-0">
            <div class="mb-3 flex flex-wrap items-center gap-2">
              <UBadge color="neutral" variant="subtle">
                {{ packageTypeLabel(release.package_type) }}
              </UBadge>
              <UBadge color="neutral" variant="outline">
                {{ release.version }}
              </UBadge>
              <UBadge v-if="release.yanked" color="warning" variant="subtle"> Yanked </UBadge>
            </div>
            <h1 class="wrap-break-words text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
              <UButton
                :label="release.namespace"
                :to="catalogNamespacePath(release.namespace)"
                color="neutral"
                variant="link"
                class="h-auto max-w-full p-0 text-3xl font-bold sm:text-4xl"
                :ui="{
                  label: 'whitespace-normal break-all text-left',
                }"
              />
              <span aria-hidden="true" class="text-dimmed">/</span>{{ release.package }}
            </h1>
            <p class="mt-4 max-w-3xl text-lg text-muted">
              {{ release.description || "No package description provided." }}
            </p>
            <div v-if="release.keywords.length" class="mt-5 flex flex-wrap gap-2">
              <UButton
                v-for="keyword in release.keywords"
                :key="keyword"
                :label="keyword"
                :to="catalogKeywordPath(keyword)"
                color="neutral"
                variant="soft"
                size="xs"
                icon="i-lucide-tag"
              />
            </div>
          </div>

          <div class="flex shrink-0 flex-wrap gap-2">
            <UButton
              v-if="release.repository_url"
              label="Repository"
              :to="release.repository_url"
              target="_blank"
              aria-label="Repository (opens in a new tab)"
              color="neutral"
              variant="outline"
              icon="i-lucide-git-fork"
            />
            <UButton
              v-if="release.homepage_url"
              label="Homepage"
              :to="release.homepage_url"
              target="_blank"
              aria-label="Homepage (opens in a new tab)"
              color="neutral"
              variant="outline"
              icon="i-lucide-house"
            />
            <UButton label="Download" :to="api.absoluteUrl(release.download_url)" external icon="i-lucide-download" />
          </div>
        </div>
      </header>

      <UAlert
        v-if="release.yanked"
        class="mt-8"
        color="warning"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        title="This release has been yanked"
        description="Existing projects may still download it, but new dependency resolution will not select it."
      />

      <!-- grid-rows-[auto_1fr]: the README column spans both rows, so a long README leaves surplus
           height for the grid to distribute. Pinning row 1 to auto keeps it at the download card's
           own height and sends the surplus to row 2, which is what holds the sticky aside against
           the chart instead of pushing it down the page. -->
      <div class="mt-10 grid gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-[auto_1fr]">
        <PackageDownloadChart
          :namespace="release.namespace"
          :package-name="release.package"
          class="self-start lg:col-start-2 lg:row-start-1"
        />

        <div class="min-w-0 space-y-14 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <section aria-labelledby="readme-heading">
            <div class="mb-5">
              <h2 id="readme-heading" class="text-2xl font-semibold text-highlighted">README</h2>
              <p v-if="readmeFile" class="mt-2 text-sm text-muted">
                {{ readmeFile.path }}
              </p>
            </div>
            <SanitizedReadme v-if="readmeFile" :source="readmeFile.source" />
            <UEmpty
              v-else
              icon="i-lucide-file-question-mark"
              title="No README provided"
              description="This release does not include referenced README content."
              variant="subtle"
            />
          </section>

          <section v-if="licenseFile" id="license" aria-labelledby="license-heading">
            <div class="mb-5">
              <h2 id="license-heading" class="text-2xl font-semibold text-highlighted">License</h2>
              <p class="mt-2 text-sm text-muted">
                {{ licenseFile.path }}
              </p>
            </div>
            <SanitizedReadme v-if="licenseIsMarkdown" :source="licenseFile.source" />
            <pre
              v-else
              class="overflow-x-auto rounded-md border border-default bg-muted p-4 text-sm whitespace-pre-wrap text-highlighted"
              >{{ licenseFile.source }}</pre>
          </section>

          <PackageDependencies :dependencies="release.dependencies" />
          <PackageDependents :namespace="release.namespace" :package-name="release.package" />
        </div>

        <aside
          aria-label="Package release information"
          class="space-y-6 self-start lg:col-start-2 lg:row-start-2 lg:sticky lg:top-[calc(var(--ui-header-height)+1.5rem)]"
        >
          <PackageInstallCommand
            :namespace="release.namespace"
            :package-name="release.package"
            :version="release.version"
          />
          <PackageVersionList
            :namespace="release.namespace"
            :package-name="release.package"
            :selected-version="release.version"
            :representative-version="data.representative_version ?? release.version"
          />
          <PackageReleaseDetails :summary="data.summary" :release="release" />
        </aside>
      </div>
    </template>
  </UContainer>
</template>
