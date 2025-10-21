import { useState, useEffect, useCallback } from 'react';

/** Simple hook for ephemeral UI messages (e.g., toasts). */
export function useTransientMessage(timeoutMs = 3000) {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), timeoutMs);
    return () => clearTimeout(t);
  }, [message, timeoutMs]);
  const push = useCallback((text: string) => setMessage(text), []);
  return { message, push } as const;
}
