import { useCallback, useEffect, useRef, useState } from "react";

export function useFlipLock(durationMs = 700) {
  const [isFlipping, setIsFlipping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runWithFlipLock = useCallback(
    (action: () => void) => {
      if (isFlipping) return false;

      setIsFlipping(true);
      action();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsFlipping(false);
      }, durationMs);

      return true;
    },
    [durationMs, isFlipping],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { isFlipping, runWithFlipLock };
}
