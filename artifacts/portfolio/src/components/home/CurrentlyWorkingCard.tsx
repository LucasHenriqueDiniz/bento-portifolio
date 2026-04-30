import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { WidgetCard } from "@/components/WidgetCard";
import { CardHeader } from "@/components/CardHeader";

interface CurrentlyWorkingCardProps {
  isDark?: boolean;
}

export const CurrentlyWorkingCard = React.memo(function CurrentlyWorkingCard({
  isDark = false,
}: CurrentlyWorkingCardProps) {
  const { t } = useTranslation("home");

  const borderColor = isDark ? "rgba(255,255,255,0.06)" : "#ebebeb";
  const bgSecondary = isDark ? "#222" : "#f5f5f5";
  const textPrimary = isDark ? "#eee" : "#111";
  const textSecondary = isDark ? "#888" : "#666";
  const textTertiary = isDark ? "#555" : "#aaa";

  const project = {
    name: "Pingo Concursos",
    subtitle: t("currentlyWorking.subtitle", "Plataforma mobile educacional para concursos públicos"),
    focus: [
      t("currentlyWorking.focus1", "Offline-first com sync em tempo real"),
      t("currentlyWorking.focus2", "UI polida e acessível"),
    ],
    tech: ["React Native", "Supabase", "TypeScript"],
    progress: 40,
  };

  const amberDot = (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#f59e0b" }} />
      <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "#f59e0b" }} />
    </span>
  );

  return (
    <WidgetCard
      className="h-full rounded-2xl overflow-hidden"
      style={{ border: `0.5px solid ${borderColor}` }}
      glowColor="245, 158, 11"
    >
      <div className="h-full flex flex-col p-4">
        <CardHeader
          icon={amberDot}
          title={t("currentlyWorking.label", "em desenvolvimento")}
          rightContent={
            <span className="text-[11px] font-medium tabular-nums" style={{ color: textSecondary }}>
              {project.progress}%
            </span>
          }
        />

        <div className="flex-1 flex flex-col mt-3 min-h-0">
          <h3 className={`text-[18px] font-bold leading-tight tracking-tight mb-1 ${isDark ? "text-white" : "text-[#111]"}`}>
            {project.name}
          </h3>
          <p className={`text-[11px] leading-relaxed mb-3 ${isDark ? "text-[#888]" : "text-[#666]"}`}>
            {project.subtitle}
          </p>

          {/* Focus block */}
          <div className={`rounded-xl p-2.5 border mb-3 ${isDark ? "bg-white/[0.03] border-white/[0.06]" : "bg-[#f8f8f8] border-[#f0f0f0]"}`}>
            <p className={`text-[9px] font-semibold uppercase tracking-widest mb-1.5 ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>
              {t("currentlyWorking.focusLabel", "foco atual")}
            </p>
            <div className="space-y-1">
              {project.focus.map((item, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className={`text-[10px] mt-0.5 ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>◎</span>
                  <span className={`text-[10.5px] leading-snug ${isDark ? "text-[#888]" : "text-[#666]"}`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech chips */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.tech.map(tech => (
              <span
                key={tech}
                className={`text-[10px] px-2 py-1 rounded-full border flex items-center gap-1 ${isDark ? "bg-white/[0.03] border-white/10 text-[#888]" : "bg-white border-[#e0e0e0] text-[#666]"}`}
              >
                <span className={`w-1 h-1 rounded-full shrink-0 ${isDark ? "bg-[#555]" : "bg-[#ccc]"}`} />
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className={`h-[2px] rounded-full overflow-hidden ${isDark ? "bg-[#333]" : "bg-[#eee]"}`}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#f59e0b" }}
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </WidgetCard>
  );
});
