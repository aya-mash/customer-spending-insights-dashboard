import { SummaryCardPlaceholder, QuickActionsPlaceholder, GoalsListPlaceholder, SummaryCard, QuickActions, GoalsList } from '../../widgets/Overview';
import { Button } from '../../components/Button';
import { useOverviewData } from './useOverviewData';

export function OverviewWidgets() {
  const customerId = 'user123'; // placeholder until auth context supplies id
  const { summary, goals, isInitialLoading, isError, hasPartialData, retry } = useOverviewData(customerId);

  return (
    <>
      {isInitialLoading && (
        <div className="overview-grid" aria-label="Loading overview data" aria-live="polite" aria-busy="true">
          <SummaryCardPlaceholder />
          <QuickActionsPlaceholder />
          <GoalsListPlaceholder />
        </div>
      )}
      {isError && !isInitialLoading && (
        <div role="alert" className="insights-error" aria-live="assertive" style={{ marginTop: '1rem' }}>
          <p style={{ margin: 0 }}><strong>Could not load overview.</strong></p>
            <p style={{ marginTop: '0.25rem' }}>Please check your connection and retry.</p>
            <Button type="button" onClick={retry} variant="secondary" size="small" aria-label="Retry loading overview data">Retry</Button>
        </div>
      )}
      {!isInitialLoading && (hasPartialData || (!isError && summary && goals)) && (
        <div className="overview-grid" aria-label={hasPartialData ? 'Overview partially loaded' : 'Overview data loaded'}>
          {/* Summary card slot */}
          {summary ? <SummaryCard summary={summary} /> : <SummaryCardPlaceholder />}
          {/* Quick actions are local UI, always show once past initial load */}
          <QuickActions />
          {/* Goals list slot */}
          {goals ? <GoalsList goals={goals} /> : <GoalsListPlaceholder />}
        </div>
      )}
    </>
  );
}