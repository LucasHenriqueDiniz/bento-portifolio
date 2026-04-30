import React, { useRef, useCallback } from "react";
import { motion, useSpring } from "framer-motion";
import { ArrowUpRight, FileText, Briefcase, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { jobExperiences, academicExperiences } from "@/constants";

interface CVCardProps {
  navigate: (path: string) => void;
  isDark?: boolean;
}

export const CVCard = React.memo(function CVCard({ navigate, isDark = false }: CVCardProps) {
  const { t, i18n } = useTranslation("home");
  const currentLang = i18n.language?.split("-")[0] || "pt";
  const jobCount = jobExperiences.filter(exp => exp.showInTimeline).length;
  const educationCount = academicExperiences.filter(exp => exp.showInTimeline).length;
  const currentJob = jobExperiences.find(exp => !exp.endDate);

  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(0, { stiffness: 350, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 350, damping: 25 });
  const scale = useSpring(1, { stiffness: 350, damping: 25 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    rotateX.set((-mouseY / (rect.height / 2)) * 12);
    rotateY.set((mouseX / (rect.width / 2)) * 12);
    scale.set(1.03);
  }, [rotateX, rotateY, scale]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }, [rotateX, rotateY, scale]);

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, scale, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="h-full cursor-pointer"
      onClick={() => navigate("/resume")}
    >
      {/* Document body */}
      <div
        className={`h-full rounded-xl border p-3 flex flex-col relative overflow-hidden group ${
          isDark
            ? "bg-[#1e1e1e] border-[#333] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            : "bg-white border-[#e0e0e0] shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
        }`}
      >
        {/* Top bar */}
        <div className={`flex items-center gap-1.5 mb-2.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          <div className={`w-2 h-2 rounded-full ${isDark ? "bg-[#ff5f57]" : "bg-[#ff5f57]"}`} />
          <div className={`w-2 h-2 rounded-full ${isDark ? "bg-[#febc2e]" : "bg-[#febc2e]"}`} />
          <div className={`w-2 h-2 rounded-full ${isDark ? "bg-[#28c840]" : "bg-[#28c840]"}`} />
          <span className="text-[8px] font-medium ml-2 flex-1 text-center truncate">
            Lucas_Henrique_Diniz_CV.pdf
          </span>
          <div className="w-6" />
        </div>

        {/* Document content */}
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Name header */}
          <div className="mb-2">
            <div className={`h-2.5 w-3/4 rounded ${isDark ? "bg-[#3d72cc]/60" : "bg-[#3d72cc]"}`} />
            <div className={`h-1.5 w-1/2 rounded mt-1 ${isDark ? "bg-[#3d72cc]/30" : "bg-[#3d72cc]/40"}`} />
          </div>

          {/* Divider */}
          <div className={`h-px w-full mb-2 ${isDark ? "bg-[#333]" : "bg-[#e0e0e0]"}`} />

          {/* Experience section */}
          <div className="flex items-center gap-1 mb-1.5">
            <Briefcase size={8} className={isDark ? "text-[#3d72cc]" : "text-[#3d72cc]"} />
            <div className={`h-1.5 w-16 rounded ${isDark ? "bg-gray-600" : "bg-gray-300"}`} />
          </div>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={`exp-${i}`} className="mb-1.5">
              <div className={`h-1.5 w-2/3 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
              <div className={`h-1 w-full rounded mt-0.5 ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
            </div>
          ))}

          {/* Education section */}
          <div className="flex items-center gap-1 mb-1.5 mt-2">
            <GraduationCap size={8} className={isDark ? "text-[#3d72cc]" : "text-[#3d72cc]"} />
            <div className={`h-1.5 w-14 rounded ${isDark ? "bg-gray-600" : "bg-gray-300"}`} />
          </div>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={`edu-${i}`} className="mb-1.5">
              <div className={`h-1.5 w-3/4 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
              <div className={`h-1 w-1/2 rounded mt-0.5 ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
            </div>
          ))}

          {/* Skills */}
          <div className="flex items-center gap-1 mb-1.5 mt-2">
            <FileText size={8} className={isDark ? "text-[#3d72cc]" : "text-[#3d72cc]"} />
            <div className={`h-1.5 w-12 rounded ${isDark ? "bg-gray-600" : "bg-gray-300"}`} />
          </div>
          <div className="flex gap-1 flex-wrap">
            {["TS", "React", "Node", "AWS"].map(s => (
              <span key={s} className={`text-[7px] px-1.5 py-0.5 rounded ${isDark ? "bg-[#3d72cc]/15 text-[#3d72cc]" : "bg-[#3d72cc]/10 text-[#3d72cc]"}`}>{s}</span>
            ))}
          </div>
        </div>

        {/* Stats footer */}
        <div className={`flex items-center justify-between mt-2 pt-2 border-t ${isDark ? "border-[#333]" : "border-[#e0e0e0]"}`}>
          <div className="flex gap-3">
            <div className="text-center">
              <p className={`text-sm font-black ${isDark ? "text-white" : "text-[#111]"}`}>{jobCount}</p>
              <p className={`text-[7px] uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>{t("cv.work")}</p>
            </div>
            <div className="text-center">
              <p className={`text-sm font-black ${isDark ? "text-white" : "text-[#111]"}`}>{educationCount}</p>
              <p className={`text-[7px] uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>{t("cv.education")}</p>
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all group-hover:scale-110 ${isDark ? "bg-[#3d72cc]/20 text-[#3d72cc]" : "bg-[#3d72cc]/10 text-[#3d72cc]"}`}>
            <ArrowUpRight size={10} />
          </div>
        </div>
      </div>
    </motion.div>
  );
});
