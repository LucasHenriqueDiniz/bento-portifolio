import React, { useRef, useEffect, useState } from "react";

interface MagneticDocumentProps {
  children: React.ReactNode;
  className?: string;
}

export function MagneticDocument({
  children,
  className = "",
}: MagneticDocumentProps) {
  const docRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0, rx: 0, ry: 0, glow: 0 });
  const currentRef = useRef({ x: 0, y: 0, rx: 0, ry: 0, glow: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!docRef.current) return;
      const rect = docRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const maxDist = 900;
      const maxMove = 26;
      const maxTilt = 4;

      if (dist < maxDist) {
        const strength = 1 - dist / maxDist;
        setActive(true);
        targetRef.current = {
          x: (dx / maxDist) * maxMove * strength,
          y: (dy / maxDist) * maxMove * strength,
          rx: -(dy / maxDist) * maxTilt * strength,
          ry: (dx / maxDist) * maxTilt * strength,
          glow: strength,
        };
      } else {
        setActive(false);
        targetRef.current = { x: 0, y: 0, rx: 0, ry: 0, glow: 0 };
      }
    };

    const handleMouseLeave = () => {
      setActive(false);
      targetRef.current = { x: 0, y: 0, rx: 0, ry: 0, glow: 0 };
    };

    const animate = () => {
      const ease = 0.12;
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * ease;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * ease;
      currentRef.current.rx += (targetRef.current.rx - currentRef.current.rx) * ease;
      currentRef.current.ry += (targetRef.current.ry - currentRef.current.ry) * ease;
      currentRef.current.glow += (targetRef.current.glow - currentRef.current.glow) * ease;

      if (docRef.current) {
        docRef.current.style.transform = `translate3d(${currentRef.current.x.toFixed(2)}px, ${currentRef.current.y.toFixed(2)}px, 0) rotateX(${currentRef.current.rx.toFixed(2)}deg) rotateY(${currentRef.current.ry.toFixed(2)}deg)`;
        const glow = currentRef.current.glow;
        docRef.current.style.boxShadow = `0 20px 48px rgba(0,0,0,${(0.18 + glow * 0.2).toFixed(3)}), 0 3px 12px rgba(0,0,0,${(0.08 + glow * 0.12).toFixed(3)})`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="flex justify-center py-10 px-4" style={{ perspective: "1200px" }}>
      <div
        ref={docRef}
        className={`w-full max-w-[860px] rounded-2xl overflow-hidden bg-panel border will-change-transform relative transition-colors duration-200 ${className}`}
        style={{ borderColor: active ? "var(--accent)" : "var(--border-base)" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-black/6" />
        {children}
      </div>
    </div>
  );
}
