import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SiGithub } from "react-icons/si";
import { Flame } from "lucide-react";
import { Card } from "@/components/Card";
import CountUp from "@/components/CountUp";
import { formatCount } from "@/lib/numberFormat";

const WEEKS_SHOWN = 24;

interface GitHubStats {
  githubContributions?: number;
  githubRepos?: number;
  totalCommitsThisYear?: number;
  currentStreak?: number;
  longestStreak?: number;
  contributionDays?: Array<{ date: string; count: number }>;
  topLanguages?: Array<{ name: string; percentage: number; color: string }>;
}

interface GitHubCardProps {
  stats: GitHubStats | undefined;
  isLoading?: boolean;
}

// Opacity of the accent colour per activity level; level 0 is an empty cell.
const LEVEL_OPACITY = [0, 0.3, 0.52, 0.76, 1];
const levelOf = (count: number) => (count <= 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 10 ? 3 : 4);

/**
 * The API's days start on a Sunday, so slicing them in sevens gives calendar weeks: each
 * column is a week and each row a weekday, as on GitHub. The last weeks are kept.
 */
export function lastWeeks(days: Array<{ date: string; count: number }>, weeks = WEEKS_SHOWN) {
  const columns: Array<Array<{ date: string; count: number }>> = [];
  for (let i = 0; i < days.length; i += 7) columns.push(days.slice(i, i + 7));
  return columns.slice(-weeks);
}

/**
 * GitHub activity with the contribution total as the headline, a calendar of the last
 * weeks in the site's accent colour that fills in as a wave, and the languages as one
 * stacked bar.
 */
export function GitHubCard({ stats, isLoading = false }: GitHubCardProps) {
  const { t, i18n } = useTranslation("home");
  const days = useMemo(() => stats?.contributionDays ?? [], [stats?.contributionDays]);
  const columns = useMemo(() => lastWeeks(days), [days]);
  const languages = stats?.topLanguages ?? [];
  const today = days[days.length - 1]?.date;
  const monthLabel = useMemo(() => new Intl.DateTimeFormat(i18n.language, { month: "short" }), [i18n.language]);
  const dateLabel = useMemo(() => new Intl.DateTimeFormat(i18n.language, { day: "numeric", month: "short" }), [i18n.language]);

  if (!stats || (!days.length && !stats.githubRepos)) {
    return (
      <Card className="h-full rounded-2xl bg-panel border border-base" glowColor="var(--accent-glow)">
        <div className="h-full flex flex-col items-center justify-center gap-2">
          <SiGithub size={22} className={isLoading ? "text-brand animate-pulse" : "text-faint"} />
          {!isLoading && <p className="text-[11px] text-faint">{t("github.empty")}</p>}
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full rounded-2xl bg-panel border border-base" glowColor="var(--accent-glow)">
      <div className="h-full p-3 flex gap-3">
        <div className="w-[112px] shrink-0 flex flex-col">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-brand">
            <SiGithub size={11} />
            {t("github.title")}
          </span>

          <p className="mt-2 text-[28px] font-black leading-none tracking-tight text-main tabular-nums">
            <CountUp to={stats.githubContributions ?? 0} separator="." duration={1.4} />
          </p>
          <p className="mt-1 text-[9px] leading-tight text-faint">{t("github.contribsLastYear")}</p>

          <div className="mt-auto space-y-1 text-[10px]">
            <p className="flex items-center gap-1 text-sub">
              <Flame size={11} className={stats.currentStreak ? "text-brand" : "text-faint"} />
              <span className="font-bold text-main tabular-nums">{stats.currentStreak ?? 0}</span>
              {t("github.streakDays", { count: stats.currentStreak ?? 0 })}
              <span className="text-faint">· {t("github.best", { count: stats.longestStreak ?? 0 })}</span>
            </p>
            <p className="text-faint">
              <span className="font-semibold text-sub tabular-nums">{formatCount(stats.totalCommitsThisYear ?? 0, i18n.language)}</span> {t("github.commits")}
            </p>
            <p className="text-faint">
              <span className="font-semibold text-sub tabular-nums">{stats.githubRepos ?? 0}</span> {t("github.repos")}
            </p>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          {/* Month names over the column where each month starts. */}
          <div className="flex gap-[2px] text-[8px] leading-none text-faint h-[10px]" aria-hidden>
            {columns.map((week, w) => {
              const month = week[0] ? new Date(`${week[0].date}T12:00:00`).getMonth() : -1;
              const previous = columns[w - 1]?.[0] ? new Date(`${columns[w - 1][0].date}T12:00:00`).getMonth() : -1;
              return (
                <span key={week[0]?.date ?? w} className="flex-1 min-w-0 overflow-visible whitespace-nowrap">
                  {w > 0 && month !== previous && week[0] ? monthLabel.format(new Date(`${week[0].date}T12:00:00`)).replace(".", "") : ""}
                </span>
              );
            })}
          </div>
          <div className="mt-1 flex-1 min-h-0 flex items-start gap-[2px]" role="img" aria-label={t("github.calendar", { weeks: columns.length })}>
            {columns.map((week, w) => (
              <div key={week[0]?.date ?? w} className="flex-1 min-w-0 flex flex-col gap-[2px]">
                {week.map((day) => {
                  const level = levelOf(day.count);
                  return (
                    <span
                      key={day.date}
                      title={`${t("github.onDay", { count: day.count })} · ${dateLabel.format(new Date(`${day.date}T12:00:00`))}`}
                      className={`gh-cell aspect-square rounded-[3px] ${day.date === today ? "gh-cell-today" : ""}`}
                      style={{
                        animationDelay: `${w * 22}ms`,
                        backgroundColor: level ? `rgba(var(--accent-glow), ${LEVEL_OPACITY[level]})` : "var(--bg-field)",
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {languages.length > 0 && (
            <div className="mt-2 shrink-0">
              <div className="flex h-1.5 rounded-full overflow-hidden bg-field">
                {languages.map((lang, i) => (
                  <motion.span
                    key={lang.name}
                    title={`${lang.name} ${lang.percentage}%`}
                    style={{ backgroundColor: lang.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${lang.percentage}%` }}
                    transition={{ delay: 0.6 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                ))}
              </div>
              <p className="mt-1 flex gap-2.5 text-[9px] text-faint truncate">
                {languages.slice(0, 3).map((lang) => (
                  <span key={lang.name} className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: lang.color }} />
                    {lang.name} <span className="tabular-nums text-sub">{lang.percentage}%</span>
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
