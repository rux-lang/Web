<script setup lang="ts">
/**
 * The compile benchmark's report table: a row per measurement, a column per
 * language, medians or ratios to Rux. The best value in each row is bold,
 * whichever way the row is better — most are lower-is-better, compile speed and
 * parallel speed-up higher. The JIT executables are in italics and not ranked,
 * as in the runner's report. The first column stays put while the table scrolls
 * sideways on a phone.
 */
import { computed } from "vue";
import type { BenchmarkCompileRun } from "~/types/benchmarks";
import {
  benchmarkBaseline,
  benchmarkCompileRows,
  compileBest,
  compileRatio,
  compileUnranked,
  compileValue,
  machineLanguages,
} from "~/utils/benchmarks";
import { formatBenchmarkValue, formatRatio } from "~/utils/benchmark-chart";

const props = defineProps<{
  run: BenchmarkCompileRun;
  relative: boolean;
  compare: string;
  /** The row the chart above shows, marked in the table. */
  selected?: string;
}>();

const languages = computed(() => machineLanguages(props.run));

const rows = computed(() =>
  benchmarkCompileRows
    // The source size is a fact about the project, not a result: no ratio for it.
    .filter((row) => !(props.relative && row.better === null))
    .filter((row) => languages.value.some((language) => compileValue(props.run, row, language.key) !== null))
    .map((row) => {
      const best = compileBest(props.run, row);
      return {
        row,
        label: props.relative || row.unit === "×" ? row.label : `${row.label} (${row.unit})`,
        cells: languages.value.map((language) => {
          const value = compileValue(props.run, row, language.key);
          const ratio = compileRatio(props.run, row, language.key);
          let text = row.better === null ? "—" : "FAIL";
          if (value !== null) {
            text = props.relative && ratio !== null ? formatRatio(ratio) : formatBenchmarkValue(value, row.digits);
            if (!props.relative && row.unit === "×") text += "×";
          }
          return {
            language: language.key,
            text,
            best: best.includes(language.key),
            failed: value === null && row.better !== null,
            unranked: compileUnranked(row, language.key),
          };
        }),
      };
    }),
);

const caption = computed(() =>
  props.relative
    ? "Compile benchmark relative to Rux: each value divided by Rux's. The best value in each row is bold."
    : "Compile benchmark, median of the timed builds. The best value in each row is bold.",
);

function headerMarker(language: string) {
  if (language === benchmarkBaseline) return "bg-(--bench-rux)";
  if (language === props.compare) return "bg-(--bench-compare)";
  return undefined;
}
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-default">
    <table class="w-full min-w-[52rem] border-collapse text-sm tabular-nums">
      <caption class="sr-only">
        {{
          caption
        }}
      </caption>
      <thead>
        <tr class="border-b border-default bg-elevated/50">
          <th scope="col" class="sticky left-0 bg-elevated px-3 py-2 text-left font-medium text-highlighted">
            Large project
          </th>
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
        <tr
          v-for="entry in rows"
          :key="entry.row.key"
          class="border-b border-default last:border-b-0"
          :class="{ 'bg-elevated/40': entry.row.key === selected }"
          :data-row="entry.row.key"
        >
          <th
            scope="row"
            class="sticky left-0 max-w-[17rem] px-3 py-1.5 text-left font-normal"
            :class="entry.row.key === selected ? 'bg-elevated text-highlighted' : 'bg-default text-toned'"
          >
            {{ entry.label }}
            <span v-if="entry.row.better === 'higher'" class="text-xs text-muted">· higher is better</span>
          </th>
          <td
            v-for="cell in entry.cells"
            :key="cell.language"
            class="px-3 py-1.5 text-right whitespace-nowrap"
            :class="
              cell.failed
                ? 'text-error'
                : cell.unranked
                  ? 'text-muted italic'
                  : cell.best
                    ? 'font-semibold text-highlighted'
                    : 'text-muted'
            "
          >
            {{ cell.text }}
          </td>
        </tr>
      </tbody>
    </table>
    <p class="border-t border-default px-3 py-2 text-xs text-muted">
      Large is the generated project; Baseline is the same build with one module, the fixed cost of every build. C# JIT
      and Java JIT executables in italics are not ranked: they need their runtime to run.
    </p>
  </div>
</template>
