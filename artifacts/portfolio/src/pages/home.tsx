import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Moon, Sun } from "lucide-react";
import {
  useGetDiscordPresence,
  useGetNowPlaying,
  useGetTopArtists,
  useGetSteamData,
  useGetLastWorkout,
  useGetStats,
  useGetMalData,
} from "@workspace/api-client-react";
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
  ProjectsCard,
  TopArtistsCard,
  CVCard,
  TechStackCard,
  PolaroidStack,
  EnhancedProjectCard,
  DiscordCard,
} from "@/components/home";
import { BentoSection } from "@/components/BentoCard";
import { contacts } from "@/constants";
import { SiInstagram, SiDiscord, SiGithub } from "react-icons/si";
import { FiMail } from "react-icons/fi";

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

/* ─── Socials Card ────────────────────────────────── */
function SocialsCard({ isDark }: { isDark: boolean }) {
  const icons: Record<string, React.ReactNode> = {
    Instagram: <SiInstagram size={14} />,
    Discord: <SiDiscord size={14} />,
    GitHub: <SiGithub size={14} />,
    LinkedIn: <span className="text-[10px] font-bold">in</span>,
    Email: <FiMail size={14} />,
  };

  return (
    <div className={`${CARD} p-3.5 flex flex-col gap-3`}>
      <p className={LABEL}>Socials</p>
      <div className="flex flex-col gap-2">
        {contacts.slice(0, 4).map((c) => (
          <a
            key={c.platform}
            href={c.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 group"
          >
            <span style={{ color: c.color }}>{icons[c.platform]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-[#111] dark:text-[#eee] truncate">{c.label}</p>
              <p className="text-[9px] text-[#999] dark:text-[#555]">{c.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─── Home Page ───────────────────────────────────── */
export default function Home() {
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const clock = useClock("America/Sao_Paulo");

  /* Cycling indices */
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

  /* API hooks */
  const { data: discordData, isLoading: loadingDiscord } = useGetDiscordPresence();
  const { data: nowPlaying, isLoading: loadingNowPlaying } = useGetNowPlaying();
  const { data: topArtists, isLoading: loadingTopArtists } = useGetTopArtists();
  const { data: steamData, isLoading: loadingSteam } = useGetSteamData();
  const { data: workout, isLoading: loadingWorkout } = useGetLastWorkout();
  const { data: stats, isLoading: loadingStats } = useGetStats();
  const { data: malData, isLoading: loadingMal } = useGetMalData();

  /* Navigate helper */
  const navigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className={`h-screen flex flex-col font-sans overflow-hidden transition-colors duration-300 bg-[#f5f5f5] dark:bg-[#0d0d0d] text-[#111] dark:text-[#eee] ${isDark ? "dark" : ""}`}>
      {/* ── NAV ── */}
      <header className="shrink-0 z-50 h-11 flex items-center border-b border-[#ebebeb] dark:border-[#282828] bg-white/80 dark:bg-[#181818]/80 backdrop-blur px-4">
        <div className="flex w-full max-w-[1480px] mx-auto items-center justify-between">
          <span className="font-bold text-[16px] tracking-tight select-none">
            <span className="text-[#2d3748] dark:text-[#e2e8f0]">lucas</span><span style={{ color: ACCENT }}>hdo</span>
          </span>
          <nav className="flex items-center gap-5 text-[13px] text-[#888] dark:text-[#666]">
            <Link href="/" className="hover:text-[#111] dark:hover:text-[#eee] transition-colors">Home</Link>
            <Link href="/projects" className="hover:text-[#111] dark:hover:text-[#eee] transition-colors">Projects</Link>
            <Link href="/cv" className="hover:text-[#111] dark:hover:text-[#eee] transition-colors">CV</Link>
            <button
              onClick={() => setIsDark(d => !d)}
              className="w-7 h-7 rounded-lg flex items-center justify-center border border-[#ebebeb] dark:border-[#282828] bg-white dark:bg-[#222] hover:bg-[#f0f0f0] dark:hover:bg-[#2a2a2a] transition-colors text-[#888] dark:text-[#666]"
            >
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </nav>
        </div>
      </header>

      {/* ── BENTO GRID ── */}
      <BentoSection className="flex-1 min-w-0 h-full overflow-y-auto px-4 py-3" style={{ scrollbarWidth: "none" } as React.CSSProperties}>
        <div className="max-w-[1480px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[160px]">

            {/* About Me */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" className={`${CARD} p-4 col-span-1 row-span-2 flex flex-col`}>
              <div className="flex items-start justify-between mb-3">
                <p className={LABEL}>About Me</p>
                <div className="flex gap-2 text-[#ccc] dark:text-[#444]">
                  <a href="https://twitter.com" target="_blank" rel="noreferrer"><SiGithub size={12} /></a>
                  <a href="https://discord.com" target="_blank" rel="noreferrer"><SiDiscord size={12} /></a>
                </div>
              </div>
              <div className="flex gap-3 items-center mb-3">
                <div className="w-11 h-11 rounded-xl bg-[#f0f0f0] dark:bg-[#252525] overflow-hidden shrink-0">
                  <img src="/selfie.webp" alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold leading-tight">Hey, I'm <span style={{ color: ACCENT }}>Lucas</span></p>
                  <p className="text-[11px] text-[#aaa] dark:text-[#555] mt-0.5">Developer & Designer</p>
                </div>
              </div>
              <p className="text-[12px] text-[#777] dark:text-[#888] leading-relaxed flex-1">Full-stack dev who loves turning ideas into real products. When I'm not coding, you'll find me at the gym, gaming, or discovering new music on Last.fm.</p>
            </motion.div>

            {/* Weather / Clock */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show" className="col-span-1 row-span-1">
              <WeatherClockCard clock={clock} />
            </motion.div>

            {/* Projects */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show" className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1">
              <EnhancedProjectCard projects={[]} />
            </motion.div>

            {/* Now Playing */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className="col-span-1 row-span-2">
              <AlbumArtCard nowPlaying={nowPlaying as any} isLoading={loadingNowPlaying} isDark={isDark} />
            </motion.div>

            {/* Fun Facts */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show" className={`${CARD} p-4 col-span-1 row-span-2 flex flex-col`}>
              <p className={`${LABEL} mb-3`}>Fun Facts</p>
              <ul className="space-y-2 flex-1">
                {["Full-stack developer","Gym rat (4x/week)","Last.fm scrobbler since 2018","Dark mode everything",`${(malData as any)?.anime?.completed ?? "…"} anime completed`].map((f,i) => (
                  <li key={i} className="flex gap-2 text-[12px] text-[#666] dark:text-[#888]">
                    <span className="text-[#ccc] dark:text-[#444] mt-px">•</span>{f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Last Workout */}
            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show" className="col-span-1 row-span-2">
              <WorkoutCard workout={workout as any} isLoading={loadingWorkout} isDark={isDark} />
            </motion.div>

            {/* Tech Stack */}
            <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show" className="col-span-1 md:col-span-1 lg:col-span-2 row-span-2">
              <TechStackCard isDark={isDark} />
            </motion.div>

            {/* Top Artists */}
            <motion.div custom={7} variants={fadeUp} initial="hidden" animate="show" className="col-span-1 row-span-2">
              <TopArtistsCard topArtists={topArtists as any} isLoading={loadingTopArtists} isDark={isDark} />
            </motion.div>

            {/* Photos */}
            <motion.div custom={8} variants={fadeUp} initial="hidden" animate="show" className={`${CARD} overflow-hidden col-span-1 row-span-2`}>
              <PolaroidStack isDark={isDark} />
            </motion.div>

            {/* GitHub */}
            <motion.div custom={9} variants={fadeUp} initial="hidden" animate="show" className="col-span-1 md:col-span-1 lg:col-span-2 row-span-2">
              <GitHubCard stats={stats as any} loadingStats={loadingStats} isDark={isDark} />
            </motion.div>

            {/* Work Experience */}
            <motion.div custom={10} variants={fadeUp} initial="hidden" animate="show" className="col-span-1 row-span-3">
              <TimelineCard isDark={isDark} />
            </motion.div>

            {/* CV */}
            <motion.div custom={11} variants={fadeUp} initial="hidden" animate="show" className="col-span-1 row-span-1">
              <CVCard navigate={navigate} />
            </motion.div>

            {/* Socials */}
            <motion.div custom={12} variants={fadeUp} initial="hidden" animate="show" className="col-span-1 row-span-1">
              <SocialsCard isDark={isDark} />
            </motion.div>

            {/* MAL */}
            <motion.div custom={13} variants={fadeUp} initial="hidden" animate="show" className="col-span-1 md:col-span-1 lg:col-span-2 row-span-2">
              <MyAnimeListCard malData={malData as any} malApi={malData} isLoading={loadingMal} />
            </motion.div>

            {/* Steam */}
            <motion.div custom={14} variants={fadeUp} initial="hidden" animate="show" className="col-span-1 row-span-2">
              <SteamCard steam={steamData as any} isLoading={loadingSteam} steamIdx={steamIdx} isDark={isDark} />
            </motion.div>

            {/* Building */}
            <motion.div custom={15} variants={fadeUp} initial="hidden" animate="show" className="col-span-1 row-span-1">
              <BuildingCard buildIdx={buildIdx} isDark={isDark} />
            </motion.div>

            {/* Discord */}
            <motion.div custom={16} variants={fadeUp} initial="hidden" animate="show" className="col-span-1 row-span-1">
              <DiscordCard discord={discordData as any} isLoading={loadingDiscord} isDark={isDark} />
            </motion.div>

            {/* Contact */}
            <motion.div custom={17} variants={fadeUp} initial="hidden" animate="show" className={`${CARD} p-4 col-span-1 row-span-1`}>
              <p className={`${LABEL} mb-2 flex items-center gap-1`}><FiMail size={9} />Contact</p>
              <p className="text-[12px] text-[#777] dark:text-[#888] leading-relaxed">
                Hit me up on <a href="https://twitter.com" style={{ color: ACCENT }} className="hover:underline">Twitter</a> or email <a href="mailto:lucashdo@protonmail.com" style={{ color: ACCENT }} className="hover:underline">lucashdo@protonmail.com</a>
              </p>
            </motion.div>

          </div>
        </div>
      </BentoSection>
    </div>
  );
}
