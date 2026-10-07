<script setup lang="ts">
/**
 * One metric for every app on a shared log axis: a row per app, a dot per
 * language. Rux and the language chosen for comparison carry the two chart
 * hues and are joined by a line, so the gap between them reads at a glance;
 * the other languages stay grey context. JIT builds are hollow rings, the
 * self-contained ones filled.
 *
 * Built like PackageDownloadChart: plain HTML marks placed by percentage, one
 * focusable group with arrow-key navigation, and every value also in the table
 * underneath, so the tooltip is a shortcut rather than the only way in.
 */
import { computed, ref, useId } from "vue";
import type { BenchmarkCell, BenchmarkMachine, BenchmarkMetricKey } from "~/types/benchmarks";
import {
  benchmarkBaseline,
  benchmarkCell,
  benchmarkMetric,
  benchmarkRatio,
  bestLanguages,
  machineLanguages,
} from "~/utils/benchmarks";
import {
  formatBenchmarkValue,
  formatRatio,
  formatTick,
  logDomain,
  logPosition,
  logTicks,
} from "~/utils/benchmark-chart";

const props = defineProps<{
  machine: BenchmarkMachine;
  metric: BenchmarkMetricKey;
  compare: string;
}>();

type Role = "rux" | "compare" | "other";

interface Dot {
  language: string;
  label: string;
  jit: boolean;
  role: Role;
  cell: BenchmarkCell;
  ratio: number | null;
  position: number;
}

interface Row {
  app: string;
  /** Painting order: grey first, then the comparison, Rux on top. */
  dots: Dot[];
  /** Left to right, for keyboard navigation. */
  ordered: Dot[];
}

const id = useId();
const instructionsId = `benchmark-plot-instructions-${id}`;
const info = computed(() => benchmarkMetric(props.metric));
const languages = computed(() => machineLanguages(props.machine));

const domain = computed(() =>
  logDomain(
    props.machine.apps.flatMap((app) =>
      languages.value.map((language) => benchmarkCell(props.machine, props.metric, app, language.key)?.median ?? 0),
    ),
  ),
);
const ticks = computed(() => logTicks(domain.value));

function role(language: string): Role {
  if (language === benchmarkBaseline) return "rux";
  return language === props.compare ? "compare" : "other";
}

const paintOrder: Record<Role, number> = { other: 0, compare: 1, rux: 2 };

const rows = computed<Row[]>(() =>
  props.machine.apps.map((app) => {
    const dots = languages.value.flatMap((language) => {
      const cell = benchmarkCell(props.machine, props.metric, app, language.key);
      if (!cell) return [];
      return [
        {
          language: language.key,
          label: language.label,
          jit: language.mode === "jit",
          role: role(language.key),
          cell,
          ratio: benchmarkRatio(props.machine, props.metric, app, language.key),
          position: logPosition(cell.median, domain.value) * 100,
        },
      ];
    });
    return {
      app,
      dots: [...dots].sort((a, b) => paintOrder[a.role] - paintOrder[b.role]),
      ordered: [...dots].sort((a, b) => a.position - b.position),
    };
  }),
);

function link(row: Row) {
  const rux = row.dots.find((dot) => dot.role === "rux");
  const other = row.dots.find((dot) => dot.role === "compare");
  if (!rux || !other) return undefined;
  const left = Math.min(rux.position, other.position);
  return { left: `${left}%`, width: `${Math.abs(rux.position - other.position)}%` };
}

const dotClasses: Record<Role, { filled: string; hollow: string }> = {
  rux: {
    filled: "size-3 bg-(--bench-rux)",
    hollow: "size-3 border-2 border-(--bench-rux) bg-default",
  },
  compare: {
    filled: "size-3 bg-(--bench-compare)",
    hollow: "size-3 border-2 border-(--bench-compare) bg-default",
  },
  other: {
    filled: "size-2 bg-(--bench-other)",
    hollow: "size-2 border-[1.5px] border-(--bench-other) bg-default",
  },
};

function dotClass(dot: Dot, active: boolean) {
  return [dotClasses[dot.role][dot.jit ? "hollow" : "filled"], active ? "scale-150 z-10" : undefined];
}

const active = ref<{ row: number; language: string } | null>(null);
const activeRow = computed(() => (active.value ? (rows.value[active.value.row] ?? null) : null));
const activeDot = computed(() => activeRow.value?.dots.find((dot) => dot.language === active.value?.language) ?? null);

function format(value: number) {
  return formatBenchmarkValue(value, info.value.digits);
}

const countNoun = computed(() => (props.metric === "compile" ? "builds" : "runs"));
const sizeMetric = computed(() => props.metric === "executable" || props.metric === "deployable");

const activeLabel = computed(() => {
  const dot = activeDot.value;
  const row = activeRow.value;
  if (!dot || !row) return "";
  const ratio = dot.role === "rux" || dot.ratio === null ? "" : `, ${formatRatio(dot.ratio)} Rux`;
  return `${row.app}, ${dot.label}: ${format(dot.cell.median)} ${info.value.unit}${ratio}`;
});

const tooltipStyle = computed(() => {
  const dot = activeDot.value;
  return dot ? { left: `${Math.min(80, Math.max(20, dot.position))}%` } : undefined;
});

const ruxWins = computed(
  () =>
    props.machine.apps.filter((app) => bestLanguages(props.machine, props.metric, app).includes(benchmarkBaseline))
      .length,
);
const summary = computed(
  () =>
    `${info.value.label} in ${info.value.unit} on a log scale, ${props.machine.apps.length} apps by ${languages.value.length} languages. ` +
    `Rux is lowest in ${ruxWins.value} of ${props.machine.apps.length} apps. The table below lists every value.`,
);

function selectNearest(rowIndex: number, event: PointerEvent) {
  const target = event.currentTarget as HTMLElement;
  const box = target.getBoundingClientRect();
  if (!box.width) return;
  const position = ((event.clientX - box.left) / box.width) * 100;
  const row = rows.value[rowIndex];
  if (!row?.dots.length) return;
  // Nearest by distance, ties to the highlighted dot so Rux is never buried
  // under a grey one sitting on the same value.
  const nearest = [...row.dots]
    .reverse()
    .reduce((best, dot) => (Math.abs(dot.position - position) < Math.abs(best.position - position) ? dot : best));
  active.value = { row: rowIndex, language: nearest.language };
}

function onKeydown(event: KeyboardEvent) {
  const count = rows.value.length;
  if (!count) return;
  const current = active.value ?? { row: 0, language: benchmarkBaseline };
  const row = rows.value[current.row]!;
  const index = row.ordered.findIndex((dot) => dot.language === current.language);

  const keep = (rowIndex: number) => {
    const target = rows.value[rowIndex]!;
    const same = target.dots.find((dot) => dot.language === current.language);
    return { row: rowIndex, language: (same ?? target.ordered[0]!).language };
  };

  if (event.key === "Escape") {
    active.value = null;
  } else if (!active.value && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    active.value = keep(0);
  } else if (event.key === "ArrowDown") {
    active.value = keep(Math.min(count - 1, current.row + 1));
  } else if (event.key === "ArrowUp") {
    active.value = keep(Math.max(0, current.row - 1));
  } else if (event.key === "ArrowRight") {
    active.value = { row: current.row, language: row.ordered[Math.min(row.ordered.length - 1, index + 1)]!.language };
  } else if (event.key === "ArrowLeft") {
    active.value = { row: current.row, language: row.ordered[Math.max(0, index - 1)]!.language };
  } else if (event.key === "Home") {
    active.value = { row: current.row, language: row.ordered[0]!.language };
  } else if (event.key === "End") {
    active.value = { row: current.row, language: row.ordered.at(-1)!.language };
  } else {
    return;
  }
  event.preventDefault();
}
</script>

<template>
  <div
    class="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    role="group"
    tabindex="0"
    :aria-label="summary"
    :aria-describedby="instructionsId"
    @keydown="onKeydown"
    @blur="active = null"
    @pointerleave="active = null"
  >
    <div class="flex">
      <ul class="w-24 shrink-0 sm:w-36" aria-hidden="true">
        <li
          v-for="row in rows"
          :key="row.app"
          class="flex h-9 items-center truncate pr-2 text-xs text-toned sm:text-sm"
          :class="{ 'font-medium text-highlighted': activeRow?.app === row.app }"
        >
          {{ row.app }}
        </li>
      </ul>

      <div class="relative mx-1.5 min-w-0 flex-1 sm:mx-3" aria-hidden="true">
        <div
          v-for="tick in ticks"
          :key="tick"
          class="absolute inset-y-0 w-px bg-(--ui-border)"
          :style="{ left: `${logPosition(tick, domain) * 100}%` }"
        />

        <div
          v-for="(row, rowIndex) in rows"
          :key="row.app"
          class="relative h-9 cursor-crosshair touch-pan-y"
          @pointermove="selectNearest(rowIndex, $event)"
          @pointerdown="selectNearest(rowIndex, $event)"
        >
          <div class="absolute inset-x-0 top-1/2 h-px bg-(--ui-border-muted)" />
          <div
            v-if="link(row)"
            class="absolute top-1/2 h-0.5 -translate-y-1/2 bg-(--ui-border-accented)"
            :style="link(row)"
          />
          <span
            v-for="dot in row.dots"
            :key="dot.language"
            class="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-(--ui-bg) transition-transform"
            :class="dotClass(dot, active?.row === rowIndex && active.language === dot.language)"
            :style="{ left: `${dot.position}%` }"
          />

          <div
            v-if="active?.row === rowIndex && activeDot"
            class="pointer-events-none absolute z-20 -translate-x-1/2 rounded-md bg-inverted px-2.5 py-1.5 text-xs whitespace-nowrap text-inverted shadow-sm"
            :class="rowIndex < 2 ? 'top-full mt-1' : 'bottom-full mb-1'"
            :style="tooltipStyle"
          >
            <p>
              <span class="font-semibold">{{ format(activeDot.cell.median) }} {{ info.unit }}</span>
              <span v-if="activeDot.role !== 'rux' && activeDot.ratio !== null" class="opacity-75">
                · {{ formatRatio(activeDot.ratio) }} Rux
              </span>
            </p>
            <p class="opacity-75">{{ activeDot.label }} · {{ row.app }}</p>
            <p v-if="!sizeMetric" class="opacity-75">
              min {{ format(activeDot.cell.min) }} · ±{{ format(activeDot.cell.stddev) }} · {{ activeDot.cell.count }}
              {{ countNoun }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex" aria-hidden="true">
      <div class="w-24 shrink-0 sm:w-36" />
      <div class="relative mx-1.5 h-5 min-w-0 flex-1 sm:mx-3">
        <!-- The end labels hang inward so the axis never pushes past the plot's edge on a phone. -->
        <span
          v-for="(tick, index) in ticks"
          :key="tick"
          class="absolute top-1 text-xs text-muted tabular-nums"
          :class="index === 0 ? undefined : index === ticks.length - 1 ? '-translate-x-full' : '-translate-x-1/2'"
          :style="{ left: `${logPosition(tick, domain) * 100}%` }"
        >
          {{ formatTick(tick) }}
        </span>
      </div>
    </div>
    <p class="mt-2 text-right text-xs text-muted" aria-hidden="true">{{ info.unit }}, log scale · lower is better</p>

    <p :id="instructionsId" class="sr-only">
      Use Up and Down Arrow keys to move between apps and Left and Right Arrow keys to move between languages. Press
      Escape to clear.
    </p>
    <p class="sr-only" aria-live="polite">{{ activeLabel }}</p>
  </div>
</template>
