/**
 * TRANSACTION DETAILS DIALOG
 * Shows full transaction details when clicking a row
 */

import { Dialog, Stack, Text, Button, Badge } from '../../design-system/components';
import { formatCurrency } from '../../design-system';
import { formatDate } from '../../utils/dates';
import { getCategoryColor } from '../../lib/categoryUtils';
import type { Transaction } from '../../data/models';
import { Download, Calendar, CreditCard, Tag, FileText } from 'lucide-react';

interface TransactionDetailsDialogProps {
  readonly transaction: Transaction | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function TransactionDetailsDialog({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailsDialogProps) {
  if (!transaction) return null;

  const handleDownloadReceipt = () => {
    // Lazy load jspdf when needed
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      doc.text(`Receipt - ${transaction.merchant}`, 20, 20);
      doc.text(`Amount: ${formatCurrency(Math.abs(transaction.amount))}`, 20, 30);
      doc.text(`Date: ${formatDate(transaction.date)}`, 20, 40);
      doc.text(`Category: ${transaction.category}`, 20, 50);
      doc.text(`ID: ${transaction.id}`, 20, 60);
      doc.save(`receipt-${transaction.id}.pdf`);
    }).catch(() => console.error('Failed to load PDF library'));
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="500px">
      <Stack spacing={5}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Text variant="bodyLg" style={{ fontWeight: 600, fontSize: '20px' }}>
            {transaction.merchant}
          </Text>
          <Badge
            variant="default"
            style={{
              backgroundColor: `${getCategoryColor(transaction.category, transaction.categoryColor)}20`,
              color: getCategoryColor(transaction.category, transaction.categoryColor),
              borderColor: getCategoryColor(transaction.category, transaction.categoryColor),
            }}
          >
            {transaction.category}
          </Badge>
        </div>

        {/* Amount */}
        <div style={{
          padding: '20px',
          backgroundColor: 'var(--color-surface-secondary)',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <Text variant="caption" color="muted" style={{ marginBottom: '4px' }}>
            Amount
          </Text>
          <Text
            variant="bodyLg"
            style={{
              color: transaction.amount < 0 ? '#EF4444' : 'inherit',
              fontWeight: 700,
              fontSize: '32px',
            }}
          >
            {formatCurrency(Math.abs(transaction.amount))}
          </Text>
        </div>

        {/* Details */}
        <Stack spacing={3}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <Calendar size={20} color="#6B7280" style={{ marginTop: '2px' }} />
            <div>
              <Text variant="caption" color="muted">Date</Text>
              <Text variant="body">{formatDate(transaction.date)}</Text>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <CreditCard size={20} color="#6B7280" style={{ marginTop: '2px' }} />
            <div>
              <Text variant="caption" color="muted">Transaction ID</Text>
              <Text variant="bodySm" style={{ fontFamily: 'monospace' }}>
                {transaction.id}
              </Text>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <Tag size={20} color="#6B7280" style={{ marginTop: '2px' }} />
            <div>
              <Text variant="caption" color="muted">Category</Text>
              <Text variant="body">{transaction.category}</Text>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <FileText size={20} color="#6B7280" style={{ marginTop: '2px' }} />
            <div>
              <Text variant="caption" color="muted">Description</Text>
              <Text variant="body">{transaction.description}</Text>
            </div>
          </div>
        </Stack>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <Button
            variant="ghost"
            size="medium"
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Close
          </Button>
          <Button
            variant="secondary"
            size="medium"
            onClick={handleDownloadReceipt}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Download size={18} />
            <span>Download Receipt</span>
          </Button>
        </div>
      </Stack>
    </Dialog>
  );
}
