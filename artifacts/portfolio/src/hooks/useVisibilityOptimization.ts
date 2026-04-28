import { useEffect, useRef, useState } from 'react';

/**
 * Hook to optimize animations based on element visibility
 * Pauses expensive animations when elements are not in viewport
 */
export function useVisibilityOptimization(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isNearViewport, setIsNearViewport] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create two observers - one for visibility, one for near-viewport detection
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    const nearViewportObserver = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      { 
        threshold: 0,
        rootMargin: '100px' // Start optimizing when element is 100px away from viewport
      }
    );

    visibilityObserver.observe(element);
    nearViewportObserver.observe(element);

    return () => {
      visibilityObserver.disconnect();
      nearViewportObserver.disconnect();
    };
  }, [threshold]);

  return {
    ref,
    isVisible,
    isNearViewport,
    shouldAnimate: isVisible && isNearViewport
  };
}