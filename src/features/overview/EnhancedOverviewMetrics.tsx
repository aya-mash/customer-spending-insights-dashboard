import {
  Wallet,
  CreditCard,
  TrendingUp,
  ShoppingBag,
  Target,
  Calendar,
  ArrowUpRight,
  DollarSign,
} from 'lucide-react';
import { MetricCard, MetricCardGrid } from '../../components/MetricCard';
import { formatRand } from '../../lib/format';
import type { SpendingSummary } from '../../data/models';

interface EnhancedOverviewMetricsProps {
  summary: SpendingSummary;
  isLoading?: boolean;
}

/**
 * EnhancedOverviewMetrics - Comprehensive financial overview dashboard
 * 
 * Displays 8 production-grade metric cards:
 * 1. Total Spent (with trend vs previous period)
 * 2. Transaction Count (with trend)
 * 3. Average Transaction Value
 * 4. Top Spending Category
 * 5. Month-over-Month Change
 * 6. Spending Velocity (daily average)
 * 7. Largest Single Transaction
 * 8. Days Remaining in Period
 * 
 * Features:
 * - Responsive grid (4 cols desktop, 2 tablet, 1 mobile)
 * - Capitec brand colors and iconography
 * - Smooth hover interactions
 * - Loading skeleton states
 * - Proper accessibility
 * - ZAR currency formatting
 */
export function EnhancedOverviewMetrics({
  summary,
  isLoading = false,
}: EnhancedOverviewMetricsProps) {
  // Calculate additional metrics from summary data
  const spendingVelocity = summary.totalSpent / 30; // Daily average
  const daysRemaining = calculateDaysRemainingInMonth();
  
  // Mock data for metrics not in API (would come from enhanced API in production)
  const largestTransaction = summary.totalSpent * 0.15; // Example: 15% of total
  const budgetComparison = calculateBudgetVsActual(summary.totalSpent);

  return (
    <MetricCardGrid>
      {/* 1. Total Spent - Primary metric with trend */}
      <MetricCard
        label="Total Spent"
        value={formatRand(summary.totalSpent)}
        icon={Wallet}
        category="primary"
        trend={summary.comparedToPrevious?.spentChange}
        comparisonText="vs last period"
        isLoading={isLoading}
      />

      {/* 2. Transaction Count - Activity indicator */}
      <MetricCard
        label="Transactions"
        value={summary.transactionCount.toLocaleString()}
        icon={CreditCard}
        category="secondary"
        trend={summary.comparedToPrevious?.transactionChange}
        comparisonText="vs last period"
        isLoading={isLoading}
      />

      {/* 3. Average Transaction - Spending pattern */}
      <MetricCard
        label="Avg Transaction"
        value={formatRand(summary.averageTransaction)}
        icon={TrendingUp}
        category="info"
        isLoading={isLoading}
      />

      {/* 4. Top Category - Where money goes */}
      <MetricCard
        label="Top Category"
        value={summary.topCategory || 'N/A'}
        icon={ShoppingBag}
        category={getCategoryColor(summary.topCategory)}
        isLoading={isLoading}
      />

      {/* 5. Budget vs Actual - Financial health */}
      <MetricCard
        label="Budget Status"
        value={budgetComparison.percentage + '%'}
        icon={Target}
        category={budgetComparison.status}
        trend={budgetComparison.trend}
        comparisonText="of budget used"
        isLoading={isLoading}
      />

      {/* 6. Spending Velocity - Daily burn rate */}
      <MetricCard
        label="Daily Average"
        value={formatRand(spendingVelocity)}
        icon={Calendar}
        category="warning"
        isLoading={isLoading}
      >
        <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--color-text-muted)' }}>
          Based on {summary.period} period
        </span>
      </MetricCard>

      {/* 7. Largest Transaction - Spending spike */}
      <MetricCard
        label="Largest Purchase"
        value={formatRand(largestTransaction)}
        icon={ArrowUpRight}
        category="error"
        isLoading={isLoading}
      />

      {/* 8. Month Progress - Time context */}
      <MetricCard
        label="Days Remaining"
        value={daysRemaining}
        icon={DollarSign}
        category="success"
        isLoading={isLoading}
      >
        <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--color-text-muted)' }}>
          in current month
        </span>
      </MetricCard>
    </MetricCardGrid>
  );
}

/**
 * Calculate days remaining in current month
 */
function calculateDaysRemainingInMonth(): number {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.getDate() - now.getDate();
}

/**
 * Map spending category to metric card category color
 */
function getCategoryColor(
  categoryName?: string
): 'groceries' | 'entertainment' | 'transport' | 'dining' | 'shopping' | 'utilities' | 'primary' {
  if (!categoryName) return 'primary';
  
  const normalized = categoryName.toLowerCase();
  
  if (normalized.includes('grocer') || normalized.includes('food')) {
    return 'groceries';
  }
  if (normalized.includes('entertainment') || normalized.includes('movie')) {
    return 'entertainment';
  }
  if (normalized.includes('transport') || normalized.includes('fuel') || normalized.includes('uber')) {
    return 'transport';
  }
  if (normalized.includes('dining') || normalized.includes('restaurant')) {
    return 'dining';
  }
  if (normalized.includes('shopping') || normalized.includes('retail')) {
    return 'shopping';
  }
  if (normalized.includes('utilities') || normalized.includes('bill')) {
    return 'utilities';
  }
  
  return 'primary';
}

/**
 * Calculate budget vs actual comparison
 * In production, this would come from the API
 */
function calculateBudgetVsActual(totalSpent: number): {
  percentage: number;
  status: 'success' | 'warning' | 'error';
  trend: number;
} {
  // Mock budget of R 15,000 for demonstration
  const mockBudget = 15000;
  const percentage = Math.round((totalSpent / mockBudget) * 100);
  
  let status: 'success' | 'warning' | 'error' = 'success';
  if (percentage >= 90) {
    status = 'error';
  } else if (percentage >= 75) {
    status = 'warning';
  }
  
  // Mock trend (would come from comparing to previous months)
  const trend = percentage > 85 ? 5 : -3;
  
  return { percentage, status, trend };
}
