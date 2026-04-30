import GridMotion from "@/components/GridMotion";
import { useGetProjects } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { FiArrowLeft, FiGithub, FiExternalLink } from "react-icons/fi";

export default function Projects() {
  const { t } = useTranslation(["projects", "common"]);
  const { data: projects } = useGetProjects();

  const gridItems = projects
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
                  {p.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70"
                    >
                      {t}
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
                <span className="text-[10px] text-white/30 ml-auto">{p.year}</span>
              </div>
            </div>
          )
        ),
        // Pad to 28 items
        ...Array(Math.max(0, 28 - (projects?.length ?? 0))).fill(""),
      ]
    : Array(28).fill("");

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
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
          <span className="text-white/40 text-sm">{projects?.length ?? 0} {t("countSuffix")}</span>
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
  );
}
