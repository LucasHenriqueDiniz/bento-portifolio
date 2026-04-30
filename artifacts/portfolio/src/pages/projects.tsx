import { useMemo } from "react";
import { useGetProjectsCached as useGetProjects } from "@/hooks/usePortfolioQueries";
import { projects as constantProjects } from "@/constants";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { FiArrowLeft, FiGithub, FiExternalLink } from "react-icons/fi";

interface DisplayProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  year?: number | null;
}

export default function Projects() {
  const { t } = useTranslation(["projects", "common"]);
  const { data: apiProjects } = useGetProjects();

  const projects: DisplayProject[] = useMemo(() => {
    const src = apiProjects && apiProjects.length > 0
      ? apiProjects.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          tags: p.tags,
          githubUrl: p.githubUrl ?? null,
          liveUrl: p.liveUrl ?? null,
          year: p.year ?? null,
        }))
      : constantProjects.map((p) => ({
          id: p.id,
          title: p.name,
          description: p.description,
          tags: p.techStack,
          githubUrl: p.repoUrl ?? null,
          liveUrl: p.url ?? null,
          year: null,
        }));
    return src;
  }, [apiProjects]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Nav */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <FiArrowLeft size={16} />
            {t("buttons.back", { ns: "common" })}
          </Link>
          <h1 className="text-base font-bold tracking-tight">{t("title")}</h1>
          <span className="text-sm text-neutral-500 dark:text-neutral-500">
            {projects.length}
          </span>
        </div>
      </header>

      {/* Project List */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="space-y-8">
          {projects.map((p, i) => (
            <article key={p.id} className="group">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-xs font-bold text-neutral-400 dark:text-neutral-600 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-lg font-bold tracking-tight">
                  {p.title}
                </h2>
                {p.year && (
                  <span className="text-xs font-medium text-neutral-400 dark:text-neutral-600 ml-auto">
                    {p.year}
                  </span>
                )}
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed pl-6">
                {p.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-3 pl-6">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-3 pl-6">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  >
                    <FiExternalLink size={12} />
                    Live
                  </a>
                )}
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  >
                    <FiGithub size={12} />
                    Source
                  </a>
                )}
              </div>

              {i < projects.length - 1 && (
                <hr className="mt-8 border-neutral-200 dark:border-neutral-800" />
              )}
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 text-center">
        <p className="text-xs text-neutral-500 dark:text-neutral-600">
          lucashdo.com — Lucas Henrique Diniz
        </p>
      </footer>
    </div>
  );
}
