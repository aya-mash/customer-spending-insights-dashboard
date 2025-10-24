/**
 * TRANSACTIONS PAGE
 * Design system implementation with server-side pagination and sorting
 * Zero semantic HTML outside design system components
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTransactionsData } from './useTransactionsData';
import { FilterDialog } from './FilterDialog';
import { TransactionDetailsDialog } from './TransactionDetailsDialog';
import { formatCurrency, Skeleton, useTheme } from '../../design-system';
import { formatDate } from '../../utils/dates';
import { getCategoryColor } from '../../lib/categoryUtils';
import { 
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
import { Search, Filter as FilterIcon, X } from 'lucide-react';
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
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
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

  const activeFilterCount = [filters.category, filters.period].filter(Boolean).length;

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
      <div style={{ padding: isMobile ? '16px' : '24px' }}>
        <Card padding={8}>
          <Stack spacing={4}>
            {/* Skeleton for filters */}
            <Skeleton height="56px" borderRadius="md" />
            {/* Skeleton for table */}
            <Skeleton height="400px" borderRadius="md" />
          </Stack>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: isMobile ? '16px' : '24px' }}>
        <Card padding={8}>
          <Stack spacing={4} align="center">
            <Text variant="body" color="muted">{error}</Text>
            <Button variant="secondary" size="medium" onClick={loadData}>{t('common.retry')}</Button>
          </Stack>
        </Card>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
      padding: isMobile ? '16px' : '24px'
    }}>
        {/* Fixed Filter Controls at Top */}
        <div style={{ 
          flexShrink: 0,
          backgroundColor: 'var(--color-surface)',
          paddingBottom: '16px'
        }}>
          <Card padding={4}>
            <Stack spacing={4}>
            {/* Mobile: Search + Filter Icon Button */}
            {isMobile ? (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <TextField
                    id="search-filter-mobile"
                    placeholder={t('transactions.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startIcon={<Search size={18} />}
                    fullWidth
                  />
                </div>
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={() => setFilterDrawerOpen(true)}
                  aria-label={t('transactions.filters')}
                  style={{ 
                    minWidth: '56px',
                    height: '56px',
                    padding: '0',
                    position: 'relative'
                  }}
                >
                  <FilterIcon size={20} />
                  {activeFilterCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      borderRadius: '10px',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}>
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </div>
            ) : (
                <>
                  <Grid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap={3}>
                    {/* Category Filter with inline chip */}
                    <div style={{ position: 'relative' }}>
                      <Select
                        id="category-filter"
                        label={t('transactions.category')}
                        options={translatedCategoryOptions}
                        value={filters.category || ''}
                        onChange={(e) => updateFilters({ category: e.target.value || undefined })}
                        fullWidth
                      />
                      {filters.category && (
                        <button
                          onClick={() => updateFilters({ category: undefined })}
                          style={{
                            position: 'absolute',
                            right: '32px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            marginTop: '12px', // Account for label height
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#6B7280',
                            borderRadius: '4px',
                            transition: 'background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          aria-label="Clear category filter"
                          type="button"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    <Select
                      id="period-filter"
                      label={t('transactions.period')}
                      options={translatedPeriodOptions}
                      value={filters.period || ''}
                      onChange={(e) => updateFilters({ period: (e.target.value as PeriodPreset) || undefined })}
                      fullWidth
                    />

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
                  </Grid>

                  {/* Active Filters - Desktop Only (Period only now, Category has inline clear) */}
                  {filters.period && (
                    <div>
                      <Stack direction="horizontal" spacing={3} wrap align="center">
                        <FilterChip
                          label={`${t('transactions.period')}: ${translatedPeriodOptions.find(o => o.value === filters.period)?.label}`}
                          onRemove={() => updateFilters({ period: undefined })}
                        />
                        {filters.category && (
                          <Button 
                            variant="ghost" 
                            size="small" 
                            onClick={clearFilters}
                          >
                            {t('transactions.clearAll')}
                          </Button>
                        )}
                      </Stack>
                    </div>
                )}
              </>
            )}
          </Stack>
        </Card>
      </div>

      {/* Scrollable Content Area (Mobile: Cards, Desktop: Table) */}
      {isMobile ? (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          paddingTop: '16px',
          gap: '16px'
        }}>
          {/* Scrollable Transaction Cards */}
          <div style={{ 
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            paddingRight: '4px'
          }}>
            {filteredData.length === 0 ? (
              <Card padding={8}>
                <Text variant="body" color="muted" style={{ textAlign: 'center' }}>
                  {t('transactions.noTransactions')}
                </Text>
              </Card>
            ) : (
              filteredData.map((txn) => (
                <Card 
                  key={txn.id} 
                  padding={4}
                  onClick={() => setSelectedTransaction(txn)}
                  style={{ cursor: 'pointer' }}
                >
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

          {/* Fixed Mobile Pagination at Bottom */}
          {totalPages > 1 && (
            <div style={{ flexShrink: 0, paddingTop: '8px' }}>
              <Card padding={3}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => updateFilters({ page: 1 })}
                  disabled={page === 1}
                  style={{ minWidth: '36px', fontSize: '16px', fontWeight: 'bold', padding: '8px' }}
                  aria-label="First page"
                >
                  ‹‹
                </Button>
                
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => updateFilters({ page: page - 1 })}
                  disabled={page === 1}
                  style={{ minWidth: '36px', fontSize: '20px', fontWeight: 'bold', padding: '8px' }}
                  aria-label="Previous page"
                >
                  ‹
                </Button>
                
                <Text variant="bodySm" color="muted" style={{ whiteSpace: 'nowrap', fontSize: '13px' }}>
                  {(page - 1) * perPage + 1}-{Math.min(page * perPage, total)} / {total}
                </Text>
                
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => updateFilters({ page: page + 1 })}
                  disabled={page === totalPages}
                  style={{ minWidth: '36px', fontSize: '20px', fontWeight: 'bold', padding: '8px' }}
                  aria-label="Next page"
                >
                  ›
                </Button>
                
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => updateFilters({ page: totalPages })}
                  disabled={page === totalPages}
                  style={{ minWidth: '36px', fontSize: '16px', fontWeight: 'bold', padding: '8px' }}
                  aria-label="Last page"
                >
                  ››
                </Button>
              </div>
            </Card>
            </div>
          )}
        </div>
      ) : (
          <div style={{ 
            flex: 1,
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            overflow: 'hidden',
            paddingTop: '16px'
          }}>
            {/* Scrollable Table */}
            <Card padding={1} style={{ flex: 1, overflow: 'auto' }}>
              <Table
                columns={columns}
                data={filteredData}
                keyExtractor={(row) => row.id}
                onSort={(key) => sort(key as keyof Transaction)}
                onRowClick={(row) => setSelectedTransaction(row)}
                sortKey={sortField}
                sortDirection={sortDirection}
                zebraStripe
                emptyMessage={t('transactions.noTransactions')}
                stickyHeader
                maxHeight="100%"
                aria-label="Transactions table"
              />
            </Card>

            {/* Fixed Desktop Pagination at Bottom */}
            {totalPages > 1 && (
              <div style={{ 
                flexShrink: 0,
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '12px',
                paddingTop: '8px'
              }}>
                {/* Range display */}
                <div style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  fontWeight: 500,
                }}>
                  {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
                </div>
                
                {/* Navigation controls with First/Last */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => updateFilters({ page: 1 })}
                    disabled={page === 1}
                    aria-label="First page"
                    style={{ minWidth: '44px', height: '44px' }}
                  >
                    ‹‹
                  </Button>
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => updateFilters({ page: newPage })}
                    maxVisible={7}
                    showPrevNext
                    itemsPerPage={perPage}
                    totalItems={total}
                    showRange={false}
                  />
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => updateFilters({ page: totalPages })}
                    disabled={page === totalPages}
                    aria-label="Last page"
                    style={{ minWidth: '44px', height: '44px' }}
                  >
                    ››
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

      {/* Mobile Filter Dialog */}
      <FilterDialog
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onApply={(newFilters) => {
          updateFilters(newFilters);
        }}
        onClear={clearFilters}
        initialCategory={filters.category}
        initialPeriod={filters.period}
        categoryOptions={translatedCategoryOptions}
        periodOptions={translatedPeriodOptions}
      />

      {/* Transaction Details Dialog */}
      <TransactionDetailsDialog
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
