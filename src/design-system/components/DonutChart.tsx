/**
 * DONUT CHART COMPONENT
 * Design system category breakdown chart with side-by-side legend
 */

import { forwardRef, type CSSProperties } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { brand, categories as categoryColors, type CategoryName, neutral, text as textColors, spacingNum, radius } from '../tokens';
import { formatCurrency, usePrefersReducedMotion, useBreakpoint } from '../index';
import { useTheme } from '../useTheme';
import type { CategoryItem } from '../../data/models';
import { Text } from './Text';

// Chart configuration
const PIE_CONFIG = {
  innerRadius: 70,
  outerRadius: 100,
  padAngle: 2,
  cornerRadius: 6,
};

function getCategoryColor(name: string): string {
  const key = name.toLowerCase().replace(/\s+/g, '') as CategoryName;
  return categoryColors[key]?.main || brand.primary;
}

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

export interface DonutChartProps {
  data: CategoryItem[];
  total: number;
  onSegmentClick?: (category: string) => void;
  height?: number;
}

export const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(
  ({ data, total, onSegmentClick, height = 280 }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = useTheme(); // Force re-render on theme change
    const reducedMotion = usePrefersReducedMotion();
    const breakpoint = useBreakpoint();
    const isMobile = breakpoint === 'mobile';

    const chartData = data.map(item => ({
      name: item.name,
      amount: item.amount,
      percentage: item.percentage,
      color: getCategoryColor(item.name),
    }));

    const top = data[0];
    const summaryId = 'category-donut-summary';

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: { 
      active?: boolean; 
      payload?: Array<{ payload: { name: string; amount: number; percentage: number } }> 
    }) => {
      if (!active || !payload?.[0]) return null;

      const data = payload[0].payload;
      return (
        <div style={createDynamicStyles({
          backgroundColor: neutral[900],
          color: textColors.inverse,
          padding: `${spacingNum[2]}px ${spacingNum[3]}px`,
          borderRadius: radius.md,
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        })}>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>
            {data.name}
          </div>
          <div style={{ fontSize: '13px', opacity: 0.9 }}>
            {formatCurrency(data.amount)} ({data.percentage?.toFixed(1)}%)
          </div>
        </div>
      );
    };

    // Legend pill chip
    const LegendChip = ({ item }: { item: typeof chartData[0] }) => (
      <button
        type="button"
        onClick={onSegmentClick ? () => onSegmentClick(item.name) : undefined}
        style={createDynamicStyles({
          display: 'flex',
          alignItems: 'center',
          gap: `${spacingNum[2]}px`,
          padding: `${spacingNum[2]}px ${spacingNum[3]}px`,
          borderRadius: radius.full,
          border: `1px solid ${item.color}`,
          backgroundColor: 'transparent',
          cursor: onSegmentClick ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
          fontSize: '13px',
          fontWeight: 500,
          color: textColors.primary,
          whiteSpace: 'nowrap',
        })}
        onMouseEnter={(e) => {
          if (onSegmentClick) {
            e.currentTarget.style.backgroundColor = item.color;
            e.currentTarget.style.color = textColors.inverse;
          }
        }}
        onMouseLeave={(e) => {
          if (onSegmentClick) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = textColors.primary;
          }
        }}
        aria-label={`${item.name}: ${formatCurrency(item.amount)}, ${item.percentage?.toFixed(1)}% of total`}
      >
        <span
          style={createDynamicStyles({
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: item.color,
          })}
          aria-hidden="true"
        />
        <span>{item.name}</span>
        <span style={{ opacity: 0.7, fontSize: '12px' }}>{formatCurrency(item.amount)}</span>
      </button>
    );

    const containerStyles = createDynamicStyles({
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'center' : 'flex-start',
      gap: `${spacingNum[6]}px`,
      width: '100%',
    });

    const chartWrapperStyles = createDynamicStyles({
      position: 'relative',
      width: isMobile ? '100%' : '280px',
      flexShrink: 0,
    });

    const centerLabelStyles = createDynamicStyles({
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      pointerEvents: 'none',
    });

    const legendStyles = createDynamicStyles({
      display: 'flex',
      flexDirection: 'column',
      gap: `${spacingNum[2]}px`,
      flex: 1,
      minWidth: 0,
    });

    return (
      <div ref={ref} style={containerStyles} aria-describedby={summaryId}>
        {/* Chart */}
        <div style={chartWrapperStyles}>
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="name"
                innerRadius={PIE_CONFIG.innerRadius}
                outerRadius={PIE_CONFIG.outerRadius}
                isAnimationActive={!reducedMotion}
                animationDuration={reducedMotion ? 0 : 800}
                animationEasing="ease-out"
                paddingAngle={PIE_CONFIG.padAngle}
                cornerRadius={PIE_CONFIG.cornerRadius}
                onClick={onSegmentClick ? (dp) => onSegmentClick((dp as { name?: string }).name || '') : undefined}
                style={{ cursor: onSegmentClick ? 'pointer' : 'default', outline: 'none' }}
              >
                {chartData.map(item => (
                  <Cell
                    key={item.name}
                    fill={item.color}
                    style={{ outline: 'none' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div style={centerLabelStyles} aria-hidden="true">
            <Text variant="bodySm" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              {top?.name ? 'Top' : 'Total'}
            </Text>
            <div style={{ fontSize: '20px', fontWeight: 700, color: textColors.strong, marginBottom: '2px' }}>
              {formatCurrency(top?.amount ?? total)}
            </div>
            {top?.name && (
              <Text variant="bodySm" color="muted">{top.name}</Text>
            )}
          </div>
        </div>

        {/* Legend */}
        <div style={legendStyles} role="list" aria-label="Category legend">
          {data.slice(0, 6).map((item) => (
            <LegendChip key={item.name} item={chartData.find(c => c.name === item.name)!} />
          ))}
        </div>

        {/* Screen reader summary */}
        <div id={summaryId} style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          Category breakdown shows {data.length} categories.
          Top category: {top?.name || 'N/A'} at {formatCurrency(top?.amount || 0)}
          ({top?.percentage?.toFixed(1)}% of total).
          Total spending: {formatCurrency(total)}.
        </div>
      </div>
    );
  }
);

DonutChart.displayName = 'DonutChart';
