import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface MalTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export const MalTooltip: React.FC<MalTooltipProps> = ({
  children,
  content,
  disabled = false,
}) => {
  const [show, setShow] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!show || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipW = 240;
    const tooltipH = 100;
    let top = rect.top - tooltipH - 10;
    if (top < 8) top = rect.bottom + 10;
    let left = rect.left + rect.width / 2 - tooltipW / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipW - 8));
    setPos({ top, left });
  }, [show]);

  if (disabled) return <>{children}</>;

  return (
    <>
      <div
        ref={triggerRef}
        className="h-full"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {createPortal(
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed z-[99999] pointer-events-none"
              style={{
                top: pos.top,
                left: pos.left,
                width: 240,
              }}
            >
              <div className="rounded-xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.35)] border backdrop-blur-md bg-panel/98 border-base">
                {content}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default MalTooltip;
