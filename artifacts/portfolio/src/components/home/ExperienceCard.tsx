import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Award, Briefcase, ChevronDown, GraduationCap } from "lucide-react";
import { Card } from "@/components/Card";
import { jobExperiences } from "@/constants/jobExperiences";
import { timelineAcademicExperiences } from "@/constants/timelineData";
import { certificates } from "@/constants/academicExperiences";

type Tab = "work" | "education";

interface Entry {
  id: string;
  title: string;
  place: string;
  logo?: string;
  start: string;
  end: string | null;
  description?: string;
  tags: string[];
}

/** "2026-08" as a local date. `new Date("2026-08")` is UTC and lands in July in Brazil. */
const monthOf = (value: string) => {
  const [year, month] = value.split("-").map(Number);
  return new Date(year, (month || 1) - 1, 1);
};

/** Whole months from `start` to `end`, counting both ends, as the résumé convention does. */
export const monthsBetween = (start: string, end: string | null, now = new Date()) => {
  const from = monthOf(start);
  const to = end ? monthOf(end) : now;
  return Math.max(1, (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1);
};

/**
 * Work and education on one rail: a tab for each, the entries in order with the current
 * ones lit, and one entry open at a time showing what it was and the stack it used.
 */
export function ExperienceCard() {
  const { t, i18n } = useTranslation("home");
  const still = useReducedMotion() ?? false;
  const lang = i18n.language?.split("-")[0] === "en" ? "en" : "pt";
  const locale = lang === "en" ? "en-US" : "pt-BR";
  const [tab, setTab] = useState<Tab>("work");
  const [openId, setOpenId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const work: Entry[] = jobExperiences
    .filter((job) => job.showInTimeline)
    .map((job) => ({
      id: job.id,
      title: lang === "en" ? job.titleEn || job.title : job.title,
      place: job.institution,
      logo: job.icon?.startsWith("/") ? job.icon : undefined,
      start: job.startDate,
      end: job.endDate ?? null,
      description: lang === "en" ? job.descriptionEn || job.description : job.description,
      tags: job.tags.map((tag) => tag.label),
    }));

  const education: Entry[] = timelineAcademicExperiences.map((edu) => ({
    id: edu.id,
    title: edu.degree,
    place: edu.institution,
    logo: edu.logo,
    start: edu.startDate,
    end: edu.endDate,
    description: edu.description,
    tags: edu.highlights ?? [],
  }));

  const entries = tab === "work" ? work : education;
  // Nothing chosen yet: the first entry of the tab is the open one.
  const open = openId && entries.some((entry) => entry.id === openId) ? openId : entries[0]?.id;

  const monthYear = (value: string) =>
    monthOf(value).toLocaleDateString(locale, { month: "short", year: "numeric" }).replace(".", "");
  const range = (entry: Entry) =>
    `${monthYear(entry.start)} — ${entry.end ? monthYear(entry.end) : t("timeline.present")}`;
  const duration = (entry: Entry) => {
    const months = monthsBetween(entry.start, entry.end);
    const years = Math.floor(months / 12);
    const rest = months % 12;
    return [years ? t("timeline.yearsShort", { count: years }) : "", rest ? t("timeline.monthsShort", { count: rest }) : ""]
      .filter(Boolean)
      .join(" ");
  };

  const tabs: Array<{ id: Tab; label: string; icon: typeof Briefcase }> = [
    { id: "work", label: t("timeline.tabWork"), icon: Briefcase },
    { id: "education", label: t("timeline.tabEducation"), icon: GraduationCap },
  ];

  return (
    <Card className="h-full rounded-2xl bg-panel border border-base" glowColor="var(--accent-glow)">
      <div className="h-full flex flex-col p-3.5">
        <div role="tablist" aria-label={t("timeline.workTitle")} className="relative grid grid-cols-2 rounded-full bg-field p-0.5 shrink-0">
          {tabs.map(({ id, label, icon: Icon }) => {
            const selected = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(id)}
                className="relative z-10 flex items-center justify-center gap-1.5 rounded-full py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors"
                style={{ color: selected ? "var(--accent)" : "var(--text-faint)" }}
              >
                {selected && (
                  <motion.span
                    layoutId="experience-tab"
                    className="absolute inset-0 -z-10 rounded-full bg-panel border border-base shadow-sm"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Icon size={11} aria-hidden />
                {label}
              </button>
            );
          })}
        </div>

        <div
          ref={scrollRef}
          role="tabpanel"
          className="relative flex-1 min-h-0 overflow-y-auto custom-scrollbar mt-3 -mr-1.5 pr-1.5"
        >
          <motion.ol
            key={tab}
            initial={still ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* The rail, drawn from the top down behind the logos. */}
            <motion.span
              aria-hidden
              className="absolute left-[13px] top-3 bottom-3 w-px origin-top"
              style={{ background: "linear-gradient(180deg, var(--accent), var(--border-base) 35%, transparent)" }}
              initial={still ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />

            {entries.map((entry, index) => {
              const current = entry.end === null;
              const expanded = open === entry.id;
              const Fallback = tab === "work" ? Briefcase : GraduationCap;
              return (
                <motion.li
                  key={entry.id}
                  initial={still ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + index * 0.05, duration: 0.3 }}
                  className="relative"
                >
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setOpenId(entry.id)}
                    className="group w-full flex items-start gap-2.5 py-1.5 text-left"
                  >
                    <span
                      className="relative z-10 mt-0.5 flex h-[27px] w-[27px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-field border transition-colors"
                      style={{ borderColor: expanded || current ? "var(--accent)" : "var(--border-base)" }}
                    >
                      {entry.logo ? (
                        <img src={entry.logo} alt="" loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <Fallback size={12} className="text-faint" aria-hidden />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className={`min-w-0 text-[11px] font-bold leading-tight text-main ${expanded ? "" : "truncate"}`}>
                          {entry.title}
                        </span>
                        {current && (
                          <span className="relative flex h-1.5 w-1.5 shrink-0" title={t("timeline.present")}>
                            {!still && <span className="absolute inset-0 rounded-full bg-[var(--accent)] opacity-60 animate-ping" />}
                            <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block truncate text-[10px] leading-tight text-sub">{entry.place}</span>
                      <span className="mt-0.5 block text-[9px] leading-tight text-faint tabular-nums">
                        {range(entry)} · {duration(entry)}
                      </span>
                    </span>
                    <ChevronDown
                      size={12}
                      aria-hidden
                      className={`mt-1 shrink-0 text-faint transition-transform duration-300 ${expanded ? "rotate-180" : "opacity-0 group-hover:opacity-100"}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {expanded && (entry.description || entry.tags.length > 0) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="ml-[37px] pb-2">
                          {entry.description && (
                            <p className="text-[10px] leading-relaxed text-sub line-clamp-4">{entry.description}</p>
                          )}
                          {entry.tags.length > 0 && (
                            <ul className="mt-1.5 flex flex-wrap gap-1">
                              {entry.tags.slice(0, 5).map((tag) => (
                                <li key={tag} className="rounded-md bg-field px-1.5 py-px text-[9px] font-medium text-faint">
                                  {tag}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </motion.ol>

          {tab === "education" && (
            <div className="mt-2 border-t border-base pt-2">
              <p className="mb-1 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-faint">
                <Award size={10} aria-hidden />
                {t("timeline.certificates")}
              </p>
              <ul>
                {certificates
                  .filter((certificate) => certificate.url)
                  .map((certificate) => (
                    <li key={certificate.title}>
                      <a
                        href={certificate.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between gap-2 rounded-lg px-1.5 py-1 hover:bg-panel-hover transition-colors"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[10px] font-semibold text-main">{certificate.title}</span>
                          <span className="block truncate text-[9px] text-faint">
                            {certificate.issuer} · {certificate.issueDate.slice(0, 4)}
                          </span>
                        </span>
                        <ArrowUpRight size={11} aria-hidden className="shrink-0 text-faint opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        <a
          href="/resume"
          className="group mt-2 flex shrink-0 items-center justify-between border-t border-base pt-2 text-[10px] font-semibold text-faint hover:text-[var(--accent)] transition-colors"
        >
          {t("timeline.viewFullCV")}
          <ArrowUpRight size={12} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </Card>
  );
}
