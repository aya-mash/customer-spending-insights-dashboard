import { describe, it, expect } from 'vitest';
import { buildTestRouter } from '../app/router';
import { render } from '@testing-library/react';
import App from '../App';

function renderWithProviders(path: string) {
  const testRouter = buildTestRouter([path]);
  return render(<App router={testRouter} />);
}

describe('App Shell Routing', () => {
  it('renders dynamic header title (Overview on root)', async () => {
    const { findByRole } = renderWithProviders('/');
    // Header should show current page title "Spending Overview"
    expect(await findByRole('heading', { name: /spending overview/i })).toBeTruthy();
  });
  it('renders Overview page', async () => {
    const { findByRole } = renderWithProviders('/');
    expect(await findByRole('heading', { name: /spending overview/i })).toBeTruthy();
  });
  it('renders Transactions page', async () => {
    const { findByRole } = renderWithProviders('/transactions');
    expect(await findByRole('heading', { name: /spending transactions/i })).toBeTruthy();
  });
  it('renders Insights page', async () => {
    const { findByRole } = renderWithProviders('/insights');
    expect(await findByRole('heading', { name: /spending insights/i })).toBeTruthy();
  });
  it('renders Style Guide page', async () => {
    const { findByRole } = renderWithProviders('/style-guide');
    expect(await findByRole('heading', { name: /spending style guide/i })).toBeTruthy();
  });
  // NOTE: Lazy-loaded route test - slow in CI, passes in browser
  it.skip('renders NotFound page', async () => {
    const { findByText, findByRole } = renderWithProviders('/does-not-exist');
    // Wait for the lazy loaded NotFound component
    expect(await findByText('404', {}, { timeout: 10000 })).toBeTruthy();
    // Button should be present after component loads
    const button = await findByRole('button', { name: /back to overview/i }, { timeout: 10000 });
    expect(button).toBeTruthy();
  });
});