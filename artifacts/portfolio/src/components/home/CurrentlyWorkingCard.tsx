import React from "react";
import { useTranslation } from "react-i18next";
import { SiExpo, SiSupabase, SiTypescript, SiCloudflare } from "react-icons/si";
import { FaReact } from "react-icons/fa";
import { WidgetCard } from "@/components/WidgetCard";
import { CardHeader } from "@/components/CardHeader";
import { ExternalLink } from "lucide-react";

interface CurrentlyWorkingCardProps {
  isDark?: boolean;
}

export const CurrentlyWorkingCard = React.memo(function CurrentlyWorkingCard({
  isDark = false,
}: CurrentlyWorkingCardProps) {
  const { t } = useTranslation("home");

  const project = {
    name: "Koto By Pingo",
    url: "https://koto-by-pingo.pages.dev/kana",
    subtitle: t("currentlyWorking.subtitle", "Plataforma mobile educacional para concursos públicos"),
    focus: [
      t("currentlyWorking.focus1", "Offline-first com sync em tempo real"),
      t("currentlyWorking.focus2", "UI polida e acessível"),
    ],
    milestones: [
      "Auth + onboarding",
      "Offline queue + sync",
      "Ranking + simulados",
    ],
    tech: [
      { name: "React Native", icon: <FaReact size={10} />, color: "#61dafb" },
      { name: "TypeScript", icon: <SiTypescript size={10} />, color: "#3178c6" },
      { name: "Expo", icon: <SiExpo size={10} />, color: "#e8e8e8" },
      { name: "Cloudflare", icon: <SiCloudflare size={10} />, color: "#f6821f" },
    ],
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
      className="h-full rounded-2xl overflow-hidden bg-panel border border-base"
      glowColor="var(--accent-glow)"
    >
      <div className="h-full flex flex-col p-3">
        <CardHeader
          icon={amberDot}
          title={t("currentlyWorking.label", "em desenvolvimento")}
          rightContent={
            <span className="text-[10px] font-medium tabular-nums text-faint">
              {project.progress}%
            </span>
          }
        />

        <div className="flex-1 flex flex-col justify-between mt-1.5 min-h-0 overflow-hidden gap-2">
          <div>
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <h3 className="text-[14px] font-bold leading-tight tracking-tight text-main flex-1">
                {project.name}
              </h3>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-brand hover:text-brand/80 transition-colors"
                  title="Visit project"
                >
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
            <p className="text-[10px] leading-snug mb-1.5 text-sub">
              {project.subtitle}
            </p>

            <div className="w-full rounded-full h-1.5 bg-field border border-base mb-1.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>

            <div className="rounded-lg p-2 border mb-1.5 bg-field border-ghost">
              <p className="text-[8px] font-semibold uppercase tracking-widest mb-1 text-faint">
                {t("currentlyWorking.focusLabel", "foco atual")}
              </p>
              <div className="space-y-0.5">
                {project.focus.map((item, i) => (
                  <div key={i} className="flex items-start gap-1">
                    <span className="text-[9px] mt-0.5 text-faint">◎</span>
                    <span className="text-[10px] leading-snug text-sub">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg p-2 border bg-field border-ghost">
              <p className="text-[8px] font-semibold uppercase tracking-widest mb-1 text-faint">
                Next Milestones
              </p>
              <div className="space-y-0.5">
                {project.milestones.map((item, i) => (
                  <div key={i} className="flex items-start gap-1">
                    <span className="text-[9px] mt-0.5 text-brand">•</span>
                    <span className="text-[10px] leading-snug text-sub">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tech chips */}
          <div className="flex flex-wrap gap-1">
            {project.tech.map((tech) => (
              <span
                key={tech.name}
                className="text-[9px] px-1.5 py-0.5 rounded-full border flex items-center gap-1 bg-field border-base text-faint"
              >
                <span className="shrink-0" style={{ color: tech.color }}>
                  {tech.icon}
                </span>
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </WidgetCard>
  );
});
