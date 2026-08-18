import React from "react";
import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";
import { Card } from "@/components/Card";
import { CardHeader } from "@/components/CardHeader";
import CountUp from "@/components/CountUp";
import { useVisitorCount } from "@/hooks/usePortfolioQueries";

export const ViewsCard = React.memo(function ViewsCard() {
  const { t } = useTranslation("home");
  const visitorCount = useVisitorCount();

  return (
    <Card className="h-full bg-panel border border-base rounded-2xl" glowColor="var(--accent-glow)">
      <div className="p-4 h-full flex flex-col">
        <CardHeader title={t("views.title")} icon={<Eye size={10} className="text-faint" />} />

        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="absolute h-14 w-14 rounded-full bg-brand/10 animate-ping [animation-duration:2.5s]" />
            <span className="absolute h-14 w-14 rounded-full border border-brand/20" />
            <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-field border border-brand/30 shadow-[0_0_20px_-4px_var(--accent-glow)]">
              <Eye size={16} className="text-brand" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-[30px] font-black leading-none tabular-nums text-main">
              {visitorCount === undefined ? "—" : <CountUp to={visitorCount} duration={0.8} separator="," />}
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-faint mt-1.5">
              {t("views.label")}
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 border bg-field border-ghost">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="text-[8px] font-medium uppercase tracking-wider text-faint">
              {t("views.live")}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
});

export default ViewsCard;
