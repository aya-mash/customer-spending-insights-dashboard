import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface SkeletonProps { readonly load: () => Promise<ReactNode>; readonly fallbackRows?: number; }

export function AsyncSection({ load, fallbackRows = 3 }: SkeletonProps) {
  const [content, setContent] = useState<ReactNode | null>(null);
  useEffect(() => { let mounted = true; load().then(c => mounted && setContent(c)); return () => { mounted = false; }; }, [load]);
  if (content) return <div aria-live="polite">{content}</div>;
  const lines = Array.from({ length: fallbackRows }, (_, i) => `sk-${i}`);
  return (
    <div aria-busy="true" aria-label="Loading section" className="skeleton-group">
      {lines.map(id => <div key={id} className="skeleton-line" />)}
    </div>
  );
}