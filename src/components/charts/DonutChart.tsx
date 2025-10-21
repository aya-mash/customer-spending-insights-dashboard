import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatRand } from '../../utils/currency';
import { useReducedMotion } from '../../utils/accessibility';
import type { CategoryItem } from '../../data/models';
import {
  getAnimationDuration,
  getCategoryColor,
  PIE_CHART_CONFIG,
  TOOLTIP_STYLES,
  formatTooltipCurrency,
} from '../../lib/chartConfig';

interface DonutChartProps {
  data: CategoryItem[];
  total: number;
  onSegmentClick?: (category: string) => void;
}

/**
 * DonutChart - Production-grade category breakdown visualization
 * 
 * Features:
 * - Brand colors for categories
 * - Inner label showing top category and total
 * - Rounded segment corners with subtle padding
 * - Custom tooltip with proper styling
 * - Click to drill down to transactions
 * - Accessible with SR summary
 * - Smooth animations (respects reduced motion)
 * - Pill-style legend chips
 */
export default function DonutChart({ data, total, onSegmentClick }: DonutChartProps) {
  const reducedMotion = useReducedMotion();
  
  const chartData = data.map(item => ({
    name: item.name,
    amount: item.amount,
    percentage: item.percentage,
    color: getCategoryColor(item.name),
  }));

  const top = data[0];
  const summaryId = 'category-donut-summary';

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; amount: number; percentage: number } }> }) => {
    if (!active || !payload?.[0]) return null;

    const data = payload[0].payload;
    return (
      <div style={TOOLTIP_STYLES}>
        <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--color-text-strong)' }}>
          {data.name}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
          {formatTooltipCurrency(data.amount)} ({data.percentage?.toFixed(1)}%)
        </div>
      </div>
    );
  };

  return (
    <div className="category-donut" aria-describedby={summaryId} aria-label="Spending by category donut chart">
      <div className="donut-chart-wrapper">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="name"
              innerRadius={PIE_CHART_CONFIG.innerRadius}
              outerRadius={PIE_CHART_CONFIG.outerRadius}
              isAnimationActive={!reducedMotion}
              animationDuration={getAnimationDuration()}
              animationEasing="ease-out"
              paddingAngle={PIE_CHART_CONFIG.padAngle}
              cornerRadius={PIE_CHART_CONFIG.cornerRadius}
              onClick={onSegmentClick ? (dp) => onSegmentClick((dp as { name?: string }).name || '') : undefined}
              style={{ cursor: onSegmentClick ? 'pointer' : 'default' }}
            >
              {chartData.map(item => (
                <Cell 
                  key={item.name} 
                  fill={item.color} 
                  aria-label={`${item.name} slice`}
                  style={{ 
                    outline: 'none',
                    transition: 'opacity var(--transition-fast) var(--ease-standard)',
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center label - Top category and total */}
        <div className="donut-center" aria-hidden="true">
          <div className="donut-center-label">{top?.name ? 'Top' : 'Total'}</div>
          <div className="donut-center-value">{formatRand(top?.amount ?? total)}</div>
          {top?.name && <div className="donut-center-category">{top.name}</div>}
        </div>
      </div>
      
      {/* Screen reader summary */}
      <div id={summaryId} className="visually-hidden">
        Category breakdown shows {data.length} categories. 
        Top category: {top?.name || 'N/A'} at {formatRand(top?.amount || 0)} 
        ({top?.percentage?.toFixed(1)}% of total). 
        Total spending: {formatRand(total)}.
      </div>
      
      {/* Legend with pill chips */}
      <div className="donut-legend" role="list" aria-label="Category legend">
        {data.slice(0, 6).map((item) => (
          <button 
            key={item.name} 
            type="button" 
            onClick={onSegmentClick ? () => onSegmentClick(item.name) : undefined}
            className="chip chip--legend"
            role="listitem"
            style={{ 
              '--chip-color': getCategoryColor(item.name),
              borderColor: getCategoryColor(item.name),
            } as React.CSSProperties}
            aria-label={`${item.name}: ${formatRand(item.amount)}, ${item.percentage?.toFixed(1)}% of total. Click to view transactions.`}
          >
            <span 
              className="legend-color" 
              style={{ backgroundColor: getCategoryColor(item.name) }} 
              aria-hidden="true"
            />
            <span className="legend-name">{item.name}</span>
            <span className="legend-amount">{formatRand(item.amount)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}