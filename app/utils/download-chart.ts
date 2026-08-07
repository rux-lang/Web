import type { PackageDownloadDay } from "~/types/package";

export interface DownloadChartPoint {
  x: number;
  y: number;
  day: PackageDownloadDay;
}

export interface DownloadChartGeometry {
  width: number;
  height: number;
  baseline: number;
  maximum: number;
  points: DownloadChartPoint[];
  line: string;
  area: string;
}

export function downloadChartGeometry(
  days: readonly PackageDownloadDay[],
  width = 300,
  height = 96,
  padding = 6,
): DownloadChartGeometry {
  const baseline = height - padding;
  const maximum = Math.max(0, ...days.map((day) => day.downloads));
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const denominator = Math.max(days.length - 1, 1);
  const points = days.map((day, index) => ({
    x: padding + (innerWidth * index) / denominator,
    y: maximum === 0 ? baseline : padding + innerHeight * (1 - day.downloads / maximum),
    day,
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = points.length
    ? `M ${points[0]?.x} ${baseline} L ${points.map((point) => `${point.x} ${point.y}`).join(" L ")} L ${points.at(-1)?.x} ${baseline} Z`
    : "";

  return { width, height, baseline, maximum, points, line, area };
}

export function nearestDownloadIndex(position: number, width: number, count: number): number | null {
  if (count < 1 || width <= 0) return null;
  const ratio = Math.min(1, Math.max(0, position / width));
  return Math.round(ratio * (count - 1));
}
