import React, { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
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
}

const GitHubGrid = React.memo(function GitHubGrid({
  seed,
  inView,
  isDark,
}: GitHubGridProps) {
  const WEEKS = 52;
  const DAYS = 7;
  const MONTHS = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
    const now = new Date();

    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return formatter.format(d);
    });
  }, []);
  const DAY_LABELS = ["", "seg", "", "qua", "", "sex", ""];

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
    <div className="w-full h-full rounded-xl border border-[#e7e7e7] dark:border-[#2a2a2a] bg-[#fbfbfb] dark:bg-[#141414] p-2 flex flex-col min-h-0">
      <div className="pl-5 pr-0.5 pb-1 shrink-0 flex items-center text-[8px] text-[#b0b0b0] dark:text-[#5e5e5e] leading-none">
        {MONTHS.map((month) => (
          <span key={month} className="flex-1 min-w-0 truncate">
            {month}
          </span>
        ))}
      </div>

      <div className="flex-1 min-h-0 flex gap-1.5">
        <div className="w-4 shrink-0 grid grid-rows-7 gap-[2px] text-[8px] text-[#b0b0b0] dark:text-[#5e5e5e] leading-none">
          {DAY_LABELS.map((day, i) => (
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
      loadingIcon={
        <SiGithub
          size={28}
          className={isDark ? "text-[#c7d5e0]" : "text-[#1b2838]"}
        />
      }
      className={`${CARD} overflow-hidden
        col-span-1 order-6
        md:col-start-2 md:col-end-4 md:row-start-9 md:row-end-13
        lg:col-start-2 lg:col-end-4 lg:row-start-9 lg:row-end-13`}
      style={{
        backgroundColor: isDark ? "#181818" : "#ffffff",
        overflow: "hidden",
      }}
    >
      <motion.div
        custom={9}
        variants={fadeUpSoft}
        initial="hidden"
        animate="show"
        className="p-3 h-full flex flex-col"
      >
        <div ref={githubRef} className="h-full flex flex-col gap-3">
          <CardHeader
            icon={
              <span className="icon-pulse">
                <SiGithub size={10} />
              </span>
            }
            title="GitHub Activity"
          />

          <div className="shrink-0 rounded-lg border border-[#e8e8e8] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#151515] px-2.5 py-2">
            <div className="grid grid-cols-4 gap-2">
              <StatItem label="repos" value={repos} />
              <StatItem label="contribs" value={contributions} separator="," />
              <StatItem label="commits" value={commits} separator="," />
              <StatItem label="streak" value={streak} suffix="d" />
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <GitHubGrid
              seed={stats?.totalCommitsThisYear ?? 539}
              inView={githubInView}
              isDark={isDark}
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
  separator,
  suffix,
}: {
  label: string;
  value: number;
  separator?: string;
  suffix?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[8px] uppercase tracking-wider text-[#9a9a9a] dark:text-[#6d6d6d]">
        {label}
      </p>
      <p className="text-[15px] leading-none mt-1 font-black text-[#111] dark:text-[#eee] truncate">
        <CountUp to={value} duration={0.9} separator={separator ?? ""} />
        {suffix ?? ""}
      </p>
    </div>
  );
}
