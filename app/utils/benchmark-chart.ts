/**
 * Geometry and number formatting for the /benchmarks charts.
 *
 * Every axis is logarithmic. The values in one chart span two to four orders of
 * magnitude (a 22-second Rux run beside a 0.2-second C++ one, a 1 KiB jar beside
 * a 5 MiB native image), and on a linear axis seven of the eight languages
 * collapse into one pixel. On a log axis equal distances are equal ratios,
 * which is also how the report compares languages.
 */

/** 1, 2, 5, 10, 20, 50, … — the steps an axis is allowed to start and end on. */
const STEPS = [1, 2, 5];

function stepsAround(exponent: number): number[] {
  return STEPS.map((step) => step * 10 ** exponent);
}

/** Avoids 0.30000000000000004 when a tick is 3 × 0.1 and so on. */
function clean(value: number): number {
  return Number(value.toPrecision(12));
}

/**
 * The smallest 1-2-5 range that holds every value. Non-positive values are
 * ignored: they have no place on a log axis, and no metric produces them.
 */
export function logDomain(values: number[]): [number, number] {
  const positive = values.filter((value) => value > 0 && Number.isFinite(value));
  if (!positive.length) return [1, 10];
  const low = Math.min(...positive);
  const high = Math.max(...positive);

  const lowExponent = Math.floor(Math.log10(low));
  const start = [...stepsAround(lowExponent)].reverse().find((step) => step <= low * (1 + 1e-9)) ?? 10 ** lowExponent;

  const highExponent = Math.floor(Math.log10(high));
  const end =
    [...stepsAround(highExponent), 10 ** (highExponent + 1)].find((step) => step >= high * (1 - 1e-9)) ??
    10 ** (highExponent + 1);

  return [clean(start), clean(end === start ? end * 10 : end)];
}

/**
 * Tick values inside a domain: every 1-2-5 step when the axis spans up to two
 * decades, only the powers of ten beyond that so the labels do not crowd.
 * The domain ends are always included.
 */
export function logTicks([start, end]: [number, number]): number[] {
  const decades = Math.log10(end / start);
  const ticks = new Set<number>([start, end]);
  for (let exponent = Math.floor(Math.log10(start)); exponent <= Math.ceil(Math.log10(end)); exponent += 1) {
    for (const step of decades > 2 ? [1] : STEPS) {
      const value = clean(step * 10 ** exponent);
      if (value >= start && value <= end) ticks.add(value);
    }
  }
  return [...ticks].sort((a, b) => a - b);
}

/** Position of a value along a log axis, 0 at the start and 1 at the end. */
export function logPosition(value: number, [start, end]: [number, number]): number {
  if (value <= 0) return 0;
  const position = Math.log(value / start) / Math.log(end / start);
  return Math.min(1, Math.max(0, position));
}

const formatters = new Map<number, Intl.NumberFormat>();

function formatter(digits: number): Intl.NumberFormat {
  let value = formatters.get(digits);
  if (!value) {
    value = new Intl.NumberFormat("en", { minimumFractionDigits: digits, maximumFractionDigits: digits });
    formatters.set(digits, value);
  }
  return value;
}

/** A measurement with the decimals the report prints for its metric. */
export function formatBenchmarkValue(value: number, digits: number): string {
  return formatter(digits).format(value);
}

/** A ratio the way the report prints one: two decimals, whole numbers from 10× up. */
export function formatRatio(value: number): string {
  return value >= 10 ? `${Math.round(value)}×` : `${value.toFixed(2)}×`;
}

/** An axis label: as few digits as the tick needs (0.05, 0.5, 5, 5,000). */
export function formatTick(value: number): string {
  const digits = value >= 1 ? 0 : Math.min(6, Math.ceil(-Math.log10(value)));
  return formatter(digits).format(value);
}
