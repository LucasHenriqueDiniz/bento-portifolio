import { useEffect, useRef, useState } from "react";

/** How long a slide stays up, the same in every carousel on the home. */
export const CAROUSEL_SLIDE_MS = 6000;

/**
 * The slide a carousel is on, advancing by itself every `durationMs`. Pausing keeps the
 * time already spent on the slide, so resuming finishes the turn instead of restarting it.
 */
export function useCarousel(count: number, paused: boolean, durationMs = CAROUSEL_SLIDE_MS) {
  const [index, setIndex] = useState(0);
  const elapsed = useRef(0);
  const timedIndex = useRef(0);
  const current = count > 0 ? index % count : 0;

  useEffect(() => {
    if (timedIndex.current !== current) {
      timedIndex.current = current;
      elapsed.current = 0;
    }
    if (count < 2 || paused) return;
    const started = Date.now();
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), Math.max(0, durationMs - elapsed.current));
    return () => {
      clearTimeout(timer);
      elapsed.current += Date.now() - started;
    };
  }, [count, paused, current, durationMs]);

  const move = (step: number) => setIndex((i) => (((i + step) % count) + count) % count);
  return { index: current, setIndex, move };
}

interface CarouselProgressProps {
  count: number;
  index: number;
  /** Stops the running bar where it is; it goes on from there when this turns false. */
  paused: boolean;
  /** No autoplay at all (reduced motion): the current bar is simply full. */
  still?: boolean;
  durationMs?: number;
  /** Makes each bar a tab that jumps to its slide. */
  onSelect?: (index: number) => void;
  /** Accessible name of the tab list and of each tab, required with `onSelect`. */
  label?: string;
  tabLabel?: (index: number) => string;
  className?: string;
}

/**
 * One bar per slide: full for the ones already shown, filling for the one that is up.
 * The fill is the carousel's clock made visible, so it pauses with it.
 */
export function CarouselProgress({
  count,
  index,
  paused,
  still = false,
  durationMs = CAROUSEL_SLIDE_MS,
  onSelect,
  label,
  tabLabel,
  className = "",
}: CarouselProgressProps) {
  if (count < 2) return null;

  const fill = (i: number) => {
    if (i < index) return <span className="block h-full rounded-full bg-white/70" />;
    if (i > index) return null;
    if (still) return <span className="block h-full rounded-full bg-white" />;
    return (
      <span
        key={index}
        data-testid="carousel-progress-fill"
        className="block h-full origin-left rounded-full bg-white"
        style={{
          animation: `project-progress ${durationMs}ms linear forwards`,
          animationPlayState: paused ? "paused" : "running",
        }}
      />
    );
  };

  const bar = "h-[3px] flex-1 overflow-hidden rounded-full bg-white/25";
  return (
    <div
      className={`flex gap-1 ${className}`}
      {...(onSelect ? { role: "tablist", "aria-label": label } : { "aria-hidden": true })}
    >
      {Array.from({ length: count }, (_, i) =>
        onSelect ? (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={tabLabel?.(i)}
            onClick={() => onSelect(i)}
            className={`${bar} outline-none focus-visible:ring-2 focus-visible:ring-white`}
          >
            {fill(i)}
          </button>
        ) : (
          <span key={i} className={bar}>
            {fill(i)}
          </span>
        )
      )}
    </div>
  );
}
