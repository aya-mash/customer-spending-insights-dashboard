import { useQuery } from '@tanstack/react-query';
import { categories, trends, transactions } from '../../data/client';
import type { CategoryBreakdown, SpendingTrends, TransactionsPage } from '../../data/models';

export interface InsightsDataState {
  catData?: CategoryBreakdown;
  trendData?: SpendingTrends;
  txnData?: TransactionsPage;
  catLoading: boolean;
  catError: boolean;
  trendLoading: boolean;
  trendError: boolean;
  txnLoading: boolean;
  txnError: boolean;
  isInitialLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  hasPartialData: boolean;
  loadData(): void;
}

export function useInsightsData(customerId: string): InsightsDataState {
  const categoriesQuery = useQuery({
    queryKey: ['categories', '30d', customerId],
    queryFn: () => categories(customerId, { period: '30d' }),
    staleTime: 60_000,
    retry: false,
  });

  const trendsQuery = useQuery({
    queryKey: ['trends', customerId, 12],
    queryFn: () => trends(customerId, { months: 12 }),
    staleTime: 60_000,
    retry: false,
  });

  const transactionsQuery = useQuery({
    queryKey: ['allTransactions', customerId],
    queryFn: () => transactions(customerId, { limit: 500 }),
    staleTime: 60_000,
    retry: false,
  });

  const isInitialLoading = categoriesQuery.isLoading && trendsQuery.isLoading && transactionsQuery.isLoading;
  const isError = (
    (categoriesQuery.isError && !categoriesQuery.data) || 
    (trendsQuery.isError && !trendsQuery.data) ||
    (transactionsQuery.isError && !transactionsQuery.data)
  );
  const isFetching = categoriesQuery.isFetching || trendsQuery.isFetching || transactionsQuery.isFetching;
  const hasPartialData = !!(categoriesQuery.data || trendsQuery.data || transactionsQuery.data);

  const loadData = () => {
    categoriesQuery.refetch();
    trendsQuery.refetch();
    transactionsQuery.refetch();
  };

  return {
    catData: categoriesQuery.data,
    trendData: trendsQuery.data,
    txnData: transactionsQuery.data,
    catLoading: categoriesQuery.isLoading,
    catError: categoriesQuery.isError && !categoriesQuery.data,
    trendLoading: trendsQuery.isLoading,
    trendError: trendsQuery.isError && !trendsQuery.data,
    txnLoading: transactionsQuery.isLoading,
    txnError: transactionsQuery.isError && !transactionsQuery.data,
    isInitialLoading,
    isError,
    isFetching,
    hasPartialData,
    loadData,
  };
}