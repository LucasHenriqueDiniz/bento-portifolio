import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/Card";
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

const POLAROID_CAPTIONS_PT = [
  "hana",
  "hana, take two",
  "poca",
  "jardim botanico",
  "curitiba morning",
  "curitiba afternoon",
  "portugal",
  "portugal coast",
];

const POLAROID_CAPTIONS_EN = [
  "hana",
  "hana, take two",
  "poca",
  "botanical garden",
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

interface PolaroidStackProps {
  isDark?: boolean;
  tier?: 1 | 2 | 3 | 4;
}

export const PolaroidStack = React.memo(function PolaroidStack({
  isDark,
  tier = 2,
}: PolaroidStackProps) {
  const { t, i18n } = useTranslation("home");
  const currentLang = i18n.language?.split("-")[0] || "pt";
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const n = POLAROID_PHOTOS.length;
  const captions = currentLang === "en" ? POLAROID_CAPTIONS_EN : POLAROID_CAPTIONS_PT;
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goTo = (idx: number) => {
    setDir(idx >= current ? 1 : -1);
    setCurrent(idx);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setDir(1);
      setCurrent((c) => (c + 1) % n);
    }, 4500);
    return () => clearInterval(id);
  }, [n]);

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x < -50 || info.velocity.x < -500) goTo((current + 1) % n);
    else if (info.offset.x > 50 || info.velocity.x > 500) goTo((current - 1 + n) % n);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo((current + 1) % n);
      else goTo((current - 1 + n) % n);
    }
  };

  return (
    <Card
      className="h-full bg-panel"
      glowColor="var(--accent-glow)"
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
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="popLayout" custom={dir}>
            <motion.img
              key={current}
              custom={dir}
              src={POLAROID_PHOTOS[current]}
              alt={captions[current]}
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
              style={{
                backgroundColor: `var(--bg-field)`,
              }}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
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
                color: `var(--text-faint)`,
              }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {captions[current]}
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
                    ? `var(--text-faint)`
                    : `var(--border-base)`,
              }}
              aria-label={t("photos.goTo", { index: i + 1 })}
            />
          ))}
        </div>
      </motion.div>
    </Card>
  );
});
