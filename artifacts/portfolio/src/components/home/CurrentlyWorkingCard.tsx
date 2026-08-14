import React from "react";
import { useTranslation } from "react-i18next";
import { SiExpo, SiSupabase, SiTypescript, SiCloudflare } from "react-icons/si";
import { FaReact } from "react-icons/fa";
import { Eye, ExternalLink } from "lucide-react";
import { FlippableCard } from "@/components/FlippableCard";
import CountUp from "@/components/CountUp";
import { useVisitorCount } from "@/hooks/usePortfolioQueries";

interface CurrentlyWorkingCardProps {
  isDark?: boolean;
}

export const CurrentlyWorkingCard = React.memo(function CurrentlyWorkingCard({
  isDark = false,
}: CurrentlyWorkingCardProps) {
  const { t } = useTranslation("home");
  const visitorCount = useVisitorCount();

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

  const frontContent = (
    <div className="flex-1 flex flex-col justify-between mt-1.5 min-h-0 overflow-hidden gap-2">
      <div>
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <h3 className="text-[14px] font-bold leading-tight tracking-tight text-main flex-1">
            {project.name}
          </h3>
          <span className="shrink-0 text-[10px] font-medium tabular-nums text-faint">
            {project.progress}%
          </span>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-brand hover:text-brand/80 transition-colors"
              title="Visit project"
              onClick={(e) => e.stopPropagation()}
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
            {t("currentlyWorking.milestonesLabel", "Next Milestones")}
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
  );

  const backContent = (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 mt-1.5">
      <div className="relative flex items-center justify-center">
        <span className="absolute h-16 w-16 rounded-full bg-brand/10 animate-ping [animation-duration:2.5s]" />
        <span className="absolute h-16 w-16 rounded-full border border-brand/20" />
        <div className="relative flex items-center justify-center h-12 w-12 rounded-full bg-field border border-brand/30 shadow-[0_0_20px_-4px_var(--accent-glow)]">
          <Eye size={18} className="text-brand" />
        </div>
      </div>

      <div className="text-center">
        <p className="text-[34px] font-black leading-none tabular-nums text-main">
          {visitorCount === undefined ? (
            "—"
          ) : (
            <CountUp to={visitorCount} duration={0.8} separator="," />
          )}
        </p>
        <p className="text-[9px] font-semibold uppercase tracking-widest text-faint mt-2">
          {t("currentlyWorking.visitorsLabel", "visitas ao site")}
        </p>
      </div>

      <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 border bg-field border-ghost">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
        <span className="text-[8px] font-medium uppercase tracking-wider text-faint">
          {t("currentlyWorking.visitorsLive", "tempo real")}
        </span>
      </div>
    </div>
  );

  return (
    <FlippableCard
      className="h-full"
      front={{
        title: t("currentlyWorking.label", "em desenvolvimento"),
        icon: amberDot,
        content: frontContent,
        flipLabel: t("currentlyWorking.visitorsFlipLabel", "visitas"),
      }}
      back={{
        title: t("currentlyWorking.visitorsBackTitle", "visitantes"),
        icon: <Eye size={10} className="text-faint" />,
        content: backContent,
        flipLabel: t("currentlyWorking.backFlipLabel", "voltar"),
      }}
    />
  );
});
