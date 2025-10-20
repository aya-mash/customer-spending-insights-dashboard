import type { Meta, StoryObj } from '@storybook/react';
import { InsightsRoute } from '../app/routes/InsightsRoute';
import { DashboardProvider } from '../layouts/dashboard/DashboardProvider';
import dashboardConfig from '../app/config/dashboard.config';
import * as client from '../data/client';
import type { CategoryBreakdown, SpendingTrends } from '../data/models';

const meta: Meta = {
  title: 'Insights/Panels',
  component: InsightsRoute,
  parameters: { layout: 'fullscreen' },
};
export default meta;

const mockCategories: CategoryBreakdown = {
  dateRange: { startDate: '2025-09-01', endDate: '2025-09-30' },
  totalAmount: 1000,
  categories: [
    { name: 'Food', amount: 400, percentage: 40, transactionCount: 10, color: '#ff9900', icon: 'Utensils' },
    { name: 'Travel', amount: 300, percentage: 30, transactionCount: 5, color: '#3366ff', icon: 'Plane' },
    { name: 'Other', amount: 300, percentage: 30, transactionCount: 7, color: '#33aa66', icon: 'Circle' },
  ],
};
const mockTrends: SpendingTrends = {
  trends: Array.from({ length: 12 }).map((_, i) => ({
    month: `2025-${String(i + 1).padStart(2,'0')}`,
    totalSpent: 500 + i * 10,
    transactionCount: 20 + i,
    averageTransaction: 25,
  }))
};

function withData() {
  return (
    <DashboardProvider config={dashboardConfig}>
      <InsightsRoute />
    </DashboardProvider>
  );
}

export const CategoryDefault: StoryObj = {
  name: 'Category Donut',
  render: () => {
    // Mock client calls
    (client.categories as unknown as () => Promise<unknown>) = () => Promise.resolve(mockCategories);
    (client.trends as unknown as () => Promise<unknown>) = () => Promise.resolve(mockTrends);
    return withData();
  }
};

export const CategoryEmpty: StoryObj = {
  name: 'Category Empty',
  render: () => {
    (client.categories as unknown as () => Promise<unknown>) = () => Promise.resolve({ ...mockCategories, categories: [], totalAmount: 0 });
    (client.trends as unknown as () => Promise<unknown>) = () => Promise.resolve(mockTrends);
    return withData();
  }
};

export const CategoryError: StoryObj = {
  name: 'Category Error',
  render: () => {
    (client.categories as unknown as () => Promise<unknown>) = () => Promise.reject(new Error('Category load failed'));
    (client.trends as unknown as () => Promise<unknown>) = () => Promise.resolve(mockTrends);
    return withData();
  }
};

export const TrendsDefault: StoryObj = {
  name: 'Trends Chart',
  render: () => {
    (client.categories as unknown as () => Promise<unknown>) = () => Promise.resolve(mockCategories);
    (client.trends as unknown as () => Promise<unknown>) = () => Promise.resolve(mockTrends);
    return withData();
  }
};