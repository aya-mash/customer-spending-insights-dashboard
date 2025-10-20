import { TransactionFilters } from '../../features/transactions/TransactionFilters';
import { TransactionTable } from '../../features/transactions/TransactionTable';

export function TransactionsRoute() {
  return (
    <section aria-labelledby="transactions-heading">
      <h2 id="transactions-heading">Transactions</h2>
      <TransactionFilters />
      <TransactionTable />
    </section>
  );
}

export default TransactionsRoute;