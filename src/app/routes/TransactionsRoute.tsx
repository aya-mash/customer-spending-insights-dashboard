import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { TransactionSort, PeriodPreset } from '../../data/models';

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

  // Sync helper: pushes updated params to URL without full reload
  const update = useCallback((partial: Partial<TxnQueryState>) => {
    const next: TxnQueryState = { ...qs, ...partial };
    navigate({ pathname: location.pathname, search: buildSearch(next) }, { replace: false });
  }, [qs, navigate, location.pathname]);

  // Placeholder UI reflecting current state
  return (
    <main className="transactions-route" aria-labelledby="transactions-heading">
      <h2 id="transactions-heading">Transactions</h2>
      <section aria-label="Current filters" className="transactions-filters-reflection">
        <dl>
          <dt>Category</dt><dd>{qs.category || '—'}</dd>
          <dt>Period</dt><dd>{qs.period || '—'}</dd>
          <dt>Limit</dt><dd>{qs.limit}</dd>
          <dt>Offset</dt><dd>{qs.offset}</dd>
          <dt>Sort</dt><dd>{qs.sortBy}</dd>
        </dl>
        <div className="transactions-temp-controls" aria-label="Temporary controls for URL state">
          <button type="button" onClick={() => update({ sortBy: qs.sortBy === 'date_desc' ? 'date_asc' : 'date_desc' })}>Toggle Date Sort</button>
          <button type="button" onClick={() => update({ offset: 0 })}>Reset Offset</button>
        </div>
      </section>
      <section aria-label="Results" className="transactions-results-reflection">
        <p>Data fetch to be implemented next. (category={qs.category || 'none'}, period={qs.period || 'none'}, limit={qs.limit}, offset={qs.offset}, sort={qs.sortBy})</p>
      </section>
    </main>
  );
}

export default TransactionsRoute;