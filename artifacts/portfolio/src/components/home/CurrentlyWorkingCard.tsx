import React from "react";
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
    <span className="relative flex h-1.5 w-1.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#f59e0b" }} />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: "#f59e0b" }} />
    </span>
  );

  return (
    <WidgetCard
      className={`h-full rounded-2xl overflow-hidden ${isDark ? "bg-[#181818] border-[#282828]" : "bg-white border-[#ebebeb]"} border`}
      glowColor="245, 158, 11"
    >
      <div className="h-full flex flex-col p-3">
        <CardHeader
          icon={amberDot}
          title={t("currentlyWorking.label", "em desenvolvimento")}
          rightContent={
            <span className={`text-[10px] font-medium tabular-nums ${isDark ? "text-[#888]" : "text-[#666]"}`}>
              {project.progress}%
            </span>
          }
        />

        <div className="flex-1 flex flex-col justify-between mt-1.5 min-h-0 overflow-hidden">
          <div>
            <h3 className={`text-[14px] font-bold leading-tight tracking-tight mb-0.5 ${isDark ? "text-white" : "text-[#111]"}`}>
              {project.name}
            </h3>
            <p className={`text-[10px] leading-snug mb-1.5 ${isDark ? "text-[#888]" : "text-[#666]"}`}>
              {project.subtitle}
            </p>

            {/* Focus block */}
            <div className={`rounded-lg p-2 border mb-1.5 ${isDark ? "bg-white/[0.03] border-white/[0.06]" : "bg-[#f8f8f8] border-[#f0f0f0]"}`}>
              <p className={`text-[8px] font-semibold uppercase tracking-widest mb-1 ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>
                {t("currentlyWorking.focusLabel", "foco atual")}
              </p>
              <div className="space-y-0.5">
                {project.focus.map((item, i) => (
                  <div key={i} className="flex items-start gap-1">
                    <span className={`text-[9px] mt-0.5 ${isDark ? "text-[#555]" : "text-[#aaa]"}`}>◎</span>
                    <span className={`text-[10px] leading-snug ${isDark ? "text-[#888]" : "text-[#666]"}`}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tech chips */}
          <div className="flex flex-wrap gap-1">
            {project.tech.map(tech => (
              <span
                key={tech}
                className={`text-[9px] px-1.5 py-0.5 rounded-full border flex items-center gap-1 ${isDark ? "bg-white/[0.03] border-white/10 text-[#888]" : "bg-white border-[#e0e0e0] text-[#666]"}`}
              >
                <span className={`w-1 h-1 rounded-full shrink-0 ${isDark ? "bg-[#555]" : "bg-[#ccc]"}`} />
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </WidgetCard>
  );
});
