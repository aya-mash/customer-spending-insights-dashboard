import React from 'react';
import { SummaryCardPlaceholder, QuickActionsPlaceholder, GoalsListPlaceholder } from '../widgets/Overview';

export function Overview() {
  return (
    <section aria-labelledby="overview-heading">
      <h2 id="overview-heading">Overview</h2>
      <div className="overview-grid">
        <SummaryCardPlaceholder />
        <QuickActionsPlaceholder />
        <GoalsListPlaceholder />
      </div>
    </section>
  );
}
export default Overview;