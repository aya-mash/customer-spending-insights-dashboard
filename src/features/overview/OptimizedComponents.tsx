import { memo, useMemo, useCallback } from 'react';
import { formatRand } from '../../utils/currency';

interface OverviewSummaryProps {
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  topCategory: string;
  period: string;
  spentChange: number;
  transactionChange: number;
}

export const OverviewSummary = memo(function OverviewSummary({
  totalSpent,
  transactionCount,
  averageTransaction,
  topCategory,
  period,
  spentChange,
  transactionChange
}: OverviewSummaryProps) {
  const formattedTotalSpent = useMemo(() => formatRand(totalSpent), [totalSpent]);
  const formattedAverage = useMemo(() => formatRand(averageTransaction), [averageTransaction]);
  
  const spentChangeFormatted = useMemo(() => {
    const abs = Math.abs(spentChange);
    const sign = spentChange >= 0 ? '+' : '';
    return `${sign}${abs.toFixed(1)}%`;
  }, [spentChange]);
  
  const transactionChangeFormatted = useMemo(() => {
    const abs = Math.abs(transactionChange);
    const sign = transactionChange >= 0 ? '+' : '';
    return `${sign}${abs.toFixed(1)}%`;
  }, [transactionChange]);

  return (
    <div className="overview-summary card">
      <div className="card__header">
        <h2 className="card__title">Spending Summary</h2>
        <span className="card__subtitle">{period}</span>
      </div>
      
      <div className="summary-grid">
        <div className="summary-metric">
          <div className="metric-label">Total Spent</div>
          <div className="metric-value">{formattedTotalSpent}</div>
          <div className={`metric-change ${spentChange >= 0 ? 'positive' : 'negative'}`}>
            {spentChangeFormatted} vs previous period
          </div>
        </div>
        
        <div className="summary-metric">
          <div className="metric-label">Transactions</div>
          <div className="metric-value">{transactionCount}</div>
          <div className={`metric-change ${transactionChange >= 0 ? 'positive' : 'negative'}`}>
            {transactionChangeFormatted} vs previous period
          </div>
        </div>
        
        <div className="summary-metric">
          <div className="metric-label">Average Transaction</div>
          <div className="metric-value">{formattedAverage}</div>
        </div>
        
        <div className="summary-metric">
          <div className="metric-label">Top Category</div>
          <div className="metric-value metric-value--category">{topCategory}</div>
        </div>
      </div>
    </div>
  );
});

interface QuickActionsProps {
  onViewTransactions: () => void;
  onViewInsights: () => void;
  onExportData: () => void;
}

export const QuickActions = memo(function QuickActions({
  onViewTransactions,
  onViewInsights,
  onExportData
}: QuickActionsProps) {
  const handleKeyDown = useCallback((e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);

  return (
    <div className="quick-actions card">
      <div className="card__header">
        <h2 className="card__title">Quick Actions</h2>
      </div>
      
      <div className="actions-grid">
        <button
          type="button"
          className="action-button"
          onClick={onViewTransactions}
          onKeyDown={(e) => handleKeyDown(e, onViewTransactions)}
        >
          <span className="action-icon" aria-hidden="true">💳</span>
          <span className="action-label">View Transactions</span>
          <span className="action-arrow" aria-hidden="true">→</span>
        </button>
        
        <button
          type="button"
          className="action-button"
          onClick={onViewInsights}
          onKeyDown={(e) => handleKeyDown(e, onViewInsights)}
        >
          <span className="action-icon" aria-hidden="true">📊</span>
          <span className="action-label">View Insights</span>
          <span className="action-arrow" aria-hidden="true">→</span>
        </button>
        
        <button
          type="button"
          className="action-button"
          onClick={onExportData}
          onKeyDown={(e) => handleKeyDown(e, onExportData)}
        >
          <span className="action-icon" aria-hidden="true">📥</span>
          <span className="action-label">Export Data</span>
          <span className="action-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
});