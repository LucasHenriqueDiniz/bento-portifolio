import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { WidgetCard } from "@/components/WidgetCard";
import { CardHeader } from "@/components/CardHeader";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

export interface Project {
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
  const ACCENT = "#3d72cc";

  const slideVariants = {
    enter: (dir: number) => ({ x: prefersReducedMotion ? 0 : dir > 0 ? 60 : -60, opacity: prefersReducedMotion ? 1 : 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: prefersReducedMotion ? 0 : dir > 0 ? -60 : 60, opacity: prefersReducedMotion ? 1 : 0 }),
  };

  const blueDot = <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />;

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
        className={`h-full rounded-2xl overflow-hidden ${isDark ? "bg-[#181818] border-[#282828]" : "bg-white border-[#ebebeb]"} border`}
        glowColor="61, 114, 204"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-3 pt-2.5 pb-1">
            <CardHeader
              icon={blueDot}
              title={t("project.featured")}
              rightContent={
                hasProjects && (
                  <span className={`text-[9px] font-medium tabular-nums ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>
                    {activeIndex + 1}/{projectCount}
                  </span>
                )
              }
            />
          </div>

          {/* Body */}
          <div className="flex-1 min-h-0 overflow-hidden relative px-3 pb-2">
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
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <h3 className={`text-[14px] font-bold leading-tight tracking-tight mb-1 ${isDark ? "text-white" : "text-[#111]"}`}>
                        {current.name}
                      </h3>
                      <p className={`text-[10px] leading-snug line-clamp-2 ${isDark ? "text-[#888]" : "text-[#666]"}`}>
                        {current.description}
                      </p>
                    </div>

                    {/* Single line of tech pills */}
                    <div className="flex flex-wrap gap-1 overflow-hidden">
                      {current.techStack.slice(0, 4).map(tech => (
                        <span
                          key={tech}
                          className={`text-[9px] px-1.5 py-0.5 rounded-full border whitespace-nowrap ${isDark ? "bg-white/[0.03] border-white/10 text-[#888]" : "bg-[#f5f5f5] border-[#e0e0e0] text-[#666]"}`}
                        >
                          {tech}
                        </span>
                      ))}
                      {current.techStack.length > 4 && (
                        <span className={`text-[9px] px-1 py-0.5 ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>
                          +{current.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                <p className={`text-[12px] font-bold ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>{t("project.empty.title")}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-between px-3 py-1.5 border-t ${isDark ? "border-white/[0.06]" : "border-[#ebebeb]"}`}>
            <div className="flex items-center gap-1.5">
              {/* Status Badge */}
              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${current?.wip
                ? (isDark ? "bg-amber-400/10 border-amber-400/20 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-700")
                : (isDark ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-700")
              }`}>
                {current?.wip ? t("project.wip") : t("project.done")}
              </span>

              {/* Nav dots */}
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
                        backgroundColor: idx === activeIndex ? ACCENT : isDark ? "#333" : "#ddd",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Arrow nav */}
              {hasProjects && projectCount > 1 && (
                <div className="flex gap-0">
                  <button onClick={goToPrev} className={`p-0.5 rounded transition-all ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"}`}>
                    <ChevronLeft size={12} className={isDark ? "text-[#555]" : "text-[#aaa]"} />
                  </button>
                  <button onClick={goToNext} className={`p-0.5 rounded transition-all ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"}`}>
                    <ChevronRight size={12} className={isDark ? "text-[#555]" : "text-[#aaa]"} />
                  </button>
                </div>
              )}

              {/* View button */}
              {current?.url && (
                <motion.a
                  href={current.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md text-white bg-[#3d72cc] hover:bg-[#2d62bc] transition-colors"
                >
                  {t("project.view")}
                  <ExternalLink size={9} />
                </motion.a>
              )}
            </div>
          </div>

          {/* Progress bar - edge to edge */}
          {hasProjects && projectCount > 1 && (
            <div className="w-full h-[2px]" style={{ background: isDark ? "#222" : "#f0f0f0" }}>
              <motion.div
                className="h-full"
                style={{ backgroundColor: ACCENT }}
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
