import React from "react";
import { useTranslation } from "react-i18next";
import { WidgetCard } from "@/components/WidgetCard";

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  highlight: string;
  url?: string;
  wip?: boolean;
}

interface EnhancedProjectCardProps {
  projects: Project[];
  isDark?: boolean;
}

export function EnhancedProjectCard({
  projects,
  isDark = false,
}: EnhancedProjectCardProps) {
  const { t } = useTranslation("home");

  const hasProjects = Array.isArray(projects) && projects.length > 0;
  const current = hasProjects ? projects[0] : null;

  return (
    <WidgetCard
      className="h-full rounded-2xl overflow-hidden"
      style={{
        border: isDark ? "1px solid #282828" : "1px solid #ebebeb",
      }}
      glowColor="61, 114, 204"
    >
      <div className="h-full flex flex-col p-3 gap-2">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="inline-flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3d72cc]" />
            <span className={`text-[9px] font-semibold uppercase tracking-wider ${isDark ? "text-white/70" : "text-[#666]"}`}>
              {t("project.featured")}
            </span>
          </div>
          {hasProjects && (
            <span className={`text-[8px] font-semibold ${isDark ? "text-white/40" : "text-[#999]"}`}>
              1/{projects.length}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-auto">
          {hasProjects && current ? (
            <div className="flex flex-col gap-2">
              <h3 className={`text-[14px] font-black leading-tight ${isDark ? "text-white" : "text-[#111]"}`}>
                {current.name}
              </h3>
              <p className={`text-[10px] leading-snug ${isDark ? "text-white/60" : "text-[#555]"}`}>
                {current.description}
              </p>
              <div className={`rounded-lg p-2 border text-[9px] leading-snug ${isDark ? "bg-white/3 border-white/8 text-white/70" : "bg-[#f5f5f5] border-[#ebebeb] text-[#666]"}`}>
                <p className="italic">&ldquo;{current.highlight}&rdquo;</p>
              </div>
              <div className="flex items-center gap-1.5 mt-auto">
                {current.url && (
                  <a
                    href={current.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold ${isDark ? "bg-[#3d72cc] text-white" : "bg-[#3d72cc] text-white"}`}
                  >
                    {t("project.view")}
                  </a>
                )}
                <span className={`text-[8px] font-bold rounded-md px-1.5 py-0.5 ${current.wip ? (isDark ? "bg-orange-400/20 text-orange-200" : "bg-orange-100 text-orange-700") : (isDark ? "bg-emerald-400/20 text-emerald-200" : "bg-emerald-100 text-emerald-700")}`}>
                  {current.wip ? t("project.wip") : t("project.done")}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
              <p className={`text-[13px] font-bold ${isDark ? "text-white/50" : "text-[#999]"}`}>
                {t("project.empty.title")}
              </p>
              <p className={`text-[10px] ${isDark ? "text-white/30" : "text-[#bbb]"}`}>
                {t("project.empty.description")}
              </p>
            </div>
          )}
        </div>
      </div>
    </WidgetCard>
  );
}
