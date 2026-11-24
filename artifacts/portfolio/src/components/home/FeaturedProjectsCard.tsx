import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { ArrowRight, Globe } from "lucide-react";
import { Card } from "@/components/Card";

const SLIDE_MS = 6000;

export interface Project {
  id: string;
  name: string;
  /** One line about the project, shown under its name. */
  description: string;
  techStack: string[];
  highlight: string;
  url?: string;
  wip?: boolean;
  image?: string;
}

interface FeaturedProjectsCardProps {
  projects: Project[];
}

/**
 * Featured projects with the screenshot as the whole card: it drifts slowly under a
 * dark veil that keeps the text readable, and slides cross-fade. A segmented bar shows
 * which project is playing; hovering pauses, arrow keys move while the card has focus.
 */
export function FeaturedProjectsCard({ projects }: FeaturedProjectsCardProps) {
  const { t } = useTranslation("home");
  const [, setLocation] = useLocation();
  const still = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = projects.length;
  const playing = count > 1 && !paused && !still;

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [playing, index, count]);

  if (count === 0) {
    return (
      <Card className="h-full rounded-2xl bg-panel border border-base" glowColor="var(--accent-glow)">
        <div className="h-full flex items-center justify-center">
          <p className="text-[12px] font-bold text-faint">{t("project.empty.title")}</p>
        </div>
      </Card>
    );
  }

  const project = projects[index % count];
  const move = (step: number) => setIndex((i) => (i + step + count) % count);

  return (
    <Card className="h-full" glowColor="var(--accent-glow)">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={t("project.featured")}
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
          else if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
        }}
        className="relative h-full overflow-hidden bg-[#0d0f14] text-white outline-none focus-visible:ring-2 focus-visible:ring-brand"
        style={{ borderRadius: "inherit" }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={project.id}
            className="absolute inset-y-0 right-0 w-[60%]"
            // The screenshot fades into the card on its left edge, so the text sits on
            // plain dark whatever the screenshot's own colours are.
            style={{ maskImage: "linear-gradient(to right, transparent 26%, black 78%)", WebkitMaskImage: "linear-gradient(to right, transparent 26%, black 78%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: still ? 0 : 0.7 }}
          >
            {project.image && (
              <motion.img
                src={project.image}
                alt=""
                className="h-full w-full object-cover object-left-top"
                initial={{ scale: 1.02, x: 0 }}
                animate={still ? undefined : { scale: 1.14, x: -10 }}
                transition={{ duration: SLIDE_MS / 1000 + 1, ease: "linear" }}
              />
            )}
          </motion.div>
        </AnimatePresence>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#0d0f14] from-30% via-[#0d0f14]/55 via-55% to-transparent" />

        <div className="relative h-full p-3.5 flex flex-col">
          <div className="flex gap-1" role="tablist" aria-label={t("project.featured")}>
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${t("project.goTo")} ${p.name}`}
                onClick={() => setIndex(i)}
                className="flex-1 h-[3px] rounded-full bg-white/25 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {i < index && <span className="block h-full bg-white/70" />}
                {i === index && (
                  <span
                    key={`${index}-${playing}`}
                    className="block h-full bg-white origin-left"
                    style={playing ? { animation: `project-progress ${SLIDE_MS}ms linear forwards` } : undefined}
                  />
                )}
              </button>
            ))}
          </div>

          <p className="mt-2.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/60">
            {t("project.featured")} · {index + 1}/{count}
          </p>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={project.id}
              className="mt-1 max-w-[54%]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: still ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="text-[19px] font-black leading-tight tracking-tight flex items-center gap-2">
                {project.name}
                {project.wip && (
                  <span className="text-[8px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/15 text-white/80">
                    {t("project.wip")}
                  </span>
                )}
              </h3>
              <p className="mt-1 text-[11px] leading-snug text-white/75 line-clamp-2">{project.description}</p>
              <ul className="mt-2 flex flex-wrap gap-1">
                {project.techStack.slice(0, 4).map((tech, i) => (
                  <motion.li
                    key={tech}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.05 }}
                    className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/12 border border-white/15 text-white/85 backdrop-blur-sm"
                  >
                    {tech}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          <div className="mt-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setLocation(`/projects/${project.id}`)}
              className="group inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-brand hover:bg-brand-hover transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {t("project.view")}
              <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${t("project.openSite")}: ${project.name}`}
                className="inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1.5 rounded-lg bg-white/12 border border-white/15 hover:bg-white/20 transition-colors backdrop-blur-sm outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Globe size={11} />
                {t("project.openSite")}
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
