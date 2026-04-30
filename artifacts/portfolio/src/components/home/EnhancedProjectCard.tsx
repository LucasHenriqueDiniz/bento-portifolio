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
  const [layoutVariant, setLayoutVariant] = useState(1);

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

  // ─── 9 Layout Variants ─────────────────────────────────
  const renderContent = () => {
    if (!current) return null;

    const content = (
      <>
        <h3 className={`text-[14px] font-bold leading-tight tracking-tight ${isDark ? "text-white" : "text-[#111]"}`}>
          {current.name}
        </h3>
        <p className={`text-[10px] leading-snug line-clamp-2 ${isDark ? "text-[#888]" : "text-[#666]"}`}>
          {current.description}
        </p>
        <div className={`border-l-2 pl-2 py-1 rounded-r-md text-[9px] italic leading-relaxed ${isDark ? "border-white/10 text-[#555] bg-white/[0.02]" : "border-[#ddd] text-[#aaa] bg-[#fafafa]"}`}>
          &ldquo;{current.highlight}&rdquo;
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {current.techStack.slice(0, 6).map(tech => (
            <span key={tech} className={`text-[9px] px-1.5 py-0.5 rounded-full border whitespace-nowrap ${isDark ? "bg-white/[0.03] border-white/10 text-[#888]" : "bg-[#f5f5f5] border-[#e0e0e0] text-[#666]"}`}>
              {tech}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1 mt-1">
          <div className={`rounded-lg p-1.5 border ${isDark ? "bg-white/[0.03] border-white/[0.06]" : "bg-[#f8f8f8] border-[#f0f0f0]"}`}>
            <p className={`text-[7px] uppercase tracking-wider mb-0.5 ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>{t("project.type")}</p>
            <p className={`text-[10px] font-medium ${isDark ? "text-white" : "text-[#111]"}`}>Web App</p>
          </div>
          <div className={`rounded-lg p-1.5 border ${isDark ? "bg-white/[0.03] border-white/[0.06]" : "bg-[#f8f8f8] border-[#f0f0f0]"}`}>
            <p className={`text-[7px] uppercase tracking-wider mb-0.5 ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>{t("project.status")}</p>
            <p className={`text-[10px] font-medium ${current.wip ? "text-amber-500" : "text-emerald-500"}`}>{current.wip ? t("project.wip") : t("project.done")}</p>
          </div>
        </div>
      </>
    );

    switch (layoutVariant) {
      case 1: // Thumbnail lateral esquerda
        return (
          <div className="h-full flex gap-2">
            {current.image && (
              <div className="w-20 h-full rounded-lg overflow-hidden shrink-0">
                <img src={current.image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0 flex flex-col justify-between">{content}</div>
          </div>
        );

      case 2: // Banner no topo
        return (
          <div className="h-full flex flex-col">
            {current.image && (
              <div className="h-16 rounded-lg overflow-hidden mb-2">
                <img src={current.image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">{content}</div>
          </div>
        );

      case 3: // Sem imagem, só texto
        return <div className="h-full flex flex-col justify-between">{content}</div>;

      case 4: // Imagem de canto (top-right)
        return (
          <div className="h-full flex flex-col justify-between relative">
            {current.image && (
              <div className="absolute top-0 right-0 w-16 h-16 rounded-lg overflow-hidden opacity-60">
                <img src={current.image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="relative z-10">{content}</div>
          </div>
        );

      case 5: // Full background blur sutil
        return (
          <div className="h-full flex flex-col justify-between">
            {content}
          </div>
        );

      case 6: // Imagem circular no header
        return (
          <div className="h-full flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {current.image && (
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border-2" style={{ borderColor: ACCENT }}>
                  <img src={current.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className={`text-[14px] font-bold leading-tight tracking-tight ${isDark ? "text-white" : "text-[#111]"}`}>
                {current.name}
              </h3>
            </div>
            <div className="flex-1">{content}</div>
          </div>
        );

      case 7: // Imagem ocupa metade direita com overlay
        return (
          <div className="h-full grid grid-cols-2 gap-0 rounded-lg overflow-hidden">
            <div className="p-2 flex flex-col justify-between">
              <div>
                <h3 className={`text-[13px] font-bold leading-tight mb-1 ${isDark ? "text-white" : "text-[#111]"}`}>{current.name}</h3>
                <p className={`text-[9.5px] leading-snug line-clamp-2 ${isDark ? "text-[#888]" : "text-[#666]"}`}>{current.description}</p>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {current.techStack.slice(0, 4).map(tech => (
                  <span key={tech} className={`text-[8px] px-1 py-0.5 rounded-full border ${isDark ? "bg-white/[0.03] border-white/10 text-[#888]" : "bg-[#f5f5f5] border-[#e0e0e0] text-[#666]"}`}>{tech}</span>
                ))}
              </div>
            </div>
            {current.image && (
              <div className="relative">
                <img src={current.image} alt="" className="w-full h-full object-cover" />
                <div className={`absolute inset-0 ${isDark ? "bg-black/40" : "bg-black/20"}`} />
              </div>
            )}
          </div>
        );

      case 8: // Imagem grande à esquerda com conteúdo sobreposto
        return (
          <div className="h-full flex relative rounded-lg overflow-hidden">
            {current.image && (
              <div className="absolute inset-0">
                <img src={current.image} alt="" className="w-full h-full object-cover" />
                <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-r from-black/90 via-black/70 to-black/40" : "bg-gradient-to-r from-white/90 via-white/70 to-white/40"}`} />
              </div>
            )}
            <div className="relative z-10 p-2 flex flex-col justify-between max-w-[65%]">
              <div>
                <h3 className={`text-[13px] font-bold leading-tight mb-1 ${isDark ? "text-white" : "text-[#111]"}`}>{current.name}</h3>
                <p className={`text-[9px] leading-snug line-clamp-2 ${isDark ? "text-white/70" : "text-[#555]"}`}>{current.description}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {current.techStack.slice(0, 4).map(tech => (
                  <span key={tech} className={`text-[8px] px-1 py-0.5 rounded-full border ${isDark ? "bg-white/10 border-white/20 text-white/70" : "bg-white/60 border-white/40 text-[#555]"}`}>{tech}</span>
                ))}
              </div>
            </div>
          </div>
        );

      case 9: // Imagem flutuante com sombra no canto inferior direito
        return (
          <div className="h-full flex flex-col justify-between relative">
            {current.image && (
              <div className="absolute -bottom-1 -right-1 w-20 h-20 rounded-xl overflow-hidden shadow-lg border-2 z-0" style={{ borderColor: isDark ? "#333" : "#fff" }}>
                <img src={current.image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="relative z-10">{content}</div>
          </div>
        );

      default:
        return <div className="h-full flex flex-col justify-between">{content}</div>;
    }
  };

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
        <div className="h-full flex flex-col relative">
          {/* Variant 5: blurred background */}
          {layoutVariant === 5 && current?.image && (
            <div className="absolute inset-0 overflow-hidden rounded-2xl z-0">
              <img
                src={current.image}
                alt=""
                className="w-full h-full object-cover"
                style={{
                  filter: "blur(8px) saturate(1.2) brightness(0.85)",
                  transform: "scale(1.05)",
                }}
              />
              <div className={`absolute inset-0 ${isDark ? "bg-black/50" : "bg-white/55"}`} />
            </div>
          )}

          {/* Header with layout variant selector */}
          <div className="relative z-10 px-3 pt-2 pb-1">
            <CardHeader
              icon={blueDot}
              title={t("project.featured")}
              rightContent={
                <div className="flex items-center gap-1.5">
                  {/* Layout variant selector (1-9) */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 9 }, (_, i) => i + 1).map(v => (
                      <button
                        key={v}
                        onClick={() => setLayoutVariant(v)}
                        className={`w-4 h-4 rounded text-[7px] font-bold transition-all ${layoutVariant === v
                          ? "bg-[#3d72cc] text-white"
                          : (isDark ? "bg-white/10 text-[#555] hover:bg-white/15" : "bg-[#f0f0f0] text-[#999] hover:bg-[#e0e0e0]")
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  {/* Project counter */}
                  {hasProjects && (
                    <span className={`text-[9px] font-medium tabular-nums ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>
                      {activeIndex + 1}/{projectCount}
                    </span>
                  )}
                </div>
              }
            />
          </div>

          {/* Body */}
          <div className={`relative z-10 flex-1 min-h-0 overflow-hidden px-3 pb-2`}>
            {hasProjects && current ? (
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`${activeIndex}-${current.name}-${layoutVariant}`}
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
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                <p className={`text-[12px] font-bold ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>{t("project.empty.title")}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`relative z-10 flex items-center justify-between px-3 py-1.5 border-t ${isDark ? "border-white/[0.06]" : "border-[#ebebeb]"}`}>
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
                        backgroundColor: idx === activeIndex ? ACCENT : isDark ? "#333" : "#ddd",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
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

          {/* Progress bar */}
          {hasProjects && projectCount > 1 && (
            <div className="relative z-10 w-full h-[2px]" style={{ background: isDark ? "#222" : "#f0f0f0" }}>
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
