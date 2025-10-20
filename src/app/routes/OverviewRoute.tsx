import { OverviewWidgets } from '../../features/overview/OverviewWidgets';

export function OverviewRoute() {
  return (
    <section aria-labelledby="overview-heading">
      <h2 id="overview-heading">Overview</h2>
      <OverviewWidgets />
    </section>
  );
}

export default OverviewRoute;