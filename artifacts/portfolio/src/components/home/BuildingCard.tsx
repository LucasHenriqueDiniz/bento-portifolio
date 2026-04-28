import { memo } from "react";
import { motion } from "framer-motion";
import { BentoCard } from "@/components/BentoCard";
import { CardHeader } from "@/components/CardHeader";
import { TechIconStack } from "@/components/TechIconStack";
import { fadeUpSoft } from "@/lib/animations";
const CARD =
  "bg-white dark:bg-[#181818] border border-[#ebebeb] dark:border-[#282828] rounded-2xl";
const ACCENT = "#3d72cc";

/**
 * Props for BuildingCard component
 * @interface BuildingCardProps
 * @property {number} buildIdx - Current index for cycling build items (0-2)
 * @property {boolean} isDark - Dark mode flag
 */
interface BuildingCardProps {
  buildIdx: number;
  isDark: boolean;
}

/**
 * BuildingCard - Shows "Currently Building" with cycling project bullets
 * Displays Pingo Concursos App with animated progress indicators
 * Enhanced with Tier 1 styling, detailed tech stack, and focus areas
 * @component
 * @param {BuildingCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const BuildingCard = memo(function BuildingCard({
  buildIdx: _buildIdx,
  isDark: _isDark,
}: BuildingCardProps) {
  const techStack = ["Supabase", "Expo", "React Native", "TypeScript"];

  return (
    <BentoCard
      className={`${CARD} overflow-hidden
        /* Mobile: full width, order 3 (tier-1 priority) */
        col-span-1 order-3
        /* Tablet: columns 2-5 (spans full width), rows 13-17 */
        md:col-start-2 md:col-end-5 md:row-start-13 md:row-end-17
        /* Desktop: column 4, rows 13-17 */
        lg:col-start-4 lg:col-end-5 lg:row-start-13 lg:row-end-17`}
      tier={1}
    >
      <motion.div
        custom={3}
        variants={fadeUpSoft}
        initial="hidden"
        animate="show"
        className="p-3 h-full min-h-0 flex flex-col"
      >
        <div className="mb-2 shrink-0">
          <CardHeader
            icon={
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                  style={{ backgroundColor: ACCENT }}
                />
                <span
                  className="relative inline-flex h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: ACCENT }}
                />
              </span>
            }
            title="Currently Building"
          />
        </div>

        <div className="shrink-0">
          <p className="text-[14px] font-black text-[#111] dark:text-[#eee] leading-tight tracking-tight line-clamp-1">
            Pingo Concursos App
          </p>
          <p className="text-[10px] text-[#666] dark:text-[#888] leading-relaxed line-clamp-2 mt-0.5">
            Mobile exam prep for concursos with offline-first sync.
          </p>
        </div>

        <div className="mt-2 mb-2.5 shrink-0 rounded-xl border border-[#e8e8e8] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#151515] p-2">
          <p className="text-[8px] uppercase tracking-wider text-[#8c8c8c] dark:text-[#666] mb-1.5">
            Stack
          </p>
          <TechIconStack
            techs={techStack}
            className="flex-nowrap overflow-hidden"
          />
        </div>

        <div className="mt-auto shrink-0 overflow-hidden rounded-xl border border-[#e7e7e7] dark:border-[#2a2a2a] bg-[#f8f9fb] dark:bg-[#161616] px-2.5 py-2">
          <p className="text-[8px] font-semibold uppercase tracking-widest text-[#888] dark:text-[#666] mb-1">
            Goal
          </p>
          <p className="text-[9px] leading-relaxed text-[#555] dark:text-[#888] line-clamp-2">
            Consolidar base de questoes, sync offline confiavel e experiencia
            fluida.
          </p>
        </div>
      </motion.div>
    </BentoCard>
  );
});
