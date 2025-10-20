import { formatRand } from '../../utils/currency';
import { formatDate } from '../../utils/dates';
import { useTransactionsData } from './useTransactionsData';

export function TransactionTable() {
  const customerId = 'user123'; // TODO: replace with real user context when available
  const { loading, error, data, sortField, sortDirection, loadData, sort } = useTransactionsData(customerId);

  if (loading) {
    return <TransactionSkeleton />;
  }

  if (error) {
    return (
      <div role="alert" className="insights-error">
        <p>{error}</p>
        <button onClick={loadData} className="btn btn--secondary btn--small">Retry</button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div role="status" className="empty-state">
        <span className="empty-icon" aria-hidden="true">💳</span>
        <p>No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="table" role="table" aria-label="Transaction history">
        <thead>
          <tr>
            <th>
              <button
                type="button"
                onClick={() => sort('date')}
                className={`sort-header ${sortField === 'date' ? 'active' : ''}`}
                aria-sort={sortField === 'date' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Date
                {sortField === 'date' && (
                  <span className="sort-icon" aria-hidden="true">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </th>
            <th>
              <button
                type="button"
                onClick={() => sort('merchant')}
                className={`sort-header ${sortField === 'merchant' ? 'active' : ''}`}
                aria-sort={sortField === 'merchant' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Merchant
                {sortField === 'merchant' && (
                  <span className="sort-icon" aria-hidden="true">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </th>
            <th>Category</th>
            <th>
              <button
                type="button"
                onClick={() => sort('amount')}
                className={`sort-header ${sortField === 'amount' ? 'active' : ''}`}
                aria-sort={sortField === 'amount' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Amount
                {sortField === 'amount' && (
                  <span className="sort-icon" aria-hidden="true">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </th>
            <th>Payment Method</th>
          </tr>
        </thead>
        <tbody>
          {data.map((transaction, index) => (
            <tr key={transaction.id} className={index % 2 === 0 ? 'even' : 'odd'}>
              <td>
                <time dateTime={transaction.date}>
                  {formatDate(transaction.date)}
                </time>
              </td>
              <td>
                <div className="merchant-cell">
                  <span className="merchant-icon" aria-hidden="true">{transaction.icon}</span>
                  <div>
                    <div className="merchant-name">{transaction.merchant}</div>
                    {transaction.description && (
                      <div className="merchant-description">{transaction.description}</div>
                    )}
                  </div>
                </div>
              </td>
              <td>
                <span 
                  className="chip chip--category"
                  style={{ backgroundColor: transaction.categoryColor }}
                >
                  {transaction.category}
                </span>
              </td>
              <td className="amount-cell">
                <span className={`amount ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                  {formatRand(Math.abs(transaction.amount))}
                </span>
              </td>
              <td>{transaction.paymentMethod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TransactionSkeleton() {
  return (
    <div className="transaction-skeleton" aria-label="Loading transactions">
      <div className="sk-table-header" />
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="sk-table-row" />
      ))}
    </div>
  );
}