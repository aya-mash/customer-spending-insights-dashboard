import { useState, useEffect, Suspense, lazy } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useInsightsData } from './useInsightsData';
import { 
  PageLayout, 
  Card, 
  Stack, 
  Heading, 
  Text, 
  Button,
  Tabs
} from '../../design-system/components/index';
import { radius, spacing } from '../../design-system/tokens';
import { useTheme, Skeleton } from '../../design-system';
import { DonutChart } from '../../design-system/components/DonutChart';

// Lazy load trends chart
const TrendsChart = lazy(() => import('../../design-system/components/TrendsChart'));

// Tab configuration
const TAB_KEYS = ['category', 'trends'] as const;
type TabKey = typeof TAB_KEYS[number];

const TAB_LABELS: Record<TabKey, string> = {
  category: 'By Category',
  trends: 'Trends'
};

export function Insights() {
  const { text: textColors, surface } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>('category');
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = 'user123';

  const { 
    catLoading, catError, catData, 
    trendLoading, trendError, trendData, 
    loadData 
  } = useInsightsData(customerId);

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
      title="Insights"
      
      
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
                Failed to load insights data. Please retry.
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
                  Retry All
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
                      Retry
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
                  <Text variant="bodySm">No data for this period.</Text>
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
                      Retry
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
                  <Text variant="bodySm">No data for this period.</Text>
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
