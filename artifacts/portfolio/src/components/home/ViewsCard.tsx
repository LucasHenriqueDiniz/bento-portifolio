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
      <div className="p-4 h-full flex flex-col relative overflow-hidden">
        {/* Dot texture + accent glows */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, var(--border-base) 1px, transparent 0)",
            backgroundSize: "14px 14px",
          }}
        />
        <div
          className="absolute -top-14 -right-14 h-40 w-40 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--accent-subtle), transparent 70%)" }}
        />
        <div
          className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--accent-subtle), transparent 70%)" }}
        />

        <div className="relative">
          <CardHeader title={t("views.title")} icon={<Eye size={10} className="text-faint" />} />
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="absolute h-16 w-16 rounded-full bg-brand/10 animate-ping [animation-duration:3s]" />
            <span className="absolute h-16 w-16 rounded-full border border-brand/15" />
            <span className="absolute h-12 w-12 rounded-full border border-brand/25" />
            <div className="relative flex items-center justify-center h-9 w-9 rounded-full bg-field border border-brand/30 shadow-[0_0_24px_-4px_var(--accent-glow)]">
              <Eye size={15} className="text-brand" />
            </div>
          </div>

          <div className="text-center mt-1.5">
            <p className="text-[34px] font-black leading-none tracking-tight tabular-nums text-main">
              {visitorCount === undefined ? "—" : <CountUp to={visitorCount} duration={0.8} separator="," />}
            </p>
            <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-faint mt-1.5">
              {t("views.label")}
            </p>
          </div>
        </div>

        <div className="relative flex justify-center">
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
