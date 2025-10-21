import type { Meta, StoryObj } from '@storybook/react';
import { SummaryCard, SummaryCardPlaceholder } from '../SummaryCard';
import { QuickActions } from '../QuickActions';
import { GoalsList } from '../GoalsList';
import type { SpendingSummary, GoalsResponse } from '../../../data/models';

const meta: Meta = {
  title: 'Overview/Composite',
};
export default meta;

type Story = StoryObj;

const summary: SpendingSummary = {
  period: '30d',
  totalSpent: 3210.99,
  transactionCount: 52,
  averageTransaction: 61.75,
  topCategory: 'Transport',
  comparedToPrevious: { spentChange: -2.3, transactionChange: 1.8 },
};
const goals: GoalsResponse = {
  goals: [
    { id: 'g1', category: 'Transport', monthlyBudget: 900, currentSpent: 300, percentageUsed: 33.3, daysRemaining: 14, status: 'on_track' },
    { id: 'g2', category: 'Dining', monthlyBudget: 700, currentSpent: 680, percentageUsed: 97.1, daysRemaining: 5, status: 'warning' },
  ],
};

export const AllLoaded: Story = {
  render: () => (
    <div className="overview-grid" style={{ gap: '1rem' }}>
      <SummaryCard summary={summary} />
      <QuickActions />
      <GoalsList goals={goals} />
    </div>
  ),
};

export const MixedLoading: Story = {
  render: () => (
    <div className="overview-grid" style={{ gap: '1rem' }}>
      <SummaryCardPlaceholder />
      <QuickActions />
      <GoalsList goals={goals} />
    </div>
  ),
};
