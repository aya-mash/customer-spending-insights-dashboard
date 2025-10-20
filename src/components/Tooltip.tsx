import { forwardRef } from 'react';
import type { ComponentProps } from 'react';

export interface TooltipProps extends ComponentProps<'div'> {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(({
  content,
  position = 'top',
  delay = 300,
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`tooltip-wrapper ${className}`}
      data-tooltip={content}
      data-tooltip-position={position}
      data-tooltip-delay={delay}
      {...props}
    >
      {children}
      <div className={`tooltip tooltip--${position}`} role="tooltip">
        {content}
      </div>
    </div>
  );
});

Tooltip.displayName = 'Tooltip';