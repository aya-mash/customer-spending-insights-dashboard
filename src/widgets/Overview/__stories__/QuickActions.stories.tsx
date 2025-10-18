import type { Meta, StoryObj } from '@storybook/react';
import { QuickActions, QuickActionsPlaceholder } from '../QuickActions';

const meta: Meta<typeof QuickActions> = {
  title: 'Overview/QuickActions',
  component: QuickActions,
};
export default meta;

type Story = StoryObj<typeof QuickActions>;

export const Default: Story = {};
export const Loading: Story = { render: () => <QuickActionsPlaceholder /> };
