import { TabbedOverview } from '../../features/overview/TabbedOverview';

export function OverviewRoute() {
  return (
    <section aria-labelledby="overview-heading" className="overview-route">
      <h2 id="overview-heading" className="visually-hidden">Spending Overview</h2>
      <TabbedOverview />
    </section>
  );
}

export default OverviewRoute;