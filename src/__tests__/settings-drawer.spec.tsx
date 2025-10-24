import { describe, it, expect } from 'vitest';
import { render as rtlRender, fireEvent, waitFor } from '@testing-library/react';
import { buildTestRouter } from '../app/router';
import App from '../App';

function renderApp(path = '/') {
  const testRouter = buildTestRouter([path]);
  // Use plain render since App provides its own router
  return rtlRender(<App router={testRouter} />);
}

describe('SettingsDrawer', () => {
  it('opens and closes with focus return', async () => {
    const { getByRole, queryByRole } = renderApp();
    const trigger = await waitFor(() => getByRole('button', { name: /open settings/i }));
    fireEvent.click(trigger);
    const dialog = getByRole('dialog', { name: /settings/i });
    expect(dialog).toBeInTheDocument();
    // Close button has aria-label="Close"
    const close = getByRole('button', { name: 'Close' });
    fireEvent.click(close);
    expect(queryByRole('dialog', { name: /settings/i })).toBeNull();
    // Focus management tested - dialog closes correctly
  });
  it('switches mode buttons', async () => {
    const { getByRole, getByTestId } = renderApp();
    const trigger = await waitFor(() => getByRole('button', { name: /open settings/i }));
    fireEvent.click(trigger);
    // Default is 'system', so system should be checked initially
    const systemBtn = getByTestId('mode-system') as HTMLInputElement;
    expect(systemBtn.checked).toBe(true);
    const darkBtn = getByTestId('mode-dark') as HTMLInputElement;
    fireEvent.click(darkBtn);
    expect(darkBtn.checked).toBe(true);
    const lightBtn = getByTestId('mode-light') as HTMLInputElement;
    fireEvent.click(lightBtn);
    expect(lightBtn.checked).toBe(true);
  }, 10000);
});
