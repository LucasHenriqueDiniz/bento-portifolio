import React, { useRef, useEffect, useState } from "react";
import { useCardGlowContext } from "./CardGlowContext";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glowColor?: string;       // "R, G, B"  e.g. "61, 114, 204"
  glowIntensity?: number;   // glow opacity multiplier (default 1)
  borderRadius?: number;    // px
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseMove?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  allowOverflow?: boolean;
  flipAngle?: number;
}

/**
 * Card with a global glow.
 * Uses the mouse position in the document to compute the glow for EVERY card,
 * even when the cursor is not directly over it.
 */
export const Card = React.memo(function Card({
  children,
  className = "",
  style,
  glowColor = "99, 102, 241",
  glowIntensity = 1,
  borderRadius = 20,
  onClick,
  onMouseMove,
  onMouseLeave,
  onMouseEnter,
  allowOverflow = false,
  flipAngle = 0,
}: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glowState = useCardGlowContext();
  const [computed, setComputed] = useState({ x: 50, y: 50, opacity: 0, inside: false });

  useEffect(() => {
    if (!ref.current || !glowState.active) {
      setComputed({ x: 50, y: 50, opacity: 0, inside: false });
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const mx = glowState.x;
    const my = glowState.y;

    // Distance from the mouse to the card center
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mx - cx;
    const dy = my - cy;

    // Check whether the mouse is inside
    const inside = mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom;

    // Influence radius when outside (px)
    const outerRadius = 220;
    const dist = Math.hypot(dx, dy);

    let xPct: number;
    let yPct: number;
    let opacity: number;

    if (inside) {
      // Inside: the glow follows the mouse
      xPct = ((mx - rect.left) / rect.width) * 100;
      yPct = ((my - rect.top) / rect.height) * 100;
      // Edge proximity drives the intensity
      const edgeX = Math.max(Math.abs(xPct - 50) / 50, Math.abs(yPct - 50) / 50);
      opacity = Math.max(0, (edgeX - 0.35) / 0.65);
    } else {
      // Outside: the glow appears on the nearest edge, pointing at the mouse
      const maxDist = Math.max(rect.width, rect.height) / 2 + outerRadius;
      if (dist > maxDist) {
        setComputed({ x: 50, y: 50, opacity: 0, inside: false });
        return;
      }

      // Mouse position relative to the card rectangle
      const relX = Math.max(rect.left, Math.min(mx, rect.right));
      const relY = Math.max(rect.top, Math.min(my, rect.bottom));

      xPct = ((relX - rect.left) / rect.width) * 100;
      yPct = ((relY - rect.top) / rect.height) * 100;

      // Opacity falls off with distance
      const edgeDist = Math.hypot(relX - mx, relY - my);
      opacity = Math.max(0, 1 - edgeDist / outerRadius) * 0.55;
    }

    setComputed({ x: xPct, y: yPct, opacity, inside });
  }, [glowState]);

  const roundedStyle = { borderRadius: `${borderRadius}px` };

  return (
    <div
      ref={ref}
      className={`relative card-hover ${className}`}
      onPointerMove={onMouseMove}
      onPointerEnter={onMouseEnter}
      onPointerLeave={onMouseLeave}
      onClick={onClick}
      style={{
        ...roundedStyle,
        perspective: flipAngle !== 0 ? "800px" : undefined,
        ...style,
      }}
    >
      {/* ── Glow layer ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 999,
          ...roundedStyle,
          overflow: "hidden",
          transformStyle: "preserve-3d",
          transform: `rotateY(${-flipAngle}deg)`,
          transition: "transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)",
        }}
      >
        {/* Radial border glow - active both inside and nearby */}
        <div
          className="absolute inset-0"
          style={{
            padding: "1.5px",
            background: `radial-gradient(420px circle at ${computed.x}% ${computed.y}%, rgba(${glowColor},0.6) 0%, rgba(${glowColor},0.22) 45%, transparent 72%)`,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: Math.min(computed.opacity * glowIntensity, 1),
            transition: computed.opacity > 0
              ? "opacity 0.2s ease-out"
              : "opacity 0.5s ease-in-out",
            ...roundedStyle,
          }}
        />

        {/* Mesh accent sutil */}
        <div
          className="absolute inset-0"
          style={{
            padding: "1px",
            background: `
              radial-gradient(at 80% 20%, rgba(${glowColor},0.3) 0px, transparent 45%),
              radial-gradient(at 20% 80%, rgba(${glowColor},0.2) 0px, transparent 45%),
              radial-gradient(at 50% 50%, rgba(${glowColor},0.12) 0px, transparent 50%)
            `,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: Math.min(computed.opacity * glowIntensity * 0.7, 1),
            transition: "opacity 0.35s ease",
            ...roundedStyle,
          }}
        />
      </div>

      {/* ── Content ── */}
      <div
        className="relative h-full"
        style={{
          zIndex: 1,
          isolation: "isolate",
          overflow: allowOverflow ? "visible" : "hidden",
          ...roundedStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
});

export default Card;
