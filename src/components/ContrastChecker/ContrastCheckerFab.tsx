import { useState, useEffect } from 'react';
import { ContrastCheckerPanel } from './ContrastCheckerPanel';

// Dev-only floating action button for contrast checker tool.
// Visible when in dev mode (import.meta.env.DEV) or URL contains ?devtools=1 or ?contrastWidget=1.
export function ContrastCheckerDev() {
  // Show in dev and test environments (hidden in production) for accessibility and test coverage.
  const enabled = import.meta.env.DEV || import.meta.env.MODE === 'test';
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