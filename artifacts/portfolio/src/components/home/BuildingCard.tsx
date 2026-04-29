import { memo } from "react";
import { motion } from "framer-motion";
import { WidgetCard } from "@/components/WidgetCard";
import { TechIconStack } from "@/components/TechIconStack";
import { fadeUpSoft } from "@/lib/animations";
import { Zap } from "lucide-react";

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
 * BuildingCard - Shows "Currently Building" with cycling project details
 * Enhanced with improved visual hierarchy and tech stack display
 * @component
 * @param {BuildingCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const BuildingCard = memo(function BuildingCard({
  buildIdx: _buildIdx,
  isDark,
}: BuildingCardProps) {
  const techStack = ["Supabase", "Expo", "React Native", "TypeScript"];

  return (
    <WidgetCard
      className="h-full rounded-2xl overflow-hidden"
      style={{
        border: isDark ? "1px solid #282828" : "1px solid #ebebeb",
      }}
      glowColor="61, 114, 204"
    >
      <motion.div
        custom={3}
        variants={fadeUpSoft}
        initial="hidden"
        animate="show"
        className="p-3 h-full min-h-0 flex flex-col gap-2"
      >
        {/* Header with live indicator */}
        <div className="flex items-center justify-between shrink-0">
          <div className="inline-flex items-center gap-1.5">
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
            <span className="text-[9px] font-semibold text-[#3d72cc] uppercase tracking-wider">Currently Building</span>
          </div>
        </div>

        {/* Project Title & Description */}
        <div className="shrink-0">
          <p className={`text-[13px] font-black leading-tight ${isDark ? "text-white" : "text-[#111]"}`}>
            Pingo Concursos
          </p>
          <p className={`text-[9px] leading-snug mt-0.5 ${isDark ? "text-white/50" : "text-[#666]"}`}>
            Mobile exam prep with offline-first sync
          </p>
        </div>

        {/* Tech Stack */}
        <div className={`rounded-lg p-2 border shrink-0 ${isDark ? "bg-white/3 border-white/8" : "bg-[#f5f5ff] border-[#e0e0ff]"}`}>
          <p className={`text-[7px] uppercase tracking-widest font-bold mb-1.5 ${isDark ? "text-[#3d72cc]/60" : "text-[#3d72cc]/70"}`}>
            Tech Stack
          </p>
          <TechIconStack techs={techStack} className="flex-nowrap overflow-hidden" />
        </div>

        {/* Goal Section */}
        <div className={`mt-auto rounded-lg p-2 border flex-1 flex flex-col justify-center ${isDark ? "bg-white/3 border-white/8" : "bg-[#f5f5ff] border-[#e0e0ff]"}`}>
          <div className="flex items-start gap-1.5">
            <Zap size={11} className="text-[#3d72cc] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className={`text-[7px] uppercase tracking-widest font-bold mb-0.5 ${isDark ? "text-[#3d72cc]/60" : "text-[#3d72cc]/70"}`}>
                Goal
              </p>
              <p className={`text-[8px] leading-snug ${isDark ? "text-white/60" : "text-[#555]"}`}>
                Consolidate question base, reliable offline sync & seamless UX
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </WidgetCard>
  );
});
