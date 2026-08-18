import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { FiSearch } from "react-icons/fi";
import SiteHeader from "@/components/SiteHeader";
import SEO from "@/components/SEO";
import { useTheme } from "@/hooks/useTheme";
import { projects, type Project } from "@/constants";

type ProjectTag = "all" | "website" | "software" | "extension";

const statusLabels: Record<string, { color: string; labelPt: string; labelEn: string }> = {
  completed: { color: "var(--status-completed)", labelPt: "Concluído", labelEn: "Completed" },
  workInProgress: { color: "var(--status-progress)", labelPt: "Em progresso", labelEn: "In progress" },
  experimental: { color: "var(--status-experimental)", labelPt: "Experimental", labelEn: "Experimental" },
  discontinued: { color: "var(--status-discontinued)", labelPt: "Descontinuado", labelEn: "Discontinued" },
};

/** Years are stored as "2025" or "2025-2026"; returns every year mentioned. */
function parseYears(year?: string): number[] {
  if (!year) return [];
  return year.split("-").map((part) => Number(part.trim())).filter((n) => Number.isFinite(n) && n > 1990);
}

function lastYear(year?: string): string {
  const years = parseYears(year);
  return years.length ? String(years[years.length - 1]) : "—";
}

export default function ProjectsPage() {
  const { t, i18n } = useTranslation("projects");
  const currentLang = i18n.language?.split("-")[0] || "pt";
  const isEn = currentLang === "en";
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<ProjectTag>("all");
  const [hovered, setHovered] = useState<{ project: Project; x: number; y: number } | null>(null);
  const { isDark, toggleTheme } = useTheme();

  const describe = useCallback(
    (project: Project) => (isEn ? project.highlightEn : project.highlight),
    [isEn]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (activeTag !== "all" && p.category !== activeTag) return false;
      if (!q) return true;
      const localized = [
        p.name,
        isEn ? p.descriptionEn : p.description,
        isEn ? p.highlightEn : p.highlight,
        (isEn ? p.typeEn : p.type) ?? "",
        (isEn ? p.roleEn : p.role) ?? "",
        p.year ?? "",
        p.techStack.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return localized.includes(q);
    });
  }, [query, activeTag, isEn]);

  const featured = useMemo(
    () =>
      filtered
        .filter((p) => p.featured)
        .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999)),
    [filtered]
  );

  const rest = useMemo(
    () =>
      filtered
        .filter((p) => !p.featured)
        .sort((a, b) => {
          const byYear = (parseYears(b.year).pop() ?? 0) - (parseYears(a.year).pop() ?? 0);
          return byYear !== 0 ? byYear : (a.priority ?? 999) - (b.priority ?? 999);
        }),
    [filtered]
  );

  const stats = useMemo(() => {
    const allYears = projects.flatMap((p) => parseYears(p.year));
    const span = allYears.length ? Math.max(...allYears) - Math.min(...allYears) + 1 : 0;
    return {
      total: projects.length,
      live: projects.filter((p) => Boolean(p.url)).length,
      years: span,
    };
  }, []);

  const categoryTags = useMemo(
    () =>
      [
        { value: "all", label: t("index.all") },
        { value: "website", label: t("index.categories.website") },
        { value: "software", label: t("index.categories.software") },
        { value: "extension", label: t("index.categories.extension") },
      ] as const,
    [t]
  );

  const handleHover = useCallback((project: Project, event: React.MouseEvent) => {
    setHovered({ project, x: event.clientX, y: event.clientY });
  }, []);

  const isEmpty = filtered.length === 0;
  const numberOf = (project: Project) => String(projects.indexOf(project) + 1).padStart(2, "0");

  return (
    <>
      <SEO
        title="Projetos"
        description="Explore os projetos de Lucas Diniz — desde extensões de navegador até aplicações web e software."
        url="/projects"
      />
      <SiteHeader isDark={isDark} onToggleTheme={toggleTheme} />

      <div className="min-h-screen w-full bg-canvas text-main pt-14" onMouseLeave={() => setHovered(null)}>
        {/* Ambient brand glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-160px] top-[-220px] h-[640px] w-[640px] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(var(--accent-glow), 0.14) 0%, rgba(var(--accent-glow), 0) 70%)",
          }}
        />

        <main className="relative mx-auto w-full max-w-[1180px] px-5 pb-16 pt-12 sm:px-8">
          {/* ─── Masthead ─────────────────────────── */}
          {/* Entrance animates transform only — never opacity: a throttled rAF
              (background tab) would otherwise leave the masthead invisible. */}
          <motion.p
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-brand"
          >
            {t("index.eyebrow")}
          </motion.p>
          <motion.h1
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="m-0 text-[clamp(2.5rem,5vw,3.75rem)] font-bold leading-[1.04] tracking-tight"
          >
            {t("title")}
          </motion.h1>
          <motion.p
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-9 mt-4 max-w-[560px] text-[15px] leading-relaxed text-sub"
          >
            {t("index.lead")}
          </motion.p>

          {/* ─── Stats ────────────────────────────── */}
          <motion.div
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-11 flex flex-wrap"
          >
            {[
              { value: stats.total, label: t("index.stats.total"), accent: false },
              { value: stats.live, label: t("index.stats.live"), accent: true },
              { value: stats.years, label: t("index.stats.years"), accent: false },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`${index === 0 ? "pr-8" : "px-8"} ${index < 2 ? "border-r border-base" : ""}`}
              >
                <div className={`text-[34px] font-bold leading-none ${stat.accent ? "text-brand" : "text-main"}`}>
                  {stat.value}
                </div>
                <div className="mt-1.5 font-mono text-[11px] uppercase tracking-wide text-faint">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* ─── Filters ──────────────────────────── */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-faint">
              {t("index.filter")}
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <FiSearch size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("search.placeholder")}
                  aria-label={t("search.placeholder")}
                  className="w-full min-w-[220px] rounded-[10px] border border-base bg-field py-2.5 pl-9 pr-3 text-[14px] text-main outline-none transition-colors placeholder:text-dim focus:border-brand sm:w-[260px]"
                />
              </div>
              {categoryTags.map((tag) => {
                const active = activeTag === tag.value;
                return (
                  <button
                    key={tag.value}
                    onClick={() => setActiveTag(tag.value)}
                    aria-pressed={active}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-[12px] font-semibold transition-colors ${
                      active
                        ? "border-brand bg-brand text-white"
                        : "border-base bg-transparent text-sub hover:border-hovered hover:text-main"
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {isEmpty && (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <p className="font-mono text-[14px] text-faint">{t("index.empty")}</p>
              <button
                onClick={() => {
                  setQuery("");
                  setActiveTag("all");
                }}
                className="cursor-pointer rounded-lg bg-brand px-4 py-2 text-[12px] font-bold text-white transition-colors hover:bg-brand-hover"
              >
                {t("index.clearFilters")}
              </button>
            </div>
          )}

          {/* ─── Featured rows ────────────────────── */}
          {featured.length > 0 && (
            <>
              <div className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-faint">
                {t("index.featured")}
              </div>
              <div className="border-t border-base">
                {featured.map((project) => {
                  const status = project.status ? statusLabels[project.status] : null;
                  const gallery = project.images?.length ?? (project.image ? 1 : 0);
                  return (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      onMouseMove={(event: React.MouseEvent) => handleHover(project, event)}
                      onMouseLeave={() => setHovered(null)}
                      className="group relative flex items-center gap-5 border-b border-ghost px-2 py-5 transition-colors hover:bg-panel-hover"
                    >
                      <span
                        aria-hidden
                        className="absolute left-[-14px] top-[10%] bottom-[10%] w-[2px] bg-brand opacity-0 transition-opacity group-hover:opacity-100"
                      />
                      <div className="w-[38px] flex-none font-mono text-[26px] font-bold text-faint">
                        {numberOf(project)}
                      </div>

                      <div className="relative hidden w-[140px] flex-none sm:block">
                        <div className="aspect-video w-full overflow-hidden rounded-lg border border-base bg-panel shadow-token">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-cover object-top"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-mono text-[9px] uppercase text-faint">
                              {project.name}
                            </div>
                          )}
                        </div>
                        {gallery > 1 && (
                          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/65 px-1.5 py-0.5 font-mono text-[9px] text-white/80">
                            ×{gallery}
                          </span>
                        )}
                      </div>

                      <div className="w-[150px] flex-none lg:w-[200px]">
                        <div className="text-[19px] font-bold leading-tight text-main">{project.name}</div>
                        {status && (
                          <div
                            className="mt-1 font-mono text-[10px] font-semibold tracking-wide"
                            style={{ color: status.color }}
                          >
                            {isEn ? status.labelEn : status.labelPt}
                          </div>
                        )}
                      </div>

                      <p className="hidden min-w-0 flex-1 text-[14px] leading-snug text-sub md:line-clamp-2 md:block">
                        {describe(project)}
                      </p>

                      <div className="hidden w-[210px] flex-none flex-wrap gap-1.5 xl:flex">
                        {project.techStack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="rounded border border-base px-1.5 py-0.5 font-mono text-[11px] text-faint"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="hidden w-[42px] flex-none text-right font-mono text-[13px] text-faint sm:block">
                        {lastYear(project.year)}
                      </div>
                      <div className="w-4 flex-none translate-x-[-4px] font-mono text-brand opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                        →
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* ─── Full archive table ───────────────── */}
          {rest.length > 0 && (
            <>
              <div className="mb-1.5 mt-7 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-faint">
                {t("index.fullArchive")} — {rest.length}
              </div>
              <div className="hidden items-center gap-5 border-b border-base px-2 pb-2 font-mono text-[10px] font-bold uppercase tracking-wide text-dim sm:flex">
                <div className="w-[30px] flex-none">{t("index.columns.number")}</div>
                <div className="w-[190px] flex-none">{t("index.columns.name")}</div>
                <div className="flex-1">{t("index.columns.description")}</div>
                <div className="w-[100px] flex-none">{t("index.columns.category")}</div>
                <div className="w-[44px] flex-none text-right">{t("index.columns.year")}</div>
              </div>
              <div>
                {rest.map((project, index) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    onMouseMove={(event: React.MouseEvent) => handleHover(project, event)}
                    onMouseLeave={() => setHovered(null)}
                    className="flex items-center gap-5 border-b border-ghost px-2 py-2.5 transition-colors hover:bg-panel-hover"
                    style={index % 2 ? { backgroundColor: "var(--elevate-1)" } : undefined}
                  >
                    <div className="w-[30px] flex-none font-mono text-[12px] font-semibold text-dim">
                      {numberOf(project)}
                    </div>
                    <div className="w-[150px] flex-none text-[13px] font-semibold uppercase tracking-wide text-main sm:w-[190px]">
                      {project.name}
                    </div>
                    <div className="hidden flex-1 truncate text-[12.5px] leading-snug text-sub sm:block">
                      {describe(project)}
                    </div>
                    <div className="hidden w-[100px] flex-none font-mono text-[11px] text-faint sm:block">
                      {t(`index.categories.${project.category}`)}
                    </div>
                    <div className="w-[44px] flex-none text-right font-mono text-[12px] text-faint">
                      {lastYear(project.year)}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </main>

        {/* ─── Cursor-following preview ──────────── */}
        {hovered?.project.image && (
          <div
            aria-hidden
            className="pointer-events-none fixed z-50 hidden w-[220px] overflow-hidden rounded-[9px] border border-base shadow-token-xl lg:block"
            style={{ left: hovered.x, top: hovered.y, transform: "translate(20px, 20px)" }}
          >
            <img src={hovered.project.image} alt="" className="aspect-video w-full object-cover object-top" />
          </div>
        )}
      </div>
    </>
  );
}
