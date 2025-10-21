import type { Meta, StoryObj } from '@storybook/react';
import { DashboardProvider } from '../layouts/dashboard/DashboardProvider';
import { DashboardLayout } from '../layouts/dashboard/DashboardLayout';
import { dashboardConfig } from '../app/config/dashboard.config';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const meta: Meta = {
  title: 'Layout/ThemeShowcase',
};
export default meta;
type Story = StoryObj;

export const LightDark: Story = {
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <DashboardProvider config={dashboardConfig}>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<div><h1>Overview</h1><p>Sample content.</p></div>} />
          </Route>
        </Routes>
      </DashboardProvider>
    </MemoryRouter>
  )
};