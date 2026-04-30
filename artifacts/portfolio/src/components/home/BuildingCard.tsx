import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BentoCard } from "@/components/BentoCard";
import { fadeUpSoft } from "@/lib/animations";
import { Sparkles } from "lucide-react";

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
 * BuildingCard - Shows "Currently Building" with focus on current project
 * @component
 * @param {BuildingCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const BuildingCard = memo(function BuildingCard({
  buildIdx: _buildIdx,
  isDark,
}: BuildingCardProps) {
  const { t } = useTranslation("home");
  const projects = [
    {
      name: t("building.project"),
      description: t("building.description"),
      focus: t("building.focus"),
      tech: ["React Native", "Expo", "Supabase", "TypeScript"],
      status: t("building.status")
    }
  ];

  const current = projects[0];

  return (
    <BentoCard
      className="h-full overflow-hidden"
      style={{
        background: isDark 
          ? `linear-gradient(135deg, rgba(45,45,45,0.5) 0%, rgba(25,25,25,0.8) 100%)`
          : `linear-gradient(135deg, rgba(250,250,255,0.8) 0%, rgba(245,245,255,0.5) 100%)`,
      }}
    >
      <motion.div
        custom={3}
        variants={fadeUpSoft}
        initial="hidden"
        animate="show"
        className="p-5 h-full min-h-0 flex flex-col gap-4"
      >
        {/* Live Indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: ACCENT }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
            {t("building.label")}
          </span>
        </div>

        {/* Project Info */}
        <div className="flex-1">
          <h3 className={`text-lg font-black leading-tight mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
            {current.name}
          </h3>
          <p className={`text-sm leading-relaxed mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {current.description}
          </p>
          <p className={`text-xs leading-relaxed mb-3 px-3 py-2 rounded ${isDark ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-600"}`}>
            <span className="font-semibold">{t("building.focusLabel")}</span> {current.focus}
          </p>
          
          {/* Tech Stack */}
          <div>
            <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? "text-gray-500" : "text-gray-600"}`}>
              {t("building.stackLabel")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {current.tech.map((tech) => (
                <span
                  key={tech}
                  className={`text-xs font-semibold px-2 py-1 rounded ${isDark ? "bg-white/10 text-gray-300" : "bg-gray-200 text-gray-700"}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Status */}
        <div className={`flex items-center justify-between pt-3 border-t ${isDark ? "border-white/10" : "border-gray-200"}`}>
          <span className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {current.status}
          </span>
          <Sparkles size={14} style={{ color: ACCENT }} />
        </div>
      </motion.div>
    </BentoCard>
  );
});
