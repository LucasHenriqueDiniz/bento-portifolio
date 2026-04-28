import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  isVisible: boolean;
  title: string;
  subtitle?: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  score?: number;
  synopsis?: string;
}

export function Tooltip({ isVisible, title, subtitle, position = "top", className = "", score, synopsis }: TooltipProps) {
  const positionClasses = {
    top: "-top-2 left-1/2 -translate-x-1/2 -translate-y-full",
    bottom: "-bottom-2 left-1/2 -translate-x-1/2 translate-y-full",
    left: "top-1/2 -left-2 -translate-y-1/2 -translate-x-full",
    right: "top-1/2 -right-2 -translate-y-1/2 translate-x-full"
  };

  const arrowClasses = {
    top: "-bottom-1.5 left-1/2 -translate-x-1/2",
    bottom: "-top-1.5 left-1/2 -translate-x-1/2 rotate-180",
    left: "top-1/2 -right-1.5 -translate-y-1/2 rotate-90",
    right: "top-1/2 -left-1.5 -translate-y-1/2 -rotate-90"
  };

  // Enhanced tooltip with more info
  const hasExtendedInfo = score !== undefined || synopsis !== undefined;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 5 }}
          transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className={`absolute ${positionClasses[position]} z-[200] pointer-events-none ${className}`}
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-[#2e51a2]/20 blur-xl rounded-lg" />
            
            {/* Tooltip content */}
            <div className={`relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] backdrop-blur-xl text-white rounded-xl shadow-2xl border border-white/10 ${
              hasExtendedInfo ? 'px-4 py-3.5 min-w-[220px] max-w-[280px]' : 'px-3 py-2.5 min-w-[140px] max-w-[200px]'
            }`}>
              {/* Title */}
              <p className="text-[13px] font-bold leading-tight mb-2.5">
                {title}
              </p>
              
              {/* Year and Score row */}
              <div className="flex items-center gap-2 mb-2.5">
                {subtitle && (
                  <div className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full">
                    <p className="text-[10px] font-semibold text-white/70 tabular-nums">
                      {subtitle}
                    </p>
                  </div>
                )}
                {score !== undefined && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#2e51a2]/20 border border-[#2e51a2]/30 rounded-full">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="text-[11px] font-bold text-[#5a8fd3] tabular-nums">
                      {score.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Synopsis */}
              {synopsis && (
                <p className="text-[11px] leading-relaxed text-white/60 line-clamp-4">
                  {synopsis}
                </p>
              )}
              
              {/* Arrow with glow */}
              <div className={`absolute ${arrowClasses[position]}`}>
                <div className="w-3 h-3 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rotate-45 border-r border-b border-white/10" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
