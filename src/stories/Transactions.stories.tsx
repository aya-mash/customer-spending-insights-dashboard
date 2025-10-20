import type { Meta, StoryObj } from '@storybook/react';
import { TransactionsRoute } from '../app/routes/TransactionsRoute';
import { DashboardProvider } from '../layouts/dashboard/DashboardProvider';
import dashboardConfig from '../app/config/dashboard.config';
import * as client from '../data/client';
import type { FiltersResponse, TransactionsPage } from '../data/models';

const meta: Meta = {
  title: 'Transactions/Route',
  component: TransactionsRoute,
  parameters: { layout: 'fullscreen' }
};
export default meta;

const mockFilters: FiltersResponse = {
  categories: [
    { name: 'Food', color: '#ff9900', icon: 'Utensils' },
    { name: 'Travel', color: '#3366ff', icon: 'Plane' },
  ],
  dateRangePresets: [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: '1 Year', value: '1y' }
  ]
};

function makePage(empty = false): TransactionsPage {
  return {
    transactions: empty ? [] : Array.from({ length: 10 }).map((_, i) => ({
      id: 't' + i,
      date: new Date(2025, 8, 1 + i).toISOString(),
      merchant: 'Merchant ' + i,
      category: i % 2 ? 'Travel' : 'Food',
      amount: i % 3 ? 100 + i : -50 - i,
      description: 'Desc',
      paymentMethod: 'Card',
      icon: 'Circle',
      categoryColor: '#000'
    })),
    pagination: { total: empty ? 0 : 100, limit: 20, offset: 0, hasMore: !empty }
  };
}

function withData(empty = false) {
  (client.filters as unknown as () => Promise<unknown>) = () => Promise.resolve(mockFilters);
  (client.transactions as unknown as () => Promise<unknown>) = () => Promise.resolve(makePage(empty));
  return (
    <DashboardProvider config={dashboardConfig}>
      <TransactionsRoute />
    </DashboardProvider>
  );
}

export const Default: StoryObj = { render: () => withData(false) };
export const Empty: StoryObj = { render: () => withData(true) };
export const DarkMode: StoryObj = {
  parameters: { backgrounds: { default: 'dark' } },
  render: () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    return withData(false);
  }
};

export const SortedAmountDesc: StoryObj = {
  name: 'Sorted Amount Desc',
  render: () => {
    // force query param sortBy=amount_desc
    window.history.replaceState({}, '', '?sortBy=amount_desc');
    return withData(false);
  }
};

export const ErrorState: StoryObj = {
  name: 'Error State',
  render: () => {
    (client.filters as unknown as () => Promise<unknown>) = () => Promise.reject(new Error('Network down'));
    (client.transactions as unknown as () => Promise<unknown>) = () => Promise.reject(new Error('Network down'));
    return (
      <DashboardProvider config={dashboardConfig}>
        <TransactionsRoute />
      </DashboardProvider>
    );
  }
};
