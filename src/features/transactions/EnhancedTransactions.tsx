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
  Table,
  type SelectOption,
  type TableColumn
} from '../../design-system/components/index';
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

  // Define table columns
  const columns: TableColumn<Transaction>[] = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'merchant',
      label: 'Merchant',
      sortable: true,
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value: string) => <Badge variant="default">{value}</Badge>,
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      align: 'right',
      render: (value: number) => (
        <Text 
          variant="body" 
          style={{ 
            fontWeight: 600,
            color: value < 0 ? '#EF4444' : undefined 
          }}
        >
          {formatCurrency(Math.abs(value))}
        </Text>
      ),
    },
  ];

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
            
            <Table
              columns={columns}
              data={data}
              keyExtractor={(row) => row.id}
              onSort={(key) => sort(key as keyof Transaction)}
              sortKey={sortField}
              sortDirection={sortDirection}
              zebraStripe
              emptyMessage="No transactions found."
              stickyHeader={false}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Stack align="center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => updateFilters({ page: newPage })}
                  maxVisible={7}
                  showPrevNext
                />
              </Stack>
            )}
          </Stack>
        </Card>
      </Stack>
    </PageLayout>
  );
}
