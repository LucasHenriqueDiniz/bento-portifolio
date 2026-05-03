import React, { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import BorderGlow from "./BorderGlow";

const DEFAULT_GLOW_COLOR = "99, 102, 241";
const PARTICLE_COUNT = 8;

function createParticle(x: number, y: number, glowColor: string): HTMLDivElement {
  const el = document.createElement("div");
  el.style.cssText = `
    position:absolute;width:3px;height:3px;border-radius:50%;
    background:rgba(${glowColor},0.9);
    box-shadow:0 0 5px rgba(${glowColor},0.5);
    pointer-events:none;z-index:100;left:${x}px;top:${y}px;
  `;
  return el;
}

function rgbToHsl(rgbStr: string): string {
  const [r, g, b] = rgbStr.split(",").map((v) => parseFloat(v.trim()));
  if ([r, g, b].some((v) => Number.isNaN(v))) return "235 80 70";
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
      case gn: h = (bn - rn) / d + 2; break;
      case bn: h = (rn - gn) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)} ${Math.round(l * 100)}`;
}

/* ─── Effects ─────────────────────────────────────── */

function useParticleEffect(ref: React.RefObject<HTMLDivElement | null>, enabled: boolean, glowColor: string) {
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isHovered = useRef(false);

  const clearParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    particlesRef.current.forEach((p) => {
      gsap.to(p, { scale: 0, opacity: 0, duration: 0.25, onComplete: () => p.remove() });
    });
    particlesRef.current = [];
  }, []);

  const spawnParticles = useCallback(() => {
    if (!ref.current || !isHovered.current) return;
    const { width, height } = ref.current.getBoundingClientRect();

    Array.from({ length: PARTICLE_COUNT }).forEach((_, i) => {
      const t = setTimeout(() => {
        if (!isHovered.current || !ref.current) return;
        const p = createParticle(Math.random() * width, Math.random() * height, glowColor);
        ref.current.appendChild(p);
        particlesRef.current.push(p);
        gsap.fromTo(p, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" });
        gsap.to(p, {
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 80,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
        gsap.to(p, { opacity: 0.2, duration: 1.2, ease: "power2.inOut", repeat: -1, yoyo: true });
      }, i * 80);
      timeoutsRef.current.push(t);
    });
  }, [glowColor, ref]);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;

    const onEnter = () => { isHovered.current = true; spawnParticles(); };
    const onLeave = () => { isHovered.current = false; clearParticles(); };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      clearParticles();
    };
  }, [enabled, ref, spawnParticles, clearParticles]);
}

function useRippleEffect(ref: React.RefObject<HTMLDivElement | null>, enabled: boolean, glowColor: string) {
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;

    const onClick = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxD = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height));
      const ripple = document.createElement("div");
      ripple.style.cssText = `position:absolute;width:${maxD*2}px;height:${maxD*2}px;border-radius:50%;background:radial-gradient(circle,rgba(${glowColor},0.3) 0%,rgba(${glowColor},0.1) 40%,transparent 70%);left:${x-maxD}px;top:${y-maxD}px;pointer-events:none;z-index:50;`;
      el.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.7, ease: "power2.out", onComplete: () => ripple.remove() });
    };

    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [enabled, glowColor, ref]);
}

/* ─── BentoCard ───────────────────────────────────── */

export interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glowColor?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseMove?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  tier?: number;
  allowOverflow?: boolean;
  enableBorderGlow?: boolean;
  clickEffect?: boolean;
}

export function BentoCard({
  children,
  className = "",
  style,
  glowColor = DEFAULT_GLOW_COLOR,
  onClick,
  onMouseMove,
  onMouseLeave,
  onMouseEnter,
  tier,
  allowOverflow = false,
  enableBorderGlow = true,
  clickEffect = false,
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useParticleEffect(cardRef, enableBorderGlow, glowColor);
  useRippleEffect(cardRef, clickEffect, glowColor);

  return (
    <BorderGlow
      className={className}
      style={style}
      glowColor={rgbToHsl(glowColor)}
      backgroundColor=""
      borderRadius={16}
      glowRadius={0}
      glowIntensity={1.2}
      edgeSensitivity={25}
      coneSpread={20}
      animated={false}
      colors={["#c084fc", "#f472b6", "#38bdf8"]}
    >
      <div
        ref={cardRef}
        className="bento-card-base h-full"
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
        style={{
          position: "relative",
          overflow: allowOverflow ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </BorderGlow>
  );
}

/* ─── BentoSection ────────────────────────────────── */

export function BentoSection({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const spot = document.createElement("div");
    spot.style.cssText = `position:fixed;width:600px;height:600px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(${DEFAULT_GLOW_COLOR},0.12) 0%,rgba(${DEFAULT_GLOW_COLOR},0.06) 20%,rgba(${DEFAULT_GLOW_COLOR},0.02) 40%,transparent 65%);z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:multiply;`;
    document.body.appendChild(spot);
    spotRef.current = spot;

    const onMove = (e: MouseEvent) => {
      if (!spotRef.current) return;
      const rect = section.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      gsap.to(spotRef.current, { left: e.clientX, top: e.clientY, duration: 0.1, ease: "power2.out" });
      gsap.to(spotRef.current, { opacity: inside ? 0.9 : 0, duration: inside ? 0.2 : 0.5 });
    };

    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousemove", onMove);
      spotRef.current?.remove();
    };
  }, []);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
