import React, { memo } from 'react';
import { Card } from './Card';
import type { Transaction } from '../data/models';
import { formatRand } from '../lib/format';
import { useMemoizedSelector } from '../utils/performance';

interface OverviewData {
  totalSpending: number;
  spendingChange: number;
  monthlyBudget: number;
  transactionCount: number;
  transactionCountChange: number;
  topCategory: {
    name: string;
    amount: number;
    percentage: number;
  };
}

interface OptimizedOverviewCardsProps {
  data: OverviewData;
  loading?: boolean;
}

export const OptimizedOverviewCards = memo<OptimizedOverviewCardsProps>(({ 
  data, 
  loading = false 
}) => {
  const summaryCards = useMemoizedSelector(data, (overviewData) => [
    {
      title: 'Total Spending',
      value: formatRand(overviewData.totalSpending),
      change: overviewData.spendingChange,
      trend: overviewData.spendingChange >= 0 ? 'up' : 'down'
    },
    {
      title: 'Monthly Budget',
      value: formatRand(overviewData.monthlyBudget),
      used: (overviewData.totalSpending / overviewData.monthlyBudget) * 100,
      remaining: overviewData.monthlyBudget - overviewData.totalSpending
    },
    {
      title: 'Transactions',
      value: overviewData.transactionCount.toString(),
      change: overviewData.transactionCountChange,
      trend: overviewData.transactionCountChange >= 0 ? 'up' : 'down'
    },
    {
      title: 'Top Category',
      value: overviewData.topCategory.name,
      amount: formatRand(overviewData.topCategory.amount),
      percentage: overviewData.topCategory.percentage
    }
  ]);

  if (loading) {
    return (
      <div className="overview-cards-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="overview-card skeleton">
            <div className="skeleton-text skeleton-title"></div>
            <div className="skeleton-text skeleton-value"></div>
            <div className="skeleton-text skeleton-change"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="overview-cards-grid">
      {summaryCards.map((card, index) => (
        <Card key={index} className="overview-card">
          <div className="card-header">
            <h3 className="card-title">{card.title}</h3>
          </div>
          <div className="card-content">
            <div className="primary-value">{card.value}</div>
            {'change' in card && card.change !== undefined && (
              <div className={`change-indicator ${card.trend}`}>
                <span className="change-value">
                  {card.change > 0 ? '+' : ''}{card.change}%
                </span>
              </div>
            )}
            {'used' in card && card.used !== undefined && (
              <div className="budget-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min(card.used, 100)}%` }}
                  />
                </div>
                <div className="budget-details">
                  <span className="budget-used">{card.used.toFixed(1)}% used</span>
                  <span className="budget-remaining">
                    {formatRand(card.remaining || 0)} remaining
                  </span>
                </div>
              </div>
            )}
            {'amount' in card && card.amount && (
              <div className="category-details">
                <div className="category-amount">{card.amount}</div>
                <div className="category-percentage">{card.percentage}% of total</div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
});

OptimizedOverviewCards.displayName = 'OptimizedOverviewCards';

interface OptimizedTransactionSummaryProps {
  transactions: Transaction[];
  dateRange: { start: Date; end: Date };
}

export const OptimizedTransactionSummary = memo<OptimizedTransactionSummaryProps>(({ 
  transactions, 
  dateRange 
}) => {
  const summary = useMemoizedSelector(
    { transactions, dateRange }, 
    ({ transactions: txns }) => {
      const totalAmount = txns.reduce((sum, tx) => sum + tx.amount, 0);
      const avgTransaction = txns.length > 0 ? totalAmount / txns.length : 0;
      
      const categoryTotals = txns.reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {} as Record<string, number>);

      const topCategories = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: (amount / totalAmount) * 100
        }));

      return {
        totalAmount,
        avgTransaction,
        transactionCount: txns.length,
        topCategories
      };
    }
  );

  return (
    <Card className="transaction-summary">
      <div className="summary-header">
        <h3>Transaction Summary</h3>
        <span className="date-range">
          {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
        </span>
      </div>
      
      <div className="summary-metrics">
        <div className="metric">
          <span className="metric-label">Total Spending</span>
          <span className="metric-value">{formatRand(summary.totalAmount)}</span>
        </div>
        
        <div className="metric">
          <span className="metric-label">Transactions</span>
          <span className="metric-value">{summary.transactionCount}</span>
        </div>
        
        <div className="metric">
          <span className="metric-label">Avg. Transaction</span>
          <span className="metric-value">{formatRand(summary.avgTransaction)}</span>
        </div>
      </div>

      {summary.topCategories.length > 0 && (
        <div className="top-categories">
          <h4>Top Categories</h4>
          {summary.topCategories.map(({ category, amount, percentage }) => (
            <div key={category} className="category-item">
              <span className="category-name">{category}</span>
              <div className="category-stats">
                <span className="category-amount">{formatRand(amount)}</span>
                <span className="category-percentage">({percentage.toFixed(1)}%)</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
});

OptimizedTransactionSummary.displayName = 'OptimizedTransactionSummary';

interface MemoizedChartWrapperProps {
  children: React.ReactNode;
  dataHash: string;
  className?: string;
}

export const MemoizedChartWrapper = memo<MemoizedChartWrapperProps>(({ 
  children, 
  className 
}) => {
  return (
    <div className={`chart-wrapper ${className || ''}`}>
      {children}
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if data hash changes
  return prevProps.dataHash === nextProps.dataHash;
});

MemoizedChartWrapper.displayName = 'MemoizedChartWrapper';