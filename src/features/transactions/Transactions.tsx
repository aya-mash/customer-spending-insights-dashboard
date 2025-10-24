/**
 * TRANSACTIONS PAGE
 * Design system implementation with server-side pagination and sorting
 * Zero semantic HTML outside design system components
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTransactionsData } from './useTransactionsData';
import { formatCurrency, Skeleton, useTheme } from '../../design-system';
import { formatDate } from '../../utils/dates';
import { getCategoryColor } from '../../lib/categoryUtils';
import { 
  PageLayout, 
  Grid, 
  Card, 
  Stack, 
  Button,
  Text,
  Badge,
  Select,
  FilterChip,
  Pagination,
  Table,
  TextField,
  type SelectOption,
  type TableColumn
} from '../../design-system/components/index';
import { Search } from 'lucide-react';
import type { PeriodPreset, Transaction } from '../../data/models';

const periodOptions: SelectOption[] = [
  { label: 'transactions.allTime', value: '' },
  { label: 'transactions.7days', value: '7d' },
  { label: 'transactions.30days', value: '30d' },
  { label: 'transactions.90days', value: '90d' },
  { label: 'transactions.1year', value: '1y' },
];

const categoryOptions: SelectOption[] = [
  { label: 'transactions.allCategories', value: '' },
  { label: 'transactions.categoryFood', value: 'Food & Dining' },
  { label: 'transactions.categoryTransportation', value: 'Transportation' },
  { label: 'transactions.categoryShopping', value: 'Shopping' },
  { label: 'transactions.categoryEntertainment', value: 'Entertainment' },
  { label: 'transactions.categoryBills', value: 'Bills & Utilities' },
  { label: 'transactions.categoryHealthcare', value: 'Healthcare' },
  { label: 'transactions.categoryTravel', value: 'Travel' },
  { label: 'transactions.categoryEducation', value: 'Education' },
  { label: 'transactions.categoryPersonalCare', value: 'Personal Care' },
  { label: 'transactions.categoryOther', value: 'Other' },
];

export function Transactions() {
  const { t } = useTranslation();
  const customerId = 'user123';
  const { isMobile } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
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
    perPage,
    total,
    totalPages,
    loadData 
  } = useTransactionsData(customerId);

  const hasActiveFilters = !!(filters.category || filters.period);

  // Translate options
  const translatedPeriodOptions = periodOptions.map(opt => ({
    ...opt,
    label: t(opt.label)
  }));

  const translatedCategoryOptions = categoryOptions.map(opt => ({
    ...opt,
    label: t(opt.label)
  }));

  // Filter data by search query (client-side search across all columns)
  const filteredData = searchQuery
    ? data.filter(txn =>
        txn.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        new Date(txn.date).toLocaleDateString().includes(searchQuery) ||
        formatCurrency(Math.abs(txn.amount)).includes(searchQuery)
      )
    : data;

  // Define table columns
  const columns: TableColumn<Transaction>[] = [
    {
      key: 'date',
      label: t('transactions.date'),
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      key: 'merchant',
      label: t('transactions.merchant'),
      sortable: true,
    },
    {
      key: 'category',
      label: t('transactions.category'),
      sortable: true,
      render: (value: string, row: Transaction) => (
        <Badge 
          variant="default" 
          style={{ 
            backgroundColor: `${getCategoryColor(value, row.categoryColor)}20`, 
            color: getCategoryColor(value, row.categoryColor), 
            borderColor: getCategoryColor(value, row.categoryColor) 
          }}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'amount',
      label: t('transactions.amount'),
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
      <PageLayout>
        <Card padding={8}>
          <Stack spacing={4}>
            {/* Skeleton for filters */}
            <Skeleton height="56px" borderRadius="md" />
            {/* Skeleton for table */}
            <Skeleton height="400px" borderRadius="md" />
          </Stack>
        </Card>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <Card padding={8}>
          <Stack spacing={4} align="center">
            <Text variant="body" color="muted">{error}</Text>
            <Button variant="secondary" size="medium" onClick={loadData}>{t('common.retry')}</Button>
          </Stack>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Stack spacing={4}>
        {/* Filter Controls */}
        <div style={{ position: 'sticky', top: '64px', zIndex: 10 }}>
          <Card padding={4}>
            <Stack spacing={4}>
            <Grid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap={3}>
              <Select
                id="category-filter"
                label={t('transactions.category')}
                options={translatedCategoryOptions}
                value={filters.category || ''}
                onChange={(e) => updateFilters({ category: e.target.value || undefined })}
                fullWidth
              />

              <Select
                id="period-filter"
                label={t('transactions.period')}
                options={translatedPeriodOptions}
                value={filters.period || ''}
                onChange={(e) => updateFilters({ period: (e.target.value as PeriodPreset) || undefined })}
                fullWidth
              />

              {!isMobile && (
                <div style={{ gridColumn: 'span 2' }}>
                  <TextField
                    id="search-filter"
                    label={t('transactions.search')}
                    placeholder={t('transactions.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startIcon={<Search size={18} />}
                    fullWidth
                  />
                </div>
              )}
            </Grid>

            {/* Active Filters - Desktop Only */}
            {!isMobile && hasActiveFilters && (
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#6B7280',
                    marginBottom: '8px',
                  }}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {t('transactions.filtersActive')}: {[filters.category, filters.period].filter(Boolean).length}
                </div>
                <Stack direction="horizontal" spacing={3} wrap>
                  {filters.category && (
                    <FilterChip
                      label={`${t('transactions.category')}: ${filters.category}`}
                      onRemove={() => updateFilters({ category: undefined })}
                    />
                  )}
                  {filters.period && (
                    <FilterChip
                      label={`${t('transactions.period')}: ${translatedPeriodOptions.find(o => o.value === filters.period)?.label}`}
                      onRemove={() => updateFilters({ period: undefined })}
                    />
                  )}
                  <Button 
                    variant="ghost" 
                    size="small" 
                    onClick={clearFilters}
                  >
                    {t('transactions.clearAll')}
                  </Button>
                </Stack>
              </div>
            )}
          </Stack>
        </Card>
        </div>

        {/* Mobile: Transaction Cards, Desktop: Table */}
        {isMobile ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            height: 'calc(100vh - 370px)',
            minHeight: '400px',
            overflow: 'hidden'
          }}>
            {/* Transaction Cards - Scrollable */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              paddingBottom: '80px'
            }}>
              {filteredData.length === 0 ? (
                <Card padding={8}>
                  <Text variant="body" color="muted" style={{ textAlign: 'center' }}>
                    {t('transactions.noTransactions')}
                  </Text>
                </Card>
              ) : (
                filteredData.map((txn) => (
                  <Card key={txn.id} padding={4}>
                    <Stack spacing={3}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <Text variant="body" style={{ fontWeight: 600, marginBottom: '4px' }}>
                            {txn.merchant}
                          </Text>
                          <Text variant="bodySm" color="muted">
                            {formatDate(txn.date)}
                          </Text>
                        </div>
                        <Text 
                          variant="body" 
                          style={{ 
                            fontWeight: 600,
                            color: txn.amount < 0 ? '#EF4444' : undefined,
                            fontSize: '18px'
                          }}
                        >
                          {formatCurrency(Math.abs(txn.amount))}
                        </Text>
                      </div>
                      <Badge 
                        variant="default" 
                        style={{ 
                          backgroundColor: `${getCategoryColor(txn.category, txn.categoryColor)}20`, 
                          color: getCategoryColor(txn.category, txn.categoryColor), 
                          borderColor: getCategoryColor(txn.category, txn.categoryColor),
                          alignSelf: 'flex-start'
                        }}
                      >
                        {txn.category}
                      </Badge>
                    </Stack>
                  </Card>
                ))
              )}
            </div>
            
            {/* Pagination - Fixed at bottom */}
            {totalPages > 1 && (
              <div style={{
                position: 'sticky',
                bottom: 0,
                backgroundColor: 'var(--color-surface)',
                padding: '12px 0',
                borderTop: '1px solid var(--color-border)',
                zIndex: 10
              }}>
                <Stack align="center">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => updateFilters({ page: newPage })}
                    maxVisible={5}
                    showPrevNext
                    itemsPerPage={perPage}
                    totalItems={total}
                    showRange
                  />
                </Stack>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            height: 'calc(100vh - 280px)',
            minHeight: '400px'
          }}>
            <Card padding={1} style={{ flex: 1, overflow: 'hidden' }}>
              <Table
                columns={columns}
                data={filteredData}
                keyExtractor={(row) => row.id}
                onSort={(key) => sort(key as keyof Transaction)}
                sortKey={sortField}
                sortDirection={sortDirection}
                zebraStripe
                emptyMessage={t('transactions.noTransactions')}
                stickyHeader
                maxHeight="100%"
                aria-label="Transactions table"
              />
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <Stack align="center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => updateFilters({ page: newPage })}
                  maxVisible={7}
                  showPrevNext
                  itemsPerPage={perPage}
                  totalItems={total}
                  showRange
                />
              </Stack>
            )}
          </div>
        )}
      </Stack>
    </PageLayout>
  );
}
