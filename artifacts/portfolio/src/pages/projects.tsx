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
        ...Array(Math.max(0, 28 - projects.length)).fill(""),
      ]
    : Array(28).fill("");

  return (
    <>
      <style>{`
        @media print {
          html, body {
            background: #fff !important;
            color: #000 !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
          }
          .for-screen,
          .for-screen * {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            min-height: 0 !important;
            max-height: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            top: -9999px !important;
            left: -9999px !important;
          }
          .for-print {
            display: block !important;
            visibility: visible !important;
            position: static !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            top: auto !important;
            left: auto !important;
            width: 100% !important;
          }
          a { color: #000 !important; text-decoration: none !important; }
          @page { margin: 15mm; size: auto; }
        }
        @media screen {
          .for-print { display: none !important; }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════
         SCREEN  —  Full visual experience
         ═══════════════════════════════════════════════ */}
      <div className="for-screen min-h-screen bg-black text-white overflow-hidden">
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-screen"
        >
          <GridMotion items={gridItems} gradientColor="#111111" />
        </motion.div>

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

      {/* ═══════════════════════════════════════════════
         PRINT  —  Compact text-only list
         ═══════════════════════════════════════════════ */}
      <div className="for-print font-sans text-black bg-white p-0">
        <header className="border-b-2 border-black pb-3 mb-5">
          <h1 className="text-xl font-black uppercase tracking-tight">{t("hero.title")}</h1>
          <p className="text-sm mt-1">Lucas Henrique Diniz — lucashdo.com/projects</p>
        </header>

        <main>
          {projects.map((p, i) => (
            <div key={p.id} className="break-inside-avoid mb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm text-gray-500 font-medium">{i + 1}.</span>
                <h2 className="text-sm font-bold">{p.title}</h2>
                {p.year && <span className="text-xs text-gray-500 ml-auto">{p.year}</span>}
              </div>
              <p className="text-xs text-gray-800 leading-snug">{p.description}</p>
              <p className="text-xs text-gray-600 mt-1">{p.tags.join(" · ")}</p>
              <div className="text-xs text-gray-700 mt-1">
                {p.liveUrl && <span className="mr-3">{p.liveUrl.replace(/^https:\/\//, "")}</span>}
                {p.githubUrl && <span>{p.githubUrl.replace(/^https:\/\//, "")}</span>}
              </div>
              {i < projects.length - 1 && <hr className="mt-4 border-gray-200" />}
            </div>
          ))}
        </main>

        <footer className="mt-6 pt-2 border-t border-gray-300 text-xs text-center text-gray-500">
          lucashdo.com — Lucas Henrique Diniz
        </footer>
      </div>
    </>
  );
}
