import { useState, useEffect } from 'react';
import { ContrastCheckerPanel } from './ContrastCheckerPanel';
import { config } from '../../config/env';

// Dev-only floating action button for contrast checker tool.
// Visible when in dev mode for accessibility testing.
export function ContrastCheckerDev() {
  // Show in dev and test environments (hidden in production) for accessibility and test coverage.
  const enabled = config.isDevelopment;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) setOpen(false);
    }
    globalThis.addEventListener('keydown', onKey);
    return () => globalThis.removeEventListener('keydown', onKey);
  }, [open]);
  if (!enabled) return null;
  return (
    <>
      {open && <div className="contrast-backdrop" aria-hidden="true" onClick={() => setOpen(false)} />}
      {open && <ContrastCheckerPanel onClose={() => setOpen(false)} />}
      <button
        type="button"
        className="contrast-fab"
        aria-label="Toggle contrast checker"
        onClick={() => setOpen(o => !o)}
      >
        ⚖️
      </button>
    </>
  );
}