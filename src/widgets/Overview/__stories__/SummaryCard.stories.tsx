import type { Meta, StoryObj } from '@storybook/react';
import { SummaryCard, SummaryCardPlaceholder } from '../SummaryCard';
import type { SpendingSummary } from '../../../data/models';

const meta: Meta<typeof SummaryCard> = {
  title: 'Overview/SummaryCard',
  component: SummaryCard,
};
export default meta;

type Story = StoryObj<typeof SummaryCard>;

const sample: SpendingSummary = {
  period: '30d',
  totalSpent: 5432.1,
  transactionCount: 87,
  averageTransaction: 62.45,
  topCategory: 'Groceries',
  comparedToPrevious: { spentChange: 4.2, transactionChange: -1.3 },
};

export const Loaded: Story = { args: { summary: sample } };
export const Loading: Story = { render: () => <SummaryCardPlaceholder /> };
