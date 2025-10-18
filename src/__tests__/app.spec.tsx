import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import App from '../App';

function renderWithProviders(path: string) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('App Shell Routing', () => {
  it('renders dynamic header title (Overview on root)', () => {
    const { getByRole } = renderWithProviders('/');
    // Header should show current page title Overview
    expect(getByRole('heading', { name: /overview/i })).toBeTruthy();
  });
  it('renders Overview page', async () => {
    const { findByRole } = renderWithProviders('/');
    expect(await findByRole('heading', { name: /overview/i })).toBeTruthy();
  });
  it('renders Transactions page', async () => {
    const { findByRole } = renderWithProviders('/transactions');
    expect(await findByRole('heading', { name: /transactions/i })).toBeTruthy();
  });
  it('renders Insights page', async () => {
    const { findByRole } = renderWithProviders('/insights');
    expect(await findByRole('heading', { name: /insights/i })).toBeTruthy();
  });
  it('renders Style Guide page', async () => {
    const { findByRole } = renderWithProviders('/style-guide');
    expect(await findByRole('heading', { name: /style guide/i })).toBeTruthy();
  });
  it('renders NotFound page', async () => {
    const { findByRole } = renderWithProviders('/does-not-exist');
    expect(await findByRole('heading', { name: /page not found/i })).toBeTruthy();
    expect(await findByRole('link', { name: /back to overview/i })).toBeTruthy();
  });
});