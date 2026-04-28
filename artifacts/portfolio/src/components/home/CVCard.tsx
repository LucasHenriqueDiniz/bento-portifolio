import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, FileText } from "lucide-react";
import { BentoCard } from "@/components/BentoCard";

const CARD =
  "bg-white dark:bg-[#181818] border border-[#ebebeb] dark:border-[#282828] rounded-2xl";

/**
 * Props for CVCard component
 * @interface CVCardProps
 * @property {Function} navigate - Navigation function to route to CV page
 */
interface CVCardProps {
  navigate: (path: string) => void;
}

/**
 * CVCard - Simple resume card with magnetic document effect
 * @component
 * @param {CVCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const CVCard = React.memo(function CVCard({ navigate }: CVCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for magnetic effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animation
  const x = useSpring(mouseX, { damping: 20, stiffness: 200 });
  const y = useSpring(mouseY, { damping: 20, stiffness: 200 });

  // Tilt effect
  const rotateX = useTransform(mouseY, [-100, 100], [3, -3]);
  const rotateY = useTransform(mouseX, [-100, 100], [-3, 3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((e.clientX - centerX) * 0.1);
    mouseY.set((e.clientY - centerY) * 0.1);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <BentoCard
      tier={2}
      className={`overflow-hidden cursor-pointer group
        /* Mobile: full width, order 10 (tier-2) */
        col-span-1 order-10
        /* Tablet: column 4, rows 9-13 */
        md:col-start-4 md:col-end-5 md:row-start-9 md:row-end-13
        /* Desktop: column 4, rows 9-13 */
        lg:col-start-4 lg:col-end-5 lg:row-start-9 lg:row-end-13`}
      onClick={() => navigate("/cv")}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className="relative w-full h-full flex flex-col bg-[#3d72cc] dark:bg-[#2d5aa3] rounded-2xl"
      >
        {/* Background pattern/texture */}
        <div className="absolute inset-0 opacity-5 rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-4">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <FileText size={12} className="text-white" />
              <span className="text-[10px] font-semibold text-white uppercase tracking-wider">
                Resume
              </span>
            </div>
            <span className="w-6 h-6 rounded-full bg-white/10 border border-white/20 text-white/85 inline-flex items-center justify-center">
              <ArrowUpRight size={11} />
            </span>
          </div>

          {/* Floating document - centered, pode sair do card */}
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              style={{ x, y, rotateX, rotateY, transformStyle: "preserve-3d" }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-[85%] aspect-[0.7] relative"
            >
              {/* Shadow */}
              <motion.div
                className="absolute inset-0 bg-black/20 blur-xl translate-y-3"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Document */}
              <motion.div
                className="relative w-full h-full bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-2xl overflow-hidden border-2 border-blue-100"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header bar */}
                <motion.div
                  className="h-8 bg-gradient-to-r from-[#3d72cc] to-[#5a8fd8]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                />

                {/* Content lines */}
                <div className="p-3 space-y-2">
                  {/* Name */}
                  <motion.div
                    className="h-2.5 bg-gradient-to-r from-gray-800 to-gray-700 rounded w-[55%]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    style={{ transformOrigin: "left" }}
                  />

                  {/* Section 1 */}
                  <div className="space-y-1">
                    {[85, 90, 75].map((width, i) => (
                      <motion.div
                        key={i}
                        className="h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded"
                        style={{ width: `${width}%`, transformOrigin: "left" }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                      />
                    ))}
                  </div>

                  {/* Section 2 */}
                  <motion.div
                    className="h-2.5 bg-gradient-to-r from-gray-800 to-gray-700 rounded w-[45%]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    style={{ transformOrigin: "left" }}
                  />

                  <div className="space-y-1">
                    {[80, 70].map((width, i) => (
                      <motion.div
                        key={i}
                        className="h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded"
                        style={{ width: `${width}%`, transformOrigin: "left" }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3, delay: 0.9 + i * 0.1 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Folded corner */}
                <div
                  className="absolute top-0 right-0 w-6 h-6 bg-blue-100"
                  style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </BentoCard>
  );
});
