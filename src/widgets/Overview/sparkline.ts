/** Utility functions for generating sparkline data & paths. */

/** Generate a synthetic sparkline series given a total amount over a period. */
export function generateSyntheticSparkline(total: number, points = 30): number[] {
  const base = total / points;
  const arr: number[] = [];
  for (let i = 0; i < points; i++) {
    const variance = (Math.sin(i / 3) + 1) / 2; // 0..1
    arr.push(Number.parseFloat((base * (0.8 + variance * 0.4)).toFixed(2)));
  }
  return arr;
}

/** Build an SVG path from a set of points scaling height to provided maxHeight. */
export function buildSparklinePath(points: readonly number[], maxHeight = 30): string {
  const max = Math.max(...points);
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${i} ${max === 0 ? maxHeight : (1 - p / max) * maxHeight}`)
    .join(' ');
}
