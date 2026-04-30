import React, { useRef, useCallback, useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface MagneticCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  disabled?: boolean;
}

export function MagneticCard({
  children,
  className = "",
  intensity = 15,
  disabled = false,
}: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });
  const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current || disabled) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateXValue = (-mouseY / (rect.height / 2)) * intensity;
      const rotateYValue = (mouseX / (rect.width / 2)) * intensity;

      rotateX.set(rotateXValue);
      rotateY.set(rotateYValue);
      x.set(mouseX * 0.02);
      y.set(mouseY * 0.02);
    },
    [disabled, intensity, rotateX, rotateY, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;
    rotateX.set(0);
    rotateY.set(0);
    x.set(0);
    y.set(0);
    setIsHovering(false);
  }, [disabled, rotateX, rotateY, x, y]);

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;
    setIsHovering(true);
  }, [disabled]);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter, disabled]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX,
        rotateY,
        x,
        y,
        transformPerspective: 1000,
      }}
    >
      {children}
    </motion.div>
  );
}
