import { useQuery } from '@tanstack/react-query';
import { spendingSummary, goals as fetchGoals, categories as fetchCategories, trends as fetchTrends, transactions as fetchTransactions } from '../../data/client';
import type { SpendingSummary, GoalsResponse, CategoryBreakdown, SpendingTrends, TransactionsPage, PeriodPreset } from '../../data/models';

export interface OverviewDataState {
  summary?: SpendingSummary;
  goals?: GoalsResponse;
  categories?: CategoryBreakdown;
  trends?: SpendingTrends;
  transactions?: TransactionsPage;
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

export function useOverviewData(customerId: string, period: PeriodPreset = '30d'): OverviewDataState {
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
  const categoriesQuery = useQuery({
    queryKey: ['categories', period, customerId],
    queryFn: () => fetchCategories(customerId, { period }),
    staleTime: 60_000,
    retry: false,
  });
  const trendsQuery = useQuery({
    queryKey: ['trends', customerId],
    queryFn: () => fetchTrends(customerId, { months: 6 }),
    staleTime: 60_000,
    retry: false,
  });
  const transactionsQuery = useQuery({
    queryKey: ['recentTransactions', customerId],
    queryFn: () => fetchTransactions(customerId, { limit: 5, sortBy: 'date_desc' }),
    staleTime: 60_000,
    retry: false,
  });

  // Initial loading only when ALL are still loading
  const isInitialLoading = summaryQuery.isLoading && goalsQuery.isLoading && categoriesQuery.isLoading && trendsQuery.isLoading && transactionsQuery.isLoading;
  // Error banner if any query failed (and that query has no data yet)
  const isError = (
    (summaryQuery.isError && !summaryQuery.data) || 
    (goalsQuery.isError && !goalsQuery.data) ||
    (categoriesQuery.isError && !categoriesQuery.data) ||
    (trendsQuery.isError && !trendsQuery.data) ||
    (transactionsQuery.isError && !transactionsQuery.data)
  );
  const isFetching = summaryQuery.isFetching || goalsQuery.isFetching || categoriesQuery.isFetching || trendsQuery.isFetching || transactionsQuery.isFetching;
  const hasPartialData = !!(summaryQuery.data || goalsQuery.data || categoriesQuery.data || trendsQuery.data || transactionsQuery.data);
  const retry = () => { 
    summaryQuery.refetch(); 
    goalsQuery.refetch(); 
    categoriesQuery.refetch(); 
    trendsQuery.refetch(); 
    transactionsQuery.refetch();
  };
  return {
    summary: summaryQuery.data,
    goals: goalsQuery.data,
    categories: categoriesQuery.data,
    trends: trendsQuery.data,
    transactions: transactionsQuery.data,
    isInitialLoading,
    isError,
    isFetching,
    hasPartialData,
    retry,
  };
}