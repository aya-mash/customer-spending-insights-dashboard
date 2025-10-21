/**
 * HEADING COMPONENT
 * Semantic heading component with levels 1-4
 */

import React, { forwardRef, useMemo, type CSSProperties, type ReactNode, type HTMLAttributes } from 'react';
import { fontSize, fontWeight, lineHeight, text as textColors } from '../tokens';

function createDynamicStyles(styles: CSSProperties): CSSProperties {
  return styles;
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4;
  children: ReactNode;
}

export const Heading = React.memo(
  forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ level, children, style, ...props }, ref) => {
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
      }, [level]);

      const Component = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';

      return React.createElement(
        Component,
        { ref, style: { ...headingStyles, ...style }, ...props },
        children
      );
    }
  )
);

Heading.displayName = 'Heading';

