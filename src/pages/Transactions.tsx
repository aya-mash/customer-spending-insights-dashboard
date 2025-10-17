import { AsyncSection } from '../components/Skeleton';

// Skip artificial delay entirely in test environment to avoid flaky timeouts.
const DELAY_MS = import.meta.env.MODE === 'test' ? 0 : 250; // Faster dev delay for snappy UX

async function loadTransactions() {
  if (DELAY_MS) await new Promise(r => setTimeout(r, DELAY_MS));
  return (
    <section aria-labelledby="transactions-heading">
      <h2 id="transactions-heading">Transactions</h2>
      <p>Transaction list and filters will appear here.</p>
    </section>
  );
}

export function Transactions() { return <AsyncSection load={loadTransactions} />; }
export default Transactions;