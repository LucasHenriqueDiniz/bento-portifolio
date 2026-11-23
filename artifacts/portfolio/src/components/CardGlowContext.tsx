import React, { createContext, useContext, useEffect, useRef } from "react";

/** Registers a card's root element for the glow; returns the matching unregister. */
type RegisterGlow = (element: HTMLElement) => () => void;

const noop = () => {};
const CardGlowContext = createContext<RegisterGlow>(() => noop);

// Influence radius of the glow when the pointer is outside a card, in px.
const OUTER_RADIUS = 220;

/**
 * Writes the glow straight into CSS variables on each registered card, once per
 * animation frame. Kept out of React state on purpose: as state, every pointer move
 * re-rendered every card on the page, twice.
 */
function paintGlow(cards: Set<HTMLElement>, pointer: { x: number; y: number } | null) {
  // All reads first, then all writes, so the frame lays out once.
  const rects = [...cards].map((card) => [card, card.getBoundingClientRect()] as const);
  for (const [card, rect] of rects) {
    const glow = pointer ? glowAt(rect, pointer.x, pointer.y) : null;
    card.style.setProperty("--glow-x", `${glow?.x ?? 50}%`);
    card.style.setProperty("--glow-y", `${glow?.y ?? 50}%`);
    card.style.setProperty("--glow-opacity", String(glow?.opacity ?? 0));
  }
}

function glowAt(rect: DOMRect, mx: number, my: number) {
  const inside = mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom;
  if (inside) {
    // Inside: the glow follows the pointer and strengthens toward the edges.
    const x = ((mx - rect.left) / rect.width) * 100;
    const y = ((my - rect.top) / rect.height) * 100;
    const edge = Math.max(Math.abs(x - 50) / 50, Math.abs(y - 50) / 50);
    return { x, y, opacity: Math.max(0, (edge - 0.35) / 0.65) };
  }

  // Outside: the glow sits on the nearest edge and fades with distance.
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  if (Math.hypot(mx - cx, my - cy) > Math.max(rect.width, rect.height) / 2 + OUTER_RADIUS) return null;
  const edgeX = Math.max(rect.left, Math.min(mx, rect.right));
  const edgeY = Math.max(rect.top, Math.min(my, rect.bottom));
  return {
    x: ((edgeX - rect.left) / rect.width) * 100,
    y: ((edgeY - rect.top) / rect.height) * 100,
    opacity: Math.max(0, 1 - Math.hypot(edgeX - mx, edgeY - my) / OUTER_RADIUS) * 0.55,
  };
}

export const CardGlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cards = useRef(new Set<HTMLElement>());
  const register = useRef<RegisterGlow>((element) => {
    cards.current.add(element);
    return () => cards.current.delete(element);
  });

  useEffect(() => {
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        paintGlow(cards.current, pointer);
      });
    };
    const onMove = (e: MouseEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      schedule();
    };
    const onLeave = () => {
      pointer = null;
      schedule();
    };
    // Mouse only, like before: a touch drag would repaint every card while scrolling.
    document.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <CardGlowContext.Provider value={register.current}>{children}</CardGlowContext.Provider>;
};

/** Hands a card's root element to the nearest glow provider; a no-op without one. */
export const useCardGlow = (ref: React.RefObject<HTMLElement | null>) => {
  const register = useContext(CardGlowContext);
  useEffect(() => {
    if (!ref.current) return;
    return register(ref.current);
  }, [register, ref]);
};
