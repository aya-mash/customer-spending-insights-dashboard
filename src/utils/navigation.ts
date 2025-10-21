import { useState, useEffect } from 'react';

interface KeyboardNavigationState {
  isKeyboardUser: boolean;
  currentFocusedElement: Element | null;
}

export function useKeyboardNavigation(): KeyboardNavigationState {
  const [state, setState] = useState<KeyboardNavigationState>({
    isKeyboardUser: false,
    currentFocusedElement: null
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Mark as keyboard user on Tab, arrow keys, Enter, Space
      if (['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(e.key)) {
        setState(prev => ({ ...prev, isKeyboardUser: true }));
      }
    };

    const handleMouseDown = () => {
      setState(prev => ({ ...prev, isKeyboardUser: false }));
    };

    const handleFocusIn = (e: FocusEvent) => {
      setState(prev => ({ ...prev, currentFocusedElement: e.target as Element }));
    };

    const handleFocusOut = () => {
      setState(prev => ({ ...prev, currentFocusedElement: null }));
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  return state;
}

// Tab list keyboard navigation
export function useTabNavigation(tabsRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!tabsRef.current) return;
      
      const tabs = Array.from(tabsRef.current.querySelectorAll('[role="tab"]')) as HTMLElement[];
      const currentIndex = tabs.findIndex(tab => tab === document.activeElement);
      
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      tabs[nextIndex]?.focus();
    };

    const element = tabsRef.current;
    element?.addEventListener('keydown', handleKeyDown);
    
    return () => {
      element?.removeEventListener('keydown', handleKeyDown);
    };
  }, [tabsRef]);
}

// Focus trap for modals/drawers
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus first element when trap activates
    firstElement?.focus();

    document.addEventListener('keydown', handleTabKey);
    
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive, containerRef]);
}