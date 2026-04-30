const STORAGE_PREFIX = "portfolio:query:";
const STORAGE_VERSION = 1;

interface CachedEntry<T> {
  v: number;
  data: T;
  ts: number;
}

function key(queryKey: string): string {
  return `${STORAGE_PREFIX}${queryKey}`;
}

export function getCache<T>(queryKey: string): T | undefined {
  try {
    const raw = localStorage.getItem(key(queryKey));
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as CachedEntry<T>;
    if (parsed.v !== STORAGE_VERSION) return undefined;
    // Expire after 7 days
    if (Date.now() - parsed.ts > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(key(queryKey));
      return undefined;
    }
    return parsed.data;
  } catch {
    return undefined;
  }
}

export function setCache<T>(queryKey: string, data: T): void {
  try {
    const entry: CachedEntry<T> = { v: STORAGE_VERSION, data, ts: Date.now() };
    localStorage.setItem(key(queryKey), JSON.stringify(entry));
  } catch {
    // Ignore localStorage errors (e.g. quota exceeded)
  }
}

export function removeCache(queryKey: string): void {
  try {
    localStorage.removeItem(key(queryKey));
  } catch {
    // Ignore
  }
}
