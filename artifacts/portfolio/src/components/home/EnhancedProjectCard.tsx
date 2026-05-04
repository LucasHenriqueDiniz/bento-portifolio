import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { WidgetCard } from "@/components/WidgetCard";
import { CardHeader } from "@/components/CardHeader";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  highlight: string;
  url?: string;
  wip?: boolean;
  image?: string;
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
  const [, setLocation] = useLocation();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const hasProjects = Array.isArray(projects) && projects.length > 0;
  const projectCount = hasProjects ? projects.length : 0;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    setActiveIndex(0);
    setProgress(0);
  }, [projects?.length]);

  useEffect(() => {
    if (!hasProjects || projectCount <= 1) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); goToPrev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); goToNext(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasProjects, projectCount, activeIndex]);

  useEffect(() => {
    if (!hasProjects || projectCount <= 1 || isHovered) {
      setProgress(0); return;
    }
    setProgress(0);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / AUTO_ADVANCE_MS) * 100, 100);
      setProgress(pct);
      if (elapsed >= AUTO_ADVANCE_MS) goToNext();
    }, PROGRESS_INTERVAL);
    return () => clearInterval(interval);
  }, [activeIndex, isHovered, hasProjects, projectCount]);

  const goTo = useCallback((index: number, dir: number) => {
    if (!hasProjects) return;
    setDirection(dir);
    setActiveIndex(((index % projectCount) + projectCount) % projectCount);
    setProgress(0);
  }, [hasProjects, projectCount]);

  const goToNext = useCallback(() => goTo(activeIndex + 1, 1), [activeIndex, goTo]);
  const goToPrev = useCallback(() => goTo(activeIndex - 1, -1), [activeIndex, goTo]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext(); else goToPrev();
    }
  };

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x < -50 || info.velocity.x < -500) goToNext();
    else if (info.offset.x > 50 || info.velocity.x > 500) goToPrev();
  };

  const current = hasProjects ? projects[activeIndex] : null;

  const slideVariants = {
    enter: (dir: number) => ({ x: prefersReducedMotion ? 0 : dir > 0 ? 60 : -60, opacity: prefersReducedMotion ? 1 : 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: prefersReducedMotion ? 0 : dir > 0 ? -60 : 60, opacity: prefersReducedMotion ? 1 : 0 }),
  };

  const blueDot = <span className="w-1.5 h-1.5 rounded-full bg-brand" />;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={t("project.featured")}
      className="outline-none h-full"
    >
      <WidgetCard
        className="h-full rounded-2xl overflow-hidden bg-panel border border-base"
        glowColor="var(--accent-glow)"
      >
        <div className="h-full flex flex-col">
          <div className="px-3 pt-2.5 pb-1">
            <CardHeader
              icon={blueDot}
              title={t("project.featured")}
              rightContent={
                hasProjects && (
                  <span className="text-[9px] font-medium tabular-nums text-faint">
                    {activeIndex + 1}/{projectCount}
                  </span>
                )
              }
            />
          </div>

          <div className="flex-1 min-h-0 overflow-hidden px-3 pb-2">
            {hasProjects && current ? (
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`${activeIndex}-${current.name}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.32, 0.72, 0, 1] }}
                  drag={projectCount > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={handleDragEnd}
                  className="h-full cursor-grab active:cursor-grabbing"
                >
                    <div className="h-full grid grid-cols-2 gap-0 rounded-lg overflow-hidden border border-base">
                    <div className="p-2.5 flex flex-col justify-start gap-2">
                      <h3 className="text-[13px] font-bold leading-tight text-main">{current.name}</h3>
                      <p className="text-[10px] leading-snug line-clamp-3 text-sub">{current.description}</p>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {current.techStack.slice(0, 4).map(tech => (
                          <span key={tech} className="text-[8px] px-1.5 py-0.5 rounded-full bg-field text-faint">{tech}</span>
                        ))}
                      </div>
                    </div>

                    <div className="relative h-full">
                      <img src={current.image || "/logo.svg"} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/40" />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                <p className="text-[12px] font-bold text-faint">{t("project.empty.title")}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-3 py-1.5 border-t border-base">
            <div className="flex items-center gap-1.5">
              {hasProjects && projectCount > 1 && (
                <div className="flex gap-0.5">
                  {projects.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(idx, idx > activeIndex ? 1 : -1)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: idx === activeIndex ? 10 : 3,
                        height: 3,
                        backgroundColor: idx === activeIndex ? `var(--accent)` : `var(--border-base)`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              {hasProjects && projectCount > 1 && (
                <div className="flex gap-0">
                  <button onClick={goToPrev} className="p-0.5 rounded transition-all hover:bg-black/5 dark:hover:bg-white/5">
                    <ChevronLeft size={12} className="text-faint" />
                  </button>
                  <button onClick={goToNext} className="p-0.5 rounded transition-all hover:bg-black/5 dark:hover:bg-white/5">
                    <ChevronRight size={12} className="text-faint" />
                  </button>
                </div>
              )}

              {current?.id && (
                <motion.button
                  type="button"
                  onClick={() => setLocation(`/projects/${current.id}`)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md text-white bg-brand hover:bg-brand-hover transition-colors"
                >
                  {t("project.view")}
                  <ExternalLink size={9} />
                </motion.button>
              )}
            </div>
          </div>

          {hasProjects && projectCount > 1 && (
            <div className="w-full h-[2px] bg-field">
              <motion.div
                className="h-full"
                style={{ backgroundColor: `var(--accent)` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: "linear" }}
              />
            </div>
          )}
        </div>
      </WidgetCard>
    </div>
  );
}
