import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { WidgetCard } from "@/components/WidgetCard";
import { TechIconStack } from "@/components/TechIconStack";
import { cn } from "@/lib/utils";
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
  const safeProjects = useMemo(
    () => (Array.isArray(projects) && projects.length ? projects : [emptyProject]),
    [projects],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered || safeProjects.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeProjects.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isHovered, safeProjects.length]);

  const current = safeProjects[activeIndex];
  const ACCENT = "#3d72cc";

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + safeProjects.length) % safeProjects.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % safeProjects.length);
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
        <div className="relative h-full flex flex-col p-3 gap-2">
          {/* Header */}
          <div className="flex items-center justify-between shrink-0">
            <div className="inline-flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ACCENT }} />
              <span className={`text-[9px] font-semibold uppercase tracking-wider ${isDark ? "text-white/70" : "text-[#666]"}`}>
                Featured Project
              </span>
            </div>
            <span className={`text-[8px] font-semibold ${isDark ? "text-white/40" : "text-[#999]"}`}>
              {activeIndex + 1}/{safeProjects.length}
            </span>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-h-0 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeIndex}-${current.name}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col gap-2"
              >
                {/* Project Name & Description */}
                <div>
                  <h3 className={`text-[14px] font-black leading-tight mb-1 ${isDark ? "text-white" : "text-[#111]"}`}>
                    {current.name}
                  </h3>
                  <p className={`text-[10px] leading-snug ${isDark ? "text-white/60" : "text-[#555]"}`}>
                    {current.description}
                  </p>
                </div>

                {/* Highlight */}
                <div className={`rounded-lg p-2 border text-[9px] leading-snug ${isDark ? "bg-white/3 border-white/8 text-white/70" : "bg-[#f5f5f5] border-[#ebebeb] text-[#666]"}`}>
                  <p className="italic">"{current.highlight}"</p>
                </div>

                {/* Tech Stack */}
                {current.techStack.length > 0 && (
                  <div className={`rounded-lg p-2 border shrink-0 ${isDark ? "bg-white/3 border-white/8" : "bg-[#f5f5f5] border-[#ebebeb]"}`}>
                    <p className={`text-[7px] uppercase tracking-widest font-bold mb-1.5 ${isDark ? "text-white/40" : "text-[#999]"}`}>
                      Tech Stack
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
                      View
                      <ExternalLink size={10} />
                    </motion.a>
                  )}
                  <span className={`text-[8px] font-bold rounded-md px-1.5 py-0.5 ${current.wip ? (isDark ? "bg-orange-400/20 border border-orange-300/25 text-orange-200" : "bg-orange-100 border border-orange-200 text-orange-700") : (isDark ? "bg-emerald-400/20 border border-emerald-300/25 text-emerald-200" : "bg-emerald-100 border border-emerald-200 text-emerald-700")}`}>
                    {current.wip ? "WIP" : "Done"}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {safeProjects.length > 1 && (
            <div className="flex items-center justify-between gap-1 shrink-0">
              <div className="flex gap-1">
                {safeProjects.map((_, idx) => (
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
                  title="Previous"
                >
                  <ChevronLeft size={14} className={isDark ? "text-white/40" : "text-[#999]"} />
                </button>
                <button
                  onClick={handleNext}
                  className={`p-1 rounded-md transition-all ${isDark ? "hover:bg-white/8" : "hover:bg-[#f0f0f0]"}`}
                  title="Next"
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

const emptyProject: Project = {
  name: "No projects yet",
  description: "Add featured projects to showcase your best work.",
  techStack: [],
  highlight: "Project highlights will appear in this area.",
};
