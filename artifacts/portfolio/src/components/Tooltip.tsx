import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  width?: string | number;
  disabled?: boolean;
}

/**
 * Tooltip reutilizável posicionado acima do elemento.
 * Aparece ao passar o mouse e desaparece ao sair.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  className = "",
  width = 280,
  disabled = false,
}) => {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, flipDown: false });

  useEffect(() => {
    if (!show || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const tooltipW = typeof width === "number" ? width : 280;
    const tooltipH = 160; // estimativa
    let top = rect.top - tooltipH - 8;
    let flipDown = false;
    if (top < 8) {
      top = rect.bottom + 8;
      flipDown = true;
    }
    let left = rect.left + rect.width / 2;
    // boundary check horizontal
    const minLeft = tooltipW / 2 + 8;
    const maxLeft = window.innerWidth - tooltipW / 2 - 8;
    left = Math.max(minLeft, Math.min(left, maxLeft));
    setPos({ top, left, flipDown });
  }, [show, width]);

  if (disabled) return <>{children}</>;

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed z-[9999] pointer-events-none"
            style={{
              top: pos.top,
              left: pos.left,
              transform: "translateX(-50%)",
              width: typeof width === "number" ? `${width}px` : width,
            }}
          >
            <div className="rounded-xl p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.28)] border backdrop-blur-sm bg-panel/95 border-base">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
