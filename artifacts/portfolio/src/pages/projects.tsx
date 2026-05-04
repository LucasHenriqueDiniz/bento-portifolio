import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
import GridMotion from "@/components/GridMotion";
import FlowingMenu from "@/components/FlowingMenu";
import SiteHeader from "@/components/SiteHeader";
import { useTheme } from "@/hooks/useTheme";
import { projects } from "@/constants";

type ProjectTag = "all" | "website" | "software" | "extension";

export default function ProjectsPage() {
  const { t, i18n } = useTranslation("projects");
  const currentLang = i18n.language?.split("-")[0] || "pt";
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<ProjectTag>("all");
  const { isDark, toggleTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = projects
    .slice()
    .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
    .filter((p) => {
      const hasQuery = Boolean(query.trim());
      const q = query.toLowerCase();
      const localizedType = (currentLang === "en" ? p.typeEn : p.type) ?? "";
      const localizedRole = (currentLang === "en" ? p.roleEn : p.role) ?? "";
      const localizedHighlight = currentLang === "en" ? p.highlightEn : p.highlight;
      const localizedDescription = currentLang === "en" ? p.descriptionEn : p.description;
      const matchesQuery = !hasQuery
        ? true
        : p.name.toLowerCase().includes(q) ||
          p.techStack.some((t) => t.toLowerCase().includes(q)) ||
          localizedDescription.toLowerCase().includes(q) ||
          localizedHighlight.toLowerCase().includes(q) ||
          localizedType.toLowerCase().includes(q) ||
          localizedRole.toLowerCase().includes(q) ||
          (p.year?.toLowerCase().includes(q) ?? false);

      if (!matchesQuery) return false;
      if (activeTag === "all") return true;
      return p.category === activeTag;
    });

  const categoryTags = useMemo(
    () => [
      { value: "website", label: currentLang === "en" ? "Website" : "Site" },
      { value: "software", label: currentLang === "en" ? "Software" : "Software" },
      { value: "extension", label: currentLang === "en" ? "Extension" : "Extensão" },
    ] as const,
    [currentLang]
  );

  // Build GridMotion items from project images
  const gridItems = projects.map((p) =>
    p.image ? (
      <div key={p.id} className="w-full h-full relative">
        <img
          src={p.image}
          alt={p.name}
          className={`w-full h-full object-cover transition-opacity ${isDark ? "opacity-60 hover:opacity-80" : "opacity-78 hover:opacity-95"}`}
        />
        <div className={`absolute inset-0 ${isDark ? "bg-black/30" : "bg-transparent"}`} />
      </div>
    ) : (
      <div key={p.id} className="w-full h-full flex items-center justify-center bg-panel">
        <span className="text-[10px] text-faint uppercase tracking-wider">{p.name}</span>
      </div>
    )
  );

  // Fill remaining slots with repeats
  while (gridItems.length < 28) {
    const p = projects[gridItems.length % projects.length];
    gridItems.push(
      p.image ? (
        <div key={`repeat-${gridItems.length}`} className="w-full h-full relative">
            <img
              src={p.image}
              alt={p.name}
            className={`w-full h-full object-cover transition-opacity ${isDark ? "opacity-40 hover:opacity-70" : "opacity-68 hover:opacity-84"}`}
            />
          <div className={`absolute inset-0 ${isDark ? "bg-black/40" : "bg-transparent"}`} />
        </div>
      ) : (
        <div key={`repeat-${gridItems.length}`} className="w-full h-full flex items-center justify-center bg-panel">
          <span className="text-[10px] text-faint uppercase tracking-wider">{p.name}</span>
        </div>
      )
    );
  }

  const menuItems = useMemo(
    () =>
      filtered.map((project) => {
        const gallery = project.images && project.images.length > 0 ? project.images : project.image ? [project.image] : [];

        return {
          link: `/projects/${project.id}`,
          text: project.name,
          image: gallery.length > 0 ? gallery : ["/og-image.jpg"],
        };
      }),
    [currentLang, filtered]
  );

  const heroGradientColor = isDark ? "#0d0d0d" : "#b7a48f";
  const heroTitleClass = isDark
    ? "drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
    : "text-[#1b1714] drop-shadow-[0_1px_2px_rgba(255,255,255,0.45)]";
  const heroSubtitleClass = isDark
    ? "text-white/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
    : "text-[#3f3730]";
  const heroSearchClass = isDark
    ? "bg-black/30 backdrop-blur-md border-white/15 text-white placeholder:text-white/40 focus:border-brand/60 focus:bg-black/50"
    : "bg-white/70 backdrop-blur-md border-black/10 text-[#1f1a15] placeholder:text-[#6f6358] focus:border-brand/50 focus:bg-white";
  const heroSearchIconClass = isDark ? "text-white/40" : "text-[#6f6358]";
  const heroCtaClass = isDark
    ? "text-white/90 hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
    : "text-[#2e2721] hover:text-[#16120f]";
  const heroCtaCircleClass = isDark
    ? "border-white/20 bg-black/20 group-hover:border-white/50 group-hover:bg-black/40"
    : "border-black/15 bg-white/70 group-hover:border-black/30 group-hover:bg-white";
  const heroBottomFadeClass = isDark
    ? "from-[#0d0d0d]"
    : "from-[#f5f5f5]";

  return (
    <>
      <SiteHeader isDark={isDark} onToggleTheme={toggleTheme} />

      {/* ═══ Scroll Container with Snap ═══ */}
      <div
        ref={containerRef}
        className={`h-screen w-full overflow-y-auto scroll-smooth snap-y snap-mandatory custom-scrollbar transition-colors duration-300 pt-14 ${
          isDark ? "bg-canvas text-main" : "bg-canvas text-main"
        }`}
      >
        {/* ════════════════════════════════════════
            SECTION 1 — Hero with GridMotion
           ════════════════════════════════════════ */}
        <section className="h-screen w-full relative shrink-0 snap-start snap-always">
          <GridMotion items={gridItems} gradientColor={heroGradientColor} />
          {/* Overlay content */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 pt-20 pointer-events-none">
            {/* Nav spacer (header is fixed now) */}
            <div />

            {/* Center text */}
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className={`text-[clamp(2.5rem,8vw,6rem)] font-black tracking-tighter leading-none ${heroTitleClass}`}
              >
                {t("hero.prefix")}
                <br />
                <span className={`text-brand ${isDark ? "drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" : ""}`}>
                  {t("title")}
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className={`text-[13px] mt-4 max-w-md mx-auto ${heroSubtitleClass}`}
              >
                {t("subtitle")}
              </motion.p>

              {/* Search */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-6 pointer-events-auto"
              >
                <div className="relative inline-flex items-center">
                  <FiSearch size={14} className={`absolute left-3 ${heroSearchIconClass}`} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                      t("search.placeholder")
                    }
                    className={`w-[280px] sm:w-[340px] pl-9 pr-10 py-2.5 rounded-xl border text-[13px] focus:outline-none transition-all shadow-lg ${heroSearchClass}`}
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className={`absolute right-3 text-[11px] ${isDark ? "text-white/40 hover:text-white" : "text-[#6f6358] hover:text-[#1f1a15]"}`}
                    >
                        {t("search.clear")}
                      </button>
                    )}
                </div>
              </motion.div>
            </div>

            {/* CTA Scroll Down */}
            <div className="flex flex-col items-center gap-3 pointer-events-auto pb-6">
              <button
                onClick={() => {
                  const el = containerRef.current;
                  if (el) el.scrollBy({ top: window.innerHeight, behavior: "smooth" });
                }}
                className={`group flex flex-col items-center gap-2 transition-colors cursor-pointer ${heroCtaClass}`}
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  {t("hero.viewAll")}
                </span>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className={`w-8 h-8 rounded-full border backdrop-blur-sm flex items-center justify-center transition-all ${heroCtaCircleClass}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </motion.div>
              </button>
            </div>
          </div>

          {/* Fade gradient at bottom */}
          <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${heroBottomFadeClass} to-transparent z-[5] pointer-events-none`} />
        </section>

        {/* ════════════════════════════════════════
            SECTION 2 — Project List Showcase
           ════════════════════════════════════════ */}
        <section className="min-h-screen w-full shrink-0 snap-start py-20 px-4 sm:px-8">
          <div className="max-w-[1000px] mx-auto">
            {/* Section header */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 text-faint`}>
                  {t("archive")}
                </p>
                <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-black tracking-tight">
                  {filtered.length} {t("countSuffix")}
                </h2>
              </div>
              {query && (
                <p className={`text-[12px] text-faint`}>
                  {t("searching", { query })}
                </p>
              )}
            </div>

            <div className="mb-8 flex flex-col gap-4">
              <div className="relative w-full sm:max-w-[460px]">
                <FiSearch size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-white/40" : "text-[#6f6358]"}`} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("search.placeholder")}
                  className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-[13px] focus:outline-none transition-all ${
                    isDark
                      ? "bg-black/30 border-white/15 text-white placeholder:text-white/40"
                      : "bg-white border-black/10 text-[#1f1a15] placeholder:text-[#6f6358]"
                  }`}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTag("all")}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors ${
                    activeTag === "all"
                      ? "bg-brand text-white"
                      : isDark
                        ? "bg-white/10 text-white/75 hover:bg-white/20"
                        : "bg-black/8 text-[#3b322b] hover:bg-black/12"
                  }`}
                >
                  {currentLang === "en" ? "All" : "Todos"}
                </button>
                {categoryTags.map((tag) => (
                  <button
                    key={tag.value}
                    onClick={() => setActiveTag(tag.value)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      activeTag === tag.value
                        ? "bg-brand text-white"
                        : isDark
                          ? "bg-white/10 text-white/75 hover:bg-white/20"
                          : "bg-black/8 text-[#3b322b] hover:bg-black/12"
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              {filtered.length > 0 ? (
                <div className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] overflow-hidden">
                  <div className="relative h-auto">
                    <FlowingMenu
                      items={menuItems}
                      speed={24}
                      textColor={isDark ? "#f9f6ef" : "#201911"}
                      bgColor={isDark ? "#0d1014" : "#efe4d5"}
                      marqueeBgColor={isDark ? "#f1b35a" : "#111111"}
                      marqueeTextColor={isDark ? "#22170a" : "#f7ede1"}
                      borderColor={isDark ? "rgba(255,255,255,0.16)" : "rgba(17,17,17,0.22)"}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                  <FiSearch size={32} className="text-faint" />
                  <p className={`text-[15px] font-bold text-faint`}>
                    {currentLang === "en" ? "No projects found" : "Nenhum projeto encontrado"}
                  </p>
                  <p className={`text-[12px] max-w-xs text-faint`}>
                    {currentLang === "en"
                      ? "Try different keywords or tech names."
                      : "Tente palavras-chave ou nomes de tecnologias diferentes."}
                  </p>
                  <button
                    onClick={() => setQuery("")}
                    className="mt-2 px-4 py-2 rounded-lg bg-brand text-white text-[12px] font-bold hover:bg-brand-hover transition-colors"
                  >
                    {currentLang === "en" ? "Clear search" : "Limpar busca"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
