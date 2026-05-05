import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';
import SiteHeader from "@/components/SiteHeader";
import { useTheme } from "@/hooks/useTheme";
import {
  useGetNowPlayingCached as useGetNowPlaying,
  useGetTopArtistsCached as useGetTopArtists,
  useGetTopTracksCached as useGetTopTracks,
  useGetSteamDataCached as useGetSteamData,
  useGetLastWorkoutCached as useGetLastWorkout,
  useGetStatsCached as useGetStats,
  useGetMalDataCached as useGetMalData,
} from "@/hooks/usePortfolioQueries";
import { useClock } from "@/hooks/useClock";
import {
  WeatherClockCard,
  AlbumArtCard,
  WorkoutCard,
  GitHubCard,
  TimelineCard,
  MyAnimeListCard,
  SteamCard,
  TopArtistsCard,
  CVCard,
  TechStackCard,
  PolaroidStack,
  EnhancedProjectCard,
  CurrentlyWorkingCard,
} from "@/components/home";
import { BentoSection } from "@/components/BentoCard";
import { Card } from "@/components/Card";
import { CardGlowProvider } from "@/components/CardGlowContext";
import { contacts, featuredProjects } from "@/constants";
import { SiInstagram, SiDiscord, SiGithub } from "react-icons/si";
import { FiMail } from "react-icons/fi";
import { Linkedin } from "lucide-react";

const ACCENT = "var(--accent)";
const CARD = "bg-panel border border-base rounded-2xl";
const LABEL = "text-[10px] font-semibold uppercase tracking-widest text-faint";
const GALLERY_SLIDES = [
  "/gallery/pingo-bored.webp",
  "/gallery/bully.webp",
  "/gallery/snake-babe.webp",
  "/gallery/lili_bed.webp",
  "/gallery/wip-school-entrance-background.webp",
];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.045, duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

/* ─── Individual Social Cards ─────────────────────── */
const socialIcons: Record<string, React.ReactNode> = {
  Instagram: <SiInstagram size={14} />,
  Discord: <SiDiscord size={14} />,
  GitHub: <SiGithub size={14} />,
  LinkedIn: <Linkedin size={14} />,
  Email: <FiMail size={14} />,
};

function SocialCard({ contact, isDark }: { contact: typeof contacts[number]; isDark: boolean }) {
  return (
    <Card
      className={`h-full ${isDark ? "bg-white/4 border-white/8 hover:border-white/15 hover:bg-white/6" : "bg-panel-hover border-base hover:border-hover hover:bg-panel"} transition-all`}
      glowColor="var(--accent-glow)"
    >
      <motion.a
        href={contact.url}
        target="_blank"
        rel="noreferrer"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="h-full flex flex-col items-center justify-center gap-1.5 cursor-pointer"
        title={contact.label}
        style={{
          color: contact.color,
        }}
      >
        <span className="text-[16px] leading-none">{socialIcons[contact.platform]}</span>
        <span className={`text-[9px] font-bold uppercase tracking-wider text-center leading-tight ${isDark ? "text-white/70" : "text-sub"}`}>
          {contact.label}
        </span>
      </motion.a>
    </Card>
  );
}

/* ─── Projects CTA (col 6, rows 7-8) ───────────────── */
function ProjectsCTA() {
  const { t } = useTranslation("home");
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [mag, setMag] = useState({ x: 0, y: 0, rx: 0, ry: 0 });

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const dx = px - 0.5;
    const dy = py - 0.5;
    setMag({ x: dx * 8, y: dy * 8, rx: -dy * 2.2, ry: dx * 2.2 });
  };

  const resetMove = () => setMag({ x: 0, y: 0, rx: 0, ry: 0 });

  return (
    <Card className="h-full cta-shimmer" glowColor="255, 200, 100" glowIntensity={1.6}>
      <motion.a
        ref={ctaRef}
        href="/projects"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        animate={{ x: mag.x, y: mag.y, rotateX: mag.rx, rotateY: mag.ry }}
        transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.7 }}
        className="h-full relative overflow-hidden cursor-pointer flex flex-col items-center justify-center gap-2"
        style={{ backgroundColor: ACCENT }}
        onMouseMove={handleMove}
        onMouseLeave={resetMove}
      >
        {/* shimmer overlay */}
        <div className="absolute inset-0 cta-shimmer-overlay" />
        <div className="absolute inset-0 opacity-[0.12]">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }} />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
            </svg>
          </span>
        <p className="text-[13px] font-black text-white tracking-tight">{t("projectsCta.title")}</p>
        <p className="text-[9px] text-white/70">{t("projectsCta.subtitle")}</p>
        </div>
      </motion.a>
    </Card>
  );
}

function GalleryCTA() {
  const { t } = useTranslation("home");
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % GALLERY_SLIDES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="h-full overflow-hidden" glowColor="var(--accent-glow)">
      <motion.a
        href="/gallery"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
        className="h-full relative overflow-hidden cursor-pointer block"
      >
        <div className="absolute inset-0 bg-[#181413]" />
        <AnimatePresence mode="popLayout">
          <motion.div
            key={GALLERY_SLIDES[slideIndex]}
            className="absolute inset-0"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              y: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
              opacity: { duration: 0.25, delay: 0.6 },
            }}
          >
            <img
              src={GALLERY_SLIDES[slideIndex]}
              alt="Gallery preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

        <div className="relative z-10 h-full p-3 flex flex-col justify-between text-white">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-white/25 bg-black/35 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/90">
              sketchbook
            </span>
            <div className="flex gap-1">
              {GALLERY_SLIDES.map((slide, idx) => (
                <span key={slide} className={`h-1.5 rounded-full transition-all ${idx === slideIndex ? "w-4 bg-white" : "w-1.5 bg-white/45"}`} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[14px] font-black tracking-tight">{t("galleryCta.title")}</p>
            <p className="text-[10px] mt-0.5 text-white/80 max-w-[85%]">{t("galleryCta.subtitle")}</p>
          </div>
        </div>
      </motion.a>
    </Card>
  );
}

/* ─── Home Page ───────────────────────────────────── */
export default function Home() {
  const { t, i18n } = useTranslation('home');
  const currentLang = i18n.language?.split("-")[0] || "pt";
  const { isDark, toggleTheme } = useTheme();

  const clock = useClock("America/Sao_Paulo");

  const [steamIdx, setSteamIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSteamIdx(i => (i + 1) % 3), 5000);
    return () => clearInterval(id);
  }, []);

  const { data: nowPlaying, isLoading: loadingNowPlaying } = useGetNowPlaying();
  const { data: topArtists, isLoading: loadingTopArtists } = useGetTopArtists();
  const { data: topTracks, isLoading: loadingTopTracks } = useGetTopTracks();
  const { data: steamData, isLoading: loadingSteam } = useGetSteamData();
  const { data: workout, isLoading: loadingWorkout } = useGetLastWorkout();
  const { data: stats, isLoading: loadingStats } = useGetStats();
  const { data: malData, isLoading: loadingMal } = useGetMalData();

  const localizedFeaturedProjects = featuredProjects.map(p => ({
    id: p.id,
    name: p.name,
    description: currentLang === "en" && p.descriptionEn ? p.descriptionEn : p.description,
    techStack: p.techStack,
    highlight: p.highlight,
    url: p.url,
    wip: p.status === "workInProgress",
    image: p.image,
  }));

  return (
    <div className={`min-h-screen lg:h-screen flex flex-col font-sans overflow-y-auto lg:overflow-hidden transition-colors duration-300 pt-14 bg-canvas text-main ${isDark ? "dark" : ""}`}>
      {/* ── NAV ── */}
      <SiteHeader isDark={isDark} onToggleTheme={toggleTheme} />

      {/* ── BENTO GRID (6 cols × 8 rows) ── */}
      <BentoSection className="flex-1 min-w-0 lg:overflow-hidden">
        <CardGlowProvider>
        <div className="w-full h-auto lg:h-full p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:grid-rows-8 gap-2 h-auto lg:h-full">

            {/* ── Col 1 ── */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-1 lg:row-start-1 lg:row-span-2 h-auto lg:h-full">
              <Card className={`${CARD} h-auto lg:h-full`} glowColor="var(--accent-glow)">
                <div className="p-4 flex flex-col h-full min-h-[180px]">
                  <div className="flex items-start justify-between mb-2">
                    <p className={LABEL}>{t('about.label')}</p>
                    <div className="flex gap-2 text-faint">
                      <a href={contacts.find((c) => c.platform === "GitHub")?.url} target="_blank" rel="noreferrer" aria-label="GitHub"><SiGithub size={12} /></a>
                      <a href={contacts.find((c) => c.platform === "Instagram")?.url} target="_blank" rel="noreferrer" aria-label="Instagram"><SiInstagram size={12} /></a>
                      <a href={contacts.find((c) => c.platform === "LinkedIn")?.url} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={12} /></a>
                      <a href={contacts.find((c) => c.platform === "Email")?.url} aria-label="Email"><FiMail size={12} /></a>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center mb-2">
                    <div className="w-10 h-10 rounded-xl bg-field overflow-hidden shrink-0">
                      <img src="/favicon.svg" alt="site icon" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold leading-tight">{t('about.greeting')} <span className="text-brand">{t('about.name')}</span></p>
                      <p className="text-[11px] text-faint mt-0.5">{t('about.role')}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-sub leading-relaxed flex-1">
                    {t('about.descriptionPrefix')}
                    <a href="/projects" className="text-brand hover:underline">{t('about.codingLabel')}</a>
                    {t('about.descriptionMiddle')}
                    <a href="/gallery" className="text-brand hover:underline">{t('about.drawingLabel')}</a>
                    {t('about.descriptionSuffix')}
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-1 lg:row-start-3 lg:row-span-2 h-auto lg:h-full">
              <WorkoutCard workout={workout as any} isLoading={loadingWorkout} isDark={isDark} />
            </motion.div>

            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-1 lg:row-start-5 lg:row-span-4 h-auto lg:h-full min-h-[200px]">
              <PolaroidStack isDark={isDark} />
            </motion.div>

            {/* ── Col 2 ── */}
            {/* Weather: half-height (row-span-1) */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-2 lg:row-start-1 lg:row-span-1 h-auto lg:h-full">
              <WeatherClockCard clock={clock} />
            </motion.div>

            {/* Currently Working */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-2 lg:row-start-2 lg:row-span-3 h-auto lg:h-full min-h-[150px]">
              <CurrentlyWorkingCard isDark={isDark} />
            </motion.div>

            {/* GitHub 2 cols wide */}
            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-2 lg:row-start-5 lg:col-span-2 lg:row-span-2 h-auto lg:h-full min-h-[200px]">
              <GitHubCard stats={stats as any} loadingStats={loadingStats} isDark={isDark} />
            </motion.div>

            {/* MyAnimeList 2 cols wide */}
            <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-2 lg:row-start-7 lg:col-span-2 lg:row-span-2 h-auto lg:h-full min-h-[200px]">
              <MyAnimeListCard data={malData as any} isLoading={loadingMal} isDark={isDark} />
            </motion.div>

            {/* ── Col 3-4 ── */}
            <motion.div custom={7} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-3 lg:row-start-1 lg:col-span-2 lg:row-span-2 h-auto lg:h-full min-h-[150px]">
              <EnhancedProjectCard projects={localizedFeaturedProjects} isDark={isDark} />
            </motion.div>

            <motion.div custom={8} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-3 lg:row-start-3 lg:col-span-2 lg:row-span-2 h-auto lg:h-full min-h-[150px]">
              <TechStackCard isDark={isDark} />
            </motion.div>

            {/* CV to the right */}
            <motion.div custom={9} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-4 lg:row-start-5 lg:row-span-2 h-auto lg:h-full min-h-[180px]">
              <CVCard navigate={(p) => { window.location.href = p; }} isDark={isDark} />
            </motion.div>

            {/* Gallery CTA — bottom right */}
            <motion.div custom={10} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-4 lg:row-start-7 lg:row-span-2 h-auto lg:h-full min-h-[180px]">
              <GalleryCTA />
            </motion.div>

            {/* ── Col 5 ── */}
            <motion.div custom={12} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-5 lg:row-start-1 lg:row-span-2 h-auto lg:h-full min-h-[150px]">
              <AlbumArtCard nowPlaying={nowPlaying as any} isLoading={loadingNowPlaying} isDark={isDark} />
            </motion.div>

            <motion.div custom={13} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-5 lg:row-start-3 lg:row-span-4 h-auto lg:h-full min-h-[200px]">
              <TimelineCard isDark={isDark} />
            </motion.div>

            <motion.div custom={14} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-5 lg:row-start-7 lg:row-span-2 h-auto lg:h-full min-h-[150px]">
              <SteamCard steam={steamData as any} isLoading={loadingSteam} steamIdx={steamIdx} isDark={isDark} />
            </motion.div>

            {/* ── Col 6 ── */}
            <motion.div custom={15} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-6 lg:row-start-1 lg:row-span-2 h-auto lg:h-full min-h-[150px]">
              <TopArtistsCard topArtists={topArtists as any} topTracks={topTracks as any} isLoading={loadingTopArtists || loadingTopTracks} isDark={isDark} />
            </motion.div>

            <motion.div custom={16} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-6 lg:row-start-3 lg:row-span-1 h-auto lg:h-full">
              <SocialCard contact={contacts.find(c => c.platform === "Discord")!} isDark={isDark} />
            </motion.div>

            <motion.div custom={17} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-6 lg:row-start-4 lg:row-span-1 h-auto lg:h-full">
              <SocialCard contact={contacts.find(c => c.platform === "Instagram")!} isDark={isDark} />
            </motion.div>

            <motion.div custom={18} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-6 lg:row-start-5 lg:row-span-1 h-auto lg:h-full">
              <SocialCard contact={contacts.find(c => c.platform === "GitHub")!} isDark={isDark} />
            </motion.div>

            <motion.div custom={19} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-6 lg:row-start-6 lg:row-span-1 h-auto lg:h-full">
              <SocialCard contact={contacts.find(c => c.platform === "LinkedIn")!} isDark={isDark} />
            </motion.div>

            <motion.div custom={20} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-6 lg:row-start-7 lg:row-span-2 h-auto lg:h-full min-h-[150px]">
              <ProjectsCTA />
            </motion.div>

          </div>
        </div>
        </CardGlowProvider>
      </BentoSection>
    </div>
  );
}
