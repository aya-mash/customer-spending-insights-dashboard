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
    
    setFilters(newFilters);
  }, [location.search]);

  const loadData = useCallback(async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await transactions(customerId, {
        ...filters,
        limit: perPage,
        offset: (page - 1) * perPage,
      }, ac.signal);
      
      if (!ac.signal.aborted) {
        setData(result.transactions);
        setLoading(false);
      }
    } catch (err) {
      if (!ac.signal.aborted) {
        setError(err instanceof Error ? err.message : 'Failed to load transactions');
        setLoading(false);
      }
    }
  }, [customerId, filters, page, perPage]);

  useEffect(() => {
    loadData();
    return () => abortRef.current?.abort();
  }, [loadData]);

  const updateFilters = useCallback((newFilters: Partial<TransactionFilters>) => {
    const params = new URLSearchParams(location.search);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });
    
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
    setPage(1); // Reset to first page when sorting
  }, [sortField, sortDirection]);

  return {
    loading,
    error,
    data,
    filters,
    sortField,
    sortDirection,
    page,
    perPage,
    loadData,
    updateFilters,
    clearFilters,
    sort,
    setPage
  };
}