<script setup lang="ts">
/**
 * The report's summary table as a heatmap: for each metric and language, the
 * geometric mean over all apps of value ÷ Rux. Every metric is lower-is-better,
 * so a cell above 1.00× is one where Rux comes out ahead and below 1.00× one
 * where it falls behind. The tint only repeats what the printed number already
 * says — a diverging pair with no tint at 1.00×, stronger the further from it,
 * on a log scale so 0.5× and 2× weigh the same.
 */
import { computed } from "vue";
import type { BenchmarkMachine, BenchmarkMetricKey } from "~/types/benchmarks";
import { benchmarkBaseline, benchmarkGeomean, benchmarkMetrics, machineLanguages } from "~/utils/benchmarks";
import { formatRatio } from "~/utils/benchmark-chart";

const props = defineProps<{ machine: BenchmarkMachine }>();
const emit = defineEmits<{ select: [metric: BenchmarkMetricKey] }>();

const languages = computed(() => machineLanguages(props.machine));

// 30× from 1.00× is full strength; past that every cell looks the same.
const SATURATION = Math.log(30);

function tone(ratio: number | null, language: string): "ahead" | "behind" | undefined {
  if (ratio === null || language === benchmarkBaseline || Math.abs(Math.log(ratio)) < 0.01) return undefined;
  return ratio > 1 ? "ahead" : "behind";
}

function tint(ratio: number | null, language: string) {
  const side = tone(ratio, language);
  if (!side || ratio === null) return undefined;
  const strength = Math.round(8 + 37 * Math.min(1, Math.abs(Math.log(ratio)) / SATURATION));
  return { backgroundColor: `color-mix(in oklab, var(--bench-${side}) ${strength}%, transparent)` };
}

const rows = computed(() =>
  benchmarkMetrics.map((metric) => ({
    metric,
    cells: languages.value.map((language) => {
      const mean = benchmarkGeomean(props.machine, metric.key, language.key);
      return {
        language: language.key,
        text: mean === null ? "—" : formatRatio(mean),
        tone: tone(mean, language.key),
        style: tint(mean, language.key),
      };
    }),
  })),
);
</script>

<template>
  <div>
    <div class="overflow-x-auto rounded-lg border border-default">
      <table class="w-full min-w-[44rem] border-collapse text-sm tabular-nums">
        <caption class="sr-only">
          Geometric mean over all apps of each language's value divided by Rux's. Above 1.00× Rux is lower, below 1.00×
          Rux is higher; every metric is lower-is-better.
        </caption>
        <thead>
          <tr class="border-b border-default bg-elevated/50">
            <th scope="col" class="sticky left-0 bg-elevated px-3 py-2 text-left font-medium text-highlighted">
              Metric
            </th>
            <th
              v-for="language in languages"
              :key="language.key"
              scope="col"
              class="px-3 py-2 text-right font-medium whitespace-nowrap text-highlighted"
            >
              {{ language.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.metric.key" class="border-b border-default last:border-b-0">
            <th scope="row" class="sticky left-0 bg-default p-0 text-left font-normal">
              <button
                type="button"
                class="w-full px-3 py-2 text-left whitespace-nowrap text-toned hover:text-highlighted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                @click="emit('select', row.metric.key)"
              >
                {{ row.metric.label }}
              </button>
            </th>
            <td
              v-for="cell in row.cells"
              :key="cell.language"
              class="px-3 py-2 text-right whitespace-nowrap text-highlighted"
              :data-tone="cell.tone"
              :style="cell.style"
            >
              {{ cell.text }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted">
      <span class="inline-flex items-center gap-1.5">
        <span class="inline-block size-3 rounded-sm bg-(--bench-ahead)/40" aria-hidden="true" />
        Above 1.00× — Rux is lower
      </span>
      <span class="inline-flex items-center gap-1.5">
        <span class="inline-block size-3 rounded-sm bg-(--bench-behind)/40" aria-hidden="true" />
        Below 1.00× — Rux is higher
      </span>
      <span>Every metric is lower-is-better. Select a metric to see it per app.</span>
    </p>
  </div>
</template>
