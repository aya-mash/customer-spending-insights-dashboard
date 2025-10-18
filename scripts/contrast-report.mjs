#!/usr/bin/env node
import { generateContrastReport } from '../src/lib/contrastReport';
// Basic token pairs (could be expanded)
const pairs = [
  { name: 'primary-on-bg', fg: '#2F70EF', bg: '#FFFFFF' },
  { name: 'text-on-bg', fg: '#1A1F29', bg: '#FFFFFF' },
  { name: 'muted-on-bg', fg: '#6B7A90', bg: '#FFFFFF' },
];
const report = generateContrastReport(pairs);
for (const s of report.samples) {
  const status = s.ratio >= 4.5 ? 'PASS' : 'FAIL';
  console.log(`${s.name}: ratio=${s.ratio.toFixed(2)} ${status}`);
}
if (report.failures.length) {
  console.error(`Failures: ${report.failures.map(f => f.name).join(', ')}`);
  process.exitCode = 1;
}