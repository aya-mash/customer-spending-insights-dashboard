import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

function renderApp() {
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/']}> <App /> </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('SettingsDrawer', () => {
  it('opens and closes with focus return', () => {
    const { getByRole, queryByRole } = renderApp();
    const trigger = getByRole('button', { name: /^settings$/i });
    fireEvent.click(trigger);
  const dialog = getByRole('dialog', { name: /settings/i });
  expect(dialog).toBeInTheDocument();
  const close = getByRole('button', { name: /close settings panel/i });
    fireEvent.click(close);
    expect(queryByRole('dialog', { name: /settings/i })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
  it('switches mode buttons', () => {
    const { getByRole, getByTestId } = renderApp();
    const trigger = getByRole('button', { name: /^settings$/i });
    fireEvent.click(trigger);
    const lightBtn = getByTestId('mode-light');
    const systemBtn = getByTestId('mode-system');
    const darkBtn = getByTestId('mode-dark');
    // Default is system
    expect(systemBtn).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(darkBtn);
    expect(darkBtn).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(lightBtn);
    expect(lightBtn).toHaveAttribute('aria-checked', 'true');
  });
});
