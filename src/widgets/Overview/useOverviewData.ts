import { useQuery } from '@tanstack/react-query';
import { spendingSummary, goals as fetchGoals } from '../../data/client';
import type { SpendingSummary, GoalsResponse } from '../../data/models';

export interface OverviewDataState {
  summary?: SpendingSummary;
  goals?: GoalsResponse;
  /** TRUE only during the very first concurrent load of both resources */
  isInitialLoading: boolean;
  /** TRUE when any resource failed and that resource has no data yet (surface partial failure) */
  isError: boolean;
  /** At least one resource is still fetching */
  isFetching: boolean;
  /** TRUE when we have at least one piece of data (partial success) */
  hasPartialData: boolean;
  retry(): void;
}

export function useOverviewData(customerId: string, period: '30d' = '30d'): OverviewDataState {
  const summaryQuery = useQuery({
    queryKey: ['spendingSummary', period, customerId],
    queryFn: () => spendingSummary(customerId, period),
    staleTime: 60_000,
    retry: false,
  });
  const goalsQuery = useQuery({
    queryKey: ['goals', customerId],
    queryFn: () => fetchGoals(customerId),
    staleTime: 60_000,
    retry: false,
  });

  // Initial loading only when BOTH are still loading (prevents skeleton overriding error state)
  const isInitialLoading = summaryQuery.isLoading && goalsQuery.isLoading;
  // Error banner if any query failed (and that query has no data yet)
  const isError = ((summaryQuery.isError && !summaryQuery.data) || (goalsQuery.isError && !goalsQuery.data));
  const isFetching = summaryQuery.isFetching || goalsQuery.isFetching;
  const hasPartialData = !!(summaryQuery.data || goalsQuery.data);
  const retry = () => { summaryQuery.refetch(); goalsQuery.refetch(); };
  return {
    summary: summaryQuery.data,
    goals: goalsQuery.data,
    isInitialLoading,
    isError,
    isFetching,
    hasPartialData,
    retry,
  };
}
