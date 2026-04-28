import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SiGithub, SiWakatime } from "react-icons/si";
import { BentoCard } from "@/components/BentoCard";
import CountUp from "@/components/CountUp";
import { fadeUpSoft } from "@/lib/animations";

const LABEL =
  "text-[10px] font-semibold uppercase tracking-widest text-[#aaa] dark:text-[#555]";
const CARD =
  "bg-white dark:bg-[#181818] border border-[#ebebeb] dark:border-[#282828] rounded-2xl";
const ACCENT = "#3d72cc";

/**
 * Props for GitHubGrid component
 * @interface GitHubGridProps
 * @property {number} seed - Seed for generating contribution pattern
 * @property {boolean} inView - Whether grid is in viewport (for animations)
 */
interface GitHubGridProps {
  seed: number;
  inView: boolean;
}

/**
 * GitHubGrid - Renders GitHub-style contribution grid
 * @component
 * @param {GitHubGridProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const GitHubGrid = React.memo(function GitHubGrid({
  seed,
  inView,
}: GitHubGridProps) {
  const WEEKS = 52,
    DAYS = 7;
  const cells = Array.from({ length: WEEKS * DAYS }, (_, i) => {
    const v = Math.abs(Math.sin(i * 9.1 + seed * 0.3) * 4) | 0;
    return Math.min(Math.abs(Math.cos(i * 3.7)) > 0.5 ? v : 0, 4);
  });
  const shades = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex w-full">
        {MONTHS.map((m) => (
          <span
            key={m}
            className="text-[8px] text-[#ccc] dark:text-[#444] flex-1 min-w-0 leading-none"
          >
            {m}
          </span>
        ))}
      </div>
      <div className="w-full flex gap-[3px]">
        {Array.from({ length: WEEKS }).map((_, w) => (
          <div key={w} className="flex flex-col gap-[3px] flex-1 min-w-0">
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
                      "--dot-delay": `${idx * 2}ms`,
                    } as React.CSSProperties
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
});

/**
 * GitHub statistics data
 * @interface StatsData
 * @property {number} [totalCommitsThisYear] - Total commits this year
 * @property {number} [currentStreak] - Current commit streak in days
 * @property {number} [githubRepos] - Total public repositories
 */
interface StatsData {
  totalCommitsThisYear?: number;
  currentStreak?: number;
  githubRepos?: number;
}

/**
 * Wakatime coding statistics
 * @interface WakaData
 * @property {Object} today - Today's coding time
 * @property {number} today.h - Hours coded today
 * @property {number} today.m - Minutes coded today
 * @property {Object} week - This week's coding time
 * @property {number} week.h - Hours coded this week
 * @property {number} week.m - Minutes coded this week
 * @property {Array<Object>} langs - Language breakdown
 * @property {string} langs[].name - Language name
 * @property {number} langs[].pct - Percentage of time
 * @property {string} langs[].color - Language color
 */
interface WakaData {
  today: { h: number; m: number };
  week: { h: number; m: number };
  langs: Array<{ name: string; pct: number; color: string }>;
}

/**
 * Props for GitHubWakatimeCard component
 * @interface GitHubWakatimeCardProps
 * @property {StatsData | undefined} stats - GitHub statistics
 * @property {boolean} loadingStats - Loading state for stats
 * @property {WakaData} waka - Wakatime statistics
 * @property {boolean} isDark - Dark mode flag
 */
interface GitHubWakatimeCardProps {
  stats: StatsData | undefined;
  loadingStats: boolean;
  waka: WakaData;
  isDark: boolean;
}

/**
 * GitHubWakatimeCard - Combined card showing GitHub contribution grid and Wakatime stats
 * @component
 * @param {GitHubWakatimeCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const GitHubWakatimeCard = React.memo(function GitHubWakatimeCard({
  stats,
  loadingStats,
  waka,
  isDark,
}: GitHubWakatimeCardProps) {
  const githubRef = useRef<HTMLDivElement>(null);
  const githubInView = useInView(githubRef, { once: true, margin: "-50px" });

  return (
    <BentoCard
      className={`${CARD} overflow-hidden`}
      style={{ gridColumn: "2 / 5", gridRow: "9 / 13" }}
    >
      <motion.div
        custom={9}
        variants={fadeUpSoft}
        initial="hidden"
        animate="show"
        className="flex h-full"
      >
        {/* LEFT: GitHub */}
        <div ref={githubRef} className="flex flex-col flex-[3] min-w-0 p-4">
          <div className="flex items-center gap-4 mb-3 shrink-0">
            <p className={`${LABEL} flex items-center gap-1.5 shrink-0`}>
              <span className="icon-pulse">
                <SiGithub size={10} />
              </span>
              GitHub
            </p>
            <div className="flex gap-4 text-[11px] text-[#aaa] dark:text-[#555]">
              {loadingStats ? (
                <>
                  <div className="sk h-3.5 w-14 rounded-full" />
                  <div className="sk h-3.5 w-16 rounded-full" />
                  <div className="sk h-3.5 w-12 rounded-full" />
                </>
              ) : (
                <>
                  <span>
                    <strong className="text-[#111] dark:text-[#eee] text-[13px] font-black">
                      <CountUp
                        to={stats?.totalCommitsThisYear ?? 0}
                        separator=","
                        duration={1.2}
                      />
                    </strong>
                    <span className="ml-1">commits</span>
                  </span>
                  <span>
                    <strong
                      className="text-[13px] font-black"
                      style={{ color: ACCENT }}
                    >
                      <CountUp to={stats?.currentStreak ?? 0} duration={0.9} />
                    </strong>
                    <span className="ml-1">day streak</span>
                  </span>
                  <span>
                    <strong className="text-[#111] dark:text-[#eee] text-[13px] font-black">
                      <CountUp to={stats?.githubRepos ?? 0} duration={1.0} />
                    </strong>
                    <span className="ml-1">repos</span>
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="overflow-hidden flex-1 flex items-end">
            <GitHubGrid
              seed={stats?.totalCommitsThisYear ?? 539}
              inView={githubInView}
            />
          </div>
        </div>

        {/* divider */}
        <div
          className={`w-px self-stretch my-4 shrink-0 ${isDark ? "bg-white/[0.06]" : "bg-[#ebebeb]"}`}
        />

        {/* RIGHT: Wakatime */}
        <div className="flex flex-col flex-[2] min-w-0 p-4">
          <div className="flex items-start justify-between mb-3 shrink-0">
            <p className={`${LABEL} flex items-center gap-1.5`}>
              <SiWakatime size={9} />
              Wakatime
            </p>
            <div className="flex gap-3 text-right">
              <div>
                <p className="font-black text-[#111] dark:text-[#eee] text-[14px] leading-none tabular-nums">
                  {waka.today.h}h
                  <span className="text-[11px]">{waka.today.m}m</span>
                </p>
                <p className="text-[9px] text-[#bbb] dark:text-[#555] mt-0.5">
                  today
                </p>
              </div>
              <div
                className={`w-px self-stretch ${isDark ? "bg-white/[0.06]" : "bg-[#f0f0f0]"}`}
              />
              <div>
                <p className="font-black text-[#111] dark:text-[#eee] text-[14px] leading-none tabular-nums">
                  {waka.week.h}h
                  <span className="text-[11px]">{waka.week.m}m</span>
                </p>
                <p className="text-[9px] text-[#bbb] dark:text-[#555] mt-0.5">
                  this week
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between flex-1">
            {waka.langs.map((l, i) => (
              <div key={l.name} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: l.color }}
                    />
                    <span className="text-[11px] font-medium text-[#555] dark:text-[#888]">
                      {l.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#bbb] dark:text-[#555] tabular-nums font-semibold">
                    {l.pct}%
                  </span>
                </div>
                <div className="h-1.5 bg-[#f0f0f0] dark:bg-[#282828] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${l.pct}%` }}
                    transition={{
                      duration: 0.9,
                      delay: i * 0.12,
                      ease: "easeOut",
                    }}
                    style={{ backgroundColor: l.color }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </BentoCard>
  );
});
