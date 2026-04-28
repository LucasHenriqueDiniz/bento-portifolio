import React, { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";

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

/* ─── Effects ─────────────────────────────────────── */

function useTiltEffect(ref: React.RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -6;
      const ry = ((x - cx) / cx) * 6;
      gsap.to(el, { rotateX: rx, rotateY: ry, duration: 0.15, ease: "power2.out", transformPerspective: 900 });
    };

    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.4, ease: "power2.out" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, ref]);
}

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

function useGlowEffect(ref: React.RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--glow-x", `${(x / rect.width) * 100}%`);
      el.style.setProperty("--glow-y", `${(y / rect.height) * 100}%`);
      el.style.setProperty("--glow-intensity", "1");
    };

    const onLeave = () => {
      el.style.setProperty("--glow-intensity", "0");
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, ref]);
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
  enableTilt?: boolean;
  enableBorderGlow?: boolean;
  enableMagnetism?: boolean;
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
  enableTilt = false,
  enableBorderGlow = false,
  enableMagnetism = false,
  clickEffect = false,
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useTiltEffect(cardRef, enableTilt || enableMagnetism);
  useParticleEffect(cardRef, enableBorderGlow, glowColor);
  useRippleEffect(cardRef, clickEffect, glowColor);
  useGlowEffect(cardRef, enableBorderGlow);

  return (
    <div
      ref={cardRef}
      className={`bento-card ${className}`}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      style={{
        "--glow-x": "50%",
        "--glow-y": "50%",
        "--glow-intensity": "0",
        "--glow-color": glowColor,
        position: "relative",
        overflow: allowOverflow ? "visible" : "hidden",
        ...style,
      } as React.CSSProperties}
    >
      {children}
    </div>
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
