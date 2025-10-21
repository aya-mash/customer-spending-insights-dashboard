/**
 * ENHANCED TRANSACTIONS PAGE
 * Design system implementation with server-side pagination and sorting
 * Zero semantic HTML outside design system components
 */

import { useTransactionsData } from './useTransactionsData';
import { formatCurrency } from '../../design-system';
import { 
  PageLayout, 
  Grid, 
  Card, 
  Stack, 
  Button,
  Heading,
  Text,
  Badge,
  Select,
  FilterChip,
  Pagination,
  type SelectOption
} from '../../design-system/components/index';
import { surface, text as textColors } from '../../design-system/tokens';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { PeriodPreset, Transaction } from '../../data/models';

const periodOptions: SelectOption[] = [
  { label: 'All time', value: '' },
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
  { label: 'Year', value: '1y' },
];

const categoryOptions: SelectOption[] = [
  { label: 'All categories', value: '' },
  { label: 'Food & Dining', value: 'Food & Dining' },
  { label: 'Transportation', value: 'Transportation' },
  { label: 'Shopping', value: 'Shopping' },
  { label: 'Entertainment', value: 'Entertainment' },
  { label: 'Bills & Utilities', value: 'Bills & Utilities' },
  { label: 'Healthcare', value: 'Healthcare' },
  { label: 'Travel', value: 'Travel' },
  { label: 'Education', value: 'Education' },
  { label: 'Personal Care', value: 'Personal Care' },
  { label: 'Other', value: 'Other' },
];

export function EnhancedTransactions() {
  const customerId = 'user123';
  const { 
    loading, 
    error, 
    data, 
    filters, 
    updateFilters, 
    clearFilters, 
    sort, 
    sortField, 
    sortDirection, 
    page, 
    totalPages 
  } = useTransactionsData(customerId);

  const hasActiveFilters = !!(filters.category || filters.period);

  const handleSort = (field: keyof Transaction) => {
    sort(field);
  };

  const getSortIcon = (field: keyof Transaction) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  if (loading) {
    return (
      <PageLayout title="Transactions">
        <Card padding={8}>
          <Stack spacing={4} align="center">
            <Text variant="body" color="muted">Loading transactions...</Text>
          </Stack>
        </Card>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Transactions">
        <Card padding={8}>
          <Stack spacing={4} align="center">
            <Text variant="body" color="muted">{error}</Text>
            <Button variant="secondary" size="medium">Retry</Button>
          </Stack>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Transactions">
      <Stack spacing={6}>
        {/* Filter Controls */}
        <Card padding={6}>
          <Stack spacing={4}>
            <Heading level={3}>Filters</Heading>
            
            <Grid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap={4}>
              <Select
                id="category-filter"
                label="Category"
                options={categoryOptions}
                value={filters.category || ''}
                onChange={(e) => updateFilters({ category: e.target.value || undefined })}
                fullWidth
              />

              <Select
                id="period-filter"
                label="Period"
                options={periodOptions}
                value={filters.period || ''}
                onChange={(e) => updateFilters({ period: (e.target.value as PeriodPreset) || undefined })}
                fullWidth
              />
            </Grid>

            {/* Active Filters */}
            {hasActiveFilters && (
              <Stack direction="horizontal" spacing={3} wrap>
                {filters.category && (
                  <FilterChip
                    label={`Category: ${filters.category}`}
                    onRemove={() => updateFilters({ category: undefined })}
                  />
                )}
                {filters.period && (
                  <FilterChip
                    label={`Period: ${periodOptions.find(o => o.value === filters.period)?.label}`}
                    onRemove={() => updateFilters({ period: undefined })}
                  />
                )}
                <Button 
                  variant="ghost" 
                  size="small" 
                  onClick={clearFilters}
                >
                  Clear all
                </Button>
              </Stack>
            )}
          </Stack>
        </Card>

        {/* Transactions Table */}
        <Card padding={6}>
          <Stack spacing={4}>
            <Heading level={3}>All Transactions</Heading>
            
            {data.length === 0 ? (
              <Stack spacing={4} align="center" style={{ padding: '48px 0' }}>
                <Text variant="body" color="muted">No transactions found.</Text>
              </Stack>
            ) : (
              <>
                {/* Desktop Table */}
                <Card padding={1} variant="default" style={{ 
                  overflow: 'hidden',
                  border: `1px solid ${surface.border}` 
                }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                    }}>
                      <thead style={{
                        backgroundColor: surface.surfaceAlt,
                        borderBottom: `2px solid ${surface.border}`,
                      }}>
                        <tr>
                          <th style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontWeight: 600,
                            fontSize: '14px',
                            color: textColors.secondary,
                            cursor: 'pointer',
                            userSelect: 'none',
                          }} onClick={() => handleSort('date')}>
                            <Stack direction="horizontal" spacing={2} align="center">
                              <span>Date</span>
                              {getSortIcon('date')}
                            </Stack>
                          </th>
                          <th style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontWeight: 600,
                            fontSize: '14px',
                            color: textColors.secondary,
                            cursor: 'pointer',
                            userSelect: 'none',
                          }} onClick={() => handleSort('merchant')}>
                            <Stack direction="horizontal" spacing={2} align="center">
                              <span>Merchant</span>
                              {getSortIcon('merchant')}
                            </Stack>
                          </th>
                          <th style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontWeight: 600,
                            fontSize: '14px',
                            color: textColors.secondary,
                            cursor: 'pointer',
                            userSelect: 'none',
                          }} onClick={() => handleSort('category')}>
                            <Stack direction="horizontal" spacing={2} align="center">
                              <span>Category</span>
                              {getSortIcon('category')}
                            </Stack>
                          </th>
                          <th style={{
                            padding: '12px 16px',
                            textAlign: 'right',
                            fontWeight: 600,
                            fontSize: '14px',
                            color: textColors.secondary,
                            cursor: 'pointer',
                            userSelect: 'none',
                          }} onClick={() => handleSort('amount')}>
                            <Stack direction="horizontal" spacing={2} align="center" justify="end">
                              <span>Amount</span>
                              {getSortIcon('amount')}
                            </Stack>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((txn, idx) => (
                          <tr 
                            key={txn.id}
                            style={{
                              backgroundColor: idx % 2 === 0 ? 'transparent' : surface.surfaceAlt,
                              borderBottom: `1px solid ${surface.border}`,
                            }}
                          >
                            <td style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              color: textColors.primary,
                            }}>
                              {new Date(txn.date).toLocaleDateString()}
                            </td>
                            <td style={{
                              padding: '12px 16px',
                              fontSize: '14px',
                              color: textColors.primary,
                              fontWeight: 500,
                            }}>
                              {txn.merchant}
                            </td>
                            <td style={{
                              padding: '12px 16px',
                            }}>
                              <Badge>{txn.category}</Badge>
                            </td>
                            <td style={{
                              padding: '12px 16px',
                              textAlign: 'right',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: txn.amount < 0 ? '#EF4444' : textColors.primary,
                            }}>
                              {formatCurrency(Math.abs(txn.amount))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Pagination */}
                <Stack align="center">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => updateFilters({ page: newPage })}
                    maxVisible={7}
                    showPrevNext
                  />
                </Stack>
              </>
            )}
          </Stack>
        </Card>
      </Stack>
    </PageLayout>
  );
}
