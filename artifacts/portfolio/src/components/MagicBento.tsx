import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";

export interface MagicBentoProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  // Animation options
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  allowOverflow?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 8; // Balanced particle count
const DEFAULT_SPOTLIGHT_RADIUS = 250; // Balanced radius
const DEFAULT_GLOW_COLOR = "132, 0, 255";

const createParticleElement = (
  x: number,
  y: number,
  color: string,
): HTMLDivElement => {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(${color}, 0.8);
    box-shadow: 0 0 4px rgba(${color}, 0.4);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
    will-change: transform;
  `;
  return el;
};

export const MagicBento: React.FC<MagicBentoProps> = ({
  children,
  className = "",
  style,
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
  allowOverflow = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(
        Math.random() * width,
        Math.random() * height,
        glowColor,
      ),
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.2, // Faster cleanup
        ease: "power2.in",
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        },
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    // Reduce particle count for better performance
    const activeParticleCount = Math.min(particleCount, 4);

    memoizedParticles.current
      .slice(0, activeParticleCount)
      .forEach((particle, index) => {
        const timeoutId = setTimeout(() => {
          if (!isHoveredRef.current || !cardRef.current) return;

          const clone = particle.cloneNode(true) as HTMLDivElement;
          cardRef.current.appendChild(clone);
          particlesRef.current.push(clone);

          gsap.fromTo(
            clone,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 0.8, duration: 0.2, ease: "back.out(1.7)" },
          );

          gsap.to(clone, {
            x: (Math.random() - 0.5) * 60, // Reduced movement
            y: (Math.random() - 0.5) * 60,
            rotation: Math.random() * 180,
            duration: 1.5 + Math.random() * 1,
            ease: "none",
            repeat: -1,
            yoyo: true,
          });

          gsap.to(clone, {
            opacity: 0.2,
            duration: 1,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
        }, index * 150); // Increased delay between particles

        timeoutsRef.current.push(timeoutId);
      });
  }, [initializeParticles, particleCount]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;
    let latestMouseX = 0;
    let latestMouseY = 0;

    const applyMouseMove = () => {
      if (!enableTilt && !enableMagnetism && !enableBorderGlow) {
        rafIdRef.current = null;
        return;
      }

      const rect = element.getBoundingClientRect();
      const x = latestMouseX - rect.left;
      const y = latestMouseY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableBorderGlow) {
        const glowX = (x / rect.width) * 100;
        const glowY = (y / rect.height) * 100;
        element.style.setProperty("--glow-x", `${glowX}%`);
        element.style.setProperty("--glow-y", `${glowY}%`);
        element.style.setProperty("--glow-intensity", "1");
      }

      if (enableTilt || enableMagnetism) {
        const rotateX = enableTilt ? ((y - centerY) / centerY) * -8 : 0;
        const rotateY = enableTilt ? ((x - centerX) / centerX) * 8 : 0;
        const translateX = enableMagnetism ? (x - centerX) * 0.02 : 0;
        const translateY = enableMagnetism ? (y - centerY) * 0.02 : 0;

        element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        element.style.transition = "transform 0.1s ease-out";
      }

      rafIdRef.current = null;
    };

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      if (enableStars && !isAnimatingRef.current) {
        isAnimatingRef.current = true;
        animateParticles();
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      isAnimatingRef.current = false;
      clearAllParticles();

      // Reset border glow
      if (enableBorderGlow) {
        element.style.setProperty("--glow-intensity", "0");
      }

      // Reset transforms using CSS (faster than GSAP)
      if (enableTilt || enableMagnetism) {
        element.style.transform =
          "translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)";
        element.style.transition =
          "transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)";
      }

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism && !enableBorderGlow) return;

      latestMouseX = e.clientX;
      latestMouseY = e.clientY;

      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(applyMouseMove);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Simplified ripple calculation
      const maxDistance = Math.max(rect.width, rect.height);

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.3) 0%, rgba(${glowColor}, 0.15) 30%, transparent 60%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
        will-change: transform, opacity;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.6, // Faster ripple
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        },
      );
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("click", handleClick);

    return () => {
      isHoveredRef.current = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
      clearAllParticles();
    };
  }, [
    animateParticles,
    clearAllParticles,
    disableAnimations,
    enableTilt,
    enableMagnetism,
    enableBorderGlow,
    clickEffect,
    glowColor,
    enableStars,
  ]);

  const borderGlowClass = enableBorderGlow ? "magic-bento--border-glow" : "";

  return (
    <div
      ref={cardRef}
      className={`magic-bento ${borderGlowClass} ${className}`}
      style={
        {
          ...style,
          position: "relative",
          overflow: allowOverflow ? "visible" : "hidden",
          "--glow-color": glowColor,
          "--glow-x": "50%",
          "--glow-y": "50%",
          "--glow-intensity": "0",
          "--glow-radius": `${spotlightRadius}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};
