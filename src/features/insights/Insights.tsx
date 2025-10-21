import { useState, useEffect, Suspense, lazy, type CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReducedMotion } from '../../utils/accessibility';
import { useInsightsData } from './useInsightsData';
import { 
  PageLayout, 
  Card, 
  Stack, 
  Heading, 
  Text, 
  Button 
} from '../../design-system/components/index';
import { brand, text as textColors, surface, radius, spacing } from '../../design-system/tokens';
import { DonutChart } from '../../design-system/components/DonutChart';

// Lazy load trends chart
const TrendsChart = lazy(() => import('../../components/charts/TrendsChart'));

// Tab configuration
const TAB_KEYS = ['category', 'trends'] as const;
type TabKey = typeof TAB_KEYS[number];

const TAB_LABELS: Record<TabKey, string> = {
  category: 'By Category',
  trends: 'Trends'
};

export function Insights() {
  const [activeTab, setActiveTab] = useState<TabKey>('category');
  const reducedMotion = useReducedMotion();
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
      setActiveTab(qp as TabKey);
    }
  }, [location.search, activeTab]);

  // Keyboard navigation for tabs
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
      e.preventDefault();
      const currentIdx = TAB_KEYS.indexOf(activeTab);
      setActiveTab(TAB_KEYS[(currentIdx + 1) % TAB_KEYS.length]);
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
      e.preventDefault();
      const currentIdx = TAB_KEYS.indexOf(activeTab);
      setActiveTab(TAB_KEYS[(currentIdx - 1 + TAB_KEYS.length) % TAB_KEYS.length]);
    }
  };

  // Combined error at top if both fail
  const showCombinedError = catError && trendError;

  // Pill tab styles
  const pillContainerStyle: CSSProperties = {
    display: 'inline-flex',
    gap: spacing[1],
    backgroundColor: surface.surfaceAlt,
    padding: spacing[1],
    borderRadius: radius.full,
    marginBottom: spacing[6]
  };

  const getPillTabStyle = (isActive: boolean): CSSProperties => ({
    backgroundColor: isActive ? brand.primary : 'transparent',
    color: isActive ? textColors.inverse : textColors.primary,
    border: '1px solid transparent',
    borderRadius: radius.full,
    padding: `${spacing[2]} ${spacing[6]}`,
    fontSize: '14px',
    fontWeight: isActive ? 600 : 500,
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 200ms ease',
    fontFamily: 'inherit'
  });

  return (
    <PageLayout 
      title="Insights"
      
      
    >
      <Stack direction="vertical" spacing={6}>
        {/* Combined error banner */}
        {showCombinedError && (
          <Card padding={4} style={{ 
            backgroundColor: '#FEE2E2', 
            border: `1px solid #EF4444`,
            borderRadius: radius.md 
          }}>
            <Stack direction="vertical" spacing={3}>
              <Text variant="bodySm" style={{ color: '#991B1B', fontWeight: 600 }}>
                Failed to load insights data. Please retry.
              </Text>
              <div>
                <Button 
                  variant="secondary" 
                  size="small" 
                  onClick={loadData}
                  style={{
                    backgroundColor: '#FFF',
                    color: '#EF4444',
                    border: '1px solid #EF4444'
                  }}
                >
                  Retry All
                </Button>
              </div>
            </Stack>
          </Card>
        )}

        {/* Pill-style tabs */}
        <div 
          role="tablist" 
          aria-label="Insights panels" 
          style={pillContainerStyle}
          onKeyDown={onKeyDown}
        >
          {TAB_KEYS.map(tabKey => (
            <button
              key={tabKey}
              role="tab"
              id={`tab-${tabKey}`}
              aria-controls={`panel-${tabKey}`}
              aria-selected={activeTab === tabKey}
              tabIndex={activeTab === tabKey ? 0 : -1}
              onClick={() => setActiveTab(tabKey)}
              style={getPillTabStyle(activeTab === tabKey)}
              onMouseEnter={(e) => {
                if (activeTab !== tabKey) {
                  e.currentTarget.style.backgroundColor = surface.card;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tabKey) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {TAB_LABELS[tabKey]}
            </button>
          ))}
        </div>

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

              {catLoading && <CategorySkeleton reducedMotion={reducedMotion} />}

              {!catLoading && catError && !trendError && (
                <div role="alert" style={{
                  backgroundColor: '#FEE2E2',
                  padding: spacing[4],
                  borderRadius: radius.md,
                  border: '1px solid #EF4444'
                }}>
                  <Stack direction="vertical" spacing={3}>
                    <Text variant="bodySm" style={{ color: '#991B1B' }}>{catError}</Text>
                    <Button 
                      variant="secondary" 
                      size="small" 
                      onClick={loadData}
                      style={{
                        backgroundColor: '#FFF',
                        color: '#EF4444',
                        border: '1px solid #EF4444',
                        alignSelf: 'flex-start'
                      }}
                    >
                      Retry
                    </Button>
                  </Stack>
                </div>
              )}

              {!catLoading && !catError && catData && catData.categories.length > 0 && (
                <Suspense fallback={<CategorySkeleton reducedMotion={reducedMotion} />}>
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
                <div 
                  role="status" 
                  style={{ 
                    textAlign: 'center', 
                    padding: spacing[8],
                    color: textColors.secondary 
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: spacing[4] }}>🍃</div>
                  <Text variant="bodySm">No data for this period.</Text>
                </div>
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

              {trendLoading && <TrendsSkeleton reducedMotion={reducedMotion} />}

              {!trendLoading && trendError && !catError && (
                <div role="alert" style={{
                  backgroundColor: '#FEE2E2',
                  padding: spacing[4],
                  borderRadius: radius.md,
                  border: '1px solid #EF4444'
                }}>
                  <Stack direction="vertical" spacing={3}>
                    <Text variant="bodySm" style={{ color: '#991B1B' }}>{trendError}</Text>
                    <Button 
                      variant="secondary" 
                      size="small" 
                      onClick={loadData}
                      style={{
                        backgroundColor: '#FFF',
                        color: '#EF4444',
                        border: '1px solid #EF4444',
                        alignSelf: 'flex-start'
                      }}
                    >
                      Retry
                    </Button>
                  </Stack>
                </div>
              )}

              {!trendLoading && !trendError && trendData && trendData.trends.length > 0 && (
                <Suspense fallback={<TrendsSkeleton reducedMotion={reducedMotion} />}>
                  <TrendsChart data={trendData.trends} />
                </Suspense>
              )}

              {!trendLoading && !trendError && trendData && trendData.trends.length === 0 && (
                <div 
                  role="status" 
                  style={{ 
                    textAlign: 'center', 
                    padding: spacing[8],
                    color: textColors.secondary 
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: spacing[4] }}>📉</div>
                  <Text variant="bodySm">No data for this period.</Text>
                </div>
              )}
            </Stack>
          </Card>
        </div>
      </Stack>
    </PageLayout>
  );
}

// Loading skeletons
function CategorySkeleton({ reducedMotion }: { reducedMotion: boolean }) {
  const shimmerStyle: CSSProperties = reducedMotion 
    ? { animation: 'none' } 
    : { 
        animation: 'shimmer 1.5s infinite linear',
        backgroundImage: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%'
      };

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
      <div style={{
        width: '200px',
        height: '200px',
        borderRadius: radius.full,
        backgroundColor: '#f0f0f0',
        margin: '0 auto',
        ...shimmerStyle
      }} />
      
      {/* Legend skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={i}
            style={{
              height: '32px',
              backgroundColor: '#f0f0f0',
              borderRadius: radius.sm,
              ...shimmerStyle
            }}
          />
        ))}
      </div>
    </div>
  );
}

function TrendsSkeleton({ reducedMotion }: { reducedMotion: boolean }) {
  const shimmerStyle: CSSProperties = reducedMotion 
    ? { animation: 'none' } 
    : { 
        animation: 'shimmer 1.5s infinite linear',
        backgroundImage: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%'
      };

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
      <div style={{
        height: '300px',
        backgroundColor: '#f0f0f0',
        borderRadius: radius.md,
        ...shimmerStyle
      }} />
      
      {/* X-axis labels skeleton */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        gap: spacing[2] 
      }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={i}
            style={{
              width: '60px',
              height: '20px',
              backgroundColor: '#f0f0f0',
              borderRadius: radius.sm,
              ...shimmerStyle
            }}
          />
        ))}
      </div>
    </div>
  );
}
