import { AsyncSection } from '../components/Skeleton';

const DELAY_MS = import.meta.env.MODE === 'test' ? 0 : 200;

async function loadOverview() {
  if (DELAY_MS) await new Promise(r => setTimeout(r, DELAY_MS));
  return (
    <section aria-labelledby="overview-heading">
      <h2 id="overview-heading">Overview</h2>
      <p>High-level summary of spending will appear here.</p>
    </section>
  );
}

export function Overview() { return <AsyncSection load={loadOverview} />; }
export default Overview;