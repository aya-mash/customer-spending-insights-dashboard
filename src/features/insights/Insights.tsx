import { useState, useEffect, Suspense, lazy, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useInsightsData } from './useInsightsData';
import { 
  PageLayout, 
  Card, 
  Stack, 
  Heading, 
  Text, 
  Button,
  Tabs,
  Badge
} from '../../design-system/components/index';
import { radius, spacing } from '../../design-system/tokens';
import { useTheme, Skeleton } from '../../design-system';
import { DonutChart } from '../../design-system/components/DonutChart';
import { formatRand } from '../../utils/currency';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Lazy load trends chart
const TrendsChart = lazy(() => import('../../design-system/components/TrendsChart'));

// Tab configuration
const TAB_KEYS = ['compare', 'category', 'trends', 'monthly', 'merchants'] as const;
type TabKey = typeof TAB_KEYS[number];

export function Insights() {
  const { t } = useTranslation();
  const { text: textColors, surface, isMobile } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>('compare');
  
  const TAB_LABELS: Record<TabKey, string> = {
    compare: t('insights.compare'),
    category: t('insights.category'),
    trends: t('insights.trends'),
    monthly: t('insights.monthly'),
    merchants: t('insights.merchants')
  };
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = 'user123';

  const { 
    catLoading, catError, catData, 
    trendLoading, trendError, trendData,
    txnLoading, txnError, txnData,
    loadData 
  } = useInsightsData(customerId);

  // Process merchant data
  const merchantData = useMemo(() => {
    if (!txnData?.transactions) return [];
    const merchantMap = new Map<string, { merchant: string; total: number; count: number }>();
    
    txnData.transactions.forEach(txn => {
      const existing = merchantMap.get(txn.merchant);
      if (existing) {
        existing.total += txn.amount;
        existing.count += 1;
      } else {
        merchantMap.set(txn.merchant, { merchant: txn.merchant, total: txn.amount, count: 1 });
      }
    });
    
    return Array.from(merchantMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [txnData]);

  // Process monthly comparison data
  const comparisonData = useMemo(() => {
    if (!trendData?.trends || trendData.trends.length < 2) return null;
    
    const sorted = [...trendData.trends].sort((a, b) => b.month.localeCompare(a.month));
    const current = sorted[0];
    const previous = sorted[1];
    
    if (!current || !previous) return null;
    
    const diff = current.totalSpent - previous.totalSpent;
    const percentChange = previous.totalSpent > 0 
      ? ((diff / previous.totalSpent) * 100)
      : 0;
    
    return {
      current,
      previous,
      diff,
      percentChange,
      isIncrease: diff > 0
    };
  }, [trendData]);

  // Sync with URL query param
  useEffect(() => {
    const qp = new URLSearchParams(location.search).get('tab');
    if (qp && TAB_KEYS.includes(qp as TabKey) && qp !== activeTab) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronizing with URL query params
      setActiveTab(qp as TabKey);
    }
  }, [location.search, activeTab]);

  // Combined error at top if both fail
  const showCombinedError = catError && trendError;

  return (
    <PageLayout 
      subtitle="Explore your spending patterns across categories and time periods"
    >
      <Stack direction="vertical" spacing={6}>
        {/* Combined error banner */}
        {showCombinedError && (
          <Card padding={4} style={{ 
            backgroundColor: 'var(--color-error-light)', 
            border: `1px solid var(--color-error)`,
            borderRadius: radius.md 
          }}>
            <Stack direction="vertical" spacing={3}>
              <Text variant="bodySm" style={{ color: 'var(--color-error-dark)', fontWeight: 600 }}>
                {t('insights.error')}
              </Text>
              <div>
                <Button 
                  variant="secondary" 
                  size="small" 
                  onClick={loadData}
                  style={{
                    backgroundColor: surface.surface,
                    color: 'var(--color-error)',
                    border: '1px solid var(--color-error)'
                  }}
                >
                  {t('common.retry')}
                </Button>
              </div>
            </Stack>
          </Card>
        )}

        {/* Tabs Navigation */}
        <Tabs
          items={TAB_KEYS.map(key => ({ key, label: TAB_LABELS[key] }))}
          activeTab={activeTab}
          onChange={(key) => setActiveTab(key as TabKey)}
          aria-label="Insights panels"
        />

        {/* Category Panel */}
        <div
          id="panel-category"
          role="tabpanel"
          aria-labelledby="tab-category"
          hidden={activeTab !== 'category'}
          style={{ display: activeTab === 'category' ? 'block' : 'none' }}
        >
          <Card >
            <Stack direction="vertical" spacing={4}>
              <div>
                <Heading level={3} style={{ marginBottom: spacing[2] }}>
                  By Category
                </Heading>
                <Text variant="bodySm" style={{ color: textColors.secondary }}>
                  Spending distribution across categories
                </Text>
              </div>

              {catLoading && <CategorySkeleton />}

              {!catLoading && catError && !trendError && (
                <div role="alert" style={{
                  backgroundColor: 'var(--color-error-light)',
                  padding: spacing[4],
                  borderRadius: radius.md,
                  border: '1px solid var(--color-error)'
                }}>
                  <Stack direction="vertical" spacing={3}>
                    <Text variant="bodySm" style={{ color: 'var(--color-error-dark)' }}>{catError}</Text>
                    <Button 
                      variant="secondary" 
                      size="small" 
                      onClick={loadData}
                      style={{
                        backgroundColor: surface.surface,
                        color: 'var(--color-error)',
                        border: '1px solid var(--color-error)',
                        alignSelf: 'flex-start'
                      }}
                    >
                      {t('common.retry')}
                    </Button>
                  </Stack>
                </div>
              )}

              {!catLoading && !catError && catData && catData.categories.length > 0 && (
                <Suspense fallback={<CategorySkeleton />}>
                  <DonutChart 
                    data={catData.categories}
                    total={catData.totalAmount}
                    onSegmentClick={(name: string) => 
                      navigate(`/transactions?category=${encodeURIComponent(name)}`)
                    }
                  />
                </Suspense>
              )}

              {!catLoading && !catError && catData && catData.categories.length === 0 && (
                <output
                  style={{ 
                    textAlign: 'center', 
                    padding: spacing[8],
                    color: textColors.secondary,
                    display: 'block'
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: spacing[4] }}>🍃</div>
                  <Text variant="bodySm">{t('insights.noData')}</Text>
                </output>
              )}
            </Stack>
          </Card>
        </div>

        {/* Trends Panel */}
        <div
          id="panel-trends"
          role="tabpanel"
          aria-labelledby="tab-trends"
          hidden={activeTab !== 'trends'}
          style={{ display: activeTab === 'trends' ? 'block' : 'none' }}
        >
          <Card >
            <Stack direction="vertical" spacing={4}>
              <div>
                <Heading level={3} style={{ marginBottom: spacing[2] }}>
                  Trends
                </Heading>
                <Text variant="bodySm" style={{ color: textColors.secondary }}>
                  Monthly spending trend
                </Text>
              </div>

              {trendLoading && <TrendsSkeleton />}

              {!trendLoading && trendError && !catError && (
                <div role="alert" style={{
                  backgroundColor: 'var(--color-error-light)',
                  padding: spacing[4],
                  borderRadius: radius.md,
                  border: '1px solid var(--color-error)'
                }}>
                  <Stack direction="vertical" spacing={3}>
                    <Text variant="bodySm" style={{ color: 'var(--color-error-dark)' }}>{trendError}</Text>
                    <Button 
                      variant="secondary" 
                      size="small" 
                      onClick={loadData}
                      style={{
                        backgroundColor: surface.surface,
                        color: 'var(--color-error)',
                        border: '1px solid var(--color-error)',
                        alignSelf: 'flex-start'
                      }}
                    >
                      {t('common.retry')}
                    </Button>
                  </Stack>
                </div>
              )}

              {!trendLoading && !trendError && trendData && trendData.trends.length > 0 && (
                <Suspense fallback={<TrendsSkeleton />}>
                  <TrendsChart data={trendData.trends} />
                </Suspense>
              )}

              {!trendLoading && !trendError && trendData && trendData.trends.length === 0 && (
                <output
                  style={{ 
                    textAlign: 'center', 
                    padding: spacing[8],
                    color: textColors.secondary,
                    display: 'block'
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: spacing[4] }}>📉</div>
                  <Text variant="bodySm">{t('insights.noData')}</Text>
                </output>
              )}
            </Stack>
          </Card>
        </div>

        {/* Monthly Panel */}
        <div
          id="panel-monthly"
          role="tabpanel"
          aria-labelledby="tab-monthly"
          hidden={activeTab !== 'monthly'}
          style={{ display: activeTab === 'monthly' ? 'block' : 'none' }}
        >
          <Card>
            <Stack direction="vertical" spacing={4}>
              <div>
                <Heading level={3} style={{ marginBottom: spacing[2] }}>
                  Monthly Breakdown
                </Heading>
                <Text variant="bodySm" style={{ color: textColors.secondary }}>
                  Spending analysis by month
                </Text>
              </div>

              {trendLoading && <TrendsSkeleton />}

              {!trendLoading && !trendError && trendData && trendData.trends.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: spacing[3],
                  maxHeight: '500px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  paddingRight: spacing[2]
                }}>
                  {[...trendData.trends]
                    .sort((a, b) => b.month.localeCompare(a.month))
                    .slice(0, 12)
                    .map(trend => {
                      const date = new Date(trend.month + '-01');
                      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                      
                      return (
                        <div
                          key={trend.month}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: spacing[4],
                            backgroundColor: surface.surfaceAlt,
                            borderRadius: radius.md,
                            border: `1px solid ${surface.border}`
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <Text variant="body" style={{ fontWeight: 600, marginBottom: spacing[1] }}>
                              {monthName}
                            </Text>
                            <Text variant="bodySm" style={{ color: textColors.secondary }}>
                              {trend.transactionCount} transactions • {formatRand(trend.averageTransaction)} avg
                            </Text>
                          </div>
                          <Text variant="bodyLg" style={{ fontWeight: 700, color: textColors.primary }}>
                            {formatRand(trend.totalSpent)}
                          </Text>
                        </div>
                      );
                    })}
                </div>
              )}

              {!trendLoading && !trendError && trendData && trendData.trends.length === 0 && (
                <output
                  style={{ 
                    textAlign: 'center', 
                    padding: spacing[8],
                    color: textColors.secondary,
                    display: 'block'
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: spacing[4] }}>📅</div>
                  <Text variant="bodySm">{t('insights.noData')}</Text>
                </output>
              )}
            </Stack>
          </Card>
        </div>

        {/* Merchants Panel */}
        <div
          id="panel-merchants"
          role="tabpanel"
          aria-labelledby="tab-merchants"
          hidden={activeTab !== 'merchants'}
          style={{ display: activeTab === 'merchants' ? 'block' : 'none' }}
        >
          <Card>
            <Stack direction="vertical" spacing={4}>
              <div>
                <Heading level={3} style={{ marginBottom: spacing[2] }}>
                  Top Merchants
                </Heading>
                <Text variant="bodySm" style={{ color: textColors.secondary }}>
                  Your most frequent spending locations
                </Text>
              </div>

              {txnLoading && <CategorySkeleton />}

              {!txnLoading && !txnError && merchantData.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: spacing[3],
                  maxHeight: '500px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  paddingRight: spacing[2]
                }}>
                  {merchantData.map((merchant, index) => {
                    const barWidth = (merchant.total / merchantData[0].total) * 100;
                    
                    return (
                      <div
                        key={merchant.merchant}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: spacing[2],
                          padding: spacing[4],
                          backgroundColor: surface.surfaceAlt,
                          borderRadius: radius.md,
                          border: `1px solid ${surface.border}`
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                            <Badge variant="default" style={{ minWidth: '28px', textAlign: 'center' }}>
                              {index + 1}
                            </Badge>
                            <div>
                              <Text variant="body" style={{ fontWeight: 600 }}>
                                {merchant.merchant}
                              </Text>
                              <Text variant="bodySm" style={{ color: textColors.secondary }}>
                                {merchant.count} {merchant.count === 1 ? 'transaction' : 'transactions'}
                              </Text>
                            </div>
                          </div>
                          <Text variant="bodyLg" style={{ fontWeight: 700 }}>
                            {formatRand(merchant.total)}
                          </Text>
                        </div>
                        <div
                          style={{
                            width: '100%',
                            height: '8px',
                            backgroundColor: surface.border,
                            borderRadius: radius.sm,
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              width: `${barWidth}%`,
                              height: '100%',
                              backgroundColor: 'var(--color-primary)',
                              borderRadius: radius.sm,
                              transition: 'width 0.3s ease'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!txnLoading && !txnError && merchantData.length === 0 && (
                <output
                  style={{ 
                    textAlign: 'center', 
                    padding: spacing[8],
                    color: textColors.secondary,
                    display: 'block'
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: spacing[4] }}>🏪</div>
                  <Text variant="bodySm">{t('insights.noData')}</Text>
                </output>
              )}
            </Stack>
          </Card>
        </div>

        {/* Compare Panel */}
        <div
          id="panel-compare"
          role="tabpanel"
          aria-labelledby="tab-compare"
          hidden={activeTab !== 'compare'}
          style={{ display: activeTab === 'compare' ? 'block' : 'none' }}
        >
          <Card>
            <Stack direction="vertical" spacing={4}>
              <div>
                <Heading level={3} style={{ marginBottom: spacing[2] }}>
                  Compare Periods
                </Heading>
                <Text variant="bodySm" style={{ color: textColors.secondary }}>
                  Month-over-month spending comparison
                </Text>
              </div>

              {trendLoading && <TrendsSkeleton />}

              {!trendLoading && !trendError && comparisonData && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
                  {/* Current vs Previous */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                      gap: spacing[4]
                    }}
                  >
                    {/* Current Month */}
                    <div
                      style={{
                        padding: spacing[6],
                        backgroundColor: surface.surfaceAlt,
                        borderRadius: radius.lg,
                        border: `2px solid ${surface.border}`
                      }}
                    >
                      <Text variant="bodySm" style={{ color: textColors.secondary, marginBottom: spacing[2] }}>
                        {t('insights.currentMonth')}
                      </Text>
                      <Text variant="bodyLg" style={{ fontWeight: 700, fontSize: isMobile ? '24px' : '32px', marginBottom: spacing[3] }}>
                        {formatRand(comparisonData.current.totalSpent)}
                      </Text>
                      <Text variant="bodySm" style={{ color: textColors.secondary }}>
                        {comparisonData.current.transactionCount} {t('overview.transactions').toLowerCase()}
                      </Text>
                    </div>

                    {/* Previous Month */}
                    <div
                      style={{
                        padding: spacing[6],
                        backgroundColor: surface.surfaceAlt,
                        borderRadius: radius.lg,
                        border: `1px solid ${surface.border}`
                      }}
                    >
                      <Text variant="bodySm" style={{ color: textColors.secondary, marginBottom: spacing[2] }}>
                        {t('insights.previousMonth')}
                      </Text>
                      <Text variant="bodyLg" style={{ fontWeight: 700, fontSize: isMobile ? '24px' : '32px', marginBottom: spacing[3] }}>
                        {formatRand(comparisonData.previous.totalSpent)}
                      </Text>
                      <Text variant="bodySm" style={{ color: textColors.secondary }}>
                        {comparisonData.previous.transactionCount} {t('overview.transactions').toLowerCase()}
                      </Text>
                    </div>
                  </div>

                  {/* Difference Card */}
                  <div
                    style={{
                      padding: spacing[6],
                      backgroundColor: comparisonData.isIncrease 
                        ? 'rgba(239, 68, 68, 0.1)' 
                        : 'rgba(34, 197, 94, 0.1)',
                      borderRadius: radius.lg,
                      border: `1px solid ${comparisonData.isIncrease ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: spacing[3]
                    }}
                  >
                    {comparisonData.isIncrease ? (
                      <TrendingUp size={32} color="rgb(239, 68, 68)" />
                    ) : comparisonData.diff < 0 ? (
                      <TrendingDown size={32} color="rgb(34, 197, 94)" />
                    ) : (
                      <Minus size={32} color={textColors.secondary} />
                    )}
                    <div style={{ textAlign: 'center' }}>
                      <Text variant="bodyLg" style={{ 
                        fontWeight: 700, 
                        fontSize: '28px',
                        color: comparisonData.isIncrease ? 'rgb(239, 68, 68)' : comparisonData.diff < 0 ? 'rgb(34, 197, 94)' : textColors.primary
                      }}>
                        {comparisonData.diff > 0 ? '+' : ''}{formatRand(Math.abs(comparisonData.diff))}
                      </Text>
                      <Text variant="bodySm" style={{ color: textColors.secondary, marginTop: spacing[1] }}>
                        {Math.abs(comparisonData.percentChange).toFixed(1)}% {comparisonData.isIncrease ? t('insights.increase') : comparisonData.diff < 0 ? t('insights.decrease') : t('insights.noChange')}
                      </Text>
                    </div>
                  </div>

                  {/* Insight Text */}
                  <div
                    style={{
                      padding: spacing[4],
                      backgroundColor: surface.surface,
                      borderRadius: radius.md,
                      border: `1px solid ${surface.border}`
                    }}
                  >
                    <Text variant="bodySm" style={{ color: textColors.secondary, lineHeight: 1.6 }}>
                      {comparisonData.isIncrease 
                        ? `Your spending increased by ${formatRand(comparisonData.diff)} this month. Consider reviewing your budget and identifying areas where you can reduce expenses.`
                        : comparisonData.diff < 0
                        ? `Great job! You spent ${formatRand(Math.abs(comparisonData.diff))} less this month. Keep up the good spending habits.`
                        : 'Your spending remained consistent with last month.'}
                    </Text>
                  </div>
                </div>
              )}

              {!trendLoading && !trendError && !comparisonData && (
                <output
                  style={{ 
                    textAlign: 'center', 
                    padding: spacing[8],
                    color: textColors.secondary,
                    display: 'block'
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: spacing[4] }}>📊</div>
                  <Text variant="bodySm">Not enough data to compare periods.</Text>
                </output>
              )}
            </Stack>
          </Card>
        </div>
      </Stack>
    </PageLayout>
  );
}

// Loading skeletons
function CategorySkeleton() {
  return (
    <div 
      aria-label="Loading category insights"
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[6],
        padding: spacing[4]
      }}
    >
      {/* Donut skeleton */}
      <Skeleton 
        width="200px" 
        height="200px" 
        variant="circular" 
        style={{ margin: '0 auto' }} 
      />
      
      {/* Legend skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton 
            key={`category-skeleton-${i}`}
            height="32px"
            borderRadius="sm"
          />
        ))}
      </div>
    </div>
  );
}

function TrendsSkeleton() {
  return (
    <div 
      aria-label="Loading trends insights"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[4],
        padding: spacing[4]
      }}
    >
      {/* Chart line skeleton */}
      <Skeleton height="300px" borderRadius="md" />
      
      {/* X-axis labels skeleton */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        gap: spacing[2] 
      }}>
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton 
            key={`trends-skeleton-${i}`}
            width="60px"
            height="20px"
            borderRadius="sm"
          />
        ))}
      </div>
    </div>
  );
}
