<script setup lang="ts">
/**
 * Every value behind one metric's dot plot, as the runner's report prints it:
 * medians, or ratios to Rux with a geometric-mean row. The best value in each
 * row is bold. The App column stays put while the table scrolls sideways on a
 * phone.
 */
import { computed } from "vue";
import type { BenchmarkMachine, BenchmarkMetricKey } from "~/types/benchmarks";
import {
  benchmarkBaseline,
  benchmarkCell,
  benchmarkGeomean,
  benchmarkMetric,
  benchmarkRatio,
  bestGeomeanLanguages,
  bestLanguages,
  machineLanguages,
} from "~/utils/benchmarks";
import { formatBenchmarkValue, formatRatio } from "~/utils/benchmark-chart";

const props = defineProps<{
  machine: BenchmarkMachine;
  metric: BenchmarkMetricKey;
  relative: boolean;
  compare: string;
}>();

const info = computed(() => benchmarkMetric(props.metric));
const languages = computed(() => machineLanguages(props.machine));

const rows = computed(() =>
  props.machine.apps.map((app) => {
    const best = bestLanguages(props.machine, props.metric, app);
    return {
      app,
      cells: languages.value.map((language) => {
        const cell = benchmarkCell(props.machine, props.metric, app, language.key);
        const ratio = benchmarkRatio(props.machine, props.metric, app, language.key);
        let text = "FAIL";
        if (cell)
          text =
            props.relative && ratio !== null
              ? formatRatio(ratio)
              : formatBenchmarkValue(cell.median, info.value.digits);
        return { language: language.key, text, best: best.includes(language.key), failed: !cell };
      }),
    };
  }),
);

const geomeans = computed(() => {
  const best = bestGeomeanLanguages(props.machine, props.metric);
  return languages.value.map((language) => {
    const mean = benchmarkGeomean(props.machine, props.metric, language.key);
    return { language: language.key, text: mean === null ? "—" : formatRatio(mean), best: best.includes(language.key) };
  });
});

const caption = computed(() =>
  props.relative
    ? `${info.value.label} relative to Rux for each app; below 1.00× is lower than Rux. The best value in each row is bold.`
    : `${info.value.label} (${info.value.unit}), median of runs for each app. The best value in each row is bold.`,
);

function headerMarker(language: string) {
  if (language === benchmarkBaseline) return "bg-(--bench-rux)";
  if (language === props.compare) return "bg-(--bench-compare)";
  return undefined;
}
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-default">
    <table class="w-full min-w-[44rem] border-collapse text-sm tabular-nums">
      <caption class="sr-only">
        {{
          caption
        }}
      </caption>
      <thead>
        <tr class="border-b border-default bg-elevated/50">
          <th scope="col" class="sticky left-0 bg-elevated px-3 py-2 text-left font-medium text-highlighted">App</th>
          <th
            v-for="language in languages"
            :key="language.key"
            scope="col"
            class="px-3 py-2 text-right font-medium whitespace-nowrap text-highlighted"
          >
            <span
              v-if="headerMarker(language.key)"
              class="mr-1.5 inline-block size-2 rounded-full align-middle"
              :class="headerMarker(language.key)"
              aria-hidden="true"
            />{{ language.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.app" class="border-b border-default last:border-b-0">
          <th scope="row" class="sticky left-0 bg-default px-3 py-1.5 text-left font-normal text-toned">
            {{ row.app }}
          </th>
          <td
            v-for="cell in row.cells"
            :key="cell.language"
            class="px-3 py-1.5 text-right whitespace-nowrap"
            :class="cell.failed ? 'text-error' : cell.best ? 'font-semibold text-highlighted' : 'text-muted'"
          >
            {{ cell.text }}
          </td>
        </tr>
      </tbody>
      <tfoot v-if="relative">
        <tr class="border-t border-accented">
          <th scope="row" class="sticky left-0 bg-default px-3 py-2 text-left font-medium text-highlighted">
            Geometric mean
          </th>
          <td
            v-for="cell in geomeans"
            :key="cell.language"
            class="px-3 py-2 text-right whitespace-nowrap"
            :class="cell.best ? 'font-semibold text-highlighted' : 'text-toned'"
          >
            {{ cell.text }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
