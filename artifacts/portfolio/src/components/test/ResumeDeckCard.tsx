import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { ArrowUpRight, Briefcase } from "lucide-react";
import { Card } from "@/components/Card";
import { jobExperiences } from "@/constants/jobExperiences";
import { formatDateRange } from "@/lib/dateFormatter";

const SHUFFLE_MS = 3200;
const VISIBLE = 3;

/**
 * The career as a deck of cards: the current job on top, earlier ones fanned behind
 * it. Every few seconds the top card slides away to the back and the next comes up, so
 * the card pages through the whole history. Hovering holds it; the card opens the résumé.
 */
export function ResumeDeckCard() {
  const { t, i18n } = useTranslation(["home", "resume"]);
  const [, setLocation] = useLocation();
  const still = useReducedMotion() ?? false;
  const [top, setTop] = useState(0);
  const [paused, setPaused] = useState(false);
  const jobs = jobExperiences;
  const english = i18n.language.startsWith("en");

  useEffect(() => {
    if (paused || still || jobs.length < 2) return;
    const timer = setInterval(() => setTop((n) => (n + 1) % jobs.length), SHUFFLE_MS);
    return () => clearInterval(timer);
  }, [paused, still, jobs.length]);

  // The top card and the ones peeking behind it, front first.
  const deck = Array.from({ length: Math.min(VISIBLE, jobs.length) }, (_, depth) => jobs[(top + depth) % jobs.length]);

  return (
    <Card className="h-full" glowColor="255, 200, 100" glowIntensity={1.4}>
      <button
        type="button"
        onClick={() => setLocation("/resume")}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-label={t("cv.viewFull")}
        className="group relative h-full w-full overflow-hidden p-3 flex flex-col text-left text-white outline-none focus-visible:ring-2 focus-visible:ring-white"
        style={{ borderRadius: "inherit", background: "linear-gradient(150deg, var(--accent) 0%, var(--accent-hover) 100%)" }}
      >
        <span aria-hidden className="absolute -top-16 -right-12 h-40 w-40 rounded-full bg-white/20 blur-2xl" />

        <span className="relative flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/85">
            <Briefcase size={11} />
            {t("cv.title")}
          </span>
          <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 group-hover:rotate-45 group-hover:bg-white/35">
            <ArrowUpRight size={13} />
          </span>
        </span>

        <span className="relative mt-auto block h-[58%] min-h-[84px]">
          <AnimatePresence initial={false}>
            {deck
              .map((job, depth) => ({ job, depth }))
              .reverse()
              .map(({ job, depth }) => (
                <motion.span
                  key={job.id}
                  className="absolute inset-x-0 bottom-0 block rounded-xl bg-white px-2.5 py-2 text-[#1c2536] shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
                  style={{ transformOrigin: "50% 100%", zIndex: VISIBLE - depth }}
                  initial={{ opacity: 0, y: -18, scale: 0.86 }}
                  animate={{ opacity: depth === 0 ? 1 : 0.9 - depth * 0.2, y: -depth * 13, scale: 1 - depth * 0.06 }}
                  exit={{ opacity: 0, x: 60, rotate: 9, transition: { duration: still ? 0 : 0.35, ease: "easeIn" } }}
                  transition={{ type: "spring", stiffness: 230, damping: 24 }}
                >
                  <span className="flex items-center gap-2">
                    {job.icon?.startsWith("/") ? (
                      <img src={job.icon} alt="" className="h-7 w-7 shrink-0 rounded-lg object-cover bg-[#eef1f6]" />
                    ) : (
                      <span className="h-7 w-7 shrink-0 rounded-lg bg-[#eef1f6] flex items-center justify-center">
                        <Briefcase size={13} className="text-[#6b778a]" />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-[11px] font-bold leading-tight">{english && job.titleEn ? job.titleEn : job.title}</span>
                      <span className="block truncate text-[9px] leading-tight text-[#6b778a]">{job.institution}</span>
                    </span>
                  </span>
                  <span className="mt-1.5 flex items-center justify-between text-[8px] font-medium uppercase tracking-wider text-[#8a95a6]">
                    <span>{formatDateRange(job.startDate, job.endDate, i18n.language, t("resume:status.present"))}</span>
                    {depth === 0 && (
                      <span className="tabular-nums">
                        {top + 1}/{jobs.length}
                      </span>
                    )}
                  </span>
                </motion.span>
              ))}
          </AnimatePresence>
        </span>
      </button>
    </Card>
  );
}
