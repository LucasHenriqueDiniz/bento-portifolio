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
        <div className="h-full flex flex-col p-4">
          {/* Header */}
          <CardHeader
            icon={blueDot}
            title={t("project.featured")}
            rightContent={
              hasProjects && (
                <span className={`text-[10px] font-medium tabular-nums ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>
                  {activeIndex + 1} / {projectCount}
                </span>
              )
            }
          />

          {/* Body */}
          <div className="flex-1 min-h-0 overflow-hidden relative mt-3">
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
                    {/* Left */}
                    <div className="flex flex-col gap-2.5">
                      <h3 className={`text-[18px] font-bold leading-tight tracking-tight ${isDark ? "text-white" : "text-[#111]"}`}>
                        {current.name}
                      </h3>
                      <p className={`text-[11px] leading-relaxed ${isDark ? "text-[#888]" : "text-[#666]"}`}>
                        {current.description}
                      </p>
                      <div className={`border-l-2 pl-3 py-1.5 rounded-r-md text-[10px] italic leading-relaxed ${isDark ? "border-white/10 text-[#555] bg-white/[0.02]" : "border-[#ddd] text-[#aaa] bg-[#fafafa]"}`}>
                        &ldquo;{current.highlight}&rdquo;
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col gap-3">
                      {/* Stack Pills */}
                      <div>
                        <p className={`text-[9px] font-semibold uppercase tracking-widest mb-1.5 ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>
                          {t("project.techStack")}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {current.techStack.slice(0, 5).map(tech => (
                            <span
                              key={tech}
                              className={`text-[10px] px-2.5 py-1 rounded-full border ${isDark ? "bg-white/[0.03] border-white/10 text-[#888]" : "bg-[#f5f5f5] border-[#e0e0e0] text-[#666]"}`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Meta Grid */}
                      <div>
                        <p className={`text-[9px] font-semibold uppercase tracking-widest mb-1.5 ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>
                          {t("project.details")}
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { key: t("project.type"), val: "Web App" },
                            { key: t("project.status"), val: current.wip ? t("project.wip") : t("project.done"), ok: !current.wip },
                            { key: t("project.scale"), val: current.wip ? "Solo" : "Production" },
                            { key: t("project.access"), val: current.url ? "Public" : "Private" },
                          ].map((meta, i) => (
                            <div key={i} className={`rounded-xl p-2 border ${isDark ? "bg-white/[0.03] border-white/[0.06]" : "bg-[#f8f8f8] border-[#f0f0f0]"}`}>
                              <p className={`text-[8px] uppercase tracking-wider mb-0.5 ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>
                                {meta.key}
                              </p>
                              <p className={`text-[11px] font-medium ${meta.ok ? "text-emerald-500" : (isDark ? "text-white" : "text-[#111]")}`}>
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
                <p className={`text-[13px] font-bold ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>{t("project.empty.title")}</p>
                <p className={`text-[10px] ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>{t("project.empty.description")}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "#ebebeb" }}>
            <div className="flex items-center gap-2">
              {/* Status Badge */}
              <span className={`text-[10px] font-medium px-2 py-1 rounded-md border ${current?.wip
                ? (isDark ? "bg-amber-400/10 border-amber-400/20 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-700")
                : (isDark ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-700")
              }`}>
                {current?.wip ? t("project.wip") : t("project.done")}
              </span>

              {/* Nav dots */}
              {hasProjects && projectCount > 1 && (
                <div className="flex gap-1 ml-1">
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

            <div className="flex items-center gap-1.5">
              {/* Arrow nav */}
              {hasProjects && projectCount > 1 && (
                <div className="flex gap-0.5">
                  <button onClick={goToPrev} className={`p-1 rounded-md transition-all ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"}`}>
                    <ChevronLeft size={14} className={isDark ? "text-[#555]" : "text-[#aaa]"} />
                  </button>
                  <button onClick={goToNext} className={`p-1 rounded-md transition-all ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"}`}>
                    <ChevronRight size={14} className={isDark ? "text-[#555]" : "text-[#aaa]"} />
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
                  className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg text-white bg-[#3d72cc] hover:bg-[#2d62bc] transition-colors"
                >
                  {t("project.view")}
                  <ExternalLink size={10} />
                </motion.a>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {hasProjects && projectCount > 1 && (
            <div className="w-full h-[2px] overflow-hidden mt-3 rounded-full" style={{ background: isDark ? "#222" : "#f0f0f0" }}>
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
