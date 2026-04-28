import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiGithub } from "react-icons/si";
import { FiArrowUpRight } from "react-icons/fi";
import { BentoCard } from "@/components/BentoCard";
import CountUp from "@/components/CountUp";
import { fadeUpSoft } from "@/lib/animations";

const LABEL =
  "text-[10px] font-semibold uppercase tracking-widest text-[#aaa] dark:text-[#555]";
const CARD =
  "bg-white dark:bg-[#181818] border border-[#ebebeb] dark:border-[#282828] rounded-2xl";
const ACCENT = "#3d72cc";

/**
 * Project data structure
 * @interface Project
 * @property {string} name - Project name
 * @property {string} description - Project description
 * @property {number} stars - GitHub stars count
 * @property {string} language - Primary language
 * @property {string} color - Language color
 * @property {string} url - Project URL
 * @property {boolean} [wip] - Work in progress flag
 */
interface Project {
  name: string;
  description: string;
  stars: number;
  language: string;
  color: string;
  url: string;
  wip?: boolean;
}

/**
 * Props for ProjectsCard component
 * @interface ProjectsCardProps
 * @property {Project[]} projects - Array of projects
 * @property {number} projIdx - Current project index for cycling
 * @property {Function} setProjIdx - Project index setter
 * @property {number} totalStars - Total stars across all projects
 * @property {Object | undefined} stats - GitHub statistics
 * @property {number} [stats.githubRepos] - Total repositories count
 * @property {boolean} isDark - Dark mode flag
 * @property {Function} navigate - Navigation function
 */
interface ProjectsCardProps {
  projects: Project[];
  projIdx: number;
  setProjIdx: (idx: number) => void;
  totalStars: number;
  stats: { githubRepos?: number } | undefined;
  isDark: boolean;
  navigate: (path: string) => void;
}

/**
 * ProjectsCard - Displays featured projects with cycling carousel
 * Shows project details, language, stars, and navigation to full projects page
 * @component
 * @param {ProjectsCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const ProjectsCard = React.memo(function ProjectsCard({
  projects,
  projIdx,
  setProjIdx,
  totalStars,
  stats,
  isDark,
  navigate,
}: ProjectsCardProps) {
  return (
    <BentoCard
      className={`${CARD} overflow-hidden group cursor-pointer`}
      style={{ gridColumn: "3 / 5", gridRow: "1 / 5" }}
      onClick={() => navigate("/projects")}
    >
      <motion.div
        custom={12}
        variants={fadeUpSoft}
        initial="hidden"
        animate="show"
        className="p-5 h-full flex flex-col gap-4"
      >
        {/* header */}
        <div className="flex items-center justify-between shrink-0">
          <p className={`${LABEL} flex items-center gap-1.5`}>
            <SiGithub size={9} />
            Projects
          </p>
          <FiArrowUpRight
            size={13}
            className="text-[#ccc] dark:text-[#444] group-hover:text-[#999] dark:group-hover:text-[#666] transition-colors"
          />
        </div>

        {/* cycling project card */}
        <div
          className={`flex-1 min-h-0 relative overflow-hidden rounded-xl border ${isDark ? "border-white/[0.07]" : "border-[#ebebeb]"}`}
        >
          <AnimatePresence mode="wait">
            {(() => {
              const p = projects[projIdx];
              return (
                <motion.div
                  key={projIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute inset-0 flex"
                >
                  {/* left color accent bar */}
                  <div
                    className="w-1 shrink-0 rounded-l-xl"
                    style={{ backgroundColor: p.color }}
                  />

                  <div className="flex-1 flex flex-col justify-between p-4">
                    {/* top */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-2">
                          <SiGithub
                            size={11}
                            className="text-[#999] dark:text-[#555] shrink-0"
                          />
                          <h3 className="text-[13px] font-bold truncate text-[#111] dark:text-[#eee]">
                            {p.name}
                          </h3>
                          {p.wip && (
                            <span
                              className="text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                              style={{
                                color: ACCENT,
                                backgroundColor: `${ACCENT}12`,
                              }}
                            >
                              WIP
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#888] dark:text-[#555] leading-snug">
                          {p.description}
                        </p>
                      </div>
                      <a
                        href={p.url}
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0 text-[#ccc] dark:text-[#444] hover:text-[#888] transition-colors"
                      >
                        <FiArrowUpRight size={12} />
                      </a>
                    </div>

                    {/* bottom */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="text-[10px] text-[#999] dark:text-[#555]">
                          {p.language}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#bbb] dark:text-[#444]">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                        </svg>
                        <span className="text-[10px] tabular-nums">
                          {p.stars}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* pagination dots */}
          <div className="absolute bottom-3 right-3 flex gap-1 z-20">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setProjIdx(i);
                }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === projIdx ? 14 : 4,
                  height: 4,
                  backgroundColor:
                    i === projIdx
                      ? projects[projIdx].color
                      : isDark
                        ? "#333"
                        : "#ddd",
                }}
              />
            ))}
          </div>
        </div>

        {/* bottom stats + cta */}
        <div className="flex items-end justify-between shrink-0">
          <div className="flex gap-5">
            <div>
              <p className="text-[22px] font-black text-[#111] dark:text-[#eee] leading-none tabular-nums">
                <CountUp to={stats?.githubRepos ?? 28} duration={1.0} />
              </p>
              <p className="text-[10px] text-[#bbb] dark:text-[#555] mt-0.5">
                repos
              </p>
            </div>
            <div
              className={`border-l ${isDark ? "border-white/10" : "border-[#ebebeb]"} pl-5`}
            >
              <p
                className="text-[22px] font-black leading-none tabular-nums"
                style={{ color: ACCENT }}
              >
                <CountUp to={totalStars} duration={1.2} />
              </p>
              <p className="text-[10px] text-[#bbb] dark:text-[#555] mt-0.5">
                stars
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="text-[11px] font-semibold"
              style={{ color: ACCENT }}
            >
              View all
            </span>
            <FiArrowUpRight
              size={11}
              style={{ color: ACCENT }}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </div>
        </div>
      </motion.div>
    </BentoCard>
  );
});
