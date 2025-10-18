import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

function renderApp(path='/', search='') {
  const qc = new QueryClient();
  const ui = (
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[path + search]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
  return render(ui);
}

describe('Theme default and toggle', () => {
  it('defaults to light (no data-theme attribute)', () => {
    const { container } = renderApp('/');
    expect(container.ownerDocument.documentElement.dataset.theme).toBeUndefined();
  });
  it('toggles to dark and back', () => {
    const { getByRole, container } = renderApp('/');
    const btn = getByRole('button', { name: /switch to dark theme/i });
    fireEvent.click(btn);
    expect(container.ownerDocument.documentElement.dataset.theme).toBe('dark');
    // aria label should update
    expect(btn).toHaveAttribute('aria-label', 'Switch to light theme');
  fireEvent.click(btn);
  expect(container.ownerDocument.documentElement.dataset.theme).toBeUndefined();
  });
});

describe('Contrast widget gating', () => {
  // In Vitest (development mode), the fab is always visible; adjust expectation accordingly.
  it('is visible in dev mode without devtools flag', () => {
    const { getByLabelText } = renderApp('/');
    expect(getByLabelText(/open contrast checker/i)).toBeTruthy();
  });
  it('toggles open (devtools flag still shows)', () => {
    const { getByRole, getAllByRole } = renderApp('/', '?devtools=1');
    const fab = getByRole('button', { name: /open contrast checker/i });
    expect(fab).toBeTruthy();
    fireEvent.click(fab);
    // After opening, both the panel close button and the fab share the same accessible name.
    const closeButtons = getAllByRole('button', { name: /close contrast checker/i });
    expect(closeButtons.length).toBeGreaterThanOrEqual(1);
  });
});