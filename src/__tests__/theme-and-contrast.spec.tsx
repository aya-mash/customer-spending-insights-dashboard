import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

function renderApp(path = '/') {
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Theme with SettingsDrawer', () => {
  it('defaults to system (no data-theme attribute and no localStorage key)', () => {
    const { container } = renderApp('/');
    expect(container.ownerDocument.documentElement.dataset.theme).toBeUndefined();
    expect(localStorage.getItem('theme-choice')).toBeNull();
  });
  it('selecting Dark sets data-theme and localStorage, selecting System clears both', () => {
    const { getByRole, getByTestId, container } = renderApp('/');
  const settingsBtn = getByRole('button', { name: /^settings$/i });
    fireEvent.click(settingsBtn);
    const darkBtn = getByTestId('mode-dark');
    fireEvent.click(darkBtn);
    expect(container.ownerDocument.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('theme-choice')).toBe('dark');
    const systemBtn = getByTestId('mode-system');
    fireEvent.click(systemBtn);
    expect(container.ownerDocument.documentElement.dataset.theme).toBeUndefined();
    expect(localStorage.getItem('theme-choice')).toBeNull();
  });
  it('selecting Light sets explicit data-theme="light" and persists', () => {
    const { getByRole, getByTestId, container } = renderApp('/');
  const settingsBtn = getByRole('button', { name: /^settings$/i });
    fireEvent.click(settingsBtn);
    const lightBtn = getByTestId('mode-light');
    fireEvent.click(lightBtn);
    expect(container.ownerDocument.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('theme-choice')).toBe('light');
  });
});

describe('Contrast widget gating', () => {
  it('is hidden in test environment (dev only feature)', () => {
    const { queryByRole } = renderApp('/');
    expect(queryByRole('button', { name: /toggle contrast checker/i })).toBeNull();
  });
});
