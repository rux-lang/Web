<script setup lang="ts">
/**
 * One row of the compile benchmark as a bar per language, best first, on a log
 * axis: the languages are one project built eight ways, so unlike the programs'
 * dot plot there is a single value each. Rux and the language chosen for
 * comparison carry the two chart hues, the others stay grey, and JIT builds are
 * outlined rather than filled, as in the dot plot.
 *
 * The value is printed beside every bar, so hovering or focusing a bar only adds
 * the spread of the timed builds; every number is also in the table underneath.
 */
import { computed, ref, useId } from "vue";
import type { BenchmarkCompileRow, BenchmarkCompileRun } from "~/types/benchmarks";
import {
  benchmarkBaseline,
  compileBest,
  compileCell,
  compileRatio,
  compileUnranked,
  compileValue,
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
  run: BenchmarkCompileRun;
  row: BenchmarkCompileRow;
  compare: string;
}>();

type Role = "rux" | "compare" | "other";

const id = useId();
const instructionsId = `benchmark-bars-instructions-${id}`;

function role(language: string): Role {
  if (language === benchmarkBaseline) return "rux";
  return language === props.compare ? "compare" : "other";
}

const bars = computed(() => {
  const best = compileBest(props.run, props.row);
  const sign = props.row.better === "higher" ? -1 : 1;
  return machineLanguages(props.run)
    .map((language) => ({
      language: language.key,
      label: language.label,
      jit: language.mode === "jit",
      role: role(language.key),
      value: compileValue(props.run, props.row, language.key),
      cell: compileCell(props.run, props.row, language.key),
      ratio: compileRatio(props.run, props.row, language.key),
      best: best.includes(language.key),
      unranked: compileUnranked(props.row, language.key),
    }))
    .sort((a, b) => {
      if (a.value === null || b.value === null) return a.value === null ? 1 : -1;
      return sign * (a.value - b.value);
    });
});

// Bars start at the axis, so the axis starts below half the smallest value:
// otherwise the best of a lower-is-better row would be a bar of no length.
const domain = computed(() => {
  const values = bars.value.map((bar) => bar.value ?? 0).filter((value) => value > 0);
  return logDomain(values.length ? [Math.min(...values) / 2, ...values] : []);
});
const ticks = computed(() => logTicks(domain.value));

function width(value: number) {
  // Never thinner than a sliver, so the start of the axis still shows a bar.
  return `${Math.max(0.75, logPosition(value, domain.value) * 100)}%`;
}

const barClasses: Record<Role, { filled: string; hollow: string }> = {
  rux: { filled: "bg-(--bench-rux)", hollow: "border-2 border-(--bench-rux) bg-(--bench-rux)/15" },
  compare: { filled: "bg-(--bench-compare)", hollow: "border-2 border-(--bench-compare) bg-(--bench-compare)/15" },
  other: { filled: "bg-(--bench-other)/70", hollow: "border-[1.5px] border-(--bench-other) bg-(--bench-other)/10" },
};

function format(value: number) {
  return formatBenchmarkValue(value, props.row.digits);
}

const unit = computed(() => (props.row.unit === "×" ? "×" : ` ${props.row.unit}`));

const active = ref<string | null>(null);
const activeBar = computed(() => bars.value.find((bar) => bar.language === active.value) ?? null);

function describe(bar: (typeof bars.value)[number]) {
  if (bar.value === null) return `${bar.label}: failed`;
  const ratio = bar.role === "rux" || bar.ratio === null ? "" : `, ${formatRatio(bar.ratio)} Rux`;
  const spread = bar.cell
    ? `; min ${format(bar.cell.min)}, ±${format(bar.cell.stddev)}, ${bar.cell.count} build${bar.cell.count === 1 ? "" : "s"}`
    : "";
  return `${bar.label}: ${format(bar.value)}${unit.value}${ratio}${spread}`;
}

const activeLabel = computed(() => (activeBar.value ? describe(activeBar.value) : ""));

const direction = computed(() => (props.row.better === "higher" ? "higher is better" : "lower is better"));
const summary = computed(() => {
  const place = bars.value.findIndex((bar) => bar.language === benchmarkBaseline) + 1;
  return (
    `${props.row.label} in ${props.row.unit} on a log scale, ${bars.value.length} languages, best first; ${direction.value}. ` +
    (place ? `Rux is ${place} of ${bars.value.length}. ` : "") +
    "The table below lists every value."
  );
});

function onKeydown(event: KeyboardEvent) {
  const list = bars.value;
  if (!list.length) return;
  const index = list.findIndex((bar) => bar.language === active.value);
  let next: number;
  if (event.key === "Escape") {
    active.value = null;
    event.preventDefault();
    return;
  } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    next = index < 0 ? 0 : Math.min(list.length - 1, index + 1);
  } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    next = index < 0 ? 0 : Math.max(0, index - 1);
  } else if (event.key === "Home") {
    next = 0;
  } else if (event.key === "End") {
    next = list.length - 1;
  } else {
    return;
  }
  active.value = list[next]!.language;
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
    <div
      v-for="bar in bars"
      :key="bar.language"
      class="flex h-8 items-center gap-2 sm:gap-3"
      aria-hidden="true"
      @pointerenter="active = bar.language"
      @pointerdown="active = bar.language"
    >
      <span
        class="w-16 shrink-0 truncate text-xs sm:w-20 sm:text-sm"
        :class="active === bar.language || bar.role !== 'other' ? 'font-medium text-highlighted' : 'text-toned'"
      >
        {{ bar.label }}
      </span>
      <div class="relative h-full min-w-0 flex-1">
        <div
          v-for="tick in ticks"
          :key="tick"
          class="absolute inset-y-0 w-px bg-(--ui-border-muted)"
          :style="{ left: `${logPosition(tick, domain) * 100}%` }"
        />
        <div
          v-if="bar.value !== null"
          class="absolute top-1/2 h-4 -translate-y-1/2 rounded-sm transition-[filter]"
          :class="[barClasses[bar.role][bar.jit ? 'hollow' : 'filled'], { 'brightness-110': active === bar.language }]"
          :style="{ width: width(bar.value) }"
        />
      </div>
      <span
        class="w-24 shrink-0 text-right text-xs whitespace-nowrap tabular-nums sm:w-32 sm:text-sm"
        :class="
          bar.value === null
            ? 'text-error'
            : bar.unranked
              ? 'text-muted italic'
              : bar.best
                ? 'font-semibold text-highlighted'
                : 'text-toned'
        "
      >
        <template v-if="bar.value === null">FAIL</template>
        <template v-else>
          {{ format(bar.value) }}{{ unit }}
          <span v-if="bar.role !== 'rux' && bar.ratio !== null" class="hidden font-normal text-muted sm:inline">
            · {{ formatRatio(bar.ratio) }}
          </span>
        </template>
      </span>
    </div>

    <div class="flex gap-2 sm:gap-3" aria-hidden="true">
      <div class="w-16 shrink-0 sm:w-20" />
      <div class="relative h-5 min-w-0 flex-1">
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
      <div class="w-24 shrink-0 sm:w-32" />
    </div>

    <p class="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-muted" aria-hidden="true">
      <span class="min-h-4">{{ activeLabel }}</span>
      <span>{{ row.unit }}, log scale · {{ direction }} · ratios are value ÷ Rux</span>
    </p>

    <p :id="instructionsId" class="sr-only">Use the Arrow keys to move between languages. Press Escape to clear.</p>
    <p class="sr-only" aria-live="polite">{{ activeLabel }}</p>
  </div>
</template>
