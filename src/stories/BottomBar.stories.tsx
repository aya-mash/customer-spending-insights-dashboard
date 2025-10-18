import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { BottomBar } from '../layouts/dashboard/BottomBar';
import { DashboardProvider } from '../layouts/dashboard/DashboardProvider';
import { dashboardConfig } from '../app/config/dashboard.config';

const meta: Meta<typeof BottomBar> = {
  title: 'Navigation/BottomBar',
  component: BottomBar,
};
export default meta;
type Story = StoryObj<typeof BottomBar>;

export const Default: Story = {
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <DashboardProvider config={dashboardConfig}>
        <BottomBar />
      </DashboardProvider>
    </MemoryRouter>
  )
};