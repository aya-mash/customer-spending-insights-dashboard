/**
 * PAGE LAYOUT COMPONENT
 * Standard page wrapper with title, subtitle, actions, and max-width constraint
 */

import React, { forwardRef, useMemo, type CSSProperties, type ReactNode, type HTMLAttributes } from 'react';
import { spacing, spacingNum, fontSize, fontWeight, lineHeight } from '../tokens';
import { useTheme, useIsMobile } from '../index';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

export interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional page title */
  title?: string;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Optional action buttons or controls */
  actions?: ReactNode;
  /** Main content of the page */
  children: ReactNode;
}

export const PageLayout = React.memo(
  forwardRef<HTMLDivElement, PageLayoutProps>(
    ({ title, subtitle, actions, children, style, ...props }, ref) => {
      const { text: textColors } = useTheme();
      const isMobile = useIsMobile();
      const padding = isMobile ? spacingNum[4] : spacingNum[6];

      const containerStyles = useMemo(() => createDynamicStyles({
        maxWidth: '1440px',
        margin: '0 auto',
        padding: `${padding}px`,
      }), [padding]);

      const headerStyles = useMemo(() => createDynamicStyles({
        marginBottom: spacing[8],
      }), []);

      const titleRowStyles = useMemo(() => createDynamicStyles({
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: spacing[4],
        flexWrap: 'wrap',
      }), []);

      const titleStyles = useMemo(() => createDynamicStyles({
        fontSize: isMobile ? fontSize.h2 : fontSize.h1,
        fontWeight: fontWeight.bold,
        color: textColors.strong,
        lineHeight: lineHeight.tight,
        margin: 0,
      }), [isMobile, textColors.strong]);

      const subtitleStyles = useMemo(() => createDynamicStyles({
        fontSize: fontSize.body,
        color: textColors.muted,
        marginTop: spacing[2],
      }), [textColors.muted]);

      return (
        <div ref={ref} style={{ ...containerStyles, ...style }} {...props}>
          {(title || subtitle || actions) && (
            <header style={headerStyles}>
              <div style={titleRowStyles}>
                <div>
                  {title && <h1 style={titleStyles}>{title}</h1>}
                  {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
                </div>
                {actions && <div>{actions}</div>}
              </div>
            </header>
          )}
          {children}
        </div>
      );
    }
  )
);

PageLayout.displayName = 'PageLayout';

