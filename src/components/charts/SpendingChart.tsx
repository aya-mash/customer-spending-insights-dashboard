import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatRand } from '../../utils/currency';
import { useReducedMotion } from '../../utils/accessibility';

interface SpendingPoint {
  date: string;
  amount: number;
}

interface SpendingChartProps {
  data: SpendingPoint[];
}

export default function SpendingChart({ data }: SpendingChartProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="spending-chart">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="date" 
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
          <Tooltip 
            formatter={(value: unknown) => [formatRand(Number(value)), 'Amount']}
            labelStyle={{ color: 'var(--color-text)' }}
            contentStyle={{ 
              backgroundColor: 'var(--color-surface)', 
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-2)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="var(--color-primary)" 
            strokeWidth={2}
            dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
            isAnimationActive={!reducedMotion}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}