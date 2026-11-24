import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Bone, Camera, CloudMoon, Hammer, Radio } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SEO from "@/components/SEO";
import { useTheme } from "@/hooks/useTheme";
import { voxelGame } from "@/constants/voxelGame";

const PILLAR_ICONS: Record<string, typeof Hammer> = { melee: Hammer, body: Bone, survival: CloudMoon, world: Radio };
const PLACEHOLDER_SHOTS = 6;

// A wall of voxels with a bite taken out of it: each cell is on, off or bloodied,
// decided once from its position so the pattern is the same on every render.
const COLS = 28;
const ROWS = 9;
const WALL = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const noise = Math.abs(Math.sin(col * 12.9898 + row * 78.233) * 43758.5453) % 1;
  const bite = Math.hypot((col - 19) / 5.5, (row - 3.5) / 3.2);
  if (bite < 0.75) return "gone";
  if (bite < 1.05) return noise > 0.35 ? "blood" : "gone";
  if (bite < 1.3 && noise > 0.7) return "blood";
  return noise > 0.12 ? "solid" : "gone";
});

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/**
 * The page of the voxel zombie game. It is built to stand before the game has a name
 * or pictures: the title is the working one and every screenshot slot shows a
 * placeholder until `voxelGame.screenshots` lists a file for it.
 */
export default function VoxelGamePage() {
  const { isDark, toggleTheme } = useTheme();
  const { i18n } = useTranslation();
  const still = useReducedMotion() ?? false;
  const lang = i18n.language?.split("-")[0] === "en" ? "en" : "pt";
  const copy = {
    back: { pt: "Voltar", en: "Back" },
    workingTitle: { pt: "Título provisório", en: "Working title" },
    inDevelopment: { pt: "Em desenvolvimento", en: "In development" },
    what: { pt: "O que é", en: "What it is" },
    shots: { pt: "Imagens", en: "Screenshots" },
    shotsSoon: { pt: "Imagens em breve", en: "Screenshots coming soon" },
    shotSlot: { pt: "Imagem em breve", en: "Picture coming soon" },
    status: { pt: "Em que pé está", en: "Where it stands" },
    statusText: {
      pt: "É um protótipo, feito para responder uma pergunta antes de qualquer outra: bater em um zumbi de voxel é satisfatório? Nome, demo e data ainda não existem.",
      en: "It is a prototype, built to answer one question before any other: is hitting a voxel zombie satisfying? A name, a demo and a date do not exist yet.",
    },
  };
  const [hero, ...rest] = voxelGame.screenshots;
  const tiles = voxelGame.screenshots.length > 0 ? rest.length : PLACEHOLDER_SHOTS;

  return (
    <>
      <SEO title={voxelGame.name} description={voxelGame.tagline[lang]} url={voxelGame.path} image={hero?.src} />
      <div className={`min-h-screen bg-canvas text-main transition-colors duration-300 ${isDark ? "dark" : ""}`}>
        <SiteHeader isDark={isDark} onToggleTheme={toggleTheme} />

        <main className="relative mx-auto w-full max-w-[1080px] px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-faint hover:text-brand transition-colors">
            <ArrowLeft size={14} aria-hidden />
            {copy.back[lang]}
          </Link>

          {/* Hero: always dark, like the game. */}
          <section className="relative mt-4 overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d10] text-white">
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 grid gap-[3px] p-4 opacity-90 [mask-image:linear-gradient(180deg,transparent,black_45%)]"
              style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
            >
              {WALL.map((cell, i) => (
                <span
                  key={i}
                  className={`aspect-square rounded-[2px] ${still || cell === "gone" ? "" : "gh-cell"}`}
                  style={{
                    background: cell === "solid" ? "#2a3038" : cell === "blood" ? "#8f1d1d" : "transparent",
                    animationDelay: `${((i % COLS) * 18 + Math.floor(i / COLS) * 40) / 1000}s`,
                  }}
                />
              ))}
            </div>
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_72%_70%,rgba(143,29,29,0.35),transparent_45%)]" />

            <div className="relative px-6 pb-40 pt-10 sm:px-10 sm:pb-52 sm:pt-14">
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300">
                  <span className="relative flex h-1.5 w-1.5">
                    {!still && <span className="absolute inset-0 animate-ping rounded-full bg-amber-400 opacity-70" />}
                    <span className="relative h-1.5 w-1.5 rounded-full bg-amber-400" />
                  </span>
                  {copy.inDevelopment[lang]} · {voxelGame.stage[lang]}
                </span>
                {!voxelGame.hasFinalName && (
                  <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">
                    {copy.workingTitle[lang]}
                  </span>
                )}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="mt-5 max-w-[16ch] text-[40px] font-black leading-[0.95] tracking-tight sm:text-[64px]"
              >
                {voxelGame.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.16 }}
                className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-white/75 sm:text-[17px]"
              >
                {voxelGame.tagline[lang]}
              </motion.p>
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.26 }}
                className="mt-5 flex flex-wrap gap-1.5"
              >
                {voxelGame.stack.map((tech) => (
                  <li key={tech} className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[11px] font-medium text-white/80">
                    {tech}
                  </li>
                ))}
              </motion.ul>
            </div>
          </section>

          {/* The first screenshot, or the slot waiting for it. */}
          <motion.section {...reveal()} className="mt-4" aria-label={copy.shots[lang]}>
            {hero ? (
              <img src={hero.src} alt={hero.alt[lang]} className="aspect-video w-full rounded-3xl border border-base object-cover" />
            ) : (
              <div
                data-testid="hero-shot-placeholder"
                className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-base bg-panel text-faint"
              >
                <Camera size={28} aria-hidden />
                <p className="text-[13px] font-semibold">{copy.shotsSoon[lang]}</p>
              </div>
            )}
          </motion.section>

          <section className="mt-12">
            <motion.h2 {...reveal()} className="text-[11px] font-bold uppercase tracking-[0.18em] text-faint">
              {copy.what[lang]}
            </motion.h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {voxelGame.pillars.map((pillar, i) => {
                const Icon = PILLAR_ICONS[pillar.id] ?? Hammer;
                return (
                  <motion.article key={pillar.id} {...reveal(i * 0.06)} className="rounded-2xl border border-base bg-panel p-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-subtle text-brand">
                      <Icon size={18} aria-hidden />
                    </span>
                    <h3 className="mt-3 text-[17px] font-bold tracking-tight">{pillar.title[lang]}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-sub">{pillar.text[lang]}</p>
                  </motion.article>
                );
              })}
            </div>
          </section>

          <section className="mt-12">
            <motion.h2 {...reveal()} className="text-[11px] font-bold uppercase tracking-[0.18em] text-faint">
              {copy.shots[lang]}
            </motion.h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: tiles }, (_, i) => {
                const shot = rest[i];
                return (
                  <motion.li key={i} {...reveal(i * 0.04)}>
                    {shot ? (
                      <img src={shot.src} alt={shot.alt[lang]} loading="lazy" className="aspect-video w-full rounded-2xl border border-base object-cover" />
                    ) : (
                      <div className="flex aspect-video w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-base bg-panel text-faint">
                        <Camera size={18} aria-hidden />
                        <span className="text-[11px] font-medium">{copy.shotSlot[lang]}</span>
                      </div>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </section>

          <motion.section {...reveal()} className="mt-12 rounded-2xl border border-base bg-panel p-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-faint">{copy.status[lang]}</h2>
            <p className="mt-2 max-w-[70ch] text-[14px] leading-relaxed text-sub">{copy.statusText[lang]}</p>
          </motion.section>
        </main>
      </div>
    </>
  );
}
