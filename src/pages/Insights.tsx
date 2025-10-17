import { AsyncSection } from '../components/Skeleton';
import { lazy, Suspense } from 'react';
const Charts = lazy(() => import('../components/Charts').then(m => ({ default: m.Charts })));

const DELAY_MS = import.meta.env.MODE === 'test' ? 0 : 300;

async function loadInsights() {
  if (DELAY_MS) await new Promise(r => setTimeout(r, DELAY_MS));
  return (
    <section aria-labelledby="insights-heading">
      <h2 id="insights-heading">Insights</h2>
      <p>Charts and analytics will appear here.</p>
      <Suspense fallback={<div aria-busy="true" aria-label="Loading charts">Loading charts…</div>}>
        <Charts />
      </Suspense>
    </section>
  );
}

export function Insights() { return <AsyncSection load={loadInsights} />; }
export default Insights;