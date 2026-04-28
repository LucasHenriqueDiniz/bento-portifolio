import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BentoCard } from "@/components/BentoCard";
import { fadeUpSoft } from "@/lib/animations";

// Fotos locais com legendas criativas
const POLAROID_PHOTOS = [
  "/photos/hana.jpg",
  "/photos/hana%20(2).jpg",
  "/photos/poca.jpg",
  "/photos/jardim-botanico-curitiba.jpg",
  "/photos/jardim-botanico-curitiba-2.jpg",
  "/photos/jardim-botanico-curitiba-3.jpg",
  "/photos/portugal.jpeg",
  "/photos/portugal-2.jpeg",
];

const POLAROID_CAPTIONS = [
  "hana",
  "hana, take two",
  "poca",
  "jardim botanico",
  "curitiba morning",
  "curitiba afternoon",
  "portugal",
  "portugal coast",
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%" }),
};

/**
 * Props for PolaroidStack component
 * @interface PolaroidStackProps
 * @property {boolean} [isDark] - Dark mode flag (optional)
 * @property {1 | 2 | 3 | 4} [tier] - Visual hierarchy tier (optional, defaults to 2)
 */
interface PolaroidStackProps {
  isDark?: boolean;
  tier?: 1 | 2 | 3 | 4;
}

/**
 * PolaroidStack - Polaroid-style photo carousel with captions
 * Auto-cycles through photos with slide animations and manual navigation
 * @component
 * @param {PolaroidStackProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const PolaroidStack = React.memo(function PolaroidStack({
  isDark,
  tier = 2,
}: PolaroidStackProps) {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const n = POLAROID_PHOTOS.length;

  const goTo = (idx: number) => {
    setDir(idx >= current ? 1 : -1);
    setCurrent(idx);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setDir(1);
      setCurrent((c) => (c + 1) % n);
    }, 4500); // Increased interval for better performance
    return () => clearInterval(id);
  }, [n]);

  return (
    <BentoCard
      className="overflow-hidden h-full bg-white dark:bg-[#181818]"
      tier={tier}
      enableTilt={true}
      enableBorderGlow={true}
      enableMagnetism={true}
    >
      <motion.div
        custom={2}
        variants={fadeUpSoft}
        initial="hidden"
        animate="show"
        className="w-full h-full flex flex-col p-3"
      >
        {/* photo area fills available space */}
        <div
          className="flex-1 relative overflow-hidden rounded-lg"
          style={{ minHeight: 0 }}
        >
          <AnimatePresence mode="popLayout" custom={dir}>
            <motion.img
              key={current}
              custom={dir}
              src={POLAROID_PHOTOS[current]}
              alt={POLAROID_CAPTIONS[current]}
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                backgroundColor: isDark ? "#252525" : "#f0f0f0",
              }}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }} // Reduced duration
            />
          </AnimatePresence>
        </div>

        {/* caption strip */}
        <div className="h-9 flex items-center justify-center shrink-0">
          <AnimatePresence mode="wait">
            <motion.p
              key={current}
              className="text-[11px] tracking-wide font-medium"
              style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                color: isDark ? "#888" : "#666",
              }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }} // Faster caption animation
            >
              {POLAROID_CAPTIONS[current]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* dot indicators */}
        <div className="flex items-center justify-center gap-1.5 pb-1 shrink-0">
          {Array.from({ length: n }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300 hover:opacity-80"
              style={{
                width: i === current ? 16 : 6,
                height: 6,
                backgroundColor:
                  i === current
                    ? isDark
                      ? "#888"
                      : "#666"
                    : isDark
                      ? "#333"
                      : "#ddd",
              }}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </BentoCard>
  );
});
