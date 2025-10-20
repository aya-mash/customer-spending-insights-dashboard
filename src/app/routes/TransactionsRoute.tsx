import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { TransactionSort, PeriodPreset, FiltersResponse, TransactionsPage } from '../../data/models';
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
    <main className="transactions-route" aria-labelledby="transactions-heading">
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
        <aside aria-label="Filters" className="tx-filters-desktop">
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
      <section aria-label="Results" className="transactions-results-reflection">
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
        { !txLoading && !txError && txData && (
          <p>Loaded {txData.transactions.length} rows (table to follow).</p>
        ) }
      </section>
    </main>
  );
}

export default TransactionsRoute;