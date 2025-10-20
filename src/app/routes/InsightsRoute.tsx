import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
        <CategorySkeleton reducedMotion={reducedMotion} />
      </div>
      <div
        id="panel-trends"
        role="tabpanel"
        aria-labelledby="tab-trends"
        hidden={activeTab !== 'trends'}
        className="insights-panel"
      >
        <TrendsSkeleton reducedMotion={reducedMotion} />
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