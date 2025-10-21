/**
 * SETTINGS DRAWER COMPONENT
 * Design system settings panel with beautiful pill-style theme switcher
 */

import { forwardRef, useEffect, useRef, type CSSProperties } from 'react';
import { Settings2, X, Sun, Monitor, Moon } from 'lucide-react';
import { brand, surface, text as textColors, spacingNum, radius, transition, easing, zIndex } from '../tokens';
import { Heading } from './Heading';
import { Stack } from './Stack';
import { Text } from './Text';
import { useTheme } from '../useTheme';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

export interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  mode: 'light' | 'dark' | 'system';
  onModeChange: (mode: 'light' | 'dark' | 'system') => void;
}

export const SettingsDrawer = forwardRef<HTMLElement, SettingsDrawerProps>(
  ({ open, onClose, mode, onModeChange }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = useTheme(); // Force re-render on theme change
    const panelRef = useRef<HTMLElement | null>(null);

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
        const focusTarget = panelRef.current.querySelector<HTMLElement>('button');
        focusTarget?.focus();
      }
    }, [open]);

    if (!open) return null;

    const overlayStyles = createDynamicStyles({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: surface.overlay,
      zIndex: zIndex.overlay,
      animation: 'fadeIn 200ms ease-out',
    });

    const drawerStyles = createDynamicStyles({
      position: 'fixed',
      top: 0,
      right: 0,
      width: '100%',
      maxWidth: '360px',
      height: '100vh',
      backgroundColor: surface.card,
      boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.12)',
      zIndex: zIndex.drawer,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideInRight 250ms ease-out',
    });

    const headerStyles = createDynamicStyles({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${spacingNum[6]}px ${spacingNum[6]}px`,
      borderBottom: `1px solid ${surface.border}`,
    });

    const titleGroupStyles = createDynamicStyles({
      display: 'flex',
      alignItems: 'center',
      gap: `${spacingNum[3]}px`,
    });

    const closeButtonStyles = createDynamicStyles({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: radius.lg,
      border: 'none',
      backgroundColor: 'transparent',
      color: textColors.secondary,
      cursor: 'pointer',
      transition: `all ${transition.fast} ${easing.standard}`,
    });

    const contentStyles = createDynamicStyles({
      flex: 1,
      padding: `${spacingNum[6]}px`,
      overflowY: 'auto',
    });

    const modeGroupStyles = createDynamicStyles({
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: `${spacingNum[2]}px`,
      padding: `${spacingNum[4]}px`,
      backgroundColor: surface.surfaceAlt,
      borderRadius: radius.xl,
    });

    const modeButtonStyles = (isActive: boolean) => createDynamicStyles({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: `${spacingNum[2]}px`,
      padding: `${spacingNum[3]}px ${spacingNum[2]}px`,
      borderRadius: radius.lg,
      border: 'none',
      backgroundColor: isActive ? brand.primary : 'transparent',
      color: isActive ? textColors.inverse : textColors.primary,
      fontSize: '13px',
      fontWeight: isActive ? 600 : 500,
      cursor: 'pointer',
      transition: `all ${transition.fast} ${easing.standard}`,
    });

    const modes: Array<{ key: 'light' | 'dark' | 'system'; label: string; icon: React.ReactNode }> = [
      { key: 'light', label: 'Light', icon: <Sun size={20} /> },
      { key: 'system', label: 'System', icon: <Monitor size={20} /> },
      { key: 'dark', label: 'Dark', icon: <Moon size={20} /> },
    ];

    return (
      <>
        {/* Overlay */}
        <div style={overlayStyles} onClick={onClose} aria-hidden="true" />

        {/* Drawer */}
        <aside
          ref={(node) => {
            panelRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          style={drawerStyles}
          role="dialog"
          aria-label="Settings"
          aria-modal="true"
        >
          {/* Header */}
          <header style={headerStyles}>
            <div style={titleGroupStyles}>
              <Settings2 size={20} color={brand.primary} aria-hidden="true" />
              <Heading level={2} style={{ fontSize: '18px', margin: 0 }}>
                Settings
              </Heading>
            </div>
            <button
              type="button"
              aria-label="Close settings panel"
              style={closeButtonStyles}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = surface.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>

          {/* Content */}
          <div style={contentStyles}>
            <Stack spacing={6}>
              {/* Theme Section */}
              <Stack spacing={3}>
                <Text variant="body" weight="semibold" style={{ fontSize: '14px' }}>
                  Appearance
                </Text>
                <div style={modeGroupStyles} role="radiogroup" aria-label="Color theme">
                  {modes.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      role="radio"
                      aria-checked={mode === item.key}
                      style={modeButtonStyles(mode === item.key)}
                      onClick={() => onModeChange(item.key)}
                      onMouseEnter={(e) => {
                        if (mode !== item.key) {
                          e.currentTarget.style.backgroundColor = surface.hover;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (mode !== item.key) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
                <Text variant="bodySm" color="muted">
                  Choose how the dashboard looks. System matches your device settings.
                </Text>
              </Stack>
            </Stack>
          </div>
        </aside>

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}
        </style>
      </>
    );
  }
);

SettingsDrawer.displayName = 'SettingsDrawer';
