import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { WidgetCard } from "@/components/WidgetCard";

interface CurrentlyWorkingCardProps {
  isDark?: boolean;
}

export const CurrentlyWorkingCard = React.memo(function CurrentlyWorkingCard({
  isDark = false,
}: CurrentlyWorkingCardProps) {
  const { t } = useTranslation("home");

  const borderColor = isDark ? "rgba(255,255,255,0.06)" : "#ebebeb";
  const bgPrimary = isDark ? "#181818" : "#fff";
  const bgSecondary = isDark ? "#222" : "#f5f5f5";
  const textPrimary = isDark ? "#eee" : "#111";
  const textSecondary = isDark ? "#888" : "#666";
  const textTertiary = isDark ? "#555" : "#aaa";

  // Data for the currently working project
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

  return (
    <WidgetCard
      className="h-full rounded-[20px] overflow-hidden"
      style={{ border: `0.5px solid ${borderColor}`, background: bgPrimary }}
      glowColor="245, 158, 11"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ borderColor }}
        >
          <div className="flex items-center gap-2">
            {/* Pulsing amber dot */}
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: "#f59e0b" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: "#f59e0b" }}
              />
            </span>
            <span
              className="text-[10px] font-medium uppercase tracking-[0.08em]"
              style={{ color: textTertiary, fontFamily: "'DM Mono', monospace" }}
            >
              {t("currentlyWorking.label", "em desenvolvimento")}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col px-5 pt-4 pb-3">
          <h3
            className="text-[20px] font-extrabold leading-[1.05] tracking-[-0.03em] mb-1.5"
            style={{ color: textPrimary, fontFamily: "'Syne', sans-serif" }}
          >
            {project.name}
          </h3>
          <p
            className="text-[11px] leading-relaxed mb-4"
            style={{ color: textSecondary, fontFamily: "'DM Mono', monospace" }}
          >
            {project.subtitle}
          </p>

          {/* Focus block */}
          <div
            className="rounded-[10px] p-3 border mb-4"
            style={{
              background: bgSecondary,
              borderColor: isDark ? "rgba(255,255,255,0.06)" : "#f0f0f0",
            }}
          >
            <p
              className="text-[9px] font-medium uppercase tracking-[0.1em] mb-2"
              style={{ color: textTertiary, fontFamily: "'DM Mono', monospace" }}
            >
              {t("currentlyWorking.focusLabel", "foco atual")}
            </p>
            <div className="space-y-1.5">
              {project.focus.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span style={{ color: textTertiary }} className="text-[10px] mt-0.5">◎</span>
                  <span
                    className="text-[10.5px] leading-snug"
                    style={{ color: textSecondary, fontFamily: "'DM Mono', monospace" }}
                  >
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
                className="text-[10px] px-2 py-1 rounded-md border flex items-center gap-1.5"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  color: textSecondary,
                  borderColor: isDark ? "rgba(255,255,255,0.1)" : "#e0e0e0",
                  background: bgSecondary,
                }}
              >
                <span
                  className="w-[5px] h-[5px] rounded-full shrink-0"
                  style={{ background: textTertiary }}
                />
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Progress section */}
        <div
          className="px-5 py-3 border-t"
          style={{ borderColor }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-[9.5px] uppercase tracking-[0.08em]"
              style={{ color: textTertiary, fontFamily: "'DM Mono', monospace" }}
            >
              {t("currentlyWorking.progress", "progresso")}
            </span>
            <span
              className="text-[11px] font-medium"
              style={{ color: textSecondary, fontFamily: "'DM Mono', monospace" }}
            >
              {project.progress}%
            </span>
          </div>
          <div className="h-[2px] rounded-full overflow-hidden" style={{ background: isDark ? "#333" : "#eee" }}>
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
