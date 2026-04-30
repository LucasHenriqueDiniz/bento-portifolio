import React, { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SiGithub } from "react-icons/si";
import { WidgetCard } from "@/components/WidgetCard";
import CountUp from "@/components/CountUp";
import { fadeUpSoft } from "@/lib/animations";
import { CardHeader } from "@/components/CardHeader";

const CARD =
  "bg-white dark:bg-[#181818] border border-[#ebebeb] dark:border-[#282828] rounded-2xl";

interface GitHubGridProps {
  seed: number;
  inView: boolean;
  isDark: boolean;
  locale: string;
  dayLabels: string[];
}

const GitHubGrid = React.memo(function GitHubGrid({
  seed,
  inView,
  isDark,
  locale,
  dayLabels,
}: GitHubGridProps) {
  const WEEKS = 52;
  const DAYS = 7;
  const MONTHS = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { month: "short" });
    const now = new Date();

    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return formatter.format(d);
    });
  }, [locale]);

  const cells = useMemo(
    () =>
      Array.from({ length: WEEKS * DAYS }, (_, i) => {
        const v = Math.abs(Math.sin(i * 9.1 + seed * 0.3) * 4) | 0;
        return Math.min(Math.abs(Math.cos(i * 3.7)) > 0.5 ? v : 0, 4);
      }),
    [seed],
  );

  const shades = isDark
    ? ["#1b1f24", "#0e4429", "#006d32", "#26a641", "#39d353"]
    : ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

  return (
    <div className={`w-full h-full rounded-lg border p-2 flex flex-col min-h-0 ${isDark ? "bg-white/3 border-white/8" : "bg-[#f5f5f5] border-[#ebebeb]"}`}>
      <div className={`pl-5 pr-0.5 pb-1 shrink-0 flex items-center text-[7px] font-semibold ${isDark ? "text-white/30" : "text-[#999]"} leading-none`}>
        {MONTHS.map((month) => (
          <span key={month} className="flex-1 min-w-0 truncate">
            {month}
          </span>
        ))}
      </div>

      <div className="flex-1 min-h-0 flex gap-1.5">
        <div className={`w-4 shrink-0 grid grid-rows-7 gap-[2px] text-[7px] ${isDark ? "text-white/30" : "text-[#999]"} leading-none`}>
          {dayLabels.map((day, i) => (
            <div key={i} className="flex items-center justify-end">
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 min-h-0 flex gap-[2px]">
          {Array.from({ length: WEEKS }).map((_, w) => (
            <div key={w} className="flex flex-col gap-[2px] flex-1 min-w-0">
              {Array.from({ length: DAYS }).map((_, d) => {
                const idx = w * DAYS + d;
                return (
                  <div
                    key={d}
                    className={inView ? "gh-dot" : ""}
                    style={
                      {
                        aspectRatio: "1",
                        borderRadius: 2,
                        backgroundColor: shades[cells[idx]],
                        "--dot-delay": `${Math.min(idx * 1.3, 520)}ms`,
                      } as React.CSSProperties
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

interface StatsData {
  totalCommitsThisYear?: number;
  currentStreak?: number;
  githubRepos?: number;
  githubContributions?: number;
  longestStreak?: number;
}

interface GitHubCardProps {
  stats: StatsData | undefined;
  loadingStats: boolean;
  isDark: boolean;
  tier?: 1 | 2 | 3 | 4;
}

export const GitHubCard = React.memo(function GitHubCard({
  stats,
  loadingStats,
  isDark,
  tier = 2,
}: GitHubCardProps) {
  const { t, i18n } = useTranslation("home");
  const currentLang = i18n.language?.split("-")[0] || "pt";
  const locale = currentLang === "en" ? "en-US" : "pt-BR";
  const dayLabels = ["", t("github.days.mon"), "", t("github.days.wed"), "", t("github.days.fri"), ""];
  const githubRef = useRef<HTMLDivElement>(null);
  const githubInView = useInView(githubRef, { once: true, margin: "-50px" });

  const contributions = stats?.githubContributions ?? 0;
  const commits = stats?.totalCommitsThisYear ?? 0;
  const repos = stats?.githubRepos ?? 0;
  const streak = stats?.currentStreak ?? 0;

  return (
    <WidgetCard
      tier={tier}
      isLoading={loadingStats}
      loadingIcon={<SiGithub size={28} className="text-[#1b2838]" />}
      className="h-full rounded-2xl overflow-hidden"
      style={{
        border: isDark ? "1px solid #282828" : "1px solid #ebebeb",
      }}
      glowColor="27, 40, 56"
    >
      <motion.div
        custom={9}
        variants={fadeUpSoft}
        initial="hidden"
        animate="show"
        className="p-3 h-full flex flex-col gap-2"
      >
        <div ref={githubRef} className="h-full flex flex-col gap-2">
          {/* Header */}
          <div className="flex items-center justify-between shrink-0">
            <div className="inline-flex items-center gap-1.5">
                <SiGithub size={12} className="text-[#1b2838] dark:text-[#c7d5e0]" />
                <span className={`text-[9px] font-semibold uppercase tracking-wider ${isDark ? "text-[#c7d5e0]" : "text-[#1b2838]"}`}>
                  {t("github.title")}
                </span>
              </div>
          </div>

          {/* Stats Grid */}
          <div className={`rounded-lg p-2 border shrink-0 ${isDark ? "bg-white/3 border-white/8" : "bg-[#f5f5f5] border-[#ebebeb]"}`}>
            <div className="grid grid-cols-4 gap-2">
              <StatItem label={t("github.repos")} value={repos} isDark={isDark} />
              <StatItem label={t("github.contribs")} value={contributions} isDark={isDark} separator="," />
              <StatItem label={t("github.commits")} value={commits} isDark={isDark} separator="," />
              <StatItem label={t("github.streak")} value={streak} isDark={isDark} suffix={t("github.daysSuffix")} />
            </div>
          </div>

          {/* GitHub Grid */}
          <div className="flex-1 min-h-0">
            <GitHubGrid
              seed={stats?.totalCommitsThisYear ?? 539}
              inView={githubInView}
              isDark={isDark}
              locale={locale}
              dayLabels={dayLabels}
            />
          </div>
        </div>
      </motion.div>
    </WidgetCard>
  );
});

function StatItem({
  label,
  value,
  isDark,
  separator,
  suffix,
}: {
  label: string;
  value: number;
  isDark: boolean;
  separator?: string;
  suffix?: string;
}) {
  return (
    <div className="min-w-0">
      <p className={`text-[7px] uppercase tracking-wider font-bold ${isDark ? "text-white/40" : "text-[#999]"}`}>
        {label}
      </p>
      <p className={`text-[13px] leading-none mt-0.5 font-black truncate ${isDark ? "text-white" : "text-[#111]"}`}>
        <CountUp to={value} duration={0.9} separator={separator ?? ""} />
        {suffix ?? ""}
      </p>
    </div>
  );
}
