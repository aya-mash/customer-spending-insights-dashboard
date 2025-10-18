import { contrastRatio } from './contrast';

export interface ContrastSample { name: string; fg: string; bg: string; ratio: number; }
export interface ContrastReport { samples: ContrastSample[]; failures: ContrastSample[]; }

export function generateContrastReport(pairs: Array<{ name: string; fg: string; bg: string }>): ContrastReport {
  const samples = pairs.map(p => ({ ...p, ratio: contrastRatio(p.fg, p.bg) }));
  const failures = samples.filter(s => s.ratio < 4.5);
  return { samples, failures };
}