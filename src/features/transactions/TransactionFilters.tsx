import { useTransactionsData } from './useTransactionsData';
import type { PeriodPreset } from '../../data/models';

export function TransactionFilters() {
  const customerId = 'user123'; // TODO: replace with real user context when available
  const { filters, updateFilters, clearFilters } = useTransactionsData(customerId);

  const periodOptions: Array<{ label: string; value: PeriodPreset }> = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'Last year', value: '1y' },
  ];

  const categoryOptions = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Education',
    'Personal Care',
    'Other'
  ];

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="transaction-filters" role="search" aria-label="Filter transactions">
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={filters.category || ''}
            onChange={(e) => updateFilters({ category: e.target.value || undefined })}
          >
            <option value="">All categories</option>
            {categoryOptions.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="period-filter">Period</label>
          <select
            id="period-filter"
            value={filters.period || ''}
            onChange={(e) => updateFilters({ period: (e.target.value as PeriodPreset) || undefined })}
          >
            <option value="">All time</option>
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button 
            type="button" 
            onClick={clearFilters}
            className="clear-filters-btn"
            aria-label="Clear all filters"
          >
            Clear filters
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="active-filters" aria-label="Active filters">
          {filters.category && (
            <span className="filter-pill">
              Category: {filters.category}
              <button
                type="button"
                onClick={() => updateFilters({ category: undefined })}
                aria-label={`Remove category filter: ${filters.category}`}
                className="filter-pill-remove"
              >
                ×
              </button>
            </span>
          )}
          {filters.period && (
            <span className="filter-pill">
              Period: {periodOptions.find(p => p.value === filters.period)?.label}
              <button
                type="button"
                onClick={() => updateFilters({ period: undefined })}
                aria-label={`Remove period filter: ${filters.period}`}
                className="filter-pill-remove"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}