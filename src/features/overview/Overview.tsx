/**
 * OVERVIEW PAGE
 * Comprehensive dashboard with 8 metric cards, charts, and goals
 * Built with design system components - zero CSS dependencies
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  CreditCard, 
  DollarSign, 
  ShoppingBag,
  Calendar,
  Target,
  Clock,
  PieChart,
  Activity
} from 'lucide-react';
import { useOverviewData } from './useOverviewData';
import { formatCurrency, Skeleton } from '../../design-system';
import { 
  PageLayout, 
  Grid, 
  Card, 
  MetricCard, 
  Stack, 
  Button,
  Heading,
  Text,
  Badge,
  Divider,
  DonutChart,
  Tabs
} from '../../design-system/components/index';
import { radius } from '../../design-system/tokens';
import type { PeriodPreset } from '../../data/models';

const PERIODS: Array<{ key: PeriodPreset; label: string }> = [
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: '90d', label: '90 Days' },
  { key: '1y', label: '1 Year' },
];

// Period selector component (extracted outside Overview)
interface PeriodSelectorProps {
  activePeriod: PeriodPreset;
  onPeriodChange: (period: PeriodPreset) => void;
}

const PeriodSelector = ({ activePeriod, onPeriodChange }: PeriodSelectorProps) => (
  <Tabs
    items={PERIODS.map(p => ({ key: p.key, label: p.label }))}
    activeTab={activePeriod}
    onChange={(key) => onPeriodChange(key as PeriodPreset)}
    aria-label="Time period selection"
  />
);

export function Overview() {
  const [activePeriod, setActivePeriod] = useState<PeriodPreset>('30d');
  const customerId = 'user123';
  const navigate = useNavigate();

  const { 
    summary, 
    goals, 
    categories, 
    transactions, 
    isInitialLoading, 
    isError, 
    hasPartialData,
    retry 
  } = useOverviewData(customerId, activePeriod);

  // Show skeleton only if everything is still loading and we have no data yet
  if (isInitialLoading && !hasPartialData) {
    return <OverviewSkeleton />;
  }

  const totalSpent = summary?.totalSpent || 0;
  const transactionCount = summary?.transactionCount || 0;
  const averageTransaction = summary?.averageTransaction || 0;
  const topCategory = summary?.topCategory || 'N/A';
  const spentChange = summary?.comparedToPrevious?.spentChange || 0;

  const categoryData = categories?.categories || [];
  const goalsData = goals?.goals || [];
  const transactionData = transactions?.transactions || [];

  // Find top category amount from category data
  const topCategoryData = categoryData.find(c => c.name === topCategory);
  const topCategoryAmount = topCategoryData?.amount || 0;

  // Calculate additional metrics
  const largestTransaction = transactionData.length > 0
    ? Math.max(...transactionData.map(t => Math.abs(t.amount)))
    : 0;

  const mostFrequentCategory = categoryData.length > 0
    ? categoryData.reduce((prev, current) => 
        (current.transactionCount || 0) > (prev.transactionCount || 0) ? current : prev,
        categoryData[0]
      ).name
    : 'N/A';

  const budgetStatus = goalsData.length > 0
    ? goalsData.reduce((sum, goal) => sum + (goal.currentSpent / goal.monthlyBudget) * 100, 0) / goalsData.length
    : 0;

  return (
    <PageLayout
      // title="Spending Overview"
      subtitle={`View your financial summary for the past ${PERIODS.find(p => p.key === activePeriod)?.label.toLowerCase()}`}
      actions={<PeriodSelector activePeriod={activePeriod} onPeriodChange={setActivePeriod} />}
    >
      {/* If some data loaded but at least one resource failed, surface an inline alert with a retry */}
      {isError && hasPartialData && (
        <Card padding={4}>
          <Stack spacing={3} align="center">
            <Text variant="bodySm" color="muted">Some data failed to load. Showing partial results.</Text>
            <Button onClick={retry} variant="secondary" size="small">Retry</Button>
          </Stack>
        </Card>
      )}
      {/* 8 Comprehensive Summary Cards */}
      <Grid 
        columns={{ mobile: 1, tablet: 2, desktop: 4 }} 
        gap={{ mobile: 4, tablet: 5, desktop: 6 }}
      >
        {/* Card 1: Total Spent */}
        <MetricCard
          label="Total Spent"
          value={formatCurrency(totalSpent)}
          icon={<DollarSign size={24} />}
          trend={spentChange === 0 ? undefined : {
            value: spentChange,
            direction: spentChange > 0 ? 'up' : 'down'
          }}
          variant="primary"
          data-testid="summary-total"
        />

        {/* Card 2: Transaction Count */}
        <MetricCard
          label="Transactions"
          value={transactionCount}
          icon={<CreditCard size={24} />}
          variant="default"
        />

        {/* Card 3: Average Transaction */}
        <MetricCard
          label="Average Transaction"
          value={formatCurrency(averageTransaction)}
          icon={<Activity size={24} />}
          variant="default"
        />

        {/* Card 4: Top Spending Category */}
        <Card padding={{ mobile: 4, desktop: 6 }}>
          <Stack spacing={3}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8B5CF6'
            }}>
              <ShoppingBag size={24} />
            </div>
            <Text variant="bodySm" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>
              Top Category
            </Text>
            <Heading level={3}>{topCategory}</Heading>
            <Text variant="body" color="muted">{formatCurrency(topCategoryAmount)}</Text>
          </Stack>
        </Card>

        {/* Card 5: Largest Transaction */}
        <MetricCard
          label="Largest Transaction"
          value={formatCurrency(largestTransaction)}
          icon={<TrendingUp size={24} />}
          variant="warning"
        />

        {/* Card 6: Most Frequent Category */}
        <Card padding={{ mobile: 4, desktop: 6 }}>
          <Stack spacing={3}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(6, 182, 212, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#06B6D4'
            }}>
              <PieChart size={24} />
            </div>
            <Text variant="bodySm" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>
              Most Frequent
            </Text>
            <Heading level={3}>{mostFrequentCategory}</Heading>
            <Text variant="bodySm" color="muted">
              {categoryData.find(c => c.name === mostFrequentCategory)?.transactionCount || 0} transactions
            </Text>
          </Stack>
        </Card>

        {/* Card 7: Budget Status */}
        <MetricCard
          label="Budget Status"
          value={`${budgetStatus.toFixed(0)}%`}
          icon={<Target size={24} />}
          variant={(() => {
            if (budgetStatus > 100) return 'error';
            if (budgetStatus > 80) return 'warning';
            return 'success';
          })()}
        />

        {/* Card 8: Period */}
        <Card padding={{ mobile: 4, desktop: 6 }}>
          <Stack spacing={3}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(47, 112, 239, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2F70EF'
            }}>
              <Calendar size={24} />
            </div>
            <Text variant="bodySm" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>
              Time Period
            </Text>
            <Heading level={3}>{PERIODS.find(p => p.key === activePeriod)?.label}</Heading>
            <Text variant="bodySm" color="muted">Selected range</Text>
          </Stack>
        </Card>
      </Grid>

      <Divider spacing={8} />

      {/* Charts Section */}
      <Stack spacing={6}>
        <Heading level={2}>Spending Analysis</Heading>
        
        <Grid columns={{ mobile: 1, desktop: 2 }} gap={6}>
          {/* Category Breakdown Chart */}
          <Card padding={6}>
            <Stack spacing={4}>
              <Heading level={3}>Category Breakdown</Heading>
              {categoryData && categoryData.length > 0 ? (
                <DonutChart
                  data={categoryData}
                  total={totalSpent}
                  onSegmentClick={(name: string) => navigate(`/transactions?category=${encodeURIComponent(name)}`)}
                />
              ) : (
                <Text variant="body" color="muted">No category data available</Text>
              )}
            </Stack>
          </Card>

          {/* Spending Goals */}
          <Card padding={6}>
            <Stack spacing={4}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Heading level={3}>Spending Goals</Heading>
                <Button variant="ghost" size="small">Manage</Button>
              </div>
              
              {goalsData && goalsData.length > 0 ? (
                <Stack spacing={4}>
                  {goalsData.map((goal) => {
                    const progress = (goal.currentSpent / goal.monthlyBudget) * 100;
                    const isOverBudget = progress > 100;
                    
                    let progressVariant: 'error' | 'warning' | 'success';
                    let progressColor: string;
                    
                    if (isOverBudget) {
                      progressVariant = 'error';
                      progressColor = '#EF4444';
                    } else if (progress > 80) {
                      progressVariant = 'warning';
                      progressColor = '#F59E0B';
                    } else {
                      progressVariant = 'success';
                      progressColor = '#10B981';
                    }
                    
                    return (
                      <Stack key={goal.id} spacing={2}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text variant="body" weight="medium">{goal.category}</Text>
                          <Badge variant={progressVariant}>
                            {progress.toFixed(0)}%
                          </Badge>
                        </div>
                        
                        <div style={{ 
                          width: '100%', 
                          height: '8px', 
                          backgroundColor: '#E5E7EB', 
                          borderRadius: radius.md,
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${Math.min(progress, 100)}%`,
                            height: '100%',
                            backgroundColor: progressColor,
                            borderRadius: radius.md,
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        
                        <Text variant="bodySm" color="muted">
                          {formatCurrency(goal.currentSpent)} of {formatCurrency(goal.monthlyBudget)}
                        </Text>
                      </Stack>
                    );
                  })}
                </Stack>
              ) : (
                <Stack spacing={3} align="center">
                  <Text variant="body" color="muted">No spending goals set</Text>
                  <Button variant="secondary" size="small">Set Goals</Button>
                </Stack>
              )}
            </Stack>
          </Card>
        </Grid>
      </Stack>

      <Divider spacing={8} />

      {/* Recent Transactions */}
      <Stack spacing={4}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Heading level={2}>Recent Transactions</Heading>
          <Button 
            variant="ghost" 
            size="small"
            onClick={() => navigate('/transactions')}
          >
            View All →
          </Button>
        </div>

        {transactionData && transactionData.length > 0 ? (
          <Stack spacing={3}>
            {transactionData.slice(0, 5).map((txn) => (
              <Card key={txn.id} padding={4} hover>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <Stack spacing={1} style={{ flex: 1 }}>
                    <Text variant="body" weight="medium">{txn.merchant}</Text>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Badge>{txn.category}</Badge>
                      <Text variant="bodySm" color="muted">{txn.date}</Text>
                    </div>
                  </Stack>
                  <Text 
                    variant="bodyLg" 
                    weight="semibold" 
                    color={txn.amount < 0 ? 'strong' : 'muted'}
                  >
                    {formatCurrency(Math.abs(txn.amount))}
                  </Text>
                </div>
              </Card>
            ))}
          </Stack>
        ) : (
          <Card padding={8}>
            <Stack spacing={2} align="center">
              <Clock size={48} style={{ color: 'var(--neutral-400)', strokeWidth: 1.5 }} />
              <Text variant="body" color="muted">No recent transactions</Text>
            </Stack>
          </Card>
        )}
      </Stack>
    </PageLayout>
  );
}

function OverviewSkeleton() {
  return (
    <PageLayout>
      <Grid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap={6}>
        {Array.from({ length: 8 }, (_, i) => `skeleton-${i}`).map((key) => (
          <Card key={key} padding={6}>
            <Stack spacing={3}>
              <Skeleton width="40px" height="40px" variant="circular" />
              <Skeleton width="60%" height="16px" />
              <Skeleton width="100%" height="32px" />
              <Skeleton width="80%" height="14px" />
            </Stack>
          </Card>
        ))}
      </Grid>
    </PageLayout>
  );
}
