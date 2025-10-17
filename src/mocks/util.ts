// Utility helpers for mock data generation.

export function seededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function pick<T>(arr: T[], rnd: () => number) {
  return arr[Math.floor(rnd() * arr.length)];
}

export function randomInt(min: number, max: number, rnd: () => number) {
  return Math.floor(rnd() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number, rnd: () => number, decimals = 2) {
  const val = rnd() * (max - min) + min;
  return Number.parseFloat(val.toFixed(decimals));
}

export function generateId(prefix: string, rnd: () => number) {
  return `${prefix}_${Math.floor(rnd() * 1e6).toString().padStart(6, '0')}`;
}