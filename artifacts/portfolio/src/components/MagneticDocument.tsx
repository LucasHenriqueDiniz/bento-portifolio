import React, { useRef, useCallback } from "react";
import { motion, useSpring } from "framer-motion";

interface MagneticDocumentProps {
  children: React.ReactNode;
  className?: string;
  isDark?: boolean;
}

export function MagneticDocument({
  children,
  className = "",
  isDark = false,
}: MagneticDocumentProps) {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(0, { stiffness: 350, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 350, damping: 25 });
  const scale = useSpring(1, { stiffness: 350, damping: 25 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const maxTilt = 6;
    const rotateXValue = (-mouseY / (rect.height / 2)) * maxTilt;
    const rotateYValue = (mouseX / (rect.width / 2)) * maxTilt;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
    scale.set(1.01);
  }, [rotateX, rotateY, scale]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }, [rotateX, rotateY, scale]);

  return (
    <div className="flex justify-center py-10 px-4">
      <motion.div
        ref={ref}
        style={{
          rotateX,
          rotateY,
          scale,
          transformPerspective: 1200,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`w-full max-w-[860px] rounded-xl overflow-hidden ${isDark ? "bg-[#1a1a1a] shadow-[0_25px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)]" : "bg-white shadow-[0_25px_80px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.06)]"}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
