/**
 * FILTER DRAWER COMPONENT
 * Mobile-optimized drawer for filters with slide-up animation
 */

import { forwardRef, useEffect, useRef, type ReactNode, type CSSProperties } from 'react';
import { X, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { spacingNum, radius, zIndex } from '../tokens';
import { useTheme } from '../index';
import { Heading } from './Heading';
import { Stack } from './Stack';
import { Button } from './Button';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

export interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  onClear?: () => void;
  activeFilterCount?: number;
}

export const FilterDrawer = forwardRef<HTMLElement, FilterDrawerProps>(
  ({ open, onClose, children, onClear, activeFilterCount = 0 }, ref) => {
    const panelRef = useRef<HTMLElement | null>(null);
    const { surface, text: textColors } = useTheme();
    const { t } = useTranslation();

    // Close on Escape
    useEffect(() => {
      function onKey(e: KeyboardEvent) {
        if (e.key === 'Escape' && open) onClose();
      }
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    // Focus trap and auto-focus
    useEffect(() => {
      if (open && panelRef.current) {
        const buttons = panelRef.current.querySelectorAll<HTMLElement>('button');
        const focusTarget = buttons.length > 0 ? buttons.item(0) : null;
        focusTarget?.focus();
      }
    }, [open]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [open]);

    if (!open) return null;

    const overlayStyles = createDynamicStyles({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: surface.overlay,
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      zIndex: zIndex.modalBackdrop,
      animation: 'fadeIn 250ms ease-out',
    });

    const drawerStyles = createDynamicStyles({
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      maxHeight: '85vh',
      backgroundColor: surface.card,
      border: 'none',
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      zIndex: zIndex.modal,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideInUp 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
    });

    const headerStyles = createDynamicStyles({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${spacingNum[4]}px ${spacingNum[4]}px ${spacingNum[3]}px`,
      borderBottom: `1px solid ${surface.border}`,
      flexShrink: 0,
    });

    const titleGroupStyles = createDynamicStyles({
      display: 'flex',
      alignItems: 'center',
      gap: `${spacingNum[2]}px`,
    });

    const contentStyles = createDynamicStyles({
      padding: `${spacingNum[4]}px`,
      overflowY: 'auto',
      flex: 1,
    });

    const footerStyles = createDynamicStyles({
      padding: `${spacingNum[3]}px ${spacingNum[4]}px ${spacingNum[4]}px`,
      borderTop: `1px solid ${surface.border}`,
      display: 'flex',
      gap: `${spacingNum[3]}px`,
      flexShrink: 0,
    });

    const closeButtonStyles = createDynamicStyles({
      background: 'transparent',
      border: 'none',
      padding: `${spacingNum[2]}px`,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.sm,
      color: textColors.muted,
      transition: 'all 200ms ease',
    });

    return (
      <>
        <div
          style={overlayStyles}
          onClick={onClose}
          aria-hidden="true"
        />
        <aside
          ref={(node) => {
            panelRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label={t('transactions.filters')}
          style={drawerStyles}
        >
          <header style={headerStyles}>
            <div style={titleGroupStyles}>
              <Filter size={20} color={textColors.primary} />
              <Heading level={3}>
                {t('transactions.filters')}
                {activeFilterCount > 0 && (
                  <span style={{ 
                    marginLeft: '8px', 
                    fontSize: '14px', 
                    fontWeight: 400,
                    color: textColors.muted 
                  }}>
                    ({activeFilterCount})
                  </span>
                )}
              </Heading>
            </div>
            <button
              onClick={onClose}
              aria-label={t('common.close')}
              style={closeButtonStyles}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = surface.hover;
                e.currentTarget.style.color = textColors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = textColors.muted;
              }}
            >
              <X size={20} />
            </button>
          </header>

          <div style={contentStyles}>
            <Stack spacing={4}>
              {children}
            </Stack>
          </div>

          <footer style={footerStyles}>
            {onClear && activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="medium"
                onClick={onClear}
                style={{ flex: 1 }}
              >
                {t('transactions.clearAll')}
              </Button>
            )}
            <Button
              variant="primary"
              size="medium"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              {t('common.apply')}
            </Button>
          </footer>
        </aside>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideInUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `}</style>
      </>
    );
  }
);

FilterDrawer.displayName = 'FilterDrawer';
