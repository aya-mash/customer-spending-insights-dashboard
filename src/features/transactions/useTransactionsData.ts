import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);

  const abortRef = useRef<AbortController | null>(null);

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

  const loadData = useCallback(async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    
    setLoading(true);
    setError(null);
    
    // Convert sortField and sortDirection to API format
    const sortBy = `${sortField}_${sortDirection}` as 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
    
    try {
      const result = await transactions(customerId, {
        ...filters,
        limit: perPage,
        offset: (page - 1) * perPage,
        sortBy,
      }, ac.signal);
      
      if (!ac.signal.aborted) {
        setData(result.transactions);
        setTotal(result.pagination.total);
        setLoading(false);
      }
    } catch (err) {
      if (!ac.signal.aborted) {
        setError(err instanceof Error ? err.message : 'Failed to load transactions');
        setLoading(false);
      }
    }
  }, [customerId, filters, page, perPage, sortField, sortDirection]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Loading data on mount and when loadData changes
    loadData();
    return () => abortRef.current?.abort();
  }, [loadData]);

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

  const totalPages = Math.ceil(total / perPage);

  return {
    loading,
    error,
    data,
    filters,
    sortField,
    sortDirection,
    page,
    perPage,
    total,
    totalPages,
    loadData,
    updateFilters,
    clearFilters,
    sort,
    setPage
  };
}