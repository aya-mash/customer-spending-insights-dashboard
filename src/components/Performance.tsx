import React, { useState, useRef, useEffect, memo, useMemo } from 'react';
import { useLazyLoad } from '../utils/performance';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
}

export const LazyImage = memo(function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3C/svg%3E'
}: LazyImageProps) {
  const { ref, isVisible } = useLazyLoad<HTMLImageElement>();

  const imageSrc = useMemo(() => {
    return isVisible ? src : placeholder;
  }, [isVisible, src, placeholder]);

  return (
    <img
      ref={ref}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
});

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5
}: VirtualizedListProps<T>) {
  const { visibleItems, containerRef, contentRef } = useVirtualization({
    items,
    itemHeight,
    containerHeight,
    overscan
  });

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      className="virtualized-list"
    >
      <div
        ref={contentRef}
        style={{ height: items.length * itemHeight, position: 'relative' }}
        className="virtualized-content"
      >
        {visibleItems.map(({ item, index, offset }: { item: T; index: number; offset: number }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: offset,
              left: 0,
              right: 0,
              height: itemHeight
            }}
            className="virtualized-item"
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Custom hook for virtualization
function useVirtualization<T>({
  items,
  itemHeight,
  containerHeight,
  overscan
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => setScrollTop(container.scrollTop);
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const visibleItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
      offset: (startIndex + index) * itemHeight
    }));
  }, [items, scrollTop, itemHeight, containerHeight, overscan]);

  return { visibleItems, containerRef, contentRef };
}