import React, { useRef } from "react";
import { useCardGlow } from "./CardGlowContext";

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
 * Card with a glow that tracks the mouse anywhere on the page, even when the cursor
 * is not over this card. Position and strength arrive as CSS variables written by
 * CardGlowProvider (--glow-x, --glow-y, --glow-opacity), so moving the mouse never
 * re-renders the card.
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
  useCardGlow(ref);

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
            background: `radial-gradient(420px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(${glowColor},0.6) 0%, rgba(${glowColor},0.22) 45%, transparent 72%)`,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: `min(calc(var(--glow-opacity, 0) * ${glowIntensity}), 1)`,
            transition: "opacity 0.3s ease-out",
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
            opacity: `min(calc(var(--glow-opacity, 0) * ${glowIntensity * 0.7}), 1)`,
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
