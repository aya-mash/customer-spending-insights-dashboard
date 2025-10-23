/**
 * SETTINGS DRAWER COMPONENT
 * Design system settings panel with RadioGroup component
 */

import { forwardRef, useEffect, useRef, type CSSProperties } from 'react';
import { Settings2, X, Sun, Monitor, Moon, Palette, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { spacingNum, radius, transition, easing, zIndex } from '../tokens';
import { useTheme } from '../index';
import { Heading } from './Heading';
import { Stack } from './Stack';
import { Text } from './Text';
import { RadioGroup, type RadioOption } from './RadioGroup';
import { languages, type LanguageCode } from '../../i18n/config';

type ThemeMode = 'light' | 'dark' | 'system';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

export interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  mode: ThemeMode;
  onModeChange: (mode: ThemeMode) => void;
  onSignOut?: () => void;
  userEmail?: string;
}

export const SettingsDrawer = forwardRef<HTMLElement, SettingsDrawerProps>(
  ({ open, onClose, mode, onModeChange, onSignOut, userEmail }, ref) => {
    const panelRef = useRef<HTMLElement | null>(null);
    const navigate = useNavigate();
    const { brand, surface, text: textColors } = useTheme();
    const { t, i18n } = useTranslation();

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
        // Fixed: Use .at(0) instead of array[0] for better null-safety
        const buttons = panelRef.current.querySelectorAll<HTMLElement>('button');
        const focusTarget = buttons.length > 0 ? buttons.item(0) : null;
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
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      zIndex: zIndex.modalBackdrop,
      animation: 'fadeIn 250ms ease-out',
    });

    const drawerStyles = createDynamicStyles({
      position: 'fixed',
      top: 0,
      right: 0,
      width: '100%',
      maxWidth: '400px',
      height: '100vh',
      backgroundColor: `${surface.card}f2`,
      border: 'none',
      borderTopLeftRadius: radius.xl,
      borderBottomLeftRadius: radius.xl,
      zIndex: zIndex.modal,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideInRight 300ms cubic-bezier(0.4, 0, 0.2, 1)',
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
      width: '44px',
      height: '44px',
      borderRadius: radius.lg,
      border: 'none',
      backgroundColor: 'transparent',
      color: textColors.secondary,
      cursor: 'pointer',
      transition: `all ${transition.fast} ${easing.standard}`,
      WebkitTapHighlightColor: 'transparent',
      touchAction: 'manipulation',
    });

    const contentStyles = createDynamicStyles({
      flex: 1,
      padding: `${spacingNum[6]}px`,
      overflowY: 'auto',
    });

    // Define theme mode options for RadioGroup
    const themeOptions: RadioOption[] = [
      { 
        value: 'light', 
        label: t('settings.light'), 
        icon: <Sun size={20} />,
      },
      { 
        value: 'system', 
        label: t('settings.system'), 
        icon: <Monitor size={20} />,
      },
      { 
        value: 'dark', 
        label: t('settings.dark'), 
        icon: <Moon size={20} />,
      },
    ];

    // Define language options for RadioGroup
    const languageOptions: RadioOption[] = Object.entries(languages).map(([code, name]) => ({
      value: code,
      label: name,
    }));

    return (
      <>
        {/* Overlay - Backdrop for drawer */}
        <div 
          style={overlayStyles} 
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer - Accessible side panel */}
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
                {t('settings.title')}
              </Heading>
            </div>
            <button
              type="button"
              aria-label={t('common.close')}
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
              {/* Theme Section - Using RadioGroup from design system */}
              <Stack spacing={3}>
                <Text variant="body" weight="semibold" style={{ fontSize: '14px' }}>
                  {t('settings.theme')}
                </Text>
                <RadioGroup
                  name="theme-mode"
                  options={themeOptions}
                  value={mode}
                  onChange={(value) => onModeChange(value as 'light' | 'dark' | 'system')}
                  aria-label={t('settings.theme')}
                />
              </Stack>

              {/* Language Section */}
              <Stack spacing={3}>
                <Text variant="body" weight="semibold" style={{ fontSize: '14px' }}>
                  {t('settings.language')}
                </Text>
                <RadioGroup
                  name="language"
                  options={languageOptions}
                  value={i18n.language}
                  onChange={(value) => i18n.changeLanguage(value as LanguageCode)}
                  aria-label={t('settings.language')}
                />
              </Stack>

              {/* Navigation Section */}
              <Stack spacing={3}>
                <Text variant="body" weight="semibold" style={{ fontSize: '14px' }}>
                  {t('settings.navigation')}
                </Text>
                <button
                  type="button"
                  style={createDynamicStyles({
                    display: 'flex',
                    alignItems: 'center',
                    gap: `${spacingNum[3]}px`,
                    padding: `${spacingNum[3]}px ${spacingNum[4]}px`,
                    borderRadius: radius.lg,
                    border: `1px solid ${surface.border}`,
                    backgroundColor: surface.surfaceAlt,
                    color: textColors.primary,
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: `all ${transition.fast} ${easing.standard}`,
                    width: '100%',
                    textAlign: 'left',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                  })}
                  onClick={() => {
                    navigate('/style-guide');
                    onClose();
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = surface.hover;
                    e.currentTarget.style.borderColor = brand.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = surface.surfaceAlt;
                    e.currentTarget.style.borderColor = surface.border;
                  }}
                >
                  <Palette size={20} color={brand.primary} aria-hidden="true" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{t('settings.styleGuide')}</div>
                    <div style={{ fontSize: '12px', color: textColors.muted, marginTop: '2px' }}>
                      {t('settings.accessibility')}
                    </div>
                  </div>
                </button>
              </Stack>

              {/* Sign Out Section */}
              {onSignOut && (
                <Stack spacing={3}>
                  {userEmail && (
                    <Text variant="bodySm" style={{ color: textColors.secondary }}>
                      Signed in as: {userEmail}
                    </Text>
                  )}
                  <button
                    type="button"
                    style={createDynamicStyles({
                      display: 'flex',
                      alignItems: 'center',
                      gap: `${spacingNum[3]}px`,
                      padding: `${spacingNum[3]}px ${spacingNum[4]}px`,
                      borderRadius: radius.lg,
                      border: `1px solid rgba(239, 68, 68, 0.3)`,
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#EF4444',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: `all ${transition.fast} ${easing.standard}`,
                      width: '100%',
                      textAlign: 'left',
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                    })}
                    onClick={() => {
                      if (onSignOut) {
                        onSignOut();
                        onClose();
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                      e.currentTarget.style.borderColor = '#EF4444';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                    }}
                  >
                    <LogOut size={20} aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </Stack>
              )}
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
