import React, { useRef, useEffect } from "react";

const DEFAULT_GLOW_COLOR = "99, 102, 241";

/**
 * Wraps the bento grid and draws a soft spotlight that follows the mouse while it is
 * over the grid.
 */
export function BentoSection({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const spot = document.createElement("div");
    spot.style.cssText = `position:fixed;left:0;top:0;width:600px;height:600px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(${DEFAULT_GLOW_COLOR},0.12) 0%,rgba(${DEFAULT_GLOW_COLOR},0.06) 20%,rgba(${DEFAULT_GLOW_COLOR},0.02) 40%,transparent 65%);z-index:200;opacity:0;transform:translate3d(-9999px,-9999px,0);transition:transform 0.1s ease-out,opacity 0.35s ease;mix-blend-mode:multiply;will-change:transform;`;
    document.body.appendChild(spot);
    spotRef.current = spot;

    // One write per animation frame, and CSS transitions for the easing: the previous
    // version started two gsap tweens on every mousemove event.
    let pointer = { x: 0, y: 0 };
    let frame = 0;
    const paint = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const inside = pointer.x >= rect.left && pointer.x <= rect.right && pointer.y >= rect.top && pointer.y <= rect.bottom;
      spot.style.transform = `translate3d(${pointer.x - 300}px, ${pointer.y - 300}px, 0)`;
      spot.style.opacity = inside ? "0.9" : "0";
    };
    const onMove = (e: MouseEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(paint);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("mousemove", onMove);
      spot.remove();
    };
  }, []);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
