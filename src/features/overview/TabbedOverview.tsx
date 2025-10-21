import { useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Calendar, Target, Clock } from 'lucide-react';
import { useOverviewData } from './useOverviewData';
import { formatRand } from '../../utils/currency';
import { Card, CardHeader, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import type { PeriodPreset } from '../../data/models';

// Lazy load charts
const DonutChart = lazy(() => import('../../components/charts/DonutChart'));

const PERIODS: Array<{ key: PeriodPreset; label: string }> = [
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: '90d', label: '90 Days' },
  { key: '1y', label: '1 Year' },
];

export function TabbedOverview() {
  const [activePeriod, setActivePeriod] = useState<PeriodPreset>('30d');
  const [categoryView, setCategoryView] = useState<'chart' | 'list'>('chart');
  const customerId = 'user123';
  const navigate = useNavigate();

  const { summary, goals, categories, transactions, isInitialLoading, isError, retry } = useOverviewData(customerId, activePeriod);

  if (isInitialLoading) {
    return <OverviewSkeleton />;
  }

  if (isError) {
    return (
      <div role="alert" className="overview-error">
        <p><strong>Could not load overview data.</strong></p>
        <p>Please check your connection and retry.</p>
        <Button onClick={retry} variant="secondary" size="small">Retry</Button>
      </div>
    );
  }

  const totalSpent = summary?.totalSpent || 0;
  const transactionCount = summary?.transactionCount || 0;
  const averageTransaction = summary?.averageTransaction || 0;
  const topCategory = summary?.topCategory || 'N/A';
  const spentChange = summary?.comparedToPrevious?.spentChange || 0;

  const categoryData = categories?.categories || [];
  const goalsData = goals?.goals || [];
  const transactionData = transactions?.transactions || [];

  return (
    <div className="tabbed-overview">
      {/* Period Filter Tabs */}
      <div className="overview-period-tabs" role="tablist" aria-label="Time period filter">
        {PERIODS.map((period) => (
          <button
            key={period.key}
            role="tab"
            aria-selected={activePeriod === period.key}
            aria-controls={`period-${period.key}`}
            tabIndex={activePeriod === period.key ? 0 : -1}
            onClick={() => setActivePeriod(period.key)}
            className={`period-tab ${activePeriod === period.key ? 'period-tab--active' : ''}`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Main Overview Grid - 3 cards that fit on desktop without scrolling */}
      <div className="overview-cards-grid">
        {/* Spending Overview Card */}
        <Card className="overview-card overview-card--spending" elevation={2}>
          <CardHeader>
            <div className="card-header-content">
              <Calendar size={20} className="card-icon" aria-hidden="true" />
              <h2 className="card-title">Spending Overview</h2>
            </div>
            <span className="period-badge">{PERIODS.find(p => p.key === activePeriod)?.label}</span>
          </CardHeader>
          <CardContent>
            <div className="spending-summary">
              <div className="spending-metric spending-metric--primary">
                <span className="metric-label">Total Spent</span>
                <span className="metric-value">{formatRand(totalSpent)}</span>
                {spentChange !== 0 && (
                  <div className="metric-change">
                    {spentChange > 0 ? (
                      <span className="change change--negative">
                        <TrendingUp size={14} aria-hidden="true" />
                        <span>{Math.abs(spentChange)}% vs previous</span>
                      </span>
                    ) : (
                      <span className="change change--positive">
                        <TrendingDown size={14} aria-hidden="true" />
                        <span>{Math.abs(spentChange)}% vs previous</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="spending-stats-grid">
                <div className="spending-stat">
                  <span className="stat-label">Transactions</span>
                  <span className="stat-value">{transactionCount}</span>
                </div>
                <div className="spending-stat">
                  <span className="stat-label">Average</span>
                  <span className="stat-value">{formatRand(averageTransaction)}</span>
                </div>
                <div className="spending-stat">
                  <span className="stat-label">Top Category</span>
                  <span className="stat-value stat-value--category">{topCategory}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spending by Category Card */}
        <Card className="overview-card overview-card--category" elevation={2}>
          <CardHeader>
            <div className="card-header-content">
              <Target size={20} className="card-icon" aria-hidden="true" />
              <h2 className="card-title">Spending by Category</h2>
            </div>
            <div className="category-view-toggle" role="tablist" aria-label="Category view">
              <button
                role="tab"
                aria-selected={categoryView === 'chart'}
                aria-controls="category-chart"
                onClick={() => setCategoryView('chart')}
                className={`view-toggle-btn ${categoryView === 'chart' ? 'view-toggle-btn--active' : ''}`}
              >
                Chart
              </button>
              <button
                role="tab"
                aria-selected={categoryView === 'list'}
                aria-controls="category-list"
                onClick={() => setCategoryView('list')}
                className={`view-toggle-btn ${categoryView === 'list' ? 'view-toggle-btn--active' : ''}`}
              >
                List
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {categoryView === 'chart' ? (
              categoryData && categoryData.length > 0 ? (
                <Suspense fallback={<div className="chart-skeleton" aria-label="Loading category chart" />}>
                  <DonutChart
                    data={categoryData}
                    total={totalSpent}
                    onSegmentClick={(name) => navigate(`/transactions?category=${encodeURIComponent(name)}`)}
                  />
                </Suspense>
              ) : (
                <div className="empty-state">
                  <p>No category data available</p>
                </div>
              )
            ) : (
              <div className="category-list">
                {categoryData && categoryData.length > 0 ? (
                  <ul className="category-list-items">
                    {categoryData.map((cat) => (
                      <li key={cat.name} className="category-list-item">
                        <div className="category-item-content">
                          <span className="category-name">{cat.name}</span>
                          <span className="category-percentage">{cat.percentage?.toFixed(1)}%</span>
                        </div>
                        <div className="category-item-footer">
                          <span className="category-amount">{formatRand(cat.amount)}</span>
                          <button
                            onClick={() => navigate(`/transactions?category=${encodeURIComponent(cat.name)}`)}
                            className="category-link"
                            aria-label={`View ${cat.name} transactions`}
                          >
                            View →
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="empty-state">
                    <p>No category data available</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Spending Goals Card */}
        <Card className="overview-card overview-card--goals" elevation={2}>
          <CardHeader>
            <div className="card-header-content">
              <Target size={24} className="card-icon" aria-hidden="true" />
              <h2 className="card-title">Spending Goals</h2>
            </div>
          </CardHeader>
          <CardContent>
            {goalsData && goalsData.length > 0 ? (
              <div className="goals-list">
                {goalsData.map((goal) => {
                  const progress = (goal.currentSpent / goal.monthlyBudget) * 100;
                  const isOverBudget = progress > 100;
                  return (
                    <div key={goal.id} className="goal-item">
                      <div className="goal-header">
                        <span className="goal-category">{goal.category}</span>
                        <span className={`goal-status ${isOverBudget ? 'goal-status--over' : ''}`}>
                          {formatRand(goal.currentSpent)} / {formatRand(goal.monthlyBudget)}
                        </span>
                      </div>
                      <div className="goal-progress-wrapper">
                        <div
                          className={`goal-progress-bar ${isOverBudget ? 'goal-progress-bar--over' : ''}`}
                          role="progressbar"
                          aria-valuenow={Math.min(progress, 100)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${goal.category} spending progress`}
                        >
                          <div
                            className="goal-progress-fill"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <span className="goal-percentage">{progress.toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <p>No spending goals set</p>
                <Button variant="secondary" size="small">Set Goals</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions Card */}
        <Card className="overview-card overview-card--transactions" elevation={2}>
          <CardHeader>
            <div className="card-header-content">
              <Clock size={24} className="card-icon" aria-hidden="true" />
              <h2 className="card-title">Recent Transactions</h2>
            </div>
            <Button
              variant="ghost"
              size="small"
              onClick={() => navigate('/transactions')}
              aria-label="View all transactions"
            >
              View All →
            </Button>
          </CardHeader>
          <CardContent>
            {transactionData && transactionData.length > 0 ? (
              <div className="recent-transactions-list">
                {transactionData.slice(0, 5).map((txn) => (
                  <div key={txn.id} className="recent-transaction-item">
                    <div className="transaction-main">
                      <span className="transaction-merchant">{txn.merchant}</span>
                      <span className="transaction-category">{txn.category}</span>
                    </div>
                    <div className="transaction-meta">
                      <span className="transaction-date">{txn.date}</span>
                      <span className={`transaction-amount ${txn.amount < 0 ? 'transaction-amount--negative' : ''}`}>
                        {formatRand(Math.abs(txn.amount))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No recent transactions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="tabbed-overview" aria-label="Loading overview" aria-busy="true">
      <div className="overview-period-tabs">
        {PERIODS.map((period) => (
          <div key={period.key} className="period-tab period-tab--skeleton" />
        ))}
      </div>
      <div className="overview-cards-grid">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="overview-card" elevation={2}>
            <div className="card-skeleton" />
          </Card>
        ))}
      </div>
    </div>
  );
}
