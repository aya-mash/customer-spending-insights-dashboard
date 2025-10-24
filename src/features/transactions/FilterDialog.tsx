/**
 * FILTER DIALOG COMPONENT
 * Mobile filter dialog for transactions with category and period selection
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  Stack,
  Button,
  Select,
  Heading,
  type SelectOption
} from '../../design-system/components/index';
import type { PeriodPreset } from '../../data/models';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { category?: string; period?: PeriodPreset }) => void;
  onClear: () => void;
  initialCategory?: string;
  initialPeriod?: PeriodPreset;
  categoryOptions: SelectOption[];
  periodOptions: SelectOption[];
}

export function FilterDialog({ 
  isOpen, 
  onClose, 
  onApply, 
  onClear,
  initialCategory,
  initialPeriod,
  categoryOptions,
  periodOptions
}: Readonly<FilterDialogProps>) {
  const { t } = useTranslation();
  const [category, setCategory] = useState('');
  const [period, setPeriod] = useState<PeriodPreset | ''>('');

  // Reset form when dialog opens with initial values
  useEffect(() => {
    if (isOpen) {
      // Use queueMicrotask to avoid cascading updates
      queueMicrotask(() => {
        setCategory(initialCategory || '');
        setPeriod(initialPeriod || '');
      });
    }
  }, [isOpen, initialCategory, initialPeriod]);

  const handleApply = () => {
    onApply({
      category: category || undefined,
      period: (period as PeriodPreset) || undefined,
    });
    onClose();
  };

  const handleClear = () => {
    setCategory('');
    setPeriod('');
    onClear();
    onClose();
  };

  const activeFilterCount = [category, period].filter(Boolean).length;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="500px"
    >
      <Stack spacing={4}>
        <Heading level={2}>{t('transactions.filters')}</Heading>
        
        <Select
          id="category-filter-mobile"
          label={t('transactions.category')}
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
        />

        <Select
          id="period-filter-mobile"
          label={t('transactions.period')}
          options={periodOptions}
          value={period}
          onChange={(e) => setPeriod(e.target.value as PeriodPreset)}
          fullWidth
        />

        <Stack direction="horizontal" spacing={3}>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="medium"
              onClick={handleClear}
              style={{ flex: 1 }}
            >
              {t('transactions.clearAll')}
            </Button>
          )}
          <Button
            variant="primary"
            size="medium"
            onClick={handleApply}
            style={{ flex: 1 }}
          >
            {t('common.apply')}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
