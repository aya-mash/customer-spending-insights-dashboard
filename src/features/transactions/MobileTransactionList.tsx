import { memo, useMemo } from 'react';
import { formatRand } from '../../utils/currency';
import { formatDate } from '../../utils/dates';
import type { Transaction } from '../../data/models';

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
}

// Mobile card component for responsive table replacement
export const TransactionCard = memo(function TransactionCard({ 
  transaction, 
  onClick 
}: TransactionCardProps) {
  const formattedAmount = useMemo(() => 
    formatRand(Math.abs(transaction.amount)), 
    [transaction.amount]
  );
  
  const formattedDate = useMemo(() => 
    formatDate(transaction.date), 
    [transaction.date]
  );

  return (
    <div 
      className={`transaction-card ${onClick ? 'transaction-card--clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="transaction-card__header">
        <div className="transaction-card__merchant">
          <span className="merchant-icon" aria-hidden="true">
            {transaction.icon}
          </span>
          <div>
            <div className="merchant-name">{transaction.merchant}</div>
            {transaction.description && (
              <div className="merchant-description">{transaction.description}</div>
            )}
          </div>
        </div>
        <div className="transaction-card__amount">
          <span className={`amount ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
            {formattedAmount}
          </span>
        </div>
      </div>
      
      <div className="transaction-card__details">
        <div className="transaction-card__meta">
          <span 
            className="chip chip--category chip--sm"
            style={{ backgroundColor: transaction.categoryColor, color: 'white' }}
          >
            {transaction.category}
          </span>
          <time 
            className="transaction-date"
            dateTime={transaction.date}
          >
            {formattedDate}
          </time>
        </div>
        <div className="payment-method">
          {transaction.paymentMethod}
        </div>
      </div>
    </div>
  );
});

interface MobileTransactionListProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
}

export const MobileTransactionList = memo(function MobileTransactionList({
  transactions,
  onTransactionClick
}: MobileTransactionListProps) {
  return (
    <div className="mobile-transaction-list" role="list" aria-label="Transaction list">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onClick={onTransactionClick ? () => onTransactionClick(transaction) : undefined}
        />
      ))}
    </div>
  );
});