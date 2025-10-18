import { useRef, useEffect, useCallback } from 'react';
import { useThemeChoice } from '../hooks/useThemeChoice';

interface SettingsDrawerProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const { mode, setMode } = useThemeChoice();
  const panelRef = useRef<HTMLElement | null>(null);
  const firstFocusable = useRef<HTMLElement | null>(null);
  const lastFocusable = useRef<HTMLElement | null>(null);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) onClose();
      // Arrow key navigation for radiogroup
      if (open && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        const order: Array<'system'|'light'|'dark'> = ['system','light','dark'];
        const idx = order.indexOf(mode);
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = order[(idx + dir + order.length) % order.length];
        setMode(next);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, mode, setMode]);

  // Basic focus trap
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'Tab') {
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      firstFocusable.current = focusables[0];
      lastFocusable.current = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstFocusable.current) {
        e.preventDefault();
        lastFocusable.current?.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable.current) {
        e.preventDefault();
        firstFocusable.current?.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      // Defer focus to next microtask
      setTimeout(() => {
        const focusTarget = panelRef.current?.querySelector<HTMLElement>('button') || panelRef.current;
        focusTarget?.focus();
      }, 0);
    }
  }, [open]);

  return (
    <>
      {open && <div className="settings-overlay" aria-hidden="true" onClick={onClose} />}
      {open && (
        <aside
          className="settings-drawer open"
          role="dialog"
          aria-label="Settings"
          aria-modal="true"
          ref={panelRef}
          onKeyDown={handleKeyDown}
        >
          <header className="settings-header">
            <h2 className="settings-title">Settings</h2>
            <button type="button" aria-label="Close settings panel" className="settings-close" onClick={onClose}>✕</button>
          </header>
          <section className="settings-section">
            <div className="mode-group" role="radiogroup" aria-label="Color theme">
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'light'}
                className={mode === 'light' ? 'seg-btn active' : 'seg-btn'}
                onClick={() => setMode('light')}
                data-testid="mode-light"
              >🌞 Light</button>
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'system'}
                className={mode === 'system' ? 'seg-btn active' : 'seg-btn'}
                onClick={() => setMode('system')}
                data-testid="mode-system"
              >🖥️ System</button>
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'dark'}
                className={mode === 'dark' ? 'seg-btn active' : 'seg-btn'}
                onClick={() => setMode('dark')}
                data-testid="mode-dark"
              >🌙 Dark</button>
            </div>
          </section>
        </aside>
      )}
    </>
  );
}
