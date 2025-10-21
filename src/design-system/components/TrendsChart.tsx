import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatRand } from '../../utils/currency';
import { useReducedMotion } from '../../utils/accessibility';
import type { MonthlyTrendPoint } from '../../data/models';
import {
  getAnimationDuration,
  CHART_COLORS,
  GRID_CONFIG,
  AXIS_CONFIG,
  TOOLTIP_STYLES,
  LINE_CHART_CONFIG,
  formatTooltipCurrency,
} from '../../lib/chartConfig';

interface TrendsChartProps {
  data: MonthlyTrendPoint[];
}

/**
 * TrendsChart - Production-grade monthly spending trends visualization
 *
 * Features:
 * - Smooth area gradient with brand colors
 * - Subtle grid lines for readability
 * - Custom tooltip with month-over-month delta
 * - Clean, minimal axes
 * - Responsive sizing
 * - Smooth 750ms animations
 * - Accessible with textual summary
 * - Respects reduced motion preference
 */
export default function TrendsChart({ data }: TrendsChartProps) {
  const reducedMotion = useReducedMotion();
  
  // Track theme for instant chart updates
  const [themeKey, setThemeKey] = useState(0);
  useEffect(() => {
    const handleThemeChange = () => setThemeKey(k => k + 1);
    document.addEventListener('themechange', handleThemeChange);
    return () => document.removeEventListener('themechange', handleThemeChange);
  }, []);

  const min = Math.min(...data.map(d => d.totalSpent));
  const max = Math.max(...data.map(d => d.totalSpent));
  
  // Fix nested ternary - use explicit if-else for better readability
  let direction: 'upward' | 'downward' | 'stable' = 'stable';
  if (data.length >= 2) {
    const lastValue = data[data.length - 1].totalSpent;
    const firstValue = data[0].totalSpent;
    direction = lastValue > firstValue ? 'upward' : 'downward';
  }

  const summaryId = 'trends-chart-summary';

  // Format month labels (YYYY-MM → MMM)
  const formatMonth = (month: string) => {
    const date = new Date(month + '-01');
    return date.toLocaleDateString('en-ZA', { month: 'short' });
  };

  // Custom tooltip component with delta
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (!active || !payload?.[0]) return null;

    const value = payload[0].value;
    const index = data.findIndex(d => d.month === label);
    const prevVal = index > 0 ? data[index - 1]?.totalSpent : undefined;
    const diff = prevVal !== undefined ? value - prevVal : 0;
    const diffPercent = prevVal !== undefined ? ((diff / prevVal) * 100) : 0;
    const isPositive = diff > 0;
    const isNegative = diff < 0;

    return (
      <div style={TOOLTIP_STYLES}>
        <div style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-strong)' }}>
          {formatMonth(label || '')} {label?.split('-')[0]}
        </div>
        <div style={{ fontSize: '15px', marginBottom: '6px', color: 'var(--color-text)' }}>
          {formatTooltipCurrency(value)}
        </div>
        {prevVal !== undefined && diff !== 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px',
              color: isPositive ? 'var(--color-error)' : isNegative ? 'var(--color-success)' : 'var(--color-text-muted)',
              fontWeight: 500,
            }}
          >
            {isPositive ? <TrendingUp size={14} strokeWidth={2.5} /> : <TrendingDown size={14} strokeWidth={2.5} />}
            {isPositive ? '+' : ''}{formatTooltipCurrency(diff)} ({diffPercent > 0 ? '+' : ''}{diffPercent.toFixed(1)}%)
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: '2px' }}>
              vs prev month
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="trends-chart" aria-describedby={summaryId} aria-label="Monthly spending trends area chart">
      <ResponsiveContainer key={`chart-${themeKey}`} width="100%" height={340}>
        <AreaChart
          data={data}
          margin={{ top: 24, right: 24, left: 16, bottom: 24 }}
        >
          <defs>
            <linearGradient id="trendAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.3}/>
              <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0.02}/>
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke={GRID_CONFIG.stroke}
            strokeDasharray={GRID_CONFIG.strokeDasharray}
            strokeWidth={GRID_CONFIG.strokeWidth}
            opacity={GRID_CONFIG.opacity}
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tickFormatter={formatMonth}
            {...AXIS_CONFIG.tick}
            axisLine={AXIS_CONFIG.axisLine}
            tickLine={AXIS_CONFIG.tickLine}
            dy={8}
          />

          <YAxis
            {...AXIS_CONFIG.tick}
            axisLine={AXIS_CONFIG.axisLine}
            tickLine={AXIS_CONFIG.tickLine}
            tickFormatter={(value) => formatRand(value)}
            width={80}
            dx={-8}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: CHART_COLORS.grid, strokeWidth: 1 }} />

          <Area
            type="monotone"
            dataKey="totalSpent"
            stroke={CHART_COLORS.primary}
            fill="url(#trendAreaGradient)"
            isAnimationActive={!reducedMotion}
            animationDuration={getAnimationDuration()}
            animationEasing="ease-out"
            strokeWidth={LINE_CHART_CONFIG.strokeWidth}
            dot={{
              ...LINE_CHART_CONFIG.dot,
              fill: CHART_COLORS.primary,
            }}
            activeDot={{
              ...LINE_CHART_CONFIG.activeDot,
              fill: CHART_COLORS.primary,
              stroke: 'var(--color-surface)',
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Screen reader summary */}
      <div id={summaryId} className="visually-hidden">
        Monthly spending trend shows {data.length} months of data.
        Minimum spending: {formatRand(min)}, Maximum spending: {formatRand(max)}.
        Overall trend is {direction}.
      </div>
    </div>
  );
}
