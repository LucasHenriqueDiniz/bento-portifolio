import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link, useRoute } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import {
  FiArrowLeft,
  FiExternalLink,
  FiGithub,
  FiTag,
  FiCheckCircle,
  FiZap,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
} from "react-icons/fi";
import { projects } from "@/constants";
import { useTheme } from "@/hooks/useTheme";
import SEO from "@/components/SEO";
import NotFound from "./not-found";

const statusConfig: Record<string, { color: string; icon: typeof FiCheckCircle; labelPt: string; labelEn: string }> = {
  completed:      { color: "#22c55e", icon: FiCheckCircle, labelPt: "Concluído",     labelEn: "Completed" },
  workInProgress: { color: "#f59e0b", icon: FiClock,       labelPt: "Em Progresso",  labelEn: "In Progress" },
  experimental:   { color: "#8b5cf6", icon: FiZap,         labelPt: "Experimental",  labelEn: "Experimental" },
  discontinued:   { color: "#ef4444", icon: FiXCircle,     labelPt: "Descontinuado", labelEn: "Discontinued" },
};

export default function ProjectDetailPage() {
  const [, params] = useRoute("/projects/:id");
  const { i18n } = useTranslation(["home", "common"]);
  const currentLang = i18n.language?.split("-")[0] || "pt";
  const [imgIndex, setImgIndex] = useState(0);
  const { isDark, toggleTheme } = useTheme();

  const project = useMemo(() => {
    return projects.find((p) => p.id === params?.id);
  }, [params?.id]);

  // Reset image index when project changes
  useEffect(() => {
    setImgIndex(0);
  }, [params?.id]);

  if (!project) return <NotFound />;

  const status = project.status ? statusConfig[project.status] : null;
  const bullets = (currentLang === "en" && project.descriptionEn
    ? project.descriptionEn
    : project.description
  )
    .split("\n")
    .filter(Boolean);

  const allImages = project.images && project.images.length > 0
    ? project.images
    : project.image
      ? [project.image]
      : [];

  const currentImage = allImages[imgIndex] || null;

  // Prev / next project
  const currentIdx = projects.findIndex((p) => p.id === project.id);
  const prevProject = projects[currentIdx - 1] || null;
  const nextProject = projects[currentIdx + 1] || null;

  const goToProject = (id: string) => {
    window.location.href = `/projects/${id}`;
  };

  const projectImage = allImages.length > 0 ? `https://lucashdo.com${allImages[0]}` : undefined;
  const projectDescription = currentLang === "en" && project.descriptionEn
    ? project.descriptionEn.split("\n")[0]
    : project.description.split("\n")[0];

  return (
    <>
      <SEO
        title={project.name}
        description={projectDescription}
        image={projectImage}
        type="article"
        url={`/projects/${project.id}`}
        lang={currentLang === "en" ? "en" : "pt-BR"}
      />
      <div className={`min-h-screen transition-colors duration-300 bg-canvas text-main`}>
      <SiteHeader isDark={isDark} onToggleTheme={toggleTheme} />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-20 pb-8 sm:pt-24 sm:pb-12">
        {/* ═══ Back nav ═══ */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link
            href="/projects"
            className={`inline-flex items-center gap-2 text-[13px] transition-colors text-faint hover:text-main`}
          >
            <FiArrowLeft size={14} />
            <span>{currentLang === "en" ? "Back to projects" : "Voltar aos projetos"}</span>
          </Link>
        </motion.div>

        {/* ═══ Hero Gallery ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden mb-4 bg-panel border border-base`}
        >
          <AnimatePresence mode="wait">
            {currentImage ? (
              <motion.img
                key={currentImage}
                src={currentImage}
                alt={`${project.name} — ${imgIndex + 1}`}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black bg-field text-faint`}>
                {project.name.charAt(0)}
              </div>
              <span className={`text-sm font-bold text-faint`}>{project.name}</span>
              </div>
            )}
          </AnimatePresence>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          {/* Status badge */}
          {status && (
            <div
              className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-sm"
              style={{
                color: status.color,
                backgroundColor: `${status.color}18`,
                border: `1px solid ${status.color}35`,
              }}
            >
              <status.icon size={12} />
              {currentLang === "en" ? status.labelEn : status.labelPt}
            </div>
          )}

          {/* Gallery arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setImgIndex((i) => (i - 1 + allImages.length) % allImages.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:bg-black/50 hover:text-white transition-all"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                onClick={() => setImgIndex((i) => (i + 1) % allImages.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:bg-black/50 hover:text-white transition-all"
              >
                <FiChevronRight size={18} />
              </button>

              {/* Counter */}
              <div className="absolute bottom-3 right-3 z-10 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-[10px] text-white/70 font-mono">
                {String(imgIndex + 1).padStart(2, "0")} / {String(allImages.length).padStart(2, "0")}
              </div>
            </>
          )}
        </motion.div>

        {/* ═══ Thumbnails ═══ */}
        {allImages.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-10 overflow-x-auto pb-1 scrollbar-hide"
          >
            {allImages.map((img, i) => (
              <button
                key={img}
                onClick={() => setImgIndex(i)}
                className={`relative shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === imgIndex
                    ? "border-brand opacity-100 shadow-lg shadow-accent/10"
                    : isDark
                      ? "border-transparent opacity-40 hover:opacity-70"
                      : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </motion.div>
        )}

        {/* ═══ Title & Actions ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-10"
        >
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight leading-none mb-3">
            {project.name}
          </h1>
          <p className={`text-[15px] leading-relaxed max-w-2xl mb-6 text-sub`}>
            {project.highlight}
          </p>

          <div className="flex flex-wrap gap-3">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-[13px] font-bold hover:bg-brand-hover transition-colors shadow-lg shadow-accent/20"
              >
                <FiExternalLink size={14} />
                {currentLang === "en" ? "Visit Project" : "Visitar Projeto"}
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-[13px] font-bold transition-colors ${
                  isDark
                    ? "bg-panel border-base text-main hover:bg-panel-hover"
                    : "bg-panel border-base text-main hover:bg-panel-hover"
                }`}
              >
                <FiGithub size={14} />
                {currentLang === "en" ? "View Code" : "Ver Código"}
              </a>
            )}
          </div>
        </motion.div>

        {/* ═══ Details Grid ═══ */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`md:col-span-2 p-6 rounded-2xl border bg-panel border-base`}
          >
            <h2 className={`text-[11px] font-bold uppercase tracking-[0.2em] mb-4 text-faint`}>
              {currentLang === "en" ? "About" : "Sobre"}
            </h2>
            <ul className="space-y-3">
              {bullets.map((line, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className={`flex items-start gap-3 text-[13px] leading-relaxed text-sub`}
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-brand" />
                  <span>{line.replace(/^•\s*/, "")}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className={`p-6 rounded-2xl border bg-panel border-base`}
          >
            <h2 className={`text-[11px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-faint`}>
              <FiTag size={10} />
              {currentLang === "en" ? "Tech Stack" : "Tecnologias"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium border bg-field border-base text-sub`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ═══ Prev / Next Project ═══ */}
        <div className="grid grid-cols-2 gap-4">
          {prevProject ? (
            <button
              onClick={() => goToProject(prevProject.id)}
              className={`group text-left p-5 rounded-2xl border transition-all ${
                isDark
                  ? "bg-panel border-base hover:border-hover hover:bg-panel-hover"
                  : "bg-panel border-base hover:border-hover hover:bg-panel-hover"
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 block text-faint`}>
                {currentLang === "en" ? "Previous" : "Anterior"}
              </span>
              <span className="text-[14px] font-bold group-hover:text-brand transition-colors">← {prevProject.name}</span>
            </button>
          ) : (
            <div />
          )}
          {nextProject ? (
            <button
              onClick={() => goToProject(nextProject.id)}
              className={`group text-right p-5 rounded-2xl border transition-all ${
                isDark
                  ? "bg-panel border-base hover:border-hover hover:bg-panel-hover"
                  : "bg-panel border-base hover:border-hover hover:bg-panel-hover"
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 block text-faint`}>
                {currentLang === "en" ? "Next" : "Próximo"}
              </span>
              <span className="text-[14px] font-bold group-hover:text-brand transition-colors">{nextProject.name} →</span>
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
    </>
  );
}
