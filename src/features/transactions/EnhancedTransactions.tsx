/**
 * ENHANCED TRANSACTIONS PAGE
 * Design system implementation with pill filters and responsive views
 */

import { useState } from 'react';
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
  Badge
} from '../../design-system/components/index';
import { brand, surface, text as textColors, spacingNum, radius } from '../../design-system/tokens';
import { X, CreditCard, ChevronUp, ChevronDown } from 'lucide-react';
import type { PeriodPreset } from '../../data/models';

// Pill chip component for filters
function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${spacingNum[2]}px`,
        padding: `${spacingNum[2]}px ${spacingNum[3]}px`,
        borderRadius: radius.full,
        border: `1px solid ${brand.primary}`,
        backgroundColor: `${brand.primary}15`,
        color: brand.primary,
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = `${brand.primary}25`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = `${brand.primary}15`;
      }}
    >
      <span>{label}</span>
      <X size={14} />
    </button>
  );
}

export function EnhancedTransactions() {
  const customerId = 'user123';
  const { loading, error, data, filters, updateFilters, clearFilters, sort, sortField, sortDirection } = useTransactionsData(customerId);
  const [page, setPage] = useState(1);
  const perPage = 20;

  const periodOptions: Array<{ label: string; value: PeriodPreset }> = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: 'Year', value: '1y' },
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

  const hasActiveFilters = filters.category || filters.period;
  const paginatedData = data.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(data.length / perPage);

  // Pagination pill component
  const PaginationPill = ({ num, active }: { num: number; active: boolean }) => (
    <button
      type="button"
      onClick={() => setPage(num)}
      style={{
        minWidth: '40px',
        height: '40px',
        padding: `0 ${spacingNum[3]}px`,
        borderRadius: radius.full,
        border: active ? `2px solid ${brand.primary}` : `1px solid ${surface.border}`,
        backgroundColor: active ? brand.primary : 'transparent',
        color: active ? textColors.inverse : textColors.primary,
        fontSize: '14px',
        fontWeight: active ? 600 : 500,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = surface.hover;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
      aria-label={`Page ${num}`}
      aria-current={active ? 'page' : undefined}
    >
      {num}
    </button>
  );

  if (loading) {
    return (
      <PageLayout title="Transactions" >
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
      <PageLayout title="Transactions" >
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
    <PageLayout title="Transactions" >
      <Stack spacing={6}>
        {/* Filter Controls */}
        <Card padding={6}>
          <Stack spacing={4}>
            <Heading level={3}>Filters</Heading>
            
            <Grid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap={4}>
              <div>
                <label htmlFor="category-filter" style={{ display: 'block', marginBottom: `${spacingNum[2]}px`, fontSize: '14px', fontWeight: 500 }}>
                  Category
                </label>
                <select
                  id="category-filter"
                  value={filters.category || ''}
                  onChange={(e) => updateFilters({ category: e.target.value || undefined })}
                  style={{
                    width: '100%',
                    padding: `${spacingNum[3]}px ${spacingNum[4]}px`,
                    borderRadius: radius.lg,
                    border: `1px solid ${surface.border}`,
                    backgroundColor: surface.surface,
                    color: textColors.primary,
                    fontSize: '14px',
                  }}
                >
                  <option value="">All categories</option>
                  {categoryOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="period-filter" style={{ display: 'block', marginBottom: `${spacingNum[2]}px`, fontSize: '14px', fontWeight: 500 }}>
                  Period
                </label>
                <select
                  id="period-filter"
                  value={filters.period || ''}
                  onChange={(e) => updateFilters({ period: (e.target.value as PeriodPreset) || undefined })}
                  style={{
                    width: '100%',
                    padding: `${spacingNum[3]}px ${spacingNum[4]}px`,
                    borderRadius: radius.lg,
                    border: `1px solid ${surface.border}`,
                    backgroundColor: surface.surface,
                    color: textColors.primary,
                    fontSize: '14px',
                  }}
                >
                  <option value="">All time</option>
                  {periodOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Button variant="secondary" size="medium" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              )}
            </Grid>

            {/* Active Filter Pills */}
            {hasActiveFilters && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${spacingNum[2]}px` }}>
                {filters.category && (
                  <FilterPill
                    label={`Category: ${filters.category}`}
                    onRemove={() => updateFilters({ category: undefined })}
                  />
                )}
                {filters.period && (
                  <FilterPill
                    label={`Period: ${periodOptions.find(p => p.value === filters.period)?.label}`}
                    onRemove={() => updateFilters({ period: undefined })}
                  />
                )}
              </div>
            )}
          </Stack>
        </Card>

        {/* Transactions Table/List */}
        {data.length === 0 ? (
          <Card padding={8}>
            <Stack spacing={4} align="center">
              <CreditCard size={48} color={textColors.muted} />
              <Text variant="body" color="muted">No transactions found</Text>
            </Stack>
          </Card>
        ) : (
          <Card padding={6}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: surface.surfaceAlt, borderBottom: `2px solid ${surface.border}` }}>
                    <th style={{ padding: `${spacingNum[4]}px ${spacingNum[6]}px`, textAlign: 'left' }}>
                      <button
                        type="button"
                        onClick={() => sort('date')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: `${spacingNum[2]}px`,
                          background: 'none',
                          border: 'none',
                          color: textColors.strong,
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Date
                        {sortField === 'date' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                      </button>
                    </th>
                    <th style={{ padding: `${spacingNum[4]}px ${spacingNum[6]}px`, textAlign: 'left' }}>
                      <button
                        type="button"
                        onClick={() => sort('merchant')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: `${spacingNum[2]}px`,
                          background: 'none',
                          border: 'none',
                          color: textColors.strong,
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Merchant
                        {sortField === 'merchant' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                      </button>
                    </th>
                    <th style={{ padding: `${spacingNum[4]}px ${spacingNum[6]}px`, textAlign: 'left', fontSize: '14px', fontWeight: 600, color: textColors.strong }}>
                      Category
                    </th>
                    <th style={{ padding: `${spacingNum[4]}px ${spacingNum[6]}px`, textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => sort('amount')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: `${spacingNum[2]}px`,
                          marginLeft: 'auto',
                          background: 'none',
                          border: 'none',
                          color: textColors.strong,
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Amount
                        {sortField === 'amount' && (sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((txn, idx) => (
                    <tr
                      key={txn.id}
                      style={{
                        backgroundColor: idx % 2 === 0 ? 'transparent' : surface.surfaceAlt,
                        borderBottom: `1px solid ${surface.border}`,
                      }}
                    >
                      <td style={{ padding: `${spacingNum[4]}px ${spacingNum[6]}px`, fontSize: '14px', color: textColors.primary }}>
                        {txn.date}
                      </td>
                      <td style={{ padding: `${spacingNum[4]}px ${spacingNum[6]}px`, fontSize: '14px', fontWeight: 500, color: textColors.strong }}>
                        {txn.merchant}
                      </td>
                      <td style={{ padding: `${spacingNum[4]}px ${spacingNum[6]}px` }}>
                        <Badge>{txn.category}</Badge>
                      </td>
                      <td style={{ padding: `${spacingNum[4]}px ${spacingNum[6]}px`, textAlign: 'right', fontSize: '14px', fontWeight: 600, color: textColors.strong }}>
                        {formatCurrency(txn.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Pagination Pills */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: `${spacingNum[2]}px`, flexWrap: 'wrap' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
              <PaginationPill key={num} num={num} active={num === page} />
            ))}
          </div>
        )}
      </Stack>
    </PageLayout>
  );
}
