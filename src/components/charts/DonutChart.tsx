import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatRand } from '../../utils/currency';
import { useReducedMotion } from '../../utils/accessibility';
import type { CategoryItem } from '../../data/models';

interface DonutChartProps {
  data: CategoryItem[];
  total: number;
  onSegmentClick?: (category: string) => void;
}

export default function DonutChart({ data, total, onSegmentClick }: DonutChartProps) {
  const reducedMotion = useReducedMotion();
  
  const chartData = data.map(item => ({
    name: item.name,
    amount: item.amount,
    color: item.color || 'var(--color-accent-soft)'
  }));

  const top = data[0];
  const summaryId = 'category-donut-summary';

  return (
    <div className="category-donut" aria-describedby={summaryId} aria-label="Spending by category donut chart">
      <div className="donut-chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              isAnimationActive={!reducedMotion}
              paddingAngle={2}
              cornerRadius={6}
              onClick={onSegmentClick ? (dp) => onSegmentClick((dp as { name?: string }).name || '') : undefined}
            >
              {chartData.map(item => (
                <Cell key={item.name} fill={item.color} aria-label={`${item.name} slice`} />
              ))}
            </Pie>
            <Tooltip formatter={(value: unknown, _name, d) => [formatRand(Number(value)), (d && (d as { payload: { name?: string } }).payload.name) || '']} />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center" aria-hidden="true">
          <div className="donut-center-label">{top?.name ? 'Top' : 'Total'}</div>
          <div className="donut-center-value">{formatRand(top?.amount ?? total)}</div>
          {top?.name && <div className="donut-center-category">{top.name}</div>}
        </div>
      </div>
      <div id={summaryId} className="donut-summary" aria-hidden="true">
        Category breakdown shows {data.length} categories. 
        Top category: {top?.name || 'N/A'} ({formatRand(top?.amount || 0)}). 
        Total spending: {formatRand(total)}.
      </div>
      <div className="donut-legend" role="list" aria-label="Category legend">
        {data.slice(0, 5).map((item) => (
          <button 
            key={item.name} 
            type="button" 
            onClick={onSegmentClick ? () => onSegmentClick(item.name) : undefined}
            className="chip chip--legend"
            role="listitem"
            style={{ borderColor: item.color }}
          >
            <span 
              className="legend-color" 
              style={{ backgroundColor: item.color }} 
              aria-hidden="true"
            />
            {item.name} ({formatRand(item.amount)})
          </button>
        ))}
      </div>
    </div>
  );
}