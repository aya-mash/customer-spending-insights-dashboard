/**
 * TEXT COMPONENT
 * Typography component for body text with variants and colors
 */

import React, { forwardRef, useMemo, type CSSProperties, type ReactNode, type HTMLAttributes } from 'react';
import { fontSize, fontWeight, lineHeight, text as textColors, type FontWeight } from '../tokens';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Text size variant */
  variant?: 'body' | 'bodyLg' | 'bodySm' | 'caption';
  /** Text color */
  color?: 'primary' | 'muted' | 'strong' | 'inverse' | 'disabled';
  /** Font weight */
  weight?: FontWeight;
  /** Text content */
  children: ReactNode;
}

export const Text = React.memo(
  forwardRef<HTMLParagraphElement, TextProps>(
    ({ variant = 'body', color = 'primary', weight, children, style, ...props }, ref) => {
      const textStyles = useMemo(() => {
        const variantMap: Record<string, string> = {
          bodyLg: fontSize.bodyLg,
          body: fontSize.body,
          bodySm: fontSize.bodySm,
          caption: fontSize.caption,
        };

        const colorMap = {
          primary: textColors.primary,
          muted: textColors.muted,
          strong: textColors.strong,
          inverse: textColors.inverse,
          disabled: textColors.disabled,
        };

        return createDynamicStyles({
          fontSize: variantMap[variant],
          fontWeight: weight ? fontWeight[weight] : fontWeight.regular,
          lineHeight: lineHeight.normal,
          color: colorMap[color],
          margin: 0,
        });
      }, [variant, color, weight]);

      return (
        <p ref={ref} style={{ ...textStyles, ...style }} {...props}>
          {children}
        </p>
      );
    }
  )
);

Text.displayName = 'Text';

