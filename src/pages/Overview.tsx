import { SummaryCardPlaceholder, QuickActionsPlaceholder, GoalsListPlaceholder, SummaryCard, QuickActions, GoalsList } from '../widgets/Overview';
import { useOverviewData } from '../widgets/Overview/useOverviewData';

export function Overview() {
  const customerId = 'user123'; // placeholder until auth context supplies id
  const { summary, goals, isInitialLoading, isError, hasPartialData, retry } = useOverviewData(customerId);

  return (
    <section aria-labelledby="overview-heading">
      <h2 id="overview-heading">Overview</h2>
      {isInitialLoading && (
        <div className="overview-grid" aria-label="Loading overview data" aria-live="polite" aria-busy="true">
          <SummaryCardPlaceholder />
          <QuickActionsPlaceholder />
          <GoalsListPlaceholder />
        </div>
      )}
      {isError && !isInitialLoading && (
        <div role="alert" className="overview-error" aria-live="assertive" style={{ marginTop: '1rem' }}>
          <p style={{ margin: 0 }}><strong>Could not load overview.</strong></p>
            <p style={{ marginTop: '0.25rem' }}>Please check your connection and retry.</p>
            <button type="button" onClick={retry} aria-label="Retry loading overview data">Retry</button>
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
    </section>
  );
}
export default Overview;