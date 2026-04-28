import type { Variants } from "framer-motion";

type FadeUpOptions = {
  y?: number;
  delayStep?: number;
  duration?: number;
};

const DEFAULT_EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export function createFadeUp(options: FadeUpOptions = {}): Variants {
  const { y = 8, delayStep = 0.05, duration = 0.3 } = options;

  return {
    hidden: { opacity: 0, y },
    show: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * delayStep,
        duration,
        ease: DEFAULT_EASE,
      },
    }),
  };
}

export const fadeUp = createFadeUp();
export const fadeUpSoft = createFadeUp({
  y: 6,
  delayStep: 0.04,
  duration: 0.26,
});
