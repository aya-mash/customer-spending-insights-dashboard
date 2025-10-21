/**
 * TABS COMPONENT
 * Neomorphic tab navigation with accessible keyboard support
 * Container is debossed (inset), inactive tabs debossed, active tab raised
 */

import React, { type CSSProperties } from 'react';
import { radius, spacing } from '../tokens';

export interface TabItem {
  key: string;
  label: string;
  'aria-label'?: string;
}

export interface TabsProps {
  /** Array of tab items */
  items: TabItem[];
  /** Currently active tab key */
  activeTab: string;
  /** Callback when tab changes */
  onChange: (key: string) => void;
  /** Optional ARIA label for the tab list */
  'aria-label'?: string;
  /** Optional className for custom styling */
  className?: string;
}

export const Tabs = React.memo<TabsProps>(({
  items,
  activeTab,
  onChange,
  'aria-label': ariaLabel = 'Tabs',
  className,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let newIndex = currentIndex;
    
    if (e.key === 'ArrowRight' || e.key === 'Right') {
      e.preventDefault();
      newIndex = (currentIndex + 1) % items.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
      e.preventDefault();
      newIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = items.length - 1;
    }
    
    if (newIndex !== currentIndex) {
      onChange(items[newIndex].key);
    }
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    gap: spacing[2],
    padding: spacing[2],
    backgroundColor: 'var(--color-surface)',
    borderRadius: radius.lg,
    boxShadow: 'var(--shadow-neumorphic-inset)',
    width: 'fit-content',
  };

  const getTabStyle = (isActive: boolean): CSSProperties => ({
    flex: '1 1 auto',
    padding: `${spacing[3]} ${spacing[6]}`,
    border: 'none',
    borderRadius: radius.md,
    backgroundColor: isActive ? 'var(--color-surface)' : 'transparent',
    boxShadow: isActive ? 'var(--shadow-neumorphic-sm)' : 'var(--shadow-neumorphic-pressed)',
    transform: isActive ? 'translateY(-1px)' : 'none',
    color: isActive ? 'var(--color-text-strong)' : 'var(--color-text-muted)',
    fontWeight: isActive ? 600 : 400,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    outline: 'none',
  });

  return (
    <div 
      role="tablist" 
      aria-label={ariaLabel} 
      style={containerStyle}
      className={className}
    >
      {items.map((item, index) => {
        const isActive = activeTab === item.key;
        return (
          <button
            key={item.key}
            role="tab"
            id={`tab-${item.key}`}
            aria-controls={`panel-${item.key}`}
            aria-selected={isActive}
            aria-label={item['aria-label'] || item.label}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(item.key)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={getTabStyle(isActive)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
});

Tabs.displayName = 'Tabs';
