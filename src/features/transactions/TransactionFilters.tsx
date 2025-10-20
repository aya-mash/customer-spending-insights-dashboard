import { useTransactionsData } from './useTransactionsData';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import type { PeriodPreset } from '../../data/models';

export function TransactionFilters() {
  const customerId = 'user123';
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
        <div className="form-group">
          <label htmlFor="category-filter" className="form-label">Category</label>
          <select
            id="category-filter"
            className="form-select"
            value={filters.category || ''}
            onChange={(e) => updateFilters({ category: e.target.value || undefined })}
          >
            <option value="">All categories</option>
            {categoryOptions.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="period-filter" className="form-label">Period</label>
          <select
            id="period-filter"
            className="form-select"
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
          <Button 
            type="button" 
            onClick={clearFilters}
            variant="secondary"
            size="small"
            aria-label="Clear all filters"
          >
            Clear filters
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="active-filters" aria-label="Active filters">
          {filters.category && (
            <Chip
              variant="filter"
              onRemove={() => updateFilters({ category: undefined })}
              aria-label={`Remove category filter: ${filters.category}`}
            >
              Category: {filters.category}
            </Chip>
          )}
          {filters.period && (
            <Chip
              variant="filter"
              onRemove={() => updateFilters({ period: undefined })}
              aria-label={`Remove period filter: ${filters.period}`}
            >
              Period: {periodOptions.find(p => p.value === filters.period)?.label}
            </Chip>
          )}
        </div>
      )}
    </div>
  );
}