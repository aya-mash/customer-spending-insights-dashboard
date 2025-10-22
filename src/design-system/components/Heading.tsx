/**
 * HEADING COMPONENT
 * Semantic heading component with levels 1-4
 */

import React, { forwardRef, useMemo, type CSSProperties, type ReactNode, type HTMLAttributes } from 'react';
import { fontSize, fontWeight, lineHeight } from '../tokens';
import { useTheme } from '../index';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Semantic heading level (1-4 corresponds to h1-h4) */
  level: 1 | 2 | 3 | 4;
  /** Content to display in the heading */
  children: ReactNode;
}

export const Heading = React.memo(
  forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ level, children, style, ...props }, ref) => {
      const { text: textColors } = useTheme();
      
      const headingStyles = useMemo(() => {
        const fontSizeMap = {
          1: fontSize.h1,
          2: fontSize.h2,
          3: fontSize.h3,
          4: fontSize.h4,
        };

        return createDynamicStyles({
          fontSize: fontSizeMap[level],
          fontWeight: fontWeight.bold,
          lineHeight: lineHeight.tight,
          color: textColors.strong,
          margin: 0,
        });
      }, [level, textColors]);

      const Component: 'h1' | 'h2' | 'h3' | 'h4' = `h${level}`;

      return React.createElement(
        Component,
        // eslint-disable-next-line react-hooks/refs -- forwardRef pattern requires passing ref
        { ref, style: { ...headingStyles, ...style }, ...props },
        children
      );
    }
  )
);

Heading.displayName = 'Heading';

