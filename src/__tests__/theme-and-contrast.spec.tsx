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
  it('is hidden without devtools flag', () => {
    const { queryByLabelText } = renderApp('/');
    expect(queryByLabelText(/contrast checker/i)).toBeNull();
  });
  it('appears with devtools flag', () => {
    const { getByRole } = renderApp('/', '?devtools=1');
    const fab = getByRole('button', { name: /toggle contrast checker/i });
    expect(fab).toBeTruthy();
    fireEvent.click(fab);
    expect(getByRole('dialog', { name: /contrast checker/i })).toBeTruthy();
  });
});