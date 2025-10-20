import { useState, useRef, useEffect } from 'react';
import type { ReactNode, KeyboardEvent } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveId?: string;
  onTabChange?: (activeId: string) => void;
  className?: string;
  variant?: 'default' | 'pills';
}

export function Tabs({ items, defaultActiveId, onTabChange, className = '', variant = 'default' }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultActiveId || items[0]?.id || '');
  const tabListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultActiveId && defaultActiveId !== activeId) {
      setActiveId(defaultActiveId);
    }
  }, [defaultActiveId, activeId]);

  const handleTabClick = (tabId: string) => {
    setActiveId(tabId);
    onTabChange?.(tabId);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const currentIndex = items.findIndex(item => item.id === activeId);
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    const newTab = items[newIndex];
    if (newTab && !newTab.disabled) {
      handleTabClick(newTab.id);
      const tabElement = tabListRef.current?.querySelector(`[data-tab-id="${newTab.id}"]`) as HTMLElement;
      tabElement?.focus();
    }
  };

  const baseClasses = variant === 'pills' ? 'tabs tabs--pills' : 'tabs';
  const classes = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <div className="tabs-container">
      <div
        ref={tabListRef}
        role="tablist"
        className={classes}
        onKeyDown={handleKeyDown}
        aria-label="Content tabs"
      >
        {items.map((item) => (
          <button
            key={item.id}
            data-tab-id={item.id}
            role="tab"
            id={`tab-${item.id}`}
            aria-controls={`panel-${item.id}`}
            aria-selected={activeId === item.id}
            tabIndex={activeId === item.id ? 0 : -1}
            className={`tab ${activeId === item.id ? 'active' : ''}`}
            onClick={() => handleTabClick(item.id)}
            disabled={item.disabled}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          id={`panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${item.id}`}
          hidden={activeId !== item.id}
          className="tab-panel"
        >
          {activeId === item.id && item.content}
        </div>
      ))}
    </div>
  );
}