import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GitCommitHorizontal } from "lucide-react";
import { WidgetCard } from "@/components/WidgetCard";
import { formatTimeAgo } from "@/lib/dateFormatter";
import type { RecentCommit } from "@/lib/apiClient";

const SHOWN = 4;

interface CommitsCardProps {
  commits: RecentCommit[];
  isLoading: boolean;
}

/**
 * The last public commits as a short git log: a rail with a node per commit, the
 * newest one lit, each with its message, its repository and how long ago it was made.
 */
export function CommitsCard({ commits, isLoading }: CommitsCardProps) {
  const { t, i18n } = useTranslation("home");
  const still = useReducedMotion() ?? false;
  const shown = commits.slice(0, SHOWN);

  return (
    <WidgetCard
      isLoading={isLoading && shown.length === 0}
      error={shown.length === 0 ? t("commits.empty") : null}
      loadingIcon={<GitCommitHorizontal size={28} className="text-faint" />}
      emptyIcon={<GitCommitHorizontal size={24} className="text-faint" />}
      className="h-full rounded-2xl overflow-hidden bg-panel"
      style={{ border: "1px solid var(--border-base)" }}
      glowColor="var(--accent-glow)"
    >
      <div className="h-full flex flex-col p-3.5">
        <p className="flex shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-faint">
          <GitCommitHorizontal size={12} style={{ color: "var(--accent)" }} aria-hidden />
          {t("commits.title")}
        </p>

        <ol className="relative mt-2.5 flex-1 min-h-0 flex flex-col justify-between">
          <motion.span
            aria-hidden
            className="absolute left-[4px] top-2 bottom-2 w-px origin-top"
            style={{ background: "linear-gradient(180deg, var(--accent), var(--border-base) 40%, transparent)" }}
            initial={still ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          {shown.map((commit, i) => {
            const ago = formatTimeAgo(Date.parse(commit.date) || null, i18n.language);
            const shortSha = commit.sha.slice(0, 7);
            return (
              <motion.li
                key={commit.sha}
                initial={still ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.3 }}
              >
                <a
                  href={commit.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("commits.open", { sha: shortSha })}
                  className="group relative flex items-start gap-2.5"
                >
                  <span className="relative z-10 mt-[3px] flex h-[9px] w-[9px] shrink-0">
                    {i === 0 && !still && <span className="absolute inset-0 rounded-full bg-[var(--accent)] opacity-60 animate-ping" />}
                    <span
                      className="relative h-[9px] w-[9px] rounded-full border-2 bg-panel transition-colors group-hover:border-[var(--accent)]"
                      style={{ borderColor: i === 0 ? "var(--accent)" : "var(--border-strong, var(--text-faint))" }}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-semibold leading-tight text-main transition-colors group-hover:text-[var(--accent)]">
                      {commit.message}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-[9px] leading-tight text-faint">
                      <span className="truncate">{commit.repo.split("/")[1] ?? commit.repo}</span>
                      <span aria-hidden>·</span>
                      <span className="shrink-0 font-mono">{shortSha}</span>
                      {ago && (
                        <>
                          <span aria-hidden>·</span>
                          <span className="shrink-0">{ago}</span>
                        </>
                      )}
                    </span>
                  </span>
                </a>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </WidgetCard>
  );
}
