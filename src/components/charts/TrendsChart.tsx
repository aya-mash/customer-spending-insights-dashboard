import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatRand } from '../../utils/currency';
import { useReducedMotion } from '../../utils/accessibility';
import type { MonthlyTrendPoint } from '../../data/models';

interface TrendsChartProps {
  data: MonthlyTrendPoint[];
}

export default function TrendsChart({ data }: TrendsChartProps) {
  const reducedMotion = useReducedMotion();
  
  const min = Math.min(...data.map(d => d.totalSpent));
  const max = Math.max(...data.map(d => d.totalSpent));
  const direction = data.length >= 2 
    ? data[data.length - 1].totalSpent > data[0].totalSpent ? 'upward' : 'downward'
    : 'stable';
  
  const summaryId = 'trends-chart-summary';

  return (
    <div className="trends-chart" aria-describedby={summaryId} aria-label="Monthly spending trends area chart">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="month" 
            stroke="var(--color-text-muted)"
            fontSize={12}
            tick={{ fill: 'var(--color-text-muted)' }}
          />
          <YAxis 
            stroke="var(--color-text-muted)"
            fontSize={12}
            tick={{ fill: 'var(--color-text-muted)' }}
            tickFormatter={(value) => formatRand(value)}
          />
          <Tooltip content={({ active, payload, label }) => {
            if (!active || !payload || !payload[0]) return null;
            const value = payload[0].value as number;
            const index = data.findIndex(d => d.month === label);
            const prevVal = index > 0 ? data[index - 1]?.totalSpent : undefined;
            const diff = prevVal !== undefined ? value - prevVal : 0;
            const diffSign = diff === 0 ? '' : diff > 0 ? '+' : '−';
            return (
              <div className="trend-tooltip">
                <strong>{label}</strong>
                <div>{formatRand(value)}</div>
                {prevVal !== undefined && (
                  <span className={`delta-chip ${diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat'}`}>
                    {diffSign}{formatRand(Math.abs(diff))}
                  </span>
                )}
              </div>
            );
          }} />
          <Area 
            type="monotone" 
            dataKey="totalSpent" 
            stroke="var(--color-accent)" 
            fill="url(#trendFill)" 
            isAnimationActive={!reducedMotion}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div id={summaryId} className="trends-summary" aria-hidden="true">
        Trend spans {data.length} months. Min {formatRand(min)}, Max {formatRand(max)}, overall direction {direction}.
      </div>
    </div>
  );
}