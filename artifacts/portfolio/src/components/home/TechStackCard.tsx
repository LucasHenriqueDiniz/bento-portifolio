import React from "react";
import { motion } from "framer-motion";
import {
  SiTypescript,
  SiGo,
  SiPython,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiPostgresql,
  SiRedis,
  SiDocker,
  SiSupabase,
  SiFigma,
} from "react-icons/si";
import { FiCode } from "react-icons/fi";
import { BentoCard } from "@/components/BentoCard";
import { CardHeader } from "@/components/CardHeader";
import { fadeUpSoft } from "@/lib/animations";

const CARD =
  "bg-white dark:bg-[#181818] border border-[#ebebeb] dark:border-[#282828] rounded-2xl";

/**
 * Props for TechStackCard component
 * @interface TechStackCardProps
 * @property {boolean} isDark - Dark mode flag
 */
interface TechStackCardProps {
  isDark: boolean;
}

/**
 * TechStackCard - Displays tech stack organized by categories
 * Shows languages, frontend, backend, and infrastructure tools with icons
 * @component
 * @param {TechStackCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const TechStackCard = React.memo(function TechStackCard({
  isDark,
}: TechStackCardProps) {
  const techGroups = [
    {
      group: "Frontend",
      accent: "#38bdf8",
      items: [
        { icon: <SiReact size={14} />, name: "React", color: "#61dafb" },
        {
          icon: <SiNextdotjs size={14} />,
          name: "Next.js",
          color: isDark ? "#eee" : "#111",
        },
        {
          icon: <SiTailwindcss size={14} />,
          name: "Tailwind",
          color: "#38bdf8",
        },
        {
          icon: <SiTypescript size={14} />,
          name: "TypeScript",
          color: "#3178c6",
        },
      ],
    },
    {
      group: "Backend",
      accent: "#5fa04e",
      items: [
        { icon: <SiNodedotjs size={14} />, name: "Node.js", color: "#5fa04e" },
        { icon: <SiGo size={14} />, name: "Go", color: "#00add8" },
        { icon: <SiPython size={14} />, name: "Python", color: "#3572a5" },
        {
          icon: <SiPostgresql size={14} />,
          name: "PostgreSQL",
          color: "#4169e1",
        },
        { icon: <SiRedis size={14} />, name: "Redis", color: "#dc382d" },
      ],
    },
    {
      group: "DevOps",
      accent: "#2496ed",
      items: [
        { icon: <SiDocker size={14} />, name: "Docker", color: "#2496ed" },
        { icon: <SiSupabase size={14} />, name: "Supabase", color: "#3ecf8e" },
        { icon: <SiFigma size={14} />, name: "Figma", color: "#a259ff" },
      ],
    },
  ];

  return (
    <BentoCard
      tier={2}
      className={`${CARD} p-3 h-full`}
    >
      <motion.div
        custom={11}
        variants={fadeUpSoft}
        initial="hidden"
        animate="show"
        className="flex flex-col h-full gap-2"
      >
        <CardHeader icon={<FiCode size={10} />} title="Tech Stack" />

        <div className="grid grid-cols-3 gap-2 flex-1 min-h-0">
          {techGroups.map((group, groupIdx) => (
            <div
              key={group.group}
              className="rounded-xl border border-[#e6e6e6] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#1a1a1a] p-2 flex flex-col min-h-0"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#888] dark:text-[#666] inline-flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: group.accent }}
                  />
                  {group.group}
                </p>
                <span className="text-[8px] px-1 py-0.5 rounded-md bg-white dark:bg-[#222] border border-[#ececec] dark:border-[#2d2d2d] text-[#9a9a9a] dark:text-[#6f6f6f]">
                  {group.items.length}
                </span>
              </div>

              <div className="space-y-1 overflow-hidden">
                {group.items.map((tech, i) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.08 + groupIdx * 0.08 + i * 0.03,
                      duration: 0.24,
                    }}
                    className="flex items-center gap-1.5 px-1.5 py-1 rounded-md border border-transparent hover:border-[#e8e8e8] dark:hover:border-[#2f2f2f] hover:bg-white dark:hover:bg-[#222] transition-colors"
                  >
                    <span style={{ color: tech.color }} className="shrink-0">
                      {tech.icon}
                    </span>
                    <span className="text-[10px] font-medium text-[#555] dark:text-[#aaa] truncate">
                      {tech.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </BentoCard>
  );
});
