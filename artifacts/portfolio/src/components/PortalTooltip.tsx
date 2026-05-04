import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface PortalTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  width?: number;
  disabled?: boolean;
  placement?: "top" | "right";
  offsetX?: number;
  offsetY?: number;
}

export const PortalTooltip: React.FC<PortalTooltipProps> = ({
  children,
  content,
  width = 300,
  disabled = false,
  placement = "top",
  offsetX = 0,
  offsetY = 0,
}) => {
  const [show, setShow] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!show || !triggerRef.current) return;
    
    // Small delay to let the tooltip render so we can measure its height
    const timer = requestAnimationFrame(() => {
      const rect = triggerRef.current!.getBoundingClientRect();
      const tooltipEl = tooltipRef.current;
      const tooltipH = tooltipEl?.offsetHeight ?? 140;
      
      let top = 0;
      let left = 0;

      if (placement === "right") {
        left = rect.right + 12;
        top = rect.top + rect.height / 2 - tooltipH / 2;

        if (left + width > window.innerWidth - 8) {
          left = rect.left - width - 12;
        }
        top = Math.max(8, Math.min(top, window.innerHeight - tooltipH - 8));
      } else {
        // Position tooltip above the trigger element with a gap
        top = rect.top - tooltipH - 10;
        if (top < 8) top = rect.bottom + 10; // fallback if not enough space above
        left = rect.left + rect.width / 2 - width / 2;
        left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
      }

      top += offsetY;
      left += offsetX;
      setPos({ top, left });
    });
    
    return () => cancelAnimationFrame(timer);
  }, [show, width, placement, offsetX, offsetY]);

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
              ref={tooltipRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed z-[99999] pointer-events-none"
              style={{
                top: pos.top,
                left: pos.left,
                width,
              }}
            >
              <div className="relative rounded-xl p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] border bg-panel border-base">
                <span
                  className="absolute w-0 h-0"
                  style={
                    placement === "right"
                      ? {
                          left: -8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          borderTop: "8px solid transparent",
                          borderBottom: "8px solid transparent",
                          borderRight: "8px solid var(--bg-panel)",
                        }
                      : {
                          left: "50%",
                          bottom: -8,
                          transform: "translateX(-50%)",
                          borderLeft: "8px solid transparent",
                          borderRight: "8px solid transparent",
                          borderTop: "8px solid var(--bg-panel)",
                        }
                  }
                />
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

export default PortalTooltip;