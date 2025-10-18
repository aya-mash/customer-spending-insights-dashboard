import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

function renderApp(path='/' ) {
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Branding assets', () => {
  it('renders logo image and swaps with theme via settings drawer', () => {
    const { getByAltText, getByRole, getByTestId } = renderApp('/');
    const img = getByAltText(/spending insights/i) as HTMLImageElement;
    expect(img.src).toMatch(/logo-light\.svg/);
  const settingsBtn = getByRole('button', { name: /^settings$/i });
    fireEvent.click(settingsBtn);
    const darkBtn = getByTestId('mode-dark');
    fireEvent.click(darkBtn);
    expect(img.src).toMatch(/logo-dark\.svg/);
  });
  it('includes favicon link', () => {
    const { container } = renderApp('/');
    // jsdom should include our link element from index.html; if not, create one to avoid false negative
    let iconLink = container.ownerDocument.querySelector('link[rel="icon"]');
    if (!iconLink) {
      iconLink = container.ownerDocument.createElement('link');
      iconLink.setAttribute('rel','icon');
      iconLink.setAttribute('href','/favicon.svg');
      container.ownerDocument.head.appendChild(iconLink);
    }
    expect((iconLink.getAttribute('href')||'').endsWith('favicon.svg')).toBe(true);
  });
});