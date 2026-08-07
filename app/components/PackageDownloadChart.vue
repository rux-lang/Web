<script setup lang="ts">
import { computed, ref, useId } from "vue";
import type { DataEnvelope } from "~/types/catalog";
import type { PackageDownloadDay, PackageDownloadStatistics } from "~/types/package";
import { normalizeApiError } from "~/utils/api-problem";
import { downloadChartGeometry, nearestDownloadIndex } from "~/utils/download-chart";
import { packageDownloadsApiPath } from "~/utils/package";

const props = defineProps<{
  namespace: string;
  packageName: string;
}>();

const api = useRegistryApi();
const requestKey = computed(() => `package-downloads:${props.namespace}:${props.packageName}`);
const requestPath = computed(() => packageDownloadsApiPath(props.namespace, props.packageName));
const {
  data: response,
  error,
  status,
  refresh,
} = useLazyAsyncData<DataEnvelope<PackageDownloadStatistics>>(
  requestKey,
  (_nuxtApp, { signal }) => api.get(requestPath.value, undefined, signal),
  { server: false },
);

const statistics = computed(() => response.value?.data ?? null);
const failure = computed(() => (error.value ? normalizeApiError(error.value) : null));
const loading = computed(() => status.value === "pending" || status.value === "idle");
const geometry = computed(() => downloadChartGeometry(statistics.value?.daily ?? []));
const activeIndex = ref<number | null>(null);
const chartRoot = ref<HTMLElement | null>(null);
const id = useId();
const gradientId = `download-gradient-${id}`;
const instructionsId = `download-instructions-${id}`;

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(value: string): string {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`));
}

function formatDownloads(value: number): string {
  return value.toLocaleString("en");
}

function pluralizedDownloads(value: number): string {
  return `${formatDownloads(value)} ${value === 1 ? "download" : "downloads"}`;
}

const activePoint = computed(() =>
  activeIndex.value === null ? null : (geometry.value.points[activeIndex.value] ?? null),
);
const latestPoint = computed(() => geometry.value.points.at(-1) ?? null);
const activeLabel = computed(() =>
  activePoint.value
    ? `${formatDate(activePoint.value.day.date)}: ${pluralizedDownloads(activePoint.value.day.downloads)}`
    : "",
);
const rangeLabel = computed(() => {
  const value = statistics.value;
  return value ? `${formatDate(value.start_date)} – ${formatDate(value.end_date)}` : "";
});
const peak = computed<PackageDownloadDay | null>(() => {
  const days = statistics.value?.daily ?? [];
  return days.reduce<PackageDownloadDay | null>(
    (current, day) => (!current || day.downloads > current.downloads ? day : current),
    null,
  );
});
const chartSummary = computed(() => {
  const value = statistics.value;
  const peakDay = peak.value;
  if (!value || !peakDay) return "No download statistics are available.";
  if (value.total_all_time === 0) return `No downloads recorded from ${rangeLabel.value}.`;
  return `${pluralizedDownloads(value.total_downloads)} from ${rangeLabel.value}. Peak day: ${formatDate(peakDay.date)}, ${pluralizedDownloads(peakDay.downloads)}.`;
});
const tooltipStyle = computed(() => {
  const point = activePoint.value;
  if (!point) return undefined;
  const left = Math.min(88, Math.max(12, (point.x / geometry.value.width) * 100));
  return { left: `${left}%` };
});
const activeMarkerStyle = computed(() => pointStyle(activePoint.value));
const latestMarkerStyle = computed(() => pointStyle(latestPoint.value));

function pointStyle(point: { x: number; y: number } | null) {
  if (!point) return undefined;
  return {
    left: `${(point.x / geometry.value.width) * 100}%`,
    top: `${(point.y / geometry.value.height) * 100}%`,
  };
}

function selectPointerDay(event: PointerEvent) {
  const target = event.currentTarget as HTMLElement;
  activeIndex.value = nearestDownloadIndex(
    event.clientX - target.getBoundingClientRect().left,
    target.getBoundingClientRect().width,
    geometry.value.points.length,
  );
}

function activatePointerDay(event: PointerEvent) {
  chartRoot.value?.focus();
  selectPointerDay(event);
}

function selectKeyboardDay(event: KeyboardEvent) {
  const last = geometry.value.points.length - 1;
  if (last < 0) return;
  if (event.key === "Escape") {
    activeIndex.value = null;
  } else if (event.key === "ArrowLeft") {
    activeIndex.value = activeIndex.value === null ? last : Math.max(0, activeIndex.value - 1);
  } else if (event.key === "ArrowRight") {
    activeIndex.value = activeIndex.value === null ? 0 : Math.min(last, activeIndex.value + 1);
  } else if (event.key === "Home") {
    activeIndex.value = 0;
  } else if (event.key === "End") {
    activeIndex.value = last;
  } else {
    return;
  }
  event.preventDefault();
}
</script>

<template>
  <UCard variant="subtle">
    <template #header>
      <div>
        <h2 class="font-semibold text-highlighted">Downloads</h2>
        <p class="mt-1 text-sm text-muted">Across all versions.</p>
      </div>
    </template>

    <div v-if="loading" role="status" aria-live="polite" aria-label="Loading download statistics">
      <USkeleton class="h-8 w-32" />
      <USkeleton class="mt-3 h-4 w-48" />
      <USkeleton class="mt-6 h-24 w-full" />
    </div>

    <ApiProblemAlert v-else-if="failure" :failure="failure" @retry="refresh" />

    <div v-else-if="statistics">
      <div class="flex items-end justify-between gap-4">
        <div>
          <p class="text-3xl font-semibold tracking-tight text-highlighted">
            {{ formatDownloads(statistics.total_downloads) }}
          </p>
          <p class="mt-1 text-xs text-muted">{{ rangeLabel }}</p>
        </div>
        <div class="text-right">
          <p class="text-xs text-muted">All time</p>
          <p class="mt-1 font-medium text-highlighted">{{ formatDownloads(statistics.total_all_time) }}</p>
        </div>
      </div>

      <div
        ref="chartRoot"
        class="relative mt-5 rounded-md bg-default/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        role="group"
        tabindex="0"
        :aria-label="chartSummary"
        :aria-describedby="instructionsId"
        @keydown="selectKeyboardDay"
        @blur="activeIndex = null"
      >
        <svg
          class="block h-24 w-full"
          :viewBox="`0 0 ${geometry.width} ${geometry.height}`"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="var(--ui-primary)" stop-opacity="0.24" />
              <stop offset="1" stop-color="var(--ui-primary)" stop-opacity="0.02" />
            </linearGradient>
          </defs>
          <line
            x1="6"
            :x2="geometry.width - 6"
            :y1="geometry.baseline"
            :y2="geometry.baseline"
            stroke="var(--ui-border-muted)"
            vector-effect="non-scaling-stroke"
          />
          <path v-if="geometry.area" :d="geometry.area" :fill="`url(#${gradientId})`" />
          <polyline
            v-if="geometry.line"
            :points="geometry.line"
            fill="none"
            stroke="var(--ui-primary)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            vector-effect="non-scaling-stroke"
          />
          <template v-if="activePoint">
            <line
              :x1="activePoint.x"
              :x2="activePoint.x"
              y1="6"
              :y2="geometry.baseline"
              stroke="var(--ui-border-accented)"
              stroke-dasharray="3 3"
              vector-effect="non-scaling-stroke"
            />
          </template>
        </svg>

        <div
          v-if="latestPoint"
          class="pointer-events-none absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-default"
          :style="latestMarkerStyle"
          aria-hidden="true"
        />
        <div
          v-if="activePoint"
          class="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-default"
          :style="activeMarkerStyle"
          aria-hidden="true"
        />

        <div
          class="absolute inset-0 cursor-crosshair touch-pan-y"
          aria-hidden="true"
          @pointermove="selectPointerDay"
          @pointerdown="activatePointerDay"
          @pointerleave="activeIndex = null"
        />

        <div
          v-if="activePoint"
          class="pointer-events-none absolute top-2 z-10 -translate-x-1/2 rounded-md bg-inverted px-2 py-1 text-xs whitespace-nowrap text-inverted shadow-sm"
          :style="tooltipStyle"
          aria-hidden="true"
        >
          {{ activeLabel }}
        </div>
      </div>

      <p :id="instructionsId" class="sr-only">
        Use Left and Right Arrow keys to inspect daily values. Press Escape to clear the selected day.
      </p>
      <p class="sr-only" aria-live="polite">{{ activeLabel }}</p>
      <p v-if="statistics.total_all_time === 0" class="mt-3 text-sm text-muted">No downloads have been recorded yet.</p>
    </div>
  </UCard>
</template>
