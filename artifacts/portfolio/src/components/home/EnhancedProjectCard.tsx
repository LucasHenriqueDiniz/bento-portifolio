import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useTranslation } from "react-i18next";
import { WidgetCard } from "@/components/WidgetCard";
import { TechIconStack } from "@/components/TechIconStack";
import { ExternalLink, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  highlight: string;
  url?: string;
  wip?: boolean;
}

interface EnhancedProjectCardProps {
  projects: Project[];
  isDark?: boolean;
}

const AUTO_ADVANCE_MS = 7000;
const PROGRESS_INTERVAL = 50;

export function EnhancedProjectCard({
  projects,
  isDark = false,
}: EnhancedProjectCardProps) {
  const { t } = useTranslation("home");
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const hasProjects = Array.isArray(projects) && projects.length > 0;
  const projectCount = hasProjects ? projects.length : 0;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);

  // Respect reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Reset when projects change
  useEffect(() => {
    setActiveIndex(0);
    setProgress(0);
  }, [projects?.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!hasProjects || projectCount <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasProjects, projectCount, activeIndex]);

  // Auto-advance + progress bar
  useEffect(() => {
    if (!hasProjects || projectCount <= 1 || isPaused || isHovered) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / AUTO_ADVANCE_MS) * 100, 100);
      setProgress(pct);

      if (elapsed >= AUTO_ADVANCE_MS) {
        goToNext();
      }
    }, PROGRESS_INTERVAL);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused, isHovered, hasProjects, projectCount]);

  const goTo = useCallback((index: number, dir: number) => {
    if (!hasProjects) return;
    setDirection(dir);
    setActiveIndex(((index % projectCount) + projectCount) % projectCount);
    setProgress(0);
  }, [hasProjects, projectCount]);

  const goToNext = useCallback(() => {
    goTo(activeIndex + 1, 1);
  }, [activeIndex, goTo]);

  const goToPrev = useCallback(() => {
    goTo(activeIndex - 1, -1);
  }, [activeIndex, goTo]);

  // Touch / swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
  };

  // Drag end handler
  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipeThreshold = 50;
    const velocityThreshold = 500;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      goToNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      goToPrev();
    }
  };

  const current = hasProjects ? projects[activeIndex] : null;
  const ACCENT = "#3d72cc";

  const slideVariants = {
    enter: (dir: number) => ({
      x: prefersReducedMotion ? 0 : dir > 0 ? 60 : -60,
      opacity: prefersReducedMotion ? 1 : 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: prefersReducedMotion ? 0 : dir > 0 ? -60 : 60,
      opacity: prefersReducedMotion ? 1 : 0,
    }),
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={t("project.featured")}
      className="outline-none"
    >
      <WidgetCard
        className="h-full rounded-2xl overflow-hidden"
        style={{
          border: isDark ? "1px solid #282828" : "1px solid #ebebeb",
        }}
        glowColor="61, 114, 204"
      >
        <div className="h-full flex flex-col p-3 gap-2">
          {/* Header */}
          <div className="flex items-center justify-between shrink-0">
            <div className="inline-flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ACCENT }} />
              <span className={`text-[9px] font-semibold uppercase tracking-wider ${isDark ? "text-white/70" : "text-[#666]"}`}>
                {t("project.featured")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Pause toggle */}
              {hasProjects && projectCount > 1 && (
                <button
                  onClick={() => setIsPaused((p) => !p)}
                  className={`p-1 rounded-md transition-all ${isDark ? "hover:bg-white/8 text-white/40" : "hover:bg-[#f0f0f0] text-[#999]"}`}
                  title={isPaused ? t("project.play") : t("project.pause")}
                  aria-label={isPaused ? t("project.play") : t("project.pause")}
                >
                  {isPaused ? <Play size={10} /> : <Pause size={10} />}
                </button>
              )}
              {hasProjects && (
                <span className={`text-[8px] font-semibold ${isDark ? "text-white/40" : "text-[#999]"}`}>
                  {activeIndex + 1}/{projectCount}
                </span>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-h-0 overflow-hidden relative">
            {hasProjects && current ? (
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`${activeIndex}-${current.name}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.3,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  drag={projectCount > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={handleDragEnd}
                  className="h-full flex flex-col gap-2 cursor-grab active:cursor-grabbing"
                >
                  {/* Project Name & Description */}
                  <div className="shrink-0">
                    <h3 className={`text-[14px] font-black leading-tight mb-1 ${isDark ? "text-white" : "text-[#111]"}`}>
                      {current.name}
                    </h3>
                    <p className={`text-[10px] leading-snug line-clamp-3 ${isDark ? "text-white/60" : "text-[#555]"}`}>
                      {current.description}
                    </p>
                  </div>

                  {/* Highlight */}
                  <div className={`rounded-lg p-2 border text-[9px] leading-snug shrink-0 ${isDark ? "bg-white/3 border-white/8 text-white/70" : "bg-[#f5f5f5] border-[#ebebeb] text-[#666]"}`}>
                    <p className="italic">&ldquo;{current.highlight}&rdquo;</p>
                  </div>

                  {/* Tech Stack */}
                  {current.techStack && current.techStack.length > 0 && (
                    <div className={`rounded-lg p-2 border shrink-0 ${isDark ? "bg-white/3 border-white/8" : "bg-[#f5f5f5] border-[#ebebeb]"}`}>
                      <p className={`text-[7px] uppercase tracking-widest font-bold mb-1.5 ${isDark ? "text-white/40" : "text-[#999]"}`}>
                        {t("project.techStack")}
                      </p>
                      <TechIconStack techs={current.techStack.slice(0, 6)} className="flex-wrap" />
                    </div>
                  )}

                  {/* CTA + Status */}
                  <div className="flex items-center gap-1.5 mt-auto shrink-0">
                    {current.url && (
                      <motion.a
                        href={current.url}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition-all ${isDark ? "bg-[#3d72cc] hover:bg-[#3d72cc]/90 text-white" : "bg-[#3d72cc] hover:bg-[#3d72cc]/90 text-white"}`}
                      >
                        {t("project.view")}
                        <ExternalLink size={10} />
                      </motion.a>
                    )}
                    <span className={`text-[8px] font-bold rounded-md px-1.5 py-0.5 ${current.wip ? (isDark ? "bg-orange-400/20 border border-orange-300/25 text-orange-200" : "bg-orange-100 border border-orange-200 text-orange-700") : (isDark ? "bg-emerald-400/20 border border-emerald-300/25 text-emerald-200" : "bg-emerald-100 border border-emerald-200 text-emerald-700")}`}>
                      {current.wip ? t("project.wip") : t("project.done")}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                <p className={`text-[13px] font-bold ${isDark ? "text-white/50" : "text-[#999]"}`}>
                  {t("project.empty.title")}
                </p>
                <p className={`text-[10px] ${isDark ? "text-white/30" : "text-[#bbb]"}`}>
                  {t("project.empty.description")}
                </p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {hasProjects && projectCount > 1 && !isPaused && (
            <div className="w-full h-[2px] rounded-full overflow-hidden shrink-0 bg-[#ebebeb] dark:bg-[#333]">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: ACCENT }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: "linear" }}
              />
            </div>
          )}

          {/* Navigation */}
          {hasProjects && projectCount > 1 && (
            <div className="flex items-center justify-between gap-1 shrink-0">
              {/* Dots with progress */}
              <div className="flex gap-1.5">
                {projects.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx, idx > activeIndex ? 1 : -1)}
                    className="group relative flex items-center justify-center"
                    aria-label={`${t("project.goTo")} ${p.name}`}
                    aria-current={idx === activeIndex ? "true" : undefined}
                  >
                    <div
                      className={`rounded-full transition-all duration-300 ${
                        idx === activeIndex
                          ? `w-4 h-1.5 ${isDark ? "bg-white" : "bg-[#111]"}`
                          : `w-1.5 h-1.5 ${isDark ? "bg-white/20 group-hover:bg-white/40" : "bg-[#ddd] group-hover:bg-[#aaa]"}`
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Arrow buttons */}
              <div className="flex gap-1">
                <button
                  onClick={goToPrev}
                  className={`p-1 rounded-md transition-all ${isDark ? "hover:bg-white/8" : "hover:bg-[#f0f0f0]"}`}
                  title={t("project.previous")}
                  aria-label={t("project.previous")}
                >
                  <ChevronLeft size={14} className={isDark ? "text-white/40" : "text-[#999]"} />
                </button>
                <button
                  onClick={goToNext}
                  className={`p-1 rounded-md transition-all ${isDark ? "hover:bg-white/8" : "hover:bg-[#f0f0f0]"}`}
                  title={t("project.next")}
                  aria-label={t("project.next")}
                >
                  <ChevronRight size={14} className={isDark ? "text-white/40" : "text-[#999]"} />
                </button>
              </div>
            </div>
          )}
        </div>
      </WidgetCard>
    </div>
  );
}
