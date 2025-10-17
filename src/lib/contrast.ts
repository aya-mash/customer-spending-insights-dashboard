// WCAG contrast utilities
// Normal text threshold: 4.5:1, Large text (>=24px regular or >=18.66px bold) threshold: 3:1

export function relativeLuminance(hex: string): number {
  const c = hex.replace('#','');
  if (c.length !== 6) return 0;
  const r = Number.parseInt(c.slice(0,2),16)/255;
  const g = Number.parseInt(c.slice(2,4),16)/255;
  const b = Number.parseInt(c.slice(4,6),16)/255;
  const toLinear = (v: number) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055)/1.055, 2.4);
  const R = toLinear(r), G = toLinear(g), B = toLinear(b);
  return 0.2126*R + 0.7152*G + 0.0722*B;
}

export function contrastRatio(fg: string, bg: string): number {
  const L1 = relativeLuminance(fg);
  const L2 = relativeLuminance(bg);
  const hi = Math.max(L1,L2), lo = Math.min(L1,L2);
  return (hi + 0.05) / (lo + 0.05);
}

export function passesAA(ratio: number, isLarge: boolean): boolean {
  return ratio >= (isLarge ? 3 : 4.5);
}

export function passesAAA(ratio: number, isLarge: boolean): boolean {
  return ratio >= (isLarge ? 4.5 : 7);
}

// Determine if text qualifies as large per WCAG (>=24px normal, >=19px bold approximation)
export function isLargeTextNormal(fontSizePx: number): boolean {
  return fontSizePx >= 24;
}
export function isLargeTextBold(fontSizePx: number): boolean {
  return fontSizePx >= 19; // approximation of 18.66
}
