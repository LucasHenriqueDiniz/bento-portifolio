import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { BentoCard } from "@/components/BentoCard";
import { TechIconStack } from "@/components/TechIconStack";
import { cn } from "@/lib/utils";

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
  tier?: 1 | 2 | 3 | 4;
  className?: string;
}

export function EnhancedProjectCard({
  projects,
  tier = 1,
  className,
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
    }, 6500);

    return () => clearInterval(interval);
  }, [isHovered, safeProjects.length]);

  const current = safeProjects[activeIndex];

  return (
    <BentoCard
      tier={tier}
      className={cn(
        "relative z-30 overflow-hidden",
        "col-span-1 order-2",
        "md:col-start-2 md:col-end-5 md:row-start-1 md:row-end-5",
        "lg:col-start-3 lg:col-end-5 lg:row-start-1 lg:row-end-5",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full overflow-hidden rounded-2xl bg-[#3d72cc] dark:bg-[#2d5aa3]">
        <div className="absolute inset-0 opacity-[0.08]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.45) 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <div className="relative z-10 flex h-full min-h-0 flex-col p-3">
          <div className="mb-2.5 flex items-center justify-between gap-2 shrink-0">
            <div className="min-w-0 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-2.5 py-1 backdrop-blur-sm">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white shrink-0"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-white">
                Featured Projects · {current.name}
              </span>
            </div>

            <div className="inline-flex shrink-0 items-center gap-1.5">
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider border",
                  current.wip
                    ? "border-orange-300/25 bg-orange-400/20 text-orange-100"
                    : "border-emerald-300/25 bg-emerald-400/20 text-emerald-100",
                )}
              >
                {current.wip ? "WIP" : "Stable"}
              </span>
              <span className="text-[10px] font-semibold text-white/80">
                {activeIndex + 1}/{safeProjects.length}
              </span>
              <div className="flex gap-1">
                {safeProjects.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`View project ${idx + 1}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      idx === activeIndex
                        ? "w-5 bg-white"
                        : "w-1.5 bg-white/35 hover:bg-white/55",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative flex-1 min-h-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeIndex}-${current.name}`}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <ProjectPanel project={current} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

function ProjectPanel({ project }: { project: Project }) {
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tx = useSpring(mx, { stiffness: 260, damping: 22, mass: 0.25 });
  const ty = useSpring(my, { stiffness: 260, damping: 22, mass: 0.25 });

  const handleCtaMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ctaRef.current) return;

    const rect = ctaRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    mx.set((px / rect.width - 0.5) * 8);
    my.set((py / rect.height - 0.5) * 8);
  };

  const handleCtaMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div className="h-full min-h-0 rounded-xl border border-white/20 bg-white/10 p-2.5">
      <div className="grid h-full min-h-0 grid-cols-1 gap-2.5 md:grid-cols-12">
        <div className="md:col-span-7 min-h-0 flex flex-col">
          <h3 className="text-[18px] font-black leading-tight text-white mb-1.5 line-clamp-1">
            {project.name}
          </h3>
          <p className="text-[12px] leading-relaxed text-white/92 line-clamp-4">
            {project.description}
          </p>

          <div className="mt-auto pt-2.5">
            <p className="text-[9px] uppercase tracking-wider text-white/70 mb-1">
              Impact
            </p>
            <p className="text-[11px] leading-relaxed text-white/95 line-clamp-3">
              {project.highlight}
            </p>
          </div>
        </div>

        <div className="md:col-span-5 min-h-0 flex flex-col gap-2">
          <div className="rounded-lg border border-white/20 bg-white/10 p-2">
            <p className="text-[9px] uppercase tracking-wider text-white/70 mb-1.5">
              Stack
            </p>
            <TechIconStack
              techs={project.techStack.slice(0, 8)}
              className="flex-wrap"
            />
          </div>

          {project.url ? (
            <motion.a
              ref={ctaRef}
              href={project.url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              onMouseMove={handleCtaMouseMove}
              onMouseLeave={handleCtaMouseLeave}
              style={{ x: tx, y: ty }}
              className="mt-auto flex items-center justify-between rounded-lg border border-white/25 bg-white/14 px-3 py-2 transition-colors hover:bg-white/20"
            >
              <span className="text-[12px] font-semibold text-white">
                Open Project
              </span>
              <span className="text-[13px] leading-none text-white">↗</span>
            </motion.a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const emptyProject: Project = {
  name: "No projects yet",
  description: "Add featured projects to show your best work here.",
  techStack: [],
  highlight: "Project highlights will appear in this area.",
};
