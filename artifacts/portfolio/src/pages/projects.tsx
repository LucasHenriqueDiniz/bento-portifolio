import GridMotion from "@/components/GridMotion";
import { useGetProjectsCached as useGetProjects } from "@/hooks/usePortfolioQueries";
import { projects as constantProjects } from "@/constants";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { FiArrowLeft, FiGithub, FiExternalLink } from "react-icons/fi";

interface DisplayProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  year?: number | null;
}

export default function Projects() {
  const { t } = useTranslation(["projects", "common"]);
  const { data: apiProjects } = useGetProjects();

  const projects: DisplayProject[] =
    apiProjects && apiProjects.length > 0
      ? apiProjects.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          tags: p.tags,
          imageUrl: p.imageUrl ?? null,
          githubUrl: p.githubUrl ?? null,
          liveUrl: p.liveUrl ?? null,
          year: p.year ?? null,
        }))
      : constantProjects.map((p) => ({
          id: p.id,
          title: p.name,
          description: p.description,
          tags: p.techStack,
          imageUrl: p.image ?? null,
          githubUrl: p.repoUrl ?? null,
          liveUrl: p.url ?? null,
          year: null,
        }));

  const gridItems = projects.length
    ? [
        ...projects.map((p) =>
          p.imageUrl ? (
            p.imageUrl
          ) : (
            <div
              key={p.id}
              data-testid={`project-card-${p.id}`}
              className="flex flex-col justify-between p-5 h-full w-full"
            >
              <div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {p.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-[15px] font-bold text-white leading-tight mb-2">{p.title}</h3>
                <p className="text-[12px] text-white/50 line-clamp-3 leading-relaxed">{p.description}</p>
              </div>
              <div className="flex gap-2 mt-3">
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/40 hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiGithub size={14} />
                  </a>
                )}
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/40 hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiExternalLink size={14} />
                  </a>
                )}
                {p.year && (
                  <span className="text-[10px] text-white/30 ml-auto">{p.year}</span>
                )}
              </div>
            </div>
          )
        ),
        // Pad to 28 items
        ...Array(Math.max(0, 28 - projects.length)).fill(""),
      ]
    : Array(28).fill("");

  return (
    <>
      <style>{`
        @media print {
          html, body {
            height: auto !important;
            overflow: visible !important;
            background: white !important;
          }
          .projects-screen {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            left: -9999px !important;
          }
          .projects-screen * {
            display: none !important;
          }
          .projects-print {
            display: block !important;
            visibility: visible !important;
            position: static !important;
            left: auto !important;
            height: auto !important;
            overflow: visible !important;
          }
        }
        @media screen {
          .projects-print {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
          }
        }
      `}</style>

      {/* ─── SCREEN VIEW ─── */}
      <div className="projects-screen min-h-screen bg-black text-white overflow-hidden">
        {/* Nav */}
        <header className="absolute top-0 left-0 right-0 z-50 h-12 flex items-center px-6">
          <div className="flex w-full items-center justify-between">
            <Link
              href="/"
              data-testid="link-back-home"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            >
              <FiArrowLeft size={14} />
              {t("buttons.back", { ns: "common" })}
            </Link>
            <span className="font-bold text-sm tracking-tight text-white/80">{t("title")}</span>
            <span className="text-white/40 text-sm">{projects.length} {t("countSuffix")}</span>
          </div>
        </header>

        {/* GridMotion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-screen"
        >
          <GridMotion items={gridItems} gradientColor="#111111" />
        </motion.div>

        {/* Center overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl font-black tracking-tight mb-2 text-white drop-shadow-2xl">
              {t("hero.title")}
            </h1>
            <p className="text-white/50 text-sm">{t("hero.subtitle")}</p>
          </motion.div>
        </div>
      </div>

      {/* ─── PRINT VIEW ─── */}
      <div className="projects-print bg-white text-black p-8">
        <header className="mb-6 pb-4 border-b border-gray-300">
          <h1 className="text-2xl font-black">{t("hero.title")}</h1>
          <p className="text-sm text-gray-600 mt-1">lucashdo.com/projects</p>
        </header>

        <div className="space-y-4">
          {projects.map((p, i) => (
            <div key={p.id} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-base font-bold">{i + 1}. {p.title}</h2>
                {p.year && <span className="text-xs text-gray-500">{p.year}</span>}
              </div>
              <p className="text-sm text-gray-700 mt-1 leading-relaxed">{p.description}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {p.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 mt-1.5 text-xs text-gray-600">
                {p.githubUrl && <span>{p.githubUrl}</span>}
                {p.liveUrl && <span>{p.liveUrl}</span>}
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500 text-center">
          lucashdo.com — Lucas Henrique Diniz
        </footer>
      </div>
    </>
  );
}
