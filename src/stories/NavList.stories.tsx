import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { NavList } from '../layouts/dashboard/NavList';
import { DashboardProvider } from '../layouts/dashboard/DashboardProvider';
import { dashboardConfig } from '../app/config/dashboard.config';

const meta: Meta<typeof NavList> = {
  title: 'Navigation/NavList',
  component: NavList,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof NavList>;

export const Default: Story = {
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <DashboardProvider config={dashboardConfig}>
        <NavList />
      </DashboardProvider>
    </MemoryRouter>
  )
};