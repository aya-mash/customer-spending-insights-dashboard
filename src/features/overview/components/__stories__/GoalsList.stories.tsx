import type { Meta, StoryObj } from '@storybook/react';
import { GoalsList, GoalsListPlaceholder } from '../GoalsList';
import type { GoalsResponse } from '../../../data/models';

const meta: Meta<typeof GoalsList> = {
  title: 'Overview/GoalsList',
  component: GoalsList,
};
export default meta;

type Story = StoryObj<typeof GoalsList>;

const goalsData: GoalsResponse = {
  goals: [
    { id: 'g1', category: 'Groceries', monthlyBudget: 1000, currentSpent: 420, percentageUsed: 42, daysRemaining: 10, status: 'on_track' },
    { id: 'g2', category: 'Dining', monthlyBudget: 800, currentSpent: 710, percentageUsed: 88.75, daysRemaining: 8, status: 'warning' },
    { id: 'g3', category: 'Entertainment', monthlyBudget: 600, currentSpent: 650, percentageUsed: 108.3, daysRemaining: 10, status: 'over' },
  ],
};

export const Loaded: Story = { args: { goals: goalsData } };
export const Loading: Story = { render: () => <GoalsListPlaceholder /> };
export const Empty: Story = { args: { goals: { goals: [] } } };
