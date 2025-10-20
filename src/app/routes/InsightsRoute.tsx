import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { categories, trends } from '../../data/client';
import type { CategoryBreakdown, SpendingTrends } from '../../data/models';

// Accessible tab ids
const TAB_KEYS = ['category', 'trends'] as const;
type TabKey = typeof TAB_KEYS[number];

function useReducedMotion() {
  const [pref, setPref] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setPref(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return pref;
}

export function InsightsRoute() {
  const [activeTab, setActiveTab] = useState<TabKey>('category');
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = 'user123'; // TODO: replace with real user context when available

  // Data states
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState<string | null>(null);
  const [catData, setCatData] = useState<CategoryBreakdown | null>(null);

  const [trendLoading, setTrendLoading] = useState(true);
  const [trendError, setTrendError] = useState<string | null>(null);
  const [trendData, setTrendData] = useState<SpendingTrends | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const loadData = useCallback(async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    // Reset
    setCatLoading(true); setCatError(null);
    setTrendLoading(true); setTrendError(null);
    try {
      const [cats, tr] = await Promise.all([
        categories(customerId, { period: '30d' }, ac.signal),
        trends(customerId, { months: 12 }, ac.signal),
      ]);
      setCatData(cats); setCatLoading(false);
      setTrendData(tr); setTrendLoading(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed loading insights';
      // If both failed? try individually to know which
      if (!catData) { setCatError(msg); setCatLoading(false); }
      if (!trendData) { setTrendError(msg); setTrendLoading(false); }
    }
  }, [customerId, catData, trendData]);

  useEffect(() => { loadData(); return () => abortRef.current?.abort(); }, [loadData]);
  // Optionally sync with query param later
  useEffect(() => {
    const qp = new URLSearchParams(location.search).get('tab');
    if (qp && TAB_KEYS.includes(qp as TabKey)) setActiveTab(qp as TabKey);
  }, [location.search]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
      e.preventDefault();
      setActiveTab(t => TAB_KEYS[(TAB_KEYS.indexOf(t) + 1) % TAB_KEYS.length]);
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
      e.preventDefault();
      setActiveTab(t => TAB_KEYS[(TAB_KEYS.indexOf(t) - 1 + TAB_KEYS.length) % TAB_KEYS.length]);
    }
  };

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    sp.set('tab', activeTab);
    navigate({ pathname: location.pathname, search: sp.toString() }, { replace: true });
  }, [activeTab, location.pathname, location.search, navigate]);

  return (
    <div className="insights-route" aria-labelledby="insights-heading">
      <h2 id="insights-heading" className="visually-hidden">Insights</h2>
      <div role="tablist" aria-label="Insights panels" className="insights-tabs" onKeyDown={onKeyDown}>
        <button
          role="tab"
          id="tab-category"
          aria-controls="panel-category"
          aria-selected={activeTab === 'category'}
          tabIndex={activeTab === 'category' ? 0 : -1}
          onClick={() => setActiveTab('category')}
          className={activeTab === 'category' ? 'active' : ''}
        >By Category</button>
        <button
          role="tab"
          id="tab-trends"
          aria-controls="panel-trends"
          aria-selected={activeTab === 'trends'}
          tabIndex={activeTab === 'trends' ? 0 : -1}
          onClick={() => setActiveTab('trends')}
          className={activeTab === 'trends' ? 'active' : ''}
        >Trends</button>
      </div>
      <div
        id="panel-category"
        role="tabpanel"
        aria-labelledby="tab-category"
        hidden={activeTab !== 'category'}
        className="insights-panel"
      >
        {catLoading && <CategorySkeleton reducedMotion={reducedMotion} />}
        {!catLoading && catError && (
          <div role="alert" className="insights-error">
            <p>{catError}</p>
            <button onClick={loadData}>Retry</button>
          </div>
        )}
        {!catLoading && !catError && catData && (
          <div className="category-placeholder" aria-label="Categories data ready">
            <p>Loaded {catData.categories.length} categories (UI coming next).</p>
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
        {trendLoading && <TrendsSkeleton reducedMotion={reducedMotion} />}
        {!trendLoading && trendError && (
          <div role="alert" className="insights-error">
            <p>{trendError}</p>
            <button onClick={loadData}>Retry</button>
          </div>
        )}
        {!trendLoading && !trendError && trendData && (
          <div className="trends-placeholder" aria-label="Trends data ready">
            <p>Loaded {trendData.trends.length} monthly points (UI coming next).</p>
          </div>
        )}
      </div>
    </div>
  );
}

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

export default InsightsRoute;