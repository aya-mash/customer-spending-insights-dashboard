/**
 * GOAL DIALOG COMPONENT
 * Create/Edit spending goal with validation
 */

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  Stack,
  Button,
  TextField,
  Select,
  Heading,
  Text,
  type SelectOption
} from '../../design-system/components/index';
import type { GoalItem } from '../../data/models';

interface GoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Partial<GoalItem>) => void;
  existingGoal?: GoalItem | null;
  categories: string[];
}

const categoryOptions: SelectOption[] = [
  { label: 'Food & Dining', value: 'Food & Dining' },
  { label: 'Transportation', value: 'Transportation' },
  { label: 'Shopping', value: 'Shopping' },
  { label: 'Entertainment', value: 'Entertainment' },
  { label: 'Bills & Utilities', value: 'Bills & Utilities' },
  { label: 'Healthcare', value: 'Healthcare' },
  { label: 'Travel', value: 'Travel' },
  { label: 'Education', value: 'Education' },
  { label: 'Personal Care', value: 'Personal Care' },
  { label: 'Other', value: 'Other' },
];

export function GoalDialog({ isOpen, onClose, onSave, existingGoal, categories }: Readonly<GoalDialogProps>) {
  const [category, setCategory] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [errors, setErrors] = useState<{ category?: string; monthlyBudget?: string }>({});

  // Initialize form when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (existingGoal) {
        setCategory(existingGoal.category);
        setMonthlyBudget(existingGoal.monthlyBudget.toString());
      } else {
        setCategory('');
        setMonthlyBudget('');
      }
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run on dialog open
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: { category?: string; monthlyBudget?: string } = {};

    if (!category) {
      newErrors.category = 'Category is required';
    } else if (!existingGoal && categories.includes(category)) {
      newErrors.category = 'Goal already exists for this category';
    }

    const budgetNum = Number.parseFloat(monthlyBudget);
    if (!monthlyBudget) {
      newErrors.monthlyBudget = 'Budget is required';
    } else if (Number.isNaN(budgetNum) || budgetNum <= 0) {
      newErrors.monthlyBudget = 'Budget must be a positive number';
    } else if (budgetNum > 1000000) {
      newErrors.monthlyBudget = 'Budget cannot exceed R1,000,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const goalData: Partial<GoalItem> = {
      category,
      monthlyBudget: Number.parseFloat(monthlyBudget),
      currentSpent: existingGoal?.currentSpent || 0,
    };

    if (existingGoal) {
      goalData.id = existingGoal.id;
    }

    onSave(goalData);
    onClose();
  };

  const handleCancel = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleCancel} maxWidth="500px">
      <Stack spacing={6}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Heading level={3}>
            {existingGoal ? 'Edit Goal' : 'Create Goal'}
          </Heading>
          <button
            onClick={handleCancel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <Stack spacing={4}>
          <Select
            id="goal-category"
            label="Category"
            options={categoryOptions}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            error={errors.category}
            fullWidth
            disabled={!!existingGoal}
          />

          <TextField
            id="goal-budget"
            label="Monthly Budget (R)"
            type="number"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(e.target.value)}
            placeholder="5000"
            error={errors.monthlyBudget}
            fullWidth
            min="0"
            step="100"
          />

          {existingGoal && (
            <div style={{
              padding: '12px',
              backgroundColor: 'var(--color-surface-alt)',
              borderRadius: '8px'
            }}>
              <Text variant="bodySm" color="muted">
                Current spending: <strong>R{existingGoal.currentSpent.toFixed(2)}</strong>
              </Text>
            </div>
          )}
        </Stack>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" size="medium" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="medium" onClick={handleSave}>
            {existingGoal ? 'Save Changes' : 'Create Goal'}
          </Button>
        </div>
      </Stack>
    </Dialog>
  );
}
