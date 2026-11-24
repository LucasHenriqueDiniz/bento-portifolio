import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/Card";

const SLIDE_MS = 4200;
const SLIDES = [
  "/gallery/thumbs/pingo-bored.webp",
  "/gallery/thumbs/bully.webp",
  "/gallery/thumbs/snake-babe.webp",
  "/gallery/thumbs/lili_bed.webp",
  "/gallery/thumbs/wip-school-entrance-background.webp",
];

/**
 * The way into the gallery: its drawings fading into one another, each drifting
 * slowly while it is up, under a bar per drawing that fills as its turn runs.
 */
export function GalleryCard() {
  const { t } = useTranslation("home");
  const still = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (still) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(timer);
  }, [still]);

  return (
    <Card className="h-full overflow-hidden" glowColor="var(--accent-glow)">
      <a href="/gallery" className="group relative block h-full overflow-hidden bg-[#181413]">
        <AnimatePresence>
          <motion.img
            key={SLIDES[index]}
            src={SLIDES[index]}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.14 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.9 }, scale: { duration: SLIDE_MS / 1000 + 1, ease: "linear" } }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />

        <div className="relative z-10 flex h-full flex-col justify-between p-3 text-white">
          <div>
            <div className="flex gap-1" aria-hidden>
              {SLIDES.map((slide, i) => (
                <span key={slide} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
                  {i < index && <span className="block h-full bg-white/80" />}
                  {i === index && !still && (
                    <span
                      className="block h-full origin-left rounded-full bg-white"
                      style={{ animation: `project-progress ${SLIDE_MS}ms linear forwards` }}
                    />
                  )}
                </span>
              ))}
            </div>
            <span className="mt-2 inline-block rounded-full border border-white/25 bg-black/35 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
              {t("galleryCta.label")}
            </span>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[15px] font-black tracking-tight leading-tight">{t("galleryCta.title")}</p>
              <p className="mt-0.5 text-[10px] text-white/75">{t("galleryCta.subtitle")}</p>
            </div>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:bg-white group-hover:text-black">
              <ArrowUpRight size={14} aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </a>
    </Card>
  );
}
