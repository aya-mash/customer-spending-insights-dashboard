import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { TransactionSort, PeriodPreset, FiltersResponse, TransactionsPage, Transaction } from '../../data/models';
import { filters, transactions } from '../../data/client';

interface TxnQueryState {
  category?: string;
  period?: PeriodPreset;
  limit: number;
  offset: number;
  sortBy: TransactionSort;
}

const PERIOD_VALUES: PeriodPreset[] = ['7d','30d','90d','1y'];
const SORT_VALUES: TransactionSort[] = ['date_desc','date_asc','amount_desc','amount_asc'];

function parseSearch(search: string): TxnQueryState {
  const usp = new URLSearchParams(search);
  const category = usp.get('category') || undefined;
  const periodRaw = usp.get('period') as PeriodPreset | null;
  const period = periodRaw && PERIOD_VALUES.includes(periodRaw) ? periodRaw : undefined;
  const limitNum = Number(usp.get('limit'));
  const offsetNum = Number(usp.get('offset'));
  const sortRaw = usp.get('sortBy') as TransactionSort | null;
  const sortBy = sortRaw && SORT_VALUES.includes(sortRaw) ? sortRaw : 'date_desc';
  return {
    category,
    period,
    limit: Number.isFinite(limitNum) && limitNum > 0 ? limitNum : 20,
    offset: Number.isFinite(offsetNum) && offsetNum >= 0 ? offsetNum : 0,
    sortBy,
  };
}

function buildSearch(state: TxnQueryState): string {
  const usp = new URLSearchParams();
  if (state.category) usp.set('category', state.category);
  if (state.period) usp.set('period', state.period);
  if (state.limit !== 20) usp.set('limit', String(state.limit));
  if (state.offset !== 0) usp.set('offset', String(state.offset));
  if (state.sortBy !== 'date_desc') usp.set('sortBy', state.sortBy);
  const s = usp.toString();
  return s ? `?${s}` : '';
}

export function TransactionsRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const qs = useMemo(() => parseSearch(location.search), [location.search]);
  const customerId = 'user123';

  // Data states
  const [fltLoading, setFltLoading] = useState(true);
  const [fltError, setFltError] = useState<string|null>(null);
  const [fltData, setFltData] = useState<FiltersResponse|null>(null);

  const [txLoading, setTxLoading] = useState(true);
  const [txError, setTxError] = useState<string|null>(null);
  const [txData, setTxData] = useState<TransactionsPage|null>(null);

  const abortRef = useRef<AbortController|null>(null);

  function computeDateRange(period?: PeriodPreset): { startDate?: string; endDate?: string } {
    if (!period) return {};
    const now = new Date();
    const endDate = now.toISOString().slice(0,10);
  const start = new Date(now);
    const map: Record<PeriodPreset, number> = { '7d':7, '30d':30, '90d':90, '1y':365 };
    const days = map[period];
    start.setDate(start.getDate() - (days - 1));
    const startDate = start.toISOString().slice(0,10);
    return { startDate, endDate };
  }

  const loadData = useCallback(async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setFltLoading(true); setFltError(null);
    setTxLoading(true); setTxError(null);
    const { startDate, endDate } = computeDateRange(qs.period);
    const txParams = { limit: qs.limit, offset: qs.offset, category: qs.category, startDate, endDate, sortBy: qs.sortBy };
    try {
      const [fRes, tRes] = await Promise.all([
        filters(customerId, ac.signal),
        transactions(customerId, txParams, ac.signal)
      ]);
      if (ac.signal.aborted) return;
      setFltData(fRes); setFltLoading(false);
      setTxData(tRes); setTxLoading(false);
    } catch (e) {
      if (ac.signal.aborted) return;
      const msg = e instanceof Error ? e.message : 'Failed loading transactions';
      // If filters fail treat separately
      setFltLoading(false); if (!fltData) setFltError(msg);
      setTxLoading(false); if (!txData) setTxError(msg);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, qs.category, qs.limit, qs.offset, qs.period, qs.sortBy]);

  useEffect(() => { loadData(); return () => abortRef.current?.abort(); }, [loadData]);

  // Sync helper: pushes updated params to URL without full reload
  const update = useCallback((partial: Partial<TxnQueryState>) => {
    const next: TxnQueryState = { ...qs, ...partial };
    navigate({ pathname: location.pathname, search: buildSearch(next) }, { replace: false });
  }, [qs, navigate, location.pathname]);

  // Placeholder UI reflecting current state
  const isMobile = typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)').matches : false;

  const periods = PERIOD_VALUES;
  const cats = fltData?.categories || [];

  const applyCategory = (c?: string) => update({ category: c, offset: 0 });
  const applyPeriod = (p?: PeriodPreset) => update({ period: p, offset: 0 });
  const resetFilters = () => update({ category: undefined, period: undefined, offset: 0 });

  return (
  <main className="transactions-route" aria-labelledby="transactions-heading" role="main">
      <h2 id="transactions-heading">Transactions</h2>
      {/* Filters UI */}
      {isMobile ? (
        <section aria-label="Filters" className="tx-filters-mobile">
          <details>
            <summary>Filters</summary>
            <div className="tx-filter-group" aria-labelledby="tx-period-label">
              <h3 id="tx-period-label">Date Range</h3>
              <div className="chip-row">
                {periods.map(p => (
                  <button key={p} type="button" className={`chip ${qs.period===p?'selected':''}`} aria-pressed={qs.period===p}
                    onClick={() => applyPeriod(qs.period===p?undefined:p)}>{p}</button>
                ))}
              </div>
            </div>
            <div className="tx-filter-group" aria-labelledby="tx-cat-label">
              <h3 id="tx-cat-label">Categories</h3>
              <div className="chip-row">
                {cats.map(c => (
                  <button key={c.name} type="button" className={`chip ${qs.category===c.name?'selected':''}`} aria-pressed={qs.category===c.name}
                    onClick={() => applyCategory(qs.category===c.name?undefined:c.name)}>{c.name}</button>
                ))}
              </div>
            </div>
            <div className="tx-filter-actions">
              <button type="button" onClick={() => { /* apply already live via toggle */ }}>Apply</button>
              <button type="button" onClick={resetFilters}>Reset</button>
            </div>
          </details>
        </section>
      ) : (
  <aside aria-label="Filters" className="tx-filters-desktop" role="complementary">
          <div className="tx-filter-group" aria-labelledby="tx-period-label-d">
            <h3 id="tx-period-label-d">Date Range</h3>
            <div className="chip-column">
              {periods.map(p => (
                <button key={p} type="button" className={`chip ${qs.period===p?'selected':''}`} aria-pressed={qs.period===p}
                  onClick={() => applyPeriod(qs.period===p?undefined:p)}>{p}</button>
              ))}
            </div>
          </div>
          <div className="tx-filter-group" aria-labelledby="tx-cat-label-d">
            <h3 id="tx-cat-label-d">Categories</h3>
            <div className="chip-column">
              {cats.map(c => (
                <button key={c.name} type="button" className={`chip ${qs.category===c.name?'selected':''}`} aria-pressed={qs.category===c.name}
                  onClick={() => applyCategory(qs.category===c.name?undefined:c.name)}>{c.name}</button>
              ))}
            </div>
            <button type="button" className="reset-btn" onClick={resetFilters}>Reset</button>
          </div>
        </aside>
      )}
  <section aria-label="Results" className="transactions-results-reflection" role="region" aria-labelledby="transactions-heading">
        {(qs.category || qs.period) && (
          <div className="tx-active-pills" aria-label="Active filters">
            {qs.category && (
              <span className="pill" data-type="category">Category: {qs.category} <button aria-label="Remove category filter" onClick={() => update({ category: undefined, offset:0 })}>×</button></span>
            )}
            {qs.period && (
              <span className="pill" data-type="period">Period: {qs.period} <button aria-label="Remove period filter" onClick={() => update({ period: undefined, offset:0 })}>×</button></span>
            )}
            <button type="button" className="clear-all" onClick={() => update({ category: undefined, period: undefined, offset:0 })}>Clear all</button>
          </div>
        )}
        { (fltError || txError) && (
          <div role="alert" className="tx-error">
            <p>{fltError || txError}</p>
            <button onClick={loadData}>Retry</button>
          </div>
        ) }
        { (fltLoading || txLoading) && (
          <div className="tx-skeleton" aria-label="Loading transactions">
            <div className="sk-header" />
            <ul className="sk-rows">{Array.from({length:5}).map((_,i)=><li key={i} className="sk-row" />)}</ul>
          </div>
        ) }
        { !txLoading && !txError && txData && txData.transactions.length === 0 && (
          <div className="tx-empty" role="status">
            <p>No transactions found for the selected filters.</p>
            <button type="button" onClick={resetFilters}>Reset Filters</button>
          </div>
        ) }
        { !txLoading && !txError && txData && txData.transactions.length > 0 && (
          <>
            <TransactionsTable
              rows={txData.transactions}
              sortBy={qs.sortBy}
              onChangeSort={(next) => update({ sortBy: next, offset: 0 })}
            />
            <Pagination
              total={txData.pagination.total}
              limit={txData.pagination.limit}
              offset={txData.pagination.offset}
              hasMore={txData.pagination.hasMore}
              onPageChange={(nextOffset: number) => update({ offset: nextOffset })}
            />
          </>
        ) }
      </section>
    </main>
  );
}

export default TransactionsRoute;

interface TransactionsTableProps {
  rows: Transaction[];
  sortBy: TransactionSort;
  onChangeSort: (s: TransactionSort) => void;
}

function TransactionsTable({ rows, sortBy, onChangeSort }: TransactionsTableProps) {
  const dateSortState = sortBy.startsWith('date_') ? (sortBy === 'date_desc' ? 'descending' : 'ascending') : 'none';
  const amountSortState = sortBy.startsWith('amount_') ? (sortBy === 'amount_desc' ? 'descending' : 'ascending') : 'none';
  function toggleDate() {
    onChangeSort(sortBy === 'date_desc' ? 'date_asc' : 'date_desc');
  }
  function toggleAmount() {
    onChangeSort(sortBy === 'amount_desc' ? 'amount_asc' : 'amount_desc');
  }
  return (
    <table className="tx-table" aria-label="Transactions table">
      <thead>
        <tr>
          <th>
            <button type="button" aria-sort={dateSortState} onClick={toggleDate} className="sortable" title="Sort by Date" aria-label="Sort by Date">
              Date <span className={`chevron ${dateSortState}`}>▾</span>
            </button>
          </th>
          <th>Merchant</th>
          <th>Category</th>
          <th>
            <button type="button" aria-sort={amountSortState} onClick={toggleAmount} className="sortable" title="Sort by Amount" aria-label="Sort by Amount">
              Amount <span className={`chevron ${amountSortState}`}>▾</span>
            </button>
          </th>
          <th>Payment Method</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => {
          const d = new Date(r.date);
          const dateLabel = d.toLocaleString('en-ZA', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
          const iso = r.date;
          return (
            <tr key={r.id}>
              <td title={iso}>{dateLabel}</td>
              <td className="merchant"><span className="merchant-name">{r.merchant}</span></td>
              <td className="category"><span className="cat-dot" style={{ background:r.categoryColor }} />{r.category}</td>
              <td className={r.amount < 0 ? 'neg' : ''}>{formatAmount(r.amount)}</td>
              <td className="method"><span className="method-icon" aria-hidden="true">💳</span>{r.paymentMethod}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function formatAmount(v: number) {
  return 'R' + v.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface PaginationProps {
  total: number; limit: number; offset: number; hasMore: boolean; onPageChange: (nextOffset: number) => void;
}
function Pagination({ total, limit, offset, hasMore, onPageChange }: PaginationProps) {
  const from = offset + 1;
  const to = Math.min(offset + limit, total);
  const prevOffset = Math.max(0, offset - limit);
  const nextOffset = offset + limit;
  return (
    <div className="tx-pager" aria-label="Pagination controls">
      <button type="button" className="pager-btn" disabled={offset === 0} onClick={() => onPageChange(prevOffset)} aria-label="Previous page">‹ Prev</button>
      <span className="tx-page-info" aria-live="polite">{from}–{to} of {total}</span>
      <button type="button" className="pager-btn" disabled={!hasMore} onClick={() => onPageChange(nextOffset)} aria-label="Next page">Next ›</button>
    </div>
  );
}