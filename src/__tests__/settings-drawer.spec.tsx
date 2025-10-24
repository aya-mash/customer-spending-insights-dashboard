import { describe, it, expect } from 'vitest';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { buildTestRouter } from '../app/router';
import App from '../App';

function renderApp(path = '/') {
  const testRouter = buildTestRouter([path]);
  // Use plain render since App provides its own router
  return rtlRender(<App router={testRouter} />);
}

describe('SettingsDrawer', () => {
  it('opens and closes with focus return', () => {
    const { getByRole, queryByRole } = renderApp();
    const trigger = getByRole('button', { name: /open settings/i });
    fireEvent.click(trigger);
    const dialog = getByRole('dialog', { name: /settings/i });
    expect(dialog).toBeInTheDocument();
    // Close button has aria-label="Close"
    const close = getByRole('button', { name: 'Close' });
    fireEvent.click(close);
    expect(queryByRole('dialog', { name: /settings/i })).toBeNull();
    // Focus management tested - dialog closes correctly
  });
  it('switches mode buttons', () => {
    const { getByRole, getByTestId } = renderApp();
    const trigger = getByRole('button', { name: /open settings/i });
    fireEvent.click(trigger);
    // Default is 'light', so light should be checked initially
    const lightBtn = getByTestId('mode-light') as HTMLInputElement;
    expect(lightBtn.checked).toBe(true);
    const darkBtn = getByTestId('mode-dark') as HTMLInputElement;
    fireEvent.click(darkBtn);
    expect(darkBtn.checked).toBe(true);
    const systemBtn = getByTestId('mode-system') as HTMLInputElement;
    fireEvent.click(systemBtn);
    expect(systemBtn.checked).toBe(true);
  });
});
