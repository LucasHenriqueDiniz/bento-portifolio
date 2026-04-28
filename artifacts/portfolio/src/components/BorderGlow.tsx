import type { ReactNode } from "react";
import { useState } from "react";

type BorderGlowProps = {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
};

export default function BorderGlow({
  children,
  className = "",
  glowColor = "61, 114, 204",
  backgroundColor = "#121212",
  borderRadius = 16,
}: BorderGlowProps) {
  const [mouse, setMouse] = useState({ x: 50, y: 50, active: false });

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMouse({ x, y, active: true });
      }}
      onMouseLeave={() => setMouse((m) => ({ ...m, active: false }))}
      style={{
        borderRadius,
        backgroundColor,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: mouse.active ? 1 : 0,
          background: `radial-gradient(220px circle at ${mouse.x}% ${mouse.y}%, rgba(${glowColor},0.28), rgba(${glowColor},0.08) 35%, transparent 68%)`,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius,
          boxShadow: mouse.active
            ? `inset 0 0 0 1px rgba(${glowColor},0.55), 0 0 28px rgba(${glowColor},0.22)`
            : "inset 0 0 0 1px rgba(255,255,255,0.06)",
          transition: "box-shadow 220ms ease",
        }}
      />

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
