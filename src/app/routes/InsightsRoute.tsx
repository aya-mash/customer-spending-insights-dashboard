import { InsightsCharts } from '../../features/insights/InsightsCharts';

export function InsightsRoute() {
  return (
    <div className="insights-route" aria-labelledby="insights-heading">
      <h2 id="insights-heading" className="visually-hidden">Insights</h2>
      <InsightsCharts />
    </div>
  );
}

export default InsightsRoute;