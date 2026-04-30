import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { WidgetCard } from "@/components/WidgetCard";
import { TechIconStack } from "@/components/TechIconStack";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

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

export function EnhancedProjectCard({
  projects,
  isDark = false,
}: EnhancedProjectCardProps) {
  const { t } = useTranslation("home");

  const hasProjects = Array.isArray(projects) && projects.length > 0;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Reset index when projects change
  useEffect(() => {
    setActiveIndex(0);
  }, [projects?.length]);

  // Auto-advance carousel
  useEffect(() => {
    if (isHovered || !hasProjects || projects.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isHovered, hasProjects, projects?.length]);

  const current = hasProjects ? projects[activeIndex] : null;
  const ACCENT = "#3d72cc";

  const handlePrev = () => {
    if (!hasProjects) return;
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleNext = () => {
    if (!hasProjects) return;
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            {hasProjects && (
              <span className={`text-[8px] font-semibold ${isDark ? "text-white/40" : "text-[#999]"}`}>
                {activeIndex + 1}/{projects.length}
              </span>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {hasProjects && current ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeIndex}-${current.name}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="h-full flex flex-col gap-2"
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

          {/* Navigation */}
          {hasProjects && projects.length > 1 && (
            <div className="flex items-center justify-between gap-1 shrink-0">
              <div className="flex gap-1">
                {projects.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1 rounded-full transition-all ${
                      idx === activeIndex
                        ? `w-3 ${isDark ? "bg-white" : "bg-[#111]"}`
                        : `w-1 ${isDark ? "bg-white/20 hover:bg-white/40" : "bg-[#ddd] hover:bg-[#aaa]"}`
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={handlePrev}
                  className={`p-1 rounded-md transition-all ${isDark ? "hover:bg-white/8" : "hover:bg-[#f0f0f0]"}`}
                  title={t("project.previous")}
                >
                  <ChevronLeft size={14} className={isDark ? "text-white/40" : "text-[#999]"} />
                </button>
                <button
                  onClick={handleNext}
                  className={`p-1 rounded-md transition-all ${isDark ? "hover:bg-white/8" : "hover:bg-[#f0f0f0]"}`}
                  title={t("project.next")}
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
