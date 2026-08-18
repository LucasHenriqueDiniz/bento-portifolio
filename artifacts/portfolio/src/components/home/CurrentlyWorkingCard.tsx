import React from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import { Card } from "@/components/Card";
import { CardHeader } from "@/components/CardHeader";

const PROJECT = {
  name: "Koto By Pingo",
  url: "https://koto-by-pingo.pages.dev/kana",
  progress: 40,
};

export const CurrentlyWorkingCard = React.memo(function CurrentlyWorkingCard() {
  const { t } = useTranslation("home");

  const amberDot = (
    <span className="relative flex h-1.5 w-1.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#f59e0b" }} />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: "#f59e0b" }} />
    </span>
  );

  return (
    <Card className="h-full bg-panel border border-base rounded-2xl" glowColor="var(--accent-glow)">
      <div className="p-4 h-full flex flex-col justify-between gap-2">
        <CardHeader title={t("currentlyWorking.label")} icon={amberDot} />

        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <a
              href={PROJECT.url}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1 min-w-0"
            >
              <h3 className="text-[14px] font-bold leading-tight tracking-tight text-main truncate group-hover:text-brand transition-colors">
                {PROJECT.name}
              </h3>
              <ExternalLink size={11} className="shrink-0 text-faint group-hover:text-brand transition-colors" />
            </a>
            <span className="shrink-0 text-[10px] font-medium tabular-nums text-faint">
              {PROJECT.progress}%
            </span>
          </div>

          <div className="w-full rounded-full h-1.5 bg-field border border-base overflow-hidden">
            <div
              className="h-full rounded-full bg-brand transition-all duration-500"
              style={{ width: `${PROJECT.progress}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
});

export default CurrentlyWorkingCard;
