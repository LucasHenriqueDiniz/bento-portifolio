import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, FileText, Briefcase, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BentoCard } from "@/components/BentoCard";
import { jobExperiences, academicExperiences } from "@/constants";

const ACCENT = "#3d72cc";

/**
 * Props for CVCard component
 * @interface CVCardProps
 * @property {Function} navigate - Navigation function to route to CV page
 * @property {boolean} isDark - Dark mode flag
 */
interface CVCardProps {
  navigate: (path: string) => void;
  isDark?: boolean;
}

/**
 * CVCard - Interactive resume preview with experience stats
 * @component
 * @param {CVCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const CVCard = React.memo(function CVCard({ navigate, isDark = false }: CVCardProps) {
  const { t, i18n } = useTranslation("home");
  const currentLang = i18n.language?.split("-")[0] || "pt";
  const jobCount = jobExperiences.filter(exp => exp.showInTimeline).length;
  const educationCount = academicExperiences.filter(exp => exp.showInTimeline).length;
  const currentJob = jobExperiences.find(exp => !exp.endDate);

  return (
    <BentoCard
      className="overflow-hidden cursor-pointer group h-full flex flex-col"
      onClick={() => navigate("/resume")}
    >
      <div className="relative w-full h-full flex flex-col rounded-2xl" style={{ backgroundColor: ACCENT }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-4 sm:p-5">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between shrink-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <FileText size={13} className="text-white" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                {t("cv.title")}
              </span>
            </div>
            <span className="w-7 h-7 rounded-full bg-white/10 border border-white/20 text-white/85 inline-flex items-center justify-center group-hover:scale-110 group-hover:bg-white/15 transition-all">
              <ArrowUpRight size={12} />
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 flex-1 min-h-0">
            {/* Job Experience */}
            <motion.div
              className="flex flex-col p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
              transition={{ type: "spring", stiffness: 200 }}
            >
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase size={14} className="text-white/80" />
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{t("cv.work")}</span>
                </div>
                <p className="text-xl font-black text-white mb-0.5">{jobCount}</p>
                {currentJob && (
                  <p className="text-[9px] text-white/60 leading-tight truncate">
                    {currentLang === "en" ? currentJob.titleEn || currentJob.title : currentJob.title}
                  </p>
                )}
              </motion.div>

            {/* Education */}
            <motion.div
              className="flex flex-col p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
              transition={{ type: "spring", stiffness: 200 }}
            >
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={14} className="text-white/80" />
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{t("cv.education")}</span>
                </div>
                <p className="text-xl font-black text-white mb-0.5">{educationCount}</p>
                {academicExperiences.find(exp => !exp.endDate) && (
                  <p className="text-[9px] text-white/60 leading-tight truncate">{t("cv.studying")}</p>
                )}
              </motion.div>
          </div>

          {/* Footer CTA */}
          <div className="mt-auto pt-3 border-t border-white/10 text-center">
            <p className="text-[11px] font-semibold text-white/90 group-hover:text-white transition-colors">
              {t("cv.viewFull")}
            </p>
          </div>
        </div>
      </div>
    </BentoCard>
  );
});
