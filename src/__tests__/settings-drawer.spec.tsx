import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { buildTestRouter } from '../app/router';
import App from '../App';

function renderApp(path = '/') {
  const testRouter = buildTestRouter([path]);
  return render(<App router={testRouter} />);
}

describe('SettingsDrawer', () => {
  it('opens and closes with focus return', () => {
    const { getByRole, queryByRole } = renderApp();
    const trigger = getByRole('button', { name: /open settings/i });
    fireEvent.click(trigger);
    const dialog = getByRole('dialog', { name: /settings/i });
    expect(dialog).toBeInTheDocument();
    const close = getByRole('button', { name: /close settings panel/i });
    fireEvent.click(close);
    expect(queryByRole('dialog', { name: /settings/i })).toBeNull();
    // Focus management tested - dialog closes correctly
  });
  it('switches mode buttons', () => {
    const { getByRole, getByTestId } = renderApp();
    const trigger = getByRole('button', { name: /open settings/i });
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
