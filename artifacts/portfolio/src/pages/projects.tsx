import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import GridMotion from "@/components/GridMotion";
import SiteHeader from "@/components/SiteHeader";
import { useTheme } from "@/hooks/useTheme";
import { projects, type Project } from "@/constants";

const statusColors: Record<string, string> = {
  completed: "#22c55e",
  workInProgress: "#f59e0b",
  experimental: "#8b5cf6",
  discontinued: "#ef4444",
};

const statusLabels: Record<string, { pt: string; en: string }> = {
  completed: { pt: "Concluído", en: "Completed" },
  workInProgress: { pt: "Em Progresso", en: "In Progress" },
  experimental: { pt: "Experimental", en: "Experimental" },
  discontinued: { pt: "Descontinuado", en: "Discontinued" },
};

export default function ProjectsPage() {
  const { t, i18n } = useTranslation("projects");
  const currentLang = i18n.language?.split("-")[0] || "pt";
  const [query, setQuery] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { isDark, toggleTheme } = useTheme();
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Rotating image index for tooltip */
  const [tooltipImgIdx, setTooltipImgIdx] = useState(0);
  const tooltipTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTooltipRotation = useCallback((project: Project) => {
    const imgs = project.images && project.images.length > 1 ? project.images : null;
    if (!imgs) return;
    setTooltipImgIdx(0);
    if (tooltipTimer.current) clearInterval(tooltipTimer.current);
    tooltipTimer.current = setInterval(() => {
      setTooltipImgIdx((i) => (i + 1) % imgs.length);
    }, 1400);
  }, []);

  const stopTooltipRotation = useCallback(() => {
    if (tooltipTimer.current) {
      clearInterval(tooltipTimer.current);
      tooltipTimer.current = null;
    }
    setTooltipImgIdx(0);
  }, []);

  const filtered = projects.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.techStack.some((t) => t.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q) ||
      (p.descriptionEn?.toLowerCase().includes(q) ?? false)
    );
  });

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

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const idx = filtered.findIndex((p) => p.id === hoveredId);
        if (e.key === "ArrowDown") {
          const next = filtered[Math.min(idx + 1, filtered.length - 1)];
          if (next) setHoveredId(next.id);
        } else {
          const prev = filtered[Math.max(idx - 1, 0)];
          if (prev) setHoveredId(prev.id);
        }
      }
    },
    [filtered, hoveredId]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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

            {/* List */}
            <div ref={listRef} className="relative">
              {filtered.length > 0 ? (
                filtered.map((project, i) => {
                  const status = project.status ? statusLabels[project.status][currentLang as "pt" | "en"] : "";
                  const statusColor = project.status ? statusColors[project.status] : "#555";
                  const isHovered = hoveredId === project.id;

                  return (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      onMouseEnter={() => {
                        setHoveredId(project.id);
                        startTooltipRotation(project);
                      }}
                      onMouseLeave={() => {
                        setHoveredId(null);
                        stopTooltipRotation();
                      }}
                      className="group block"
                    >
                      <motion.div
                        layout
                        className={`relative flex items-center gap-4 sm:gap-6 py-5 sm:py-6 border-b cursor-pointer ${
                          isDark ? "border-white/[0.06]" : "border-black/[0.06]"
                        }`}
                      >
                        {/* Number */}
                        <span className={`w-8 text-[11px] font-mono shrink-0 text-right hidden sm:block text-faint`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        {/* Status dot */}
                        <div className="relative shrink-0">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
                          {isHovered && (
                            <motion.div
                              layoutId="hover-dot"
                              className="absolute inset-0 w-2 h-2 rounded-full"
                              style={{ backgroundColor: statusColor }}
                              initial={{ scale: 1 }}
                              animate={{ scale: 1.5, opacity: 0.5 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </div>

                        {/* Name & meta */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-[15px] sm:text-[17px] font-bold tracking-tight group-hover:text-brand transition-colors truncate">
                              {project.name}
                            </h3>
                            {/* Status badge mobile */}
                            <span
                              className="sm:hidden text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                              style={{ color: statusColor, backgroundColor: `${statusColor}15` }}
                            >
                              {status}
                            </span>
                          </div>
                          <p className={`text-[12px] truncate leading-relaxed text-faint`}>
                            {project.highlight}
                          </p>
                        </div>

                        {/* Tech stack — desktop only */}
                        <div className="hidden lg:flex items-center gap-1.5 shrink-0 max-w-[220px]">
                          {project.techStack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className={`text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap ${
                                isDark ? "bg-white/[0.04] text-faint" : "bg-black/[0.04] text-faint"
                              }`}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 3 && (
                            <span className={`text-[10px] text-faint`}>
                              +{project.techStack.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Status desktop */}
                        <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 w-24">
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: statusColor }}>
                            {status}
                          </span>
                        </div>

                        {/* Arrow */}
                        <motion.div
                          className={`shrink-0 transition-colors ${
                            isDark ? "text-faint group-hover:text-main" : "text-faint group-hover:text-main"
                          }`}
                          animate={{ x: isHovered ? 4 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FiArrowRight size={16} />
                        </motion.div>

                        {/* Hover image preview */}
                        <AnimatePresence>
                          {isHovered && project.image && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.92, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.92, y: 10 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="hidden xl:block absolute right-12 top-1/2 -translate-y-1/2 z-30 pointer-events-none"
                            >
                              <div className="relative w-[280px] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-panel">
                                {(() => {
                                  const imgs =
                                    project.images && project.images.length > 0
                                      ? project.images
                                      : project.image
                                        ? [project.image]
                                        : [];
                                  return (
                                    <div className="relative aspect-[16/10]">
                                      <AnimatePresence mode="wait">
                                        <motion.img
                                          key={imgs[tooltipImgIdx % imgs.length]}
                                          src={imgs[tooltipImgIdx % imgs.length]}
                                          alt={`${project.name} — ${tooltipImgIdx + 1}`}
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          exit={{ opacity: 0 }}
                                          transition={{ duration: 0.35 }}
                                          className="absolute inset-0 w-full h-full object-cover"
                                        />
                                      </AnimatePresence>
                                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/40 to-transparent" />

                                      {/* Image counter dots */}
                                      {imgs.length > 1 && (
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                                          {imgs.map((_, i) => (
                                            <div
                                              key={i}
                                              className="h-1 rounded-full transition-all duration-300"
                                              style={{
                                                width: i === (tooltipImgIdx % imgs.length) ? 14 : 4,
                                                backgroundColor:
                                                  i === (tooltipImgIdx % imgs.length)
                                                    ? "#fff"
                                                    : "rgba(255,255,255,0.3)",
                                              }}
                                            />
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Hover bg highlight */}
                        <motion.div
                          className="absolute inset-0 -mx-4 sm:-mx-8 rounded-xl pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: isHovered ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            backgroundColor: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.02)",
                          }}
                        />
                      </motion.div>
                    </Link>
                  );
                })
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
