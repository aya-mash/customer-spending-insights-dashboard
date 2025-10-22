/**
 * DIALOG COMPONENT
 * Modal dialog with backdrop for forms and confirmations
 */

import { useEffect, type ReactNode, type CSSProperties } from 'react';
import { radius, spacing } from '../tokens';
import { useTheme } from '../index';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  showBackdrop?: boolean;
}

export function Dialog({
  isOpen,
  onClose,
  children,
  maxWidth = '600px',
  showBackdrop = true,
}: Readonly<DialogProps>) {
  const { surface } = useTheme();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const backdropStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
    padding: spacing[4],
  };

  const dialogStyle: CSSProperties = {
    backgroundColor: surface.surface,
    borderRadius: radius.lg,
    padding: spacing[6],
    maxWidth,
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  };

  return (
    <div
      style={backdropStyle}
      onClick={(e) => {
        if (e.target === e.currentTarget && showBackdrop) {
          onClose();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
      tabIndex={-1}
    >
      <div style={dialogStyle} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
}
