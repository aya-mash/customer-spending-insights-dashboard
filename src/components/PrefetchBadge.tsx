import { useEffect, useState } from 'react';
import { getPrefetchedPaths } from '../dev/prefetchStore';

export function PrefetchBadge() {
  const [paths, setPaths] = useState<string[]>([]);
  useEffect(() => {
    const id = setInterval(() => setPaths(getPrefetchedPaths()), 500);
    return () => clearInterval(id);
  }, []);
  if (!import.meta.env.DEV) return null;
  if (!paths.length) return null;
  return (
    <div style={{ position: 'fixed', bottom: 64, right: 8, background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '12px', padding: '4px 8px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }} aria-label="Prefetched routes">
      Prefetched: {paths.join(', ')}
    </div>
  );
}