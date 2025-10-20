import { useState, useEffect, useCallback, useRef } from 'react';
import { categories, trends } from '../../data/client';
import type { CategoryBreakdown, SpendingTrends } from '../../data/models';

export function useInsightsData(customerId: string) {
  // Data states
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState<string | null>(null);
  const [catData, setCatData] = useState<CategoryBreakdown | null>(null);

  const [trendLoading, setTrendLoading] = useState(true);
  const [trendError, setTrendError] = useState<string | null>(null);
  const [trendData, setTrendData] = useState<SpendingTrends | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const loadData = useCallback(async () => {
    // Abort any in-flight request and create a fresh controller
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setCatLoading(true); setCatError(null);
    setTrendLoading(true); setTrendError(null);
    const catPromise = categories(customerId, { period: '30d' }, ac.signal);
    const trendPromise = trends(customerId, { months: 12 }, ac.signal);
    const [catResult, trendResult] = await Promise.allSettled([catPromise, trendPromise]);
    const aborted = ac.signal.aborted;
    // If aborted, do not update errors (silent cancellation)
    if (aborted) return;
    if (catResult.status === 'fulfilled') {
      setCatData(catResult.value); setCatLoading(false);
    } else {
      setCatError(catResult.reason instanceof Error ? catResult.reason.message : 'Failed loading categories'); setCatLoading(false);
    }
    if (trendResult.status === 'fulfilled') {
      setTrendData(trendResult.value); setTrendLoading(false);
    } else {
      setTrendError(trendResult.reason instanceof Error ? trendResult.reason.message : 'Failed loading trends'); setTrendLoading(false);
    }
  }, [customerId]);

  useEffect(() => { loadData(); return () => abortRef.current?.abort(); }, [loadData]);

  return {
    catLoading, catError, catData,
    trendLoading, trendError, trendData,
    loadData
  };
}