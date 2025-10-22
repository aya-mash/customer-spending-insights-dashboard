import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { transactions } from '../../data/client';
import type { Transaction, PeriodPreset } from '../../data/models';

interface TransactionFilters {
  category?: string;
  period?: PeriodPreset;
  startDate?: string;
  endDate?: string;
}

export function useTransactionsData(customerId: string) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);

  // Parse URL filters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters: TransactionFilters = {};
    
    if (params.get('category')) {
      newFilters.category = params.get('category')!;
    }
    if (params.get('period')) {
      newFilters.period = params.get('period') as PeriodPreset;
    }
    
    const pageParam = params.get('page');
    if (pageParam) {
      const pageNum = parseInt(pageParam, 10);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronizing with URL query params
      if (pageNum > 0) setPage(pageNum);
    }
     
    setFilters(newFilters);
  }, [location.search]);

  // Convert sortField and sortDirection to API format
  const sortBy = `${sortField}_${sortDirection}` as 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

  const transactionsQuery = useQuery({
    queryKey: ['transactions', customerId, filters, page, perPage, sortBy],
    queryFn: () => transactions(customerId, {
      ...filters,
      limit: perPage,
      offset: (page - 1) * perPage,
      sortBy,
    }),
    staleTime: 60_000,
    retry: false,
  });

  const updateFilters = useCallback((newFilters: Partial<TransactionFilters & { page?: number }>) => {
    const params = new URLSearchParams(location.search);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });
    
    // Reset to page 1 when changing filters (except when changing page itself)
    if (!('page' in newFilters)) {
      params.set('page', '1');
    }
    
    navigate(`?${params.toString()}`, { replace: true });
  }, [location.search, navigate]);

  const clearFilters = useCallback(() => {
    navigate(location.pathname, { replace: true });
  }, [location.pathname, navigate]);

  const sort = useCallback((field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    // Page will be reset via updateFilters
    const params = new URLSearchParams(location.search);
    params.set('page', '1');
    navigate(`?${params.toString()}`, { replace: true });
  }, [sortField, sortDirection, location.search, navigate]);

  const total = transactionsQuery.data?.pagination.total ?? 0;
  const totalPages = Math.ceil(total / perPage);

  return {
    loading: transactionsQuery.isLoading,
    error: transactionsQuery.isError ? 'Failed to load transactions' : null,
    data: transactionsQuery.data?.transactions ?? [],
    filters,
    sortField,
    sortDirection,
    page,
    perPage,
    total,
    totalPages,
    loadData: () => transactionsQuery.refetch(),
    updateFilters,
    clearFilters,
    sort,
    setPage
  };
}