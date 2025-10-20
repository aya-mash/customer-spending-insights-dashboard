import { useMemo } from 'react';
import { formatRand } from '../../lib/format';
import type { SpendingSummary } from '../../data/models';
import { generateSyntheticSparkline, buildSparklinePath } from './sparkline';

export function SummaryCardPlaceholder() {
  return (
    <div className="overview-summary-card skeleton" aria-label="Summary loading placeholder">
      <div className="kpi-line" />
    </div>
  );
}

interface SummaryCardProps { readonly summary: SpendingSummary }
export function SummaryCard({ summary }: Readonly<SummaryCardProps>) {
  const points = useMemo(() => generateSyntheticSparkline(summary.totalSpent, 30), [summary.totalSpent]);

  const prefersReduced = typeof globalThis !== 'undefined' && globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
  <section className="overview-summary-card" aria-labelledby="summary-heading">
      <div className="summary-header">
        <h3 id="summary-heading" className="summary-title">Total spent (30 days)</h3>
        <span className="summary-value" data-testid="summary-total">{formatRand(summary.totalSpent)}</span>
      </div>
      <Sparkline points={points} animate={!prefersReduced} />
    </section>
  );
}

interface SparklineProps { readonly points: readonly number[]; readonly animate?: boolean }
function Sparkline({ points, animate = true }: Readonly<SparklineProps>) {
  const path = buildSparklinePath(points, 30);
  return (
    <figure className="sparkline" aria-label="30-day spending sparkline">
      <svg viewBox={`0 0 ${points.length} 30`} preserveAspectRatio="none" className={animate? 'sparkline-svg animate':'sparkline-svg'}>
        <path d={path} fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      <figcaption className="visually-hidden">30-day spending sparkline</figcaption>
    </figure>
  );
}
