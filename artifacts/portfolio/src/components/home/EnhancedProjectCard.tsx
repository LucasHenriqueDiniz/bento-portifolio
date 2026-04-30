import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { WidgetCard } from "@/components/WidgetCard";
import { ExternalLink, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

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
  const [isPaused, setIsPaused] = useState(false);
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
      else if (e.key === " ") { e.preventDefault(); setIsPaused(p => !p); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasProjects, projectCount, activeIndex]);

  useEffect(() => {
    if (!hasProjects || projectCount <= 1 || isPaused || isHovered) {
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
  }, [activeIndex, isPaused, isHovered, hasProjects, projectCount]);

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

  // Bento-style colors
  const borderColor = isDark ? "#282828" : "#ebebeb";
  const bgPrimary = isDark ? "#181818" : "#fff";
  const bgSecondary = isDark ? "#222" : "#f5f5f5";
  const textPrimary = isDark ? "#eee" : "#111";
  const textSecondary = isDark ? "#888" : "#666";
  const textTertiary = isDark ? "#555" : "#aaa";

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
        className="h-full rounded-[20px] overflow-hidden"
        style={{ border: `0.5px solid ${borderColor}`, background: bgPrimary }}
        glowColor="61, 114, 204"
      >
        <div className="h-full flex flex-col">
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "#ebebeb" }}>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
              <span className="text-[10px] font-medium uppercase tracking-[0.08em]" style={{ color: textTertiary, fontFamily: "'DM Mono', monospace" }}>
                {t("project.featured")}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              {hasProjects && projectCount > 1 && (
                <button
                  onClick={() => setIsPaused(p => !p)}
                  className="p-1 rounded-md transition-all hover:bg-black/5 dark:hover:bg-white/5"
                  title={isPaused ? t("project.play") : t("project.pause")}
                >
                  {isPaused ? <Play size={10} style={{ color: textTertiary }} /> : <Pause size={10} style={{ color: textTertiary }} />}
                </button>
              )}
              {hasProjects && (
                <span className="text-[10px] font-medium" style={{ color: textTertiary, fontFamily: "'DM Mono', monospace" }}>
                  {activeIndex + 1} / {projectCount}
                </span>
              )}
            </div>
          </div>

          {/* ── Body ── */}
          <div className="flex-1 min-h-0 overflow-hidden relative px-5 pt-4 pb-3">
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
                  <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left: Title + Description + Highlight */}
                    <div className="flex flex-col gap-3">
                      <h3
                        className="text-[22px] font-extrabold leading-[1.05] tracking-[-0.03em]"
                        style={{ color: textPrimary, fontFamily: "'Syne', sans-serif" }}
                      >
                        {current.name}
                      </h3>
                      <p
                        className="text-[11px] leading-relaxed"
                        style={{ color: textSecondary, fontFamily: "'DM Mono', monospace" }}
                      >
                        {current.description}
                      </p>
                      <div
                        className="border-l-2 pl-3 py-1.5 rounded-r-md text-[10px] italic leading-relaxed"
                        style={{
                          borderColor: isDark ? "rgba(255,255,255,0.12)" : "#ddd",
                          color: textTertiary,
                          fontFamily: "'DM Mono', monospace",
                          background: isDark ? "rgba(255,255,255,0.02)" : "#fafafa",
                        }}
                      >
                        &ldquo;{current.highlight}&rdquo;
                      </div>
                    </div>

                    {/* Right: Stack + Meta Grid */}
                    <div className="flex flex-col gap-3">
                      {/* Stack Pills */}
                      <div>
                        <p
                          className="text-[9px] font-medium uppercase tracking-[0.1em] mb-2"
                          style={{ color: textTertiary, fontFamily: "'DM Mono', monospace" }}
                        >
                          {t("project.techStack")}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {current.techStack.slice(0, 5).map(tech => (
                            <span
                              key={tech}
                              className="text-[10px] px-2.5 py-1 rounded-full border"
                              style={{
                                fontFamily: "'DM Mono', monospace",
                                color: textSecondary,
                                borderColor: isDark ? "rgba(255,255,255,0.1)" : "#e0e0e0",
                                background: bgSecondary,
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Meta Grid */}
                      <div>
                        <p
                          className="text-[9px] font-medium uppercase tracking-[0.1em] mb-2"
                          style={{ color: textTertiary, fontFamily: "'DM Mono', monospace" }}
                        >
                          {t("project.details")}
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { key: t("project.type"), val: "Web App" },
                            { key: t("project.status"), val: current.wip ? t("project.wip") : t("project.done"), ok: !current.wip },
                            { key: t("project.scale"), val: current.wip ? "Solo" : "Production" },
                            { key: t("project.access"), val: current.url ? "Public" : "Private" },
                          ].map((meta, i) => (
                            <div
                              key={i}
                              className="rounded-[10px] p-2 border"
                              style={{
                                background: bgSecondary,
                                borderColor: isDark ? "rgba(255,255,255,0.06)" : "#f0f0f0",
                              }}
                            >
                              <p
                                className="text-[8px] uppercase tracking-[0.09em] mb-0.5"
                                style={{ color: textTertiary, fontFamily: "'DM Mono', monospace" }}
                              >
                                {meta.key}
                              </p>
                              <p
                                className="text-[11px] font-medium"
                                style={{
                                  color: meta.ok ? "#22c55e" : textPrimary,
                                  fontFamily: "'DM Mono', monospace",
                                }}
                              >
                                {meta.val}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                <p className="text-[13px] font-bold" style={{ color: textTertiary }}>{t("project.empty.title")}</p>
                <p className="text-[10px]" style={{ color: textTertiary }}>{t("project.empty.description")}</p>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div
            className="flex items-center justify-between px-5 py-3 border-t"
            style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "#ebebeb" }}
          >
            <div className="flex items-center gap-2">
              {/* Status Badge */}
              <span
                className="text-[10px] font-medium px-2 py-1 rounded-md"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  background: current?.wip
                    ? (isDark ? "rgba(245,158,11,0.12)" : "#fef3c7")
                    : (isDark ? "rgba(34,197,94,0.12)" : "#dcfce7"),
                  color: current?.wip
                    ? (isDark ? "#fbbf24" : "#b45309")
                    : (isDark ? "#4ade80" : "#15803d"),
                  border: `0.5px solid ${current?.wip
                    ? (isDark ? "rgba(245,158,11,0.2)" : "#fde68a")
                    : (isDark ? "rgba(34,197,94,0.2)" : "#bbf7d0")}`,
                }}
              >
                {current?.wip ? t("project.wip") : t("project.done")}
              </span>

              {/* Nav dots */}
              {hasProjects && projectCount > 1 && (
                <div className="flex gap-1 ml-2">
                  {projects.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(idx, idx > activeIndex ? 1 : -1)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: idx === activeIndex ? 14 : 4,
                        height: 4,
                        backgroundColor: idx === activeIndex ? ACCENT : isDark ? "#333" : "#ddd",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Arrow nav */}
              {hasProjects && projectCount > 1 && (
                <div className="flex gap-0.5 mr-1">
                  <button onClick={goToPrev} className="p-1 rounded-md transition-all hover:bg-black/5 dark:hover:bg-white/5">
                    <ChevronLeft size={14} style={{ color: textTertiary }} />
                  </button>
                  <button onClick={goToNext} className="p-1 rounded-md transition-all hover:bg-black/5 dark:hover:bg-white/5">
                    <ChevronRight size={14} style={{ color: textTertiary }} />
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
                  className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg text-white"
                  style={{
                    background: ACCENT,
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {t("project.view")}
                  <ExternalLink size={10} />
                </motion.a>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {hasProjects && projectCount > 1 && !isPaused && (
            <div className="w-full h-[2px] overflow-hidden" style={{ background: isDark ? "#222" : "#f0f0f0" }}>
              <motion.div
                className="h-full rounded-full"
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
