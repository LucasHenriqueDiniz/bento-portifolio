import { useRef, useCallback } from 'react';

/**
 * Hook to optimize animations by throttling updates and preventing unnecessary re-renders
 */
export function useOptimizedAnimation() {
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const throttledUpdate = useCallback((callback: () => void, throttleMs = 16) => {
    const now = performance.now();
    
    if (now - lastUpdateRef.current < throttleMs) {
      return;
    }
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      lastUpdateRef.current = now;
      callback();
    });
  }, []);

  const cleanup = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  return { throttledUpdate, cleanup };
}