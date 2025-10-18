const seen = new Set<string>();

export function markPrefetched(path: string) { seen.add(path); }
export function getPrefetchedPaths(): string[] { return Array.from(seen); }