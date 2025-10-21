/**
 * CONTRAST CHECKER FAB - Soft Modern Design
 * Floating action button for dev-only contrast checker
 */

import { useState, useEffect, type CSSProperties } from 'react';
import { ContrastCheckerPanel } from './ContrastCheckerPanel';
import { brand, surface, radius, spacing, transition, easing } from '../tokens';
import { Palette } from 'lucide-react';
import { config } from '../../config/env';

export function ContrastCheckerDev() {
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

  const backdropStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: surface.overlay,
    zIndex: 1399,
    animation: 'fadeIn 200ms ease-out',
  };

  const fabStyle: CSSProperties = {
    position: 'fixed',
    bottom: spacing[6],
    right: spacing[6],
    width: '56px',
    height: '56px',
    borderRadius: radius.full,
    backgroundColor: brand.primary,
    color: '#FFFFFF',
    border: 'none',
    boxShadow: 'var(--shadow-neumorphic-md)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1500,
    transition: `all ${transition.normal} ${easing.standard}`,
  };

  return (
    <>
      {open && (
        <div
          style={backdropStyle}
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}
      {open && <ContrastCheckerPanel onClose={() => setOpen(false)} />}
      <button
        type="button"
        style={fabStyle}
        aria-label="Toggle contrast checker"
        onClick={() => setOpen(o => !o)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = 'var(--shadow-neumorphic-lg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'var(--shadow-neumorphic-md)';
        }}
      >
        <Palette size={24} />
      </button>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}