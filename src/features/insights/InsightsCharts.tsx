import { useState, useEffect, Suspense, lazy } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReducedMotion } from '../../utils/accessibility';
import { useInsightsData } from './useInsightsData';

const DonutChart = lazy(() => import('../../design-system/components/DonutChart').then(m => ({ default: m.DonutChart })));
const TrendsChart = lazy(() => import('../../design-system/components/TrendsChart'));

// Accessible tab ids
const TAB_KEYS = ['category', 'trends'] as const;
type TabKey = typeof TAB_KEYS[number];

export function InsightsCharts() {
  const [activeTab, setActiveTab] = useState<TabKey>('category');
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = 'user123';

  const { catLoading, catError, catData, trendLoading, trendError, trendData, loadData } = useInsightsData(customerId);

  useEffect(() => {
    const qp = new URLSearchParams(location.search).get('tab');
    if (qp && TAB_KEYS.includes(qp as TabKey) && qp !== activeTab) setActiveTab(qp as TabKey);
  }, [location.search, activeTab]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
      e.preventDefault();
      setActiveTab(t => TAB_KEYS[(TAB_KEYS.indexOf(t) + 1) % TAB_KEYS.length]);
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
      e.preventDefault();
      setActiveTab(t => TAB_KEYS[(TAB_KEYS.indexOf(t) - 1 + TAB_KEYS.length) % TAB_KEYS.length]);
    }
  };

  return (
    <>
      {(catError && trendError) && (
        <div role="alert" className="insights-error combined-error" tabIndex={-1}>
          <p>Failed to load insights data. Please retry.</p>
          <button onClick={loadData} className="btn btn--secondary btn--small">Retry All</button>
        </div>
      )}
      <div role="tablist" aria-label="Insights panels" className="insights-tabs" onKeyDown={onKeyDown}>
        <button
          role="tab"
          id="tab-category"
          aria-controls="panel-category"
          aria-selected={activeTab === 'category'}
          tabIndex={activeTab === 'category' ? 0 : -1}
          onClick={() => setActiveTab('category')}
          className={`tab ${activeTab === 'category' ? 'tab--active' : ''}`}
        >By Category</button>
        <button
          role="tab"
          id="tab-trends"
          aria-controls="panel-trends"
          aria-selected={activeTab === 'trends'}
          tabIndex={activeTab === 'trends' ? 0 : -1}
          onClick={() => setActiveTab('trends')}
          className={`tab ${activeTab === 'trends' ? 'tab--active' : ''}`}
        >Trends</button>
      </div>
      <div className="insights-grid">
        <div
          id="panel-category"
          role="tabpanel"
          aria-labelledby="tab-category"
          hidden={activeTab !== 'category'}
          className="insights-panel"
        >
          <h3>By Category</h3>
          <p className="panel-muted">Spending distribution across categories</p>
          {catLoading && <CategorySkeleton reducedMotion={reducedMotion} />}
          {!catLoading && catError && !trendError && (
            <div role="alert" className="insights-error">
              <p>{catError}</p>
              <button onClick={loadData} className="btn btn--secondary">Retry</button>
            </div>
          )}
          {!catLoading && !catError && catData && catData.categories.length > 0 && (
            <Suspense fallback={<CategorySkeleton reducedMotion={reducedMotion} />}>
              <DonutChart
                data={catData.categories}
                total={catData.totalAmount}
                onSegmentClick={(name: string) => navigate(`/transactions?category=${encodeURIComponent(name)}`)}
              />
            </Suspense>
          )}
          {!catLoading && !catError && catData && catData.categories.length === 0 && (
            <div role="status" className="empty-state">
              <span className="empty-icon" aria-hidden="true">🍃</span>
              <p>No data for this period.</p>
            </div>
          )}
        </div>
        <div
          id="panel-trends"
          role="tabpanel"
          aria-labelledby="tab-trends"
          hidden={activeTab !== 'trends'}
          className="insights-panel"
        >
          <h3>Trends</h3>
          <p className="panel-muted">Monthly spending trend</p>
          {trendLoading && <TrendsSkeleton reducedMotion={reducedMotion} />}
          {!trendLoading && trendError && !catError && (
            <div role="alert" className="insights-error">
              <p>{trendError}</p>
              <button onClick={loadData} className="btn btn--secondary">Retry</button>
            </div>
          )}
          {!trendLoading && !trendError && trendData && trendData.trends.length > 0 && (
            <Suspense fallback={<TrendsSkeleton reducedMotion={reducedMotion} />}>
              <TrendsChart data={trendData.trends} />
            </Suspense>
          )}
          {!trendLoading && !trendError && trendData && trendData.trends.length === 0 && (
            <div role="status" className="empty-state">
              <span className="empty-icon" aria-hidden="true">📉</span>
              <p>No data for this period.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Component skeletons for loading states
function shimmerStyle(reduced: boolean) {
  return reduced ? { animation: 'none' } : {};
}

function CategorySkeleton({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="category-skeleton" aria-label="Loading category insights">
      <div className="sk-circle" style={shimmerStyle(reducedMotion)} />
      <ul className="sk-legend">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="sk-row" style={shimmerStyle(reducedMotion)} />
        ))}
      </ul>
    </div>
  );
}

function TrendsSkeleton({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="trends-skeleton" aria-label="Loading trends insights">
      <div className="sk-line" style={shimmerStyle(reducedMotion)} />
      <div className="sk-bars" style={shimmerStyle(reducedMotion)} />
    </div>
  );
}