import React from "react";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiAstro,
  SiCloudflare,
  SiDocker,
  SiFastapi,
  SiGithubactions,
  SiGo,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { FiCode } from "react-icons/fi";
import { Card } from "@/components/Card";
import { CardHeader } from "@/components/CardHeader";
import { fadeUpSoft } from "@/lib/animations";
import { skillsData, type SkillCategory, type SkillDataType } from "@/constants/skillsData";

const CARD = "bg-panel border border-base rounded-2xl";

// Columns of the card, each fed by skill categories in this order. The skills come from
// skillsData (`featured: true`), the same list the resume reads, so the two agree.
const COLUMNS: Array<{ title: string; accent: string; categories: SkillCategory[] }> = [
  { title: "Frontend", accent: "#38bdf8", categories: ["frontend"] },
  { title: "Backend", accent: "#5fa04e", categories: ["backend"] },
  { title: "Infra & dados", accent: "#f38020", categories: ["database", "devops", "automation"] },
];

// Brand icon and colour per skill; anything not listed gets a generic code icon.
const ICONS: Record<string, { icon: IconType; color: string | ((isDark: boolean) => string) }> = {
  TypeScript: { icon: SiTypescript, color: "#3178c6" },
  React: { icon: SiReact, color: "#61dafb" },
  "Next.js": { icon: SiNextdotjs, color: (isDark) => (isDark ? "#eee" : "#111") },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#38bdf8" },
  Astro: { icon: SiAstro, color: "#ff5d01" },
  Python: { icon: SiPython, color: "#3572a5" },
  Go: { icon: SiGo, color: "#00add8" },
  "Node.js": { icon: SiNodedotjs, color: "#5fa04e" },
  FastAPI: { icon: SiFastapi, color: "#009688" },
  PostgreSQL: { icon: SiPostgresql, color: "#4169e1" },
  Supabase: { icon: SiSupabase, color: "#3ecf8e" },
  Redis: { icon: SiRedis, color: "#dc382d" },
  Cloudflare: { icon: SiCloudflare, color: "#f38020" },
  "AWS Lambda": { icon: FaAws, color: "#ff9900" },
  "GitHub Actions": { icon: SiGithubactions, color: "#2088ff" },
  Docker: { icon: SiDocker, color: "#2496ed" },
};

export const featuredColumns = (skills: SkillDataType[] = skillsData) =>
  COLUMNS.map((column) => ({
    ...column,
    items: skills
      .filter((skill) => skill.featured && column.categories.includes(skill.category))
      .sort(
        (a, b) =>
          column.categories.indexOf(a.category) - column.categories.indexOf(b.category) ||
          (a.order ?? 999) - (b.order ?? 999)
      ),
  }));

interface TechStackCardProps {
  isDark: boolean;
}

/** The featured skills from skillsData, one band per group. */
export const TechStackCard = React.memo(function TechStackCard({ isDark }: TechStackCardProps) {
  const columns = featuredColumns();

  return (
    <Card className={`${CARD} p-3 h-full`} glowColor="var(--accent-glow)">
      <motion.div custom={11} variants={fadeUpSoft} initial="hidden" animate="show" className="flex flex-col h-full gap-2">
        <CardHeader icon={<FiCode size={10} />} title="Tech Stack" />

        {/* One band per group, its label beside the skills: three narrow columns of
            stacked rows only fit three skills each at 1440x900. */}
        <div className="flex flex-col justify-evenly gap-1 flex-1 min-h-0">
          {columns.map((column, columnIdx) => (
            <div key={column.title} className="flex items-start gap-2 min-h-0">
              <p className="w-[58px] shrink-0 pt-[3px] text-[9px] leading-[11px] font-bold uppercase tracking-wider text-faint flex items-start gap-1">
                <span className="w-1.5 h-1.5 mt-[2px] rounded-full shrink-0" style={{ backgroundColor: column.accent }} />
                {column.title}
              </p>
              <ul className="flex flex-wrap gap-[3px] min-w-0">
                {column.items.map((skill, i) => {
                  const brand = ICONS[skill.name];
                  const Icon = brand?.icon ?? FiCode;
                  const color = typeof brand?.color === "function" ? brand.color(isDark) : brand?.color;
                  return (
                    <motion.li
                      key={skill.name}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + columnIdx * 0.08 + i * 0.03, duration: 0.24 }}
                      className="flex items-center gap-[3px] px-1 py-[2px] rounded-md border border-base bg-field hover:bg-panel transition-colors"
                    >
                      <span style={{ color }} className="shrink-0">
                        <Icon size={12} aria-hidden />
                      </span>
                      <span className="text-[10px] leading-[14px] font-medium text-main whitespace-nowrap">{skill.name}</span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </Card>
  );
});
