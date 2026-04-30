import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useTranslation } from 'react-i18next';
import { Moon, Sun } from "lucide-react";
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";
import {
  useGetNowPlayingCached as useGetNowPlaying,
  useGetTopArtistsCached as useGetTopArtists,
  useGetSteamDataCached as useGetSteamData,
  useGetLastWorkoutCached as useGetLastWorkout,
  useGetStatsCached as useGetStats,
  useGetMalDataCached as useGetMalData,
} from "@/hooks/usePortfolioQueries";
import { useClock } from "@/hooks/useClock";
import {
  WeatherClockCard,
  BuildingCard,
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
} from "@/components/home";
import { BentoSection } from "@/components/BentoCard";
import { contacts, featuredProjects } from "@/constants";
import { SiInstagram, SiDiscord, SiGithub } from "react-icons/si";
import { FiMail } from "react-icons/fi";
import { Linkedin } from "lucide-react";

const ACCENT = "#3d72cc";
const CARD = "bg-white dark:bg-[#181818] border border-[#ebebeb] dark:border-[#282828] rounded-2xl";
const LABEL = "text-[10px] font-semibold uppercase tracking-widest text-[#aaa] dark:text-[#555]";

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
    <motion.a
      href={contact.url}
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`h-full rounded-2xl border overflow-hidden flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${isDark ? "bg-white/4 border-white/8 hover:border-white/15 hover:bg-white/6" : "bg-[#fafafa] border-[#ebebeb] hover:border-[#ddd] hover:bg-white"}`}
      title={contact.label}
      style={{
        color: contact.color,
      }}
    >
      <span className="text-[16px] leading-none">{socialIcons[contact.platform]}</span>
      <span className={`text-[9px] font-bold uppercase tracking-wider text-center leading-tight ${isDark ? "text-white/70" : "text-[#666]"}`}>
        {contact.label}
      </span>
    </motion.a>
  );
}

/* ─── Projects CTA (col 6, rows 7-8) ───────────────── */
function ProjectsCTA() {
  const { t } = useTranslation("home");
  return (
    <motion.a
      href="/projects"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full rounded-2xl relative overflow-hidden cursor-pointer flex flex-col items-center justify-center gap-2"
      style={{ backgroundColor: ACCENT }}
    >
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
  );
}

/* ─── Home Page ───────────────────────────────────── */
export default function Home() {
  const { t, i18n } = useTranslation('home');
  const currentLang = i18n.language?.split("-")[0] || "pt";
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const clock = useClock("America/Sao_Paulo");

  const [buildIdx, setBuildIdx] = useState(0);
  const [steamIdx, setSteamIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setBuildIdx(i => (i + 1) % 3), 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setSteamIdx(i => (i + 1) % 3), 5000);
    return () => clearInterval(id);
  }, []);

  const { data: nowPlaying, isLoading: loadingNowPlaying } = useGetNowPlaying();
  const { data: topArtists, isLoading: loadingTopArtists } = useGetTopArtists();
  const { data: steamData, isLoading: loadingSteam } = useGetSteamData();
  const { data: workout, isLoading: loadingWorkout } = useGetLastWorkout();
  const { data: stats, isLoading: loadingStats } = useGetStats();
  const { data: malData, isLoading: loadingMal } = useGetMalData();

  const localizedFeaturedProjects = useMemo(() =>
    featuredProjects.map(p => ({
      name: p.name,
      description: currentLang === "en" && p.descriptionEn ? p.descriptionEn : p.description,
      techStack: p.techStack,
      highlight: p.highlight,
      url: p.url,
      wip: p.status === "workInProgress",
    })), [currentLang]);

  return (
    <div className={`h-screen flex flex-col font-sans overflow-hidden transition-colors duration-300 bg-[#f5f5f5] dark:bg-[#0d0d0d] text-[#111] dark:text-[#eee] ${isDark ? "dark" : ""}`}>
      {/* ── NAV ── */}
      <header className="shrink-0 z-50 h-11 flex items-center border-b border-[#ebebeb] dark:border-[#282828] bg-white/80 dark:bg-[#181818]/80 backdrop-blur px-4">
        <div className="flex w-full max-w-[1480px] mx-auto items-center justify-between">
          <span className="font-bold text-[16px] tracking-tight select-none">
            <span className="text-[#2d3748] dark:text-[#e2e8f0]">lucas</span><span style={{ color: ACCENT }}>hdo</span>
          </span>
          <nav className="flex items-center gap-4 text-[13px] text-[#888] dark:text-[#666]">
            <Link href="/" className="hover:text-[#111] dark:hover:text-[#eee] transition-colors">Home</Link>
            <Link href="/projects" className="hover:text-[#111] dark:hover:text-[#eee] transition-colors">Projects</Link>
            <Link href="/resume" className="hover:text-[#111] dark:hover:text-[#eee] transition-colors">Resume</Link>
            <LanguageSwitcher isDark={isDark} />
            <button onClick={() => setIsDark(d => !d)} className="w-7 h-7 rounded-lg flex items-center justify-center border border-[#ebebeb] dark:border-[#282828] bg-white dark:bg-[#222] hover:bg-[#f0f0f0] dark:hover:bg-[#2a2a2a] transition-colors text-[#888] dark:text-[#666]">
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </nav>
        </div>
      </header>

      {/* ── BENTO GRID (6 cols × 8 rows) ── */}
      <BentoSection className="flex-1 min-w-0 overflow-hidden">
        <div className="w-full h-full p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:grid-rows-8 gap-2 h-full">

            {/* ── Col 1 ── */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" className={`${CARD} p-4 flex flex-col lg:col-start-1 lg:row-start-1 lg:row-span-2`}>
              <div className="flex items-start justify-between mb-2">
                <p className={LABEL}>{t('about.label')}</p>
                <div className="flex gap-2 text-[#ccc] dark:text-[#444]">
                  <a href="https://github.com/LucasHenriqueDiniz" target="_blank" rel="noreferrer"><SiGithub size={12} /></a>
                  <a href="https://discord.com" target="_blank" rel="noreferrer"><SiDiscord size={12} /></a>
                </div>
              </div>
              <div className="flex gap-3 items-center mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#f0f0f0] dark:bg-[#252525] overflow-hidden shrink-0">
                  <img src="/selfie.webp" alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold leading-tight">{t('about.greeting')} <span style={{ color: ACCENT }}>{t('about.name')}</span></p>
                  <p className="text-[11px] text-[#aaa] dark:text-[#555] mt-0.5">{t('about.role')}</p>
                </div>
              </div>
              <p className="text-[11px] text-[#777] dark:text-[#888] leading-relaxed flex-1">{t('about.description')}</p>
            </motion.div>

            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show" className={`${CARD} p-4 flex flex-col lg:col-start-1 lg:row-start-3 lg:row-span-2`}>
              <p className={`${LABEL} mb-2`}>{t('funFacts.label')}</p>
              <ul className="space-y-1.5 flex-1">
                {(t('funFacts.items', { animeCount: (malData as any)?.anime?.completed ?? "…", returnObjects: true }) as string[]).map((f: string, i: number) => (
                  <li key={i} className="flex gap-2 text-[11px] text-[#666] dark:text-[#888]">
                    <span className="text-[#ccc] dark:text-[#444] mt-px">•</span>{f}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-1 lg:row-start-5 lg:row-span-4 min-h-0">
              <PolaroidStack isDark={isDark} />
            </motion.div>

            {/* ── Col 2 ── */}
            {/* Weather: half-height (row-span-1) */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-2 lg:row-start-1 lg:row-span-1 min-h-0">
              <WeatherClockCard clock={clock} />
            </motion.div>

            {/* Workout: 1.5 height (row-span-3) */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-2 lg:row-start-2 lg:row-span-3 min-h-0">
              <WorkoutCard workout={workout as any} isLoading={loadingWorkout} isDark={isDark} />
            </motion.div>

            {/* GitHub 2 cols wide */}
            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-2 lg:row-start-5 lg:col-span-2 lg:row-span-2 min-h-0">
              <GitHubCard stats={stats as any} loadingStats={loadingStats} isDark={isDark} />
            </motion.div>

            {/* MyAnimeList 2 cols wide */}
            <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-2 lg:row-start-7 lg:col-span-2 lg:row-span-2 min-h-0">
              <MyAnimeListCard data={malData as any} isLoading={loadingMal} isDark={isDark} />
            </motion.div>

            {/* ── Col 3-4 ── */}
            <motion.div custom={7} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-3 lg:row-start-1 lg:col-span-2 lg:row-span-2 min-h-0">
              <EnhancedProjectCard projects={localizedFeaturedProjects} isDark={isDark} />
            </motion.div>

            <motion.div custom={8} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-3 lg:row-start-3 lg:col-span-2 lg:row-span-2 min-h-0">
              <TechStackCard isDark={isDark} />
            </motion.div>

            {/* CV to the right */}
            <motion.div custom={9} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-4 lg:row-start-5 lg:row-span-2 min-h-0">
              <CVCard navigate={(p) => { window.location.href = p; }} isDark={isDark} />
            </motion.div>

            {/* Building moved down */}
            <motion.div custom={10} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-4 lg:row-start-7 lg:row-span-2 min-h-0">
              <BuildingCard buildIdx={buildIdx} isDark={isDark} />
            </motion.div>

            {/* ── Col 5 ── */}
            <motion.div custom={11} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-5 lg:row-start-1 lg:row-span-2 min-h-0">
              <AlbumArtCard nowPlaying={nowPlaying as any} isLoading={loadingNowPlaying} isDark={isDark} />
            </motion.div>

            <motion.div custom={12} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-5 lg:row-start-3 lg:row-span-4 min-h-0">
              <TimelineCard isDark={isDark} />
            </motion.div>

            <motion.div custom={13} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-5 lg:row-start-7 lg:row-span-2 min-h-0">
              <SteamCard steam={steamData as any} isLoading={loadingSteam} steamIdx={steamIdx} isDark={isDark} />
            </motion.div>

            {/* ── Col 6 ── */}
            <motion.div custom={14} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-6 lg:row-start-1 lg:row-span-2 min-h-0">
              <TopArtistsCard topArtists={topArtists as any} isLoading={loadingTopArtists} isDark={isDark} />
            </motion.div>

            <motion.div custom={15} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-6 lg:row-start-3 lg:row-span-1 min-h-0">
              <SocialCard contact={contacts.find(c => c.platform === "Discord")!} isDark={isDark} />
            </motion.div>

            <motion.div custom={16} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-6 lg:row-start-4 lg:row-span-1 min-h-0">
              <SocialCard contact={contacts.find(c => c.platform === "Instagram")!} isDark={isDark} />
            </motion.div>

            <motion.div custom={17} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-6 lg:row-start-5 lg:row-span-1 min-h-0">
              <SocialCard contact={contacts.find(c => c.platform === "GitHub")!} isDark={isDark} />
            </motion.div>

            <motion.div custom={18} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-6 lg:row-start-6 lg:row-span-1 min-h-0">
              <SocialCard contact={contacts.find(c => c.platform === "LinkedIn")!} isDark={isDark} />
            </motion.div>

            <motion.div custom={19} variants={fadeUp} initial="hidden" animate="show" className="lg:col-start-6 lg:row-start-7 lg:row-span-2 min-h-0">
              <ProjectsCTA />
            </motion.div>

          </div>
        </div>
      </BentoSection>
    </div>
  );
}
