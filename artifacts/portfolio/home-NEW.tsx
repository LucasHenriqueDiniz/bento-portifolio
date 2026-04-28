import {
  useGetDiscordPresence,
  useGetNowPlaying,
  useGetTopArtists,
  useGetSteamData,
  useGetLastWorkout,
  useGetStats,
  useGetMalData,
} from "@workspace/api-client-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  SiGithub, SiDiscord, SiLastdotfm, SiSteam, SiMyanimelist,
  SiWakatime, SiTypescript, SiReact, SiNodedotjs, SiGo,
  SiPostgresql, SiDocker, SiNextdotjs, SiTailwindcss, SiFigma,
  SiPython, SiRedis, SiSupabase, SiExpo,
} from "react-icons/si";
import { FiTwitter, FiMail, FiExternalLink, FiBook, FiClock, FiArrowUpRight } from "react-icons/fi";
import { Dumbbell, Moon, Sun } from "lucide-react";
import { BentoCard, BentoSection } from "@/components/BentoCard";
import CountUp from "@/components/CountUp";

/* ─── helpers ─────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.045, duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const STATUS_COLORS: Record<string, string> = {
  online: "#22c55e",
  idle:   "#eab308",
  dnd:    "#ef4444",
  offline:"#9ca3af",
};

const ACCENT = "#3d72cc";

const CARD  = "bg-white dark:bg-[#181818] border border-[#ebebeb] dark:border-[#282828] rounded-2xl";
const LABEL = "text-[10px] font-semibold uppercase tracking-widest text-[#aaa] dark:text-[#555]";

/* ─── live clock ──────────────────────────────────── */
function useClock(timezone = "America/Sao_Paulo") {
  const [time, setTime] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const fmt = new Intl.DateTimeFormat("pt-BR", {
    timeZone: timezone,
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(time).reduce<Record<string, string>>((acc, p) => {
    acc[p.type] = p.value; return acc;
  }, {});
  return { h: parts.hour, m: parts.minute, s: parts.second };
}


/* ─── GitHub grid ─────────────────────────────────── */
function GitHubGrid({ seed, inView }: { seed: number; inView: boolean }) {
  const WEEKS = 52, DAYS = 7;
  const cells = Array.from({ length: WEEKS * DAYS }, (_, i) => {
    const v = Math.abs(Math.sin(i * 9.1 + seed * 0.3) * 4) | 0;
    return Math.min(Math.abs(Math.cos(i * 3.7)) > 0.5 ? v : 0, 4);
  });
  const shades = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return (
    <div className="w-full flex flex-col gap-1.5">
      {/* month labels */}
      <div className="flex w-full">
        {MONTHS.map((m) => (
          <span key={m} className="text-[8px] text-[#ccc] dark:text-[#444] flex-1 min-w-0 leading-none">{m}</span>
        ))}
      </div>
      {/* grid — fills full width */}
      <div className="w-full flex gap-[3px]">
        {Array.from({ length: WEEKS }).map((_, w) => (
          <div key={w} className="flex flex-col gap-[3px] flex-1 min-w-0">
            {Array.from({ length: DAYS }).map((_, d) => {
              const idx = w * DAYS + d;
              return (
                <div
                  key={d}
                  className={inView ? "gh-dot" : ""}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 2,
                    backgroundColor: shades[cells[idx]],
                    "--dot-delay": `${idx * 2}ms`,
                  } as React.CSSProperties}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}


/* ─── Photo Card ──────────────────────────────────── */
const POLAROID_PHOTOS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
];
const POLAROID_CAPTIONS = ["summer '23", "buenos aires", "coffee run", "studio day", "road trip"];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%" }),
};

function PolaroidStack({ isDark }: { isDark?: boolean }) {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const n = POLAROID_PHOTOS.length;

  const goTo = (idx: number) => {
    setDir(idx >= current ? 1 : -1);
    setCurrent(idx);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setDir(1);
      setCurrent(c => (c + 1) % n);
    }, 3800);
    return () => clearInterval(id);
  }, [n]);

  return (
    <div className="w-full h-full flex flex-col" style={{ padding: 10, background: isDark ? "#181818" : "white" }}>
      {/* photo area fills available space */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="popLayout" custom={dir}>
          <motion.img
            key={current}
            custom={dir}
            src={POLAROID_PHOTOS[current]}
            alt={POLAROID_CAPTIONS[current]}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
          />
        </AnimatePresence>
      </div>
      {/* caption strip */}
      <div className="h-8 flex items-center justify-center shrink-0">
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            className="text-[11px] tracking-wide"
            style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: isDark ? "#666" : "#888" }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            {POLAROID_CAPTIONS[current]}
          </motion.p>
        </AnimatePresence>
      </div>
      {/* dot indicators */}
      <div className="flex items-center justify-center gap-1 pb-1 shrink-0">
        {Array.from({ length: n }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 14 : 5,
              height: 5,
              backgroundColor: i === current ? (isDark ? "#666" : "#aaa") : (isDark ? "#333" : "#ddd"),
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── EQ bars ─────────────────────────────────────── */
function EqBars() {
  return (
    <span className="flex items-end gap-[2px]" style={{ height: 12 }}>
      {[0.8, 0.5, 0.7, 0.6].map((dur, i) => (
        <span
          key={i}
          className="eq-bar inline-block w-[3px] rounded-sm"
          style={{ backgroundColor: ACCENT, height: 12, "--dur": `${dur}s`, animationDelay: `${i * 0.12}s` } as React.CSSProperties}
        />
      ))}
    </span>
  );
}

/* ─── Main component ─────────────────────────────── */
export default function Home() {
  const { data: discord,    isLoading: loadingDiscord    } = useGetDiscordPresence();
  const { data: nowPlaying, isLoading: loadingNowPlaying } = useGetNowPlaying();
  const { data: topArtists, isLoading: loadingArtists    } = useGetTopArtists();
  const { data: steam,      isLoading: loadingSteam      } = useGetSteamData();
  const { data: workout,    isLoading: loadingWorkout     } = useGetLastWorkout();
  const { data: stats,      isLoading: loadingStats       } = useGetStats();
  const { data: malApi,     isLoading: loadingMal         } = useGetMalData();

  const statusColor = STATUS_COLORS[discord?.status ?? "dnd"];
  const [weatherFlipped, setWeatherFlipped] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  /* inView refs for scroll-triggered animations */
  const githubRef  = useRef<HTMLDivElement>(null);
  const githubInView = useInView(githubRef, { once: true, margin: "-50px" });


  /* MAL data — from Jikan API */
  const malData = {
    anime: {
      watching:  malApi?.animeStats?.watching  ?? 0,
      completed: malApi?.animeStats?.completed ?? 0,
      episodes:  malApi?.animeStats?.episodesWatched ?? 0,
      favorites: (malApi?.animeFavorites ?? []).map(f => ({
        title: f.title,
        year:  f.year ?? null,
        img:   f.imageUrl ?? `https://picsum.photos/seed/${encodeURIComponent(f.title)}/80/120`,
      })),
    },
    manga: {
      reading:   malApi?.mangaStats?.reading   ?? 0,
      completed: malApi?.mangaStats?.completed ?? 0,
      chapters:  malApi?.mangaStats?.chaptersRead ?? 0,
      favorites: (malApi?.mangaFavorites ?? []).map(f => ({
        title: f.title,
        year:  f.year ?? null,
        img:   f.imageUrl ?? `https://picsum.photos/seed/${encodeURIComponent(f.title)}/80/120`,
      })),
    },
  };
    const [malFlipped, setMalFlipped] = useState(false);
  const [malPage,    setMalPage]    = useState(0);
  const [malHover,   setMalHover]   = useState<string | null>(null);
  const [steamIdx,   setSteamIdx]   = useState(0);
  const [projIdx,    setProjIdx]    = useState(0);
  const [buildIdx,   setBuildIdx]   = useState(0);

  useEffect(() => {
    const t = setInterval(() => setMalPage(p => (p + 1) % 2), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const games = steam?.recentGames ?? [];
    if (games.length < 2) return;
    const t = setInterval(() => setSteamIdx(i => (i + 1) % games.length), 4000);
    return () => clearInterval(t);
  }, [steam?.recentGames?.length]);

  useEffect(() => {
    const t = setInterval(() => setProjIdx(i => (i + 1) % 4), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBuildIdx(i => (i + 1) % 3), 2500);
    return () => clearInterval(t);
  }, []);


  /* Wakatime mock data */
  const waka = {
    today: { h: 4, m: 32 },
    week:  { h: 28, m: 15 },
    langs: [
      { name: "TypeScript", pct: 52, color: "#3178c6" },
      { name: "Go",         pct: 24, color: "#00add8" },
      { name: "Python",     pct: 14, color: "#3572a5" },
      { name: "MDX",        pct: 10, color: "#f97316" },
    ],
  };

  /* Projects mock data */
  const projects = [
    {
      name: "lucashdo.com",
      description: "Personal bento portfolio with live API integrations",
      stars: 42,
      language: "TypeScript",
      color: "#3d72cc",
      url: "#",
      wip: true,
    },
    {
      name: "pingo-api",
      description: "REST + WebSocket backend for the concursos platform",
      stars: 24,
      language: "Go",
      color: "#00add8",
      url: "#",
    },
    {
      name: "animelist-tracker",
      description: "MAL API wrapper with caching & webhook support",
      stars: 18,
      language: "Go",
      color: "#00add8",
      url: "#",
    },
    {
      name: "workout-logger",
      description: "Lyfta integration with progression analytics",
      stars: 7,
      language: "TypeScript",
      color: "#3178c6",
      url: "#",
    },
  ];
  const totalStars = projects.reduce((a, p) => a + p.stars, 0);

  /* Currently reading mock */
  const reading = {
    title:    "The Pragmatic Programmer",
    author:   "Andrew Hunt & David Thomas",
    cover:    "https://covers.openlibrary.org/b/isbn/9780201616224-M.jpg",
    page:     189,
    total:    352,
  };

  /* Live clock — Rio de Janeiro */
  const clock = useClock("America/Sao_Paulo");

  /* Tech stack */
  const stack = [
    { icon: <SiReact />,       label: "React",      color: "#61dafb" },
    { icon: <SiNextdotjs />,   label: "Next.js",    color: "#000" },
    { icon: <SiTypescript />,  label: "TypeScript", color: "#3178c6" },
    { icon: <SiNodedotjs />,   label: "Node.js",    color: "#339933" },
    { icon: <SiGo />,          label: "Go",         color: "#00add8" },
    { icon: <SiPython />,      label: "Python",     color: "#3572a5" },
    { icon: <SiPostgresql />,  label: "Postgres",   color: "#4169e1" },
    { icon: <SiRedis />,       label: "Redis",      color: "#dc382d" },
    { icon: <SiDocker />,      label: "Docker",     color: "#2496ed" },
    { icon: <SiTailwindcss />, label: "Tailwind",   color: "#38bdf8" },
    { icon: <SiFigma />,       label: "Figma",      color: "#f24e1e" },
  ];

  return (
    <div className={`h-screen flex flex-col font-sans overflow-hidden transition-colors duration-300 bg-[#f5f5f5] dark:bg-[#0d0d0d] text-[#111] dark:text-[#eee]${isDark ? " dark" : ""}`}>

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
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </nav>
        </div>
      </header>

      {/* ── 3-COLUMN ── */}
      <div className="flex-1 overflow-hidden">
      <div className="max-w-[1480px] mx-auto h-full flex gap-2.5 p-2.5 items-start">

        {/* ════ LEFT SIDEBAR ════ */}
        <aside className="w-[220px] shrink-0 flex flex-col gap-2.5 h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>

          {/* Profile */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" className={`${CARD} p-4`}>
            <div className="flex items-start justify-between mb-3">
              <p className={LABEL}>About Me</p>
              <div className="flex gap-2 text-[#ccc] dark:text-[#444]">
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="transition-colors" style={{ color: "inherit" }} onMouseEnter={e => (e.currentTarget.style.color = ACCENT)} onMouseLeave={e => (e.currentTarget.style.color = "")}><FiTwitter size={12} /></a>
                <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-[#5865f2] transition-colors"><SiDiscord size={12} /></a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#111] dark:hover:text-[#eee] transition-colors"><SiGithub size={12} /></a>
              </div>
            </div>
            <div className="flex gap-3 items-center mb-3">
              <div className="w-11 h-11 rounded-xl bg-[#f0f0f0] dark:bg-[#252525] overflow-hidden shrink-0">
                <img src="https://api.dicebear.com/8.x/notionists/svg?seed=portfolio123&backgroundColor=c0aede" alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[13px] font-semibold leading-tight">Hey, I'm <span style={{ color: ACCENT }}>Lucas</span></p>
                <p className="text-[11px] text-[#aaa] dark:text-[#555] mt-0.5">Developer & Designer</p>
              </div>
            </div>
            <p className="text-[12px] text-[#777] dark:text-[#888] leading-relaxed">Building things on the web. Crafting digital experiences one pixel at a time.</p>
          </motion.div>

          {/* Fun Facts */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show" className={`${CARD} p-4`}>
            <p className={`${LABEL} mb-3`}>Fun Facts</p>
            <ul className="space-y-2">
              {["Full-stack developer","Gym rat (4x/week)","Last.fm scrobbler since 2018","Dark mode everything",`${malData.anime.completed || "…"} anime completed`].map((f,i) => (
                <li key={i} className="flex gap-2 text-[12px] text-[#666] dark:text-[#888] slide-up" style={{ "--delay": `${i*0.08}s` } as React.CSSProperties}>
                  <span className="text-[#ccc] dark:text-[#444] mt-px">•</span>{f}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Photos */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show"
            className="rounded-2xl border border-[#ebebeb] dark:border-[#282828] flex-1 min-h-[200px] overflow-hidden">
            <PolaroidStack isDark={isDark} />
          </motion.div>

          {/* Contact */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className={`${CARD} p-4`}>
            <p className={`${LABEL} mb-2 flex items-center gap-1`}><FiMail size={9} />Contact</p>
            <p className="text-[12px] text-[#777] dark:text-[#888] leading-relaxed">
              Hit me up on{" "}<a href="https://twitter.com" style={{ color: ACCENT }} className="hover:underline">Twitter</a>{" "}or email{" "}
              <a href="mailto:you@example.com" style={{ color: ACCENT }} className="hover:underline">you@example.com</a>
            </p>
          </motion.div>
        </aside>

        {/* ════ CENTER BENTO ════ */}
        <BentoSection className="flex-1 min-w-0 h-full overflow-y-auto" style={{ scrollbarWidth: "none" } as React.CSSProperties}>
          <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "calc((100dvh - 124px) / 8)" }}>

            {/* WEATHER / CLOCK FLIP — 1×1 (moved to col1 row1 after removing STATUS) */}
            <BentoCard
              className="col-span-1 row-span-1 rounded-2xl border border-[#ebebeb] dark:border-[#282828] cursor-pointer overflow-hidden"
              style={{ perspective: "800px" }}
              onClick={() => setWeatherFlipped(f => !f)}
            >
              <div
                className="relative w-full h-full transition-transform duration-500"
                style={{ transformStyle: "preserve-3d", transform: weatherFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                {/* FRONT — Weather */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between bg-white dark:bg-[#181818] rounded-2xl" style={{ backfaceVisibility: "hidden" }}>
                  <p className={`${LABEL} flex items-center gap-1`}>☁ Weather · <span className="normal-case text-[#ccc] dark:text-[#444]">click to flip</span></p>
                  <div>
                    <p className="text-[28px] font-black tracking-tight leading-none text-[#111] dark:text-[#eee]">27°C</p>
                    <p className="text-[11px] text-[#aaa] dark:text-[#555] mt-1">Sunny · Rio de Janeiro</p>
                  </div>
                </div>
                {/* BACK — Clock */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between bg-white dark:bg-[#181818] rounded-2xl" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <p className={`${LABEL} flex items-center gap-1.5`}><FiClock size={9} />Rio de Janeiro</p>
                  <div>
                    <div className="flex items-end gap-0.5 font-black tabular-nums leading-none">
                      <span className="text-[26px] text-[#111] dark:text-[#eee]">{clock.h}</span>
                      <span className="text-[20px] text-[#ccc] dark:text-[#444] mb-0.5">:</span>
                      <span className="text-[26px] text-[#111] dark:text-[#eee]">{clock.m}</span>
                      <span className="text-[20px] text-[#ccc] dark:text-[#444] mb-0.5">:</span>
                      <span className="text-[20px] text-[#aaa] dark:text-[#555] mb-0.5">{clock.s}</span>
                    </div>
                    <p className="text-[11px] text-[#aaa] dark:text-[#555] mt-1">UTC−3 · BRT</p>
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* CURRENTLY BUILDING — col3, rows7-8 */}
            <BentoCard
              className={`${CARD} overflow-hidden`}
              style={{ gridColumn: "3", gridRow: "7 / 9" }}
            >
              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className="p-3.5 h-full flex flex-col gap-0">

                {/* header */}
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: ACCENT }} />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                  </span>
                  <p className={LABEL}>Building</p>
                </div>

                {/* project name + description */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[17px] font-black text-[#111] dark:text-[#eee] leading-tight tracking-tight">
                      Pingo Concursos App
                    </p>
                    <p className="text-[10px] text-[#999] dark:text-[#555] mt-2 leading-relaxed">
                      Mobile exam prep for Brazilian concursos — built for scale.
                    </p>
                  </div>

                  {/* cycling bullet */}
                  {(() => {
                    const bullets = [
                      { text: "question system", done: true },
                      { text: "Supabase + Expo", done: true },
                      { text: "offline sync", done: false },
                    ];
                    const item = bullets[buildIdx];
                    return (
                      <div className={`py-3 border-t border-b ${isDark ? "border-white/[0.06]" : "border-[#ebebeb]"}`}>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={buildIdx}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25 }}
                            className="flex items-center gap-1.5"
                          >
                            <span className="text-[11px] font-bold shrink-0" style={{ color: item.done ? ACCENT : "#ccc" }}>→</span>
                            <p className={`text-[10px] leading-snug ${item.done ? "text-[#555] dark:text-[#888]" : "text-[#bbb] dark:text-[#444]"}`}>
                              {item.text}
                            </p>
                          </motion.div>
                        </AnimatePresence>
                        {/* step dots */}
                        <div className="flex gap-1 mt-2">
                          {bullets.map((_, i) => (
                            <span key={i} className="rounded-full transition-all duration-300" style={{ width: i === buildIdx ? 12 : 4, height: 4, backgroundColor: i === buildIdx ? ACCENT : (isDark ? "#333" : "#ddd") }} />
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* tech icons — icon only */}
                  <div className="flex items-center gap-2.5 pt-2.5">
                    <SiSupabase size={12} style={{ color: "#3ecf8e" }} />
                    <SiExpo size={12} style={{ color: isDark ? "#bbb" : "#555" }} />
                    <SiReact size={12} style={{ color: "#61dafb" }} />
                    <SiTypescript size={12} style={{ color: "#3178c6" }} />
                  </div>
                </div>

              </motion.div>
            </BentoCard>

            {/* ALBUM ART — 1×2 (explicitly positioned at col4) */}
            <BentoCard
              className="rounded-2xl border border-[#ebebeb] dark:border-[#282828] overflow-hidden relative"
              style={{ gridColumn: "4", gridRow: "1 / 3" }}
            >
              <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show" className="w-full h-full">
                {loadingNowPlaying ? (
                  <div className="w-full h-full flex flex-col relative overflow-hidden">
                    <div className="sk absolute inset-0 rounded-none" />
                    <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
                      <div className="sk h-2 w-16 rounded-full" style={{ opacity: 0.6 }} />
                      <div className="sk h-3 w-28 rounded-full" style={{ opacity: 0.5 }} />
                      <div className="sk h-2 w-20 rounded-full" style={{ opacity: 0.4 }} />
                    </div>
                  </div>
                ) : nowPlaying?.albumArt ? (
                  <>
                    <img src={nowPlaying.albumArt} alt="album" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white/70 text-[9px] uppercase tracking-widest font-semibold mb-0.5">Listening</p>
                      <p className="text-white text-[13px] font-bold leading-tight truncate">{nowPlaying.track}</p>
                      <p className="text-white/60 text-[11px] truncate">{nowPlaying.artist}</p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-[#f0f0f0] dark:bg-[#252525] flex items-center justify-center">
                    <span className="icon-pulse"><SiLastdotfm size={28} className="text-[#ccc] dark:text-[#444]" /></span>
                  </div>
                )}
              </motion.div>
            </BentoCard>

            {/* LAST WORKOUT — 1×3 (taller, explicitly at col1 rows2-4) */}
            <BentoCard
              className={`rounded-2xl overflow-hidden flex flex-col ${!isDark ? "border border-[#ebebeb] bg-white" : ""}`}
              style={{
                background: isDark ? "linear-gradient(160deg, #181818 0%, #0f0f0f 100%)" : undefined,
                gridColumn: "1",
                gridRow: "2 / 5",
              }}
            >
              <div className="p-3.5 h-full flex flex-col gap-2.5">
                <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col h-full gap-2.5">

                  {/* header */}
                  <div className="flex items-center justify-between">
                    <p className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isDark ? "text-white/30" : "text-[#aaa]"}`}>
                      <span className="icon-pulse"><Dumbbell size={9} className={isDark ? "text-white/40" : "text-[#ccc]"} /></span>Last Workout
                    </p>
                    {loadingWorkout
                      ? <div className="sk h-4 w-10 rounded-full" />
                      : <span className={`text-[8px] px-1.5 py-0.5 rounded-full border ${isDark ? "text-white/30 bg-white/5 border-white/[0.08]" : "text-[#888] bg-[#f5f5f5] border-[#e8e8e8]"}`}>
                          {workout?.type?.split("(")[0]?.trim() ?? "Push"}
                        </span>
                    }
                  </div>

                  {/* top stats row */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className={`rounded-xl p-2 border ${isDark ? "bg-white/5 border-white/5" : "bg-[#f8f8f8] border-[#ebebeb]"}`}>
                      {loadingWorkout
                        ? <div className="flex flex-col gap-1.5"><div className="sk h-5 w-16 rounded" /><div className="sk h-2 w-12 rounded-full mt-1" /></div>
                        : <>
                            <p className={`font-black text-[18px] leading-none ${isDark ? "text-white" : "text-[#111]"}`}>
                              <CountUp to={workout?.totalVolume ?? 0} separator="," duration={1.4} />
                              <span className={`text-[9px] font-normal ml-0.5 ${isDark ? "text-white/30" : "text-[#bbb]"}`}>kg</span>
                            </p>
                            <p className={`text-[8px] uppercase tracking-wider mt-1 ${isDark ? "text-white/25" : "text-[#bbb]"}`}>total volume</p>
                          </>
                      }
                    </div>
                    <div className={`rounded-xl p-2 border ${isDark ? "bg-white/5 border-white/5" : "bg-[#f8f8f8] border-[#ebebeb]"}`}>
                      {loadingWorkout
                        ? <div className="flex flex-col gap-1.5"><div className="sk h-5 w-10 rounded" /><div className="sk h-2 w-10 rounded-full mt-1" /></div>
                        : <>
                            <p className={`font-black text-[18px] leading-none ${isDark ? "text-white" : "text-[#111]"}`}>
                              <CountUp to={workout?.weeklyStats?.streak ?? 0} duration={0.8} />
                              <span className={`text-[9px] font-normal ml-0.5 ${isDark ? "text-white/30" : "text-[#bbb]"}`}>days</span>
                            </p>
                            <p className={`text-[8px] uppercase tracking-wider mt-1 ${isDark ? "text-white/25" : "text-[#bbb]"}`}>streak 🔥</p>
                          </>
                      }
                    </div>
                  </div>

                  {/* sub stats */}
                  <div className="flex gap-3 px-0.5">
                    {loadingWorkout
                      ? <><div className="sk h-3 w-12 rounded-full" /><div className="sk h-3 w-16 rounded-full" /></>
                      : <>
                          <span className={`text-[10px] ${isDark ? "text-white/30" : "text-[#bbb]"}`}>
                            <span className={`font-semibold ${isDark ? "text-white/60" : "text-[#666]"}`}><CountUp to={workout?.duration ?? 0} duration={1.0} /></span> min
                          </span>
                          <span className={isDark ? "text-white/15" : "text-[#ddd]"}>·</span>
                          <span className={`text-[10px] ${isDark ? "text-white/30" : "text-[#bbb]"}`}>
                            <span className={`font-semibold ${isDark ? "text-white/60" : "text-[#666]"}`}><CountUp to={workout?.weeklyStats?.workoutsThisWeek ?? 0} duration={0.7} />×</span> this week
                          </span>
                        </>
                    }
                  </div>

                  {/* divider */}
                  <div className={`border-t ${isDark ? "border-white/[0.06]" : "border-[#ebebeb]"}`} />

                  {/* exercise list */}
                  <div className="flex flex-col justify-between flex-1 min-h-0">
                    {loadingWorkout
                      ? [40, 56, 48, 52, 44].map((w, i) => (
                          <div key={i} className="flex items-center justify-between gap-2 py-0.5">
                            <div className="sk h-2.5 rounded-full flex-1" style={{ maxWidth: `${w}%` }} />
                            <div className="sk h-4 w-12 rounded-md" />
                          </div>
                        ))
                      : (workout?.exercises ?? []).map((ex, i) => (
                      <motion.div
                        key={ex.name}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.06, duration: 0.32 }}
                        className="flex items-center justify-between gap-2 py-0.5"
                      >
                        <p className={`text-[10px] font-medium truncate flex-1 ${isDark ? "text-white/55" : "text-[#555]"}`}>{ex.name}</p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[9px] ${isDark ? "text-white/25" : "text-[#bbb]"}`}>{ex.sets}×{ex.reps}</span>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${isDark ? "text-white/45 bg-white/5" : "text-[#555] bg-[#f5f5f5]"}`}>
                            {ex.weight}kg
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                </motion.div>
              </div>
            </BentoCard>

            {/* GITHUB + WAKATIME combined — col1-3, rows5-6 */}
            <BentoCard className={`${CARD} overflow-hidden`} style={{ gridColumn: "1 / 4", gridRow: "5 / 7" }}>
              <motion.div custom={9} variants={fadeUp} initial="hidden" animate="show" className="flex h-full">

                {/* ── LEFT: GitHub ── */}
                <div ref={githubRef} className="flex flex-col flex-[3] min-w-0 p-4">
                  {/* header + stats */}
                  <div className="flex items-center gap-4 mb-3 shrink-0">
                    <p className={`${LABEL} flex items-center gap-1.5 shrink-0`}>
                      <span className="icon-pulse"><SiGithub size={10} /></span>GitHub
                    </p>
                    <div className="flex gap-4 text-[11px] text-[#aaa] dark:text-[#555]">
                      {loadingStats ? (
                        <>
                          <div className="sk h-3.5 w-14 rounded-full" />
                          <div className="sk h-3.5 w-16 rounded-full" />
                          <div className="sk h-3.5 w-12 rounded-full" />
                        </>
                      ) : (
                        <>
                          <span>
                            <strong className="text-[#111] dark:text-[#eee] text-[13px] font-black"><CountUp to={stats?.totalCommitsThisYear ?? 0} separator="," duration={1.2} /></strong>
                            <span className="ml-1">commits</span>
                          </span>
                          <span>
                            <strong className="text-[13px] font-black" style={{ color: ACCENT }}><CountUp to={stats?.currentStreak ?? 0} duration={0.9} /></strong>
                            <span className="ml-1">day streak</span>
                          </span>
                          <span>
                            <strong className="text-[#111] dark:text-[#eee] text-[13px] font-black"><CountUp to={stats?.githubRepos ?? 0} duration={1.0} /></strong>
                            <span className="ml-1">repos</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {/* contribution grid */}
                  <div className="overflow-hidden flex-1 flex items-end">
                    <GitHubGrid seed={stats?.totalCommitsThisYear ?? 539} inView={githubInView} />
                  </div>
                </div>

                {/* divider */}
                <div className={`w-px self-stretch my-4 shrink-0 ${isDark ? "bg-white/[0.06]" : "bg-[#ebebeb]"}`} />

                {/* ── RIGHT: Wakatime ── */}
                <div className="flex flex-col flex-[2] min-w-0 p-4">
                  {/* header + time stats */}
                  <div className="flex items-start justify-between mb-3 shrink-0">
                    <p className={`${LABEL} flex items-center gap-1.5`}><SiWakatime size={9} />Wakatime</p>
                    <div className="flex gap-3 text-right">
                      <div>
                        <p className="font-black text-[#111] dark:text-[#eee] text-[14px] leading-none tabular-nums">{waka.today.h}h<span className="text-[11px]">{waka.today.m}m</span></p>
                        <p className="text-[9px] text-[#bbb] dark:text-[#555] mt-0.5">today</p>
                      </div>
                      <div className={`w-px self-stretch ${isDark ? "bg-white/[0.06]" : "bg-[#f0f0f0]"}`} />
                      <div>
                        <p className="font-black text-[#111] dark:text-[#eee] text-[14px] leading-none tabular-nums">{waka.week.h}h<span className="text-[11px]">{waka.week.m}m</span></p>
                        <p className="text-[9px] text-[#bbb] dark:text-[#555] mt-0.5">this week</p>
                      </div>
                    </div>
                  </div>
                  {/* language bars */}
                  <div className="flex flex-col justify-between flex-1">
                    {waka.langs.map((l, i) => (
                      <div key={l.name} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                            <span className="text-[11px] font-medium text-[#555] dark:text-[#888]">{l.name}</span>
                          </div>
                          <span className="text-[11px] text-[#bbb] dark:text-[#555] tabular-nums font-semibold">{l.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-[#f0f0f0] dark:bg-[#282828] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${l.pct}%` }}
                            transition={{ duration: 0.9, delay: i * 0.12, ease: "easeOut" }}
                            style={{ backgroundColor: l.color }}
                            className="h-full rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            </BentoCard>

            {/* DISCORD — col4, rows3-5 */}
            <BentoCard
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: isDark ? "#1e1f22" : "#f5f6ff", border: isDark ? "1px solid #2b2d31" : "1px solid #e3e4f0", gridColumn: "4", gridRow: "3 / 5" }}
            >
              <motion.div custom={8} variants={fadeUp} initial="hidden" animate="show" className="p-3.5 h-full flex flex-col gap-3">

                {/* header */}
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? "text-[#5865f2]/50" : "text-[#5865f2]/60"}`}>Discord</span>
                  <span className="icon-pulse"><SiDiscord size={13} className="text-[#5865f2]" /></span>
                </div>

                {loadingDiscord ? (
                  /* skeleton state */
                  <>
                    <div className="flex flex-col items-center gap-2 pt-1">
                      <div className="sk w-14 h-14 rounded-full" />
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="sk h-3 w-20 rounded-full" />
                        <div className="sk h-2.5 w-14 rounded-full" />
                      </div>
                    </div>
                    <div className={`border-t ${isDark ? "border-white/5" : "border-[#e3e4f0]"}`} />
                    <div className={`rounded-xl p-2.5 border flex-1 flex flex-col justify-center gap-2 ${isDark ? "bg-white/[0.04] border-white/5" : "bg-white border-[#e3e4f0]"}`}>
                      <div className="sk h-2 w-10 rounded-full" />
                      <div className="sk h-3 w-24 rounded-full" />
                    </div>
                  </>
                ) : (
                  <>
                    {/* avatar + name + status */}
                    <div className="flex flex-col items-center gap-2 pt-1">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#5865f2]/20">
                          {discord?.avatarUrl
                            ? <img src={discord.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-[#5865f2] flex items-center justify-center"><SiDiscord size={24} className="text-white" /></div>
                          }
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[2.5px] ${isDark ? "border-[#1e1f22]" : "border-[#f5f6ff]"}`}
                          style={{ backgroundColor: statusColor }}
                        />
                      </div>
                      <div className="text-center">
                        <p className={`font-bold text-[13px] leading-tight ${isDark ? "text-white" : "text-[#111]"}`}>
                          {discord?.displayName ?? "lucashdo"}
                        </p>
                        <div className="flex items-center justify-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
                          <p className={`text-[10px] capitalize ${isDark ? "text-white/40" : "text-[#888]"}`}>{discord?.status ?? "online"}</p>
                        </div>
                      </div>
                    </div>

                    {/* divider */}
                    <div className={`border-t ${isDark ? "border-white/5" : "border-[#e3e4f0]"}`} />

                    {/* activity */}
                    <div className={`rounded-xl p-2.5 border flex-1 flex flex-col justify-center gap-1 ${isDark ? "bg-white/[0.04] border-white/5" : "bg-white border-[#e3e4f0]"}`}>
                      <p className={`text-[8px] uppercase tracking-widest font-bold ${isDark ? "text-[#5865f2]/50" : "text-[#5865f2]/60"}`}>
                        {discord?.activity ? "Playing" : "Status"}
                      </p>
                      <p className={`text-[11px] font-semibold truncate ${isDark ? "text-white/80" : "text-[#333]"}`}>
                        {discord?.activity ?? "VS Code"}
                      </p>
                      {discord?.activityDetail && (
                        <p className={`text-[9px] truncate ${isDark ? "text-white/30" : "text-[#aaa]"}`}>{discord.activityDetail}</p>
                      )}
                      {discord?.customStatus && (
                        <p className={`text-[9px] italic mt-0.5 ${isDark ? "text-white/25" : "text-[#bbb]"}`}>"{discord.customStatus}"</p>
                      )}
                    </div>
                  </>
                )}

              </motion.div>
            </BentoCard>

            {/* CV CTA — col4, rows5-7 */}
            <BentoCard
              className={`${CARD} overflow-hidden cursor-pointer group`}
              style={{ gridColumn: "4", gridRow: "5 / 7" }}
              onClick={() => navigate("/cv")}
            >
              <motion.div
                custom={8.5}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="p-4 h-full flex flex-col justify-between"
              >
                <p className={LABEL}>Résumé</p>

                <div className="flex flex-col gap-1">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
                    style={{ backgroundColor: `${ACCENT}12` }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                  </div>
                  <p className="text-[15px] font-black text-[#111] dark:text-[#eee] leading-tight">View CV</p>
                  <p className="text-[10px] text-[#bbb] dark:text-[#444] leading-snug">Experience, skills & projects</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold" style={{ color: ACCENT }}>Open résumé</span>
                  <FiArrowUpRight size={11} style={{ color: ACCENT }} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.div>
            </BentoCard>

            {/* TECH STACK — col2-3, rows3-4 */}
            <BentoCard className={`${CARD} p-4`} style={{ gridColumn: "2 / 4", gridRow: "3 / 5" }}>
              <motion.div custom={11} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col h-full gap-3">
                <p className={LABEL}>Tech Stack</p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 flex-1 content-start">
                  {[
                    { group: "Languages", items: [
                      { icon: <SiTypescript size={12} />, name: "TypeScript", color: "#3178c6" },
                      { icon: <SiGo size={12} />, name: "Go", color: "#00add8" },
                      { icon: <SiPython size={12} />, name: "Python", color: "#3572a5" },
                    ]},
                    { group: "Frontend", items: [
                      { icon: <SiReact size={12} />, name: "React", color: "#61dafb" },
                      { icon: <SiNextdotjs size={12} />, name: "Next.js", color: isDark ? "#eee" : "#111" },
                      { icon: <SiTailwindcss size={12} />, name: "Tailwind", color: "#38bdf8" },
                    ]},
                    { group: "Backend · DB", items: [
                      { icon: <SiNodedotjs size={12} />, name: "Node.js", color: "#5fa04e" },
                      { icon: <SiPostgresql size={12} />, name: "PostgreSQL", color: "#4169e1" },
                      { icon: <SiRedis size={12} />, name: "Redis", color: "#dc382d" },
                    ]},
                    { group: "Infra · Tools", items: [
                      { icon: <SiDocker size={12} />, name: "Docker", color: "#2496ed" },
                      { icon: <SiSupabase size={12} />, name: "Supabase", color: "#3ecf8e" },
                      { icon: <SiFigma size={12} />, name: "Figma", color: "#a259ff" },
                    ]},
                  ].map((group) => (
                    <div key={group.group} className="flex flex-col gap-1.5">
                      <p className="text-[8px] font-bold uppercase tracking-widest text-[#ccc] dark:text-[#444]">{group.group}</p>
                      {group.items.map((item) => (
                        <div key={item.name} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#f8f8f8] dark:bg-[#1e1e1e] border border-[#f0f0f0] dark:border-[#282828] hover:border-[#e0e0e0] dark:hover:border-[#333] transition-colors cursor-default">
                          <span style={{ color: item.color }}>{item.icon}</span>
                          <span className="text-[11px] font-medium text-[#555] dark:text-[#999]">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            </BentoCard>

            {/* MYANIME LIST — col1-2, rows7-8 flip card */}
            <BentoCard
              className={`${CARD} cursor-pointer`}
              style={{ perspective: "1200px", gridColumn: "1 / 3", gridRow: "7 / 9" }}
              onClick={() => { setMalFlipped(f => !f); setMalHover(null); }}
            >
              <motion.div custom={12} variants={fadeUp} initial="hidden" animate="show" className="w-full h-full">
                <div
                  className="relative w-full h-full transition-transform duration-700"
                  style={{ transformStyle: "preserve-3d", transform: malFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                >

                  {/* ── helper: cover strip ── renders 5 covers with rotation + tooltip */}
                  {([
                    { side: "anime", favs: malData.anime.favorites, faceTransform: undefined },
                    { side: "manga", favs: malData.manga.favorites, faceTransform: "rotateY(180deg)" },
                  ] as const).map(({ side, favs, faceTransform }) => {
                    const visible = [...favs, ...favs].slice(malPage, malPage + 5);
                    const hovered = visible.find(f => f.title === malHover) ?? null;
                    const stats = side === "anime"
                      ? [
                          { to: malData.anime.completed, label: "completed", dur: 1.0 },
                          { to: malData.anime.watching,  label: "watching",  dur: 0.6 },
                          { to: malData.anime.episodes,  label: "episodes",  dur: 1.4, sep: "," },
                        ]
                      : [
                          { to: malData.manga.completed, label: "completed", dur: 1.0 },
                          { to: malData.manga.reading,   label: "reading",   dur: 0.5 },
                          { to: malData.manga.chapters,  label: "chapters",  dur: 1.4, sep: "," },
                        ];
                    const hint = side === "anime" ? "tap for manga →" : "← tap for anime";

                    return (
                      <div
                        key={side}
                        className="absolute inset-0 rounded-2xl overflow-hidden p-4 flex flex-col gap-2.5 bg-white dark:bg-[#181818]"
                        style={{ backfaceVisibility: "hidden", transform: faceTransform }}
                        onClick={e => e.stopPropagation()}
                      >
                        {/* header */}
                        <div className="flex items-center justify-between shrink-0" onClick={() => { setMalFlipped(f => !f); setMalHover(null); }}>
                          <div className="flex items-center gap-2 leading-none">
                            <SiMyanimelist size={14} style={{ color: "#2e51a2" }} />
                            <span className="text-[13px] font-bold text-[#111] dark:text-[#eee] leading-none capitalize">{side}</span>
                          </div>
                          <span className="text-[9px] leading-none text-[#bbb] dark:text-[#555]">{hint}</span>
                        </div>

                        {/* stats row — animated counters */}
                        <div className="flex gap-5 shrink-0" onClick={() => { setMalFlipped(f => !f); setMalHover(null); }}>
                          {stats.map((s, i) => (
                            <div key={s.label} className={i > 0 ? "border-l border-[#ebebeb] dark:border-[#282828] pl-5" : ""}>
                              <p className="text-[26px] font-black leading-none text-[#111] dark:text-[#eee]">
                                <CountUp to={s.to} separator={s.sep ?? ""} duration={s.dur} />
                              </p>
                              <p className={`${LABEL} mt-1`}>{s.label}</p>
                            </div>
                          ))}
                        </div>

                        {/* divider */}
                        <div className="border-t border-[#ebebeb] dark:border-[#282828] shrink-0" />

                        {/* cover strip */}
                        <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={`${side}-page-${malPage}`}
                              initial={{ opacity: 0, x: 12 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -12 }}
                              transition={{ duration: 0.35, ease: "easeOut" }}
                              className="flex gap-2 flex-1"
                            >
                              {visible.map((f) => (
                                <div
                                  key={f.title}
                                  className="flex-1 relative rounded-xl overflow-hidden bg-[#f0f0f0] dark:bg-[#252525] min-w-0 cursor-pointer"
                                  onMouseEnter={() => setMalHover(f.title)}
                                  onMouseLeave={() => setMalHover(null)}
                                  onClick={e => e.stopPropagation()}
                                >
                                  <img src={f.img} alt={f.title} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                                  <div className="absolute bottom-0 left-0 right-0 p-1.5">
                                    <p className="text-white text-[7px] font-semibold leading-tight line-clamp-2">{f.title}</p>
                                    <p className="text-white/50 text-[6px] mt-0.5 tabular-nums">{f.year}</p>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          </AnimatePresence>

                          {/* description strip — slides in on hover */}
                          <AnimatePresence>
                            {hovered ? (
                              <motion.div
                                key={hovered.title}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.22 }}
                                className="overflow-hidden shrink-0"
                              >
                                <div className="bg-[#f5f5f5] dark:bg-[#222] rounded-xl px-3 py-2 flex items-start gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-[#111] dark:text-[#eee] leading-tight truncate">{hovered.title} <span className="text-[9px] font-normal text-[#bbb] dark:text-[#555]">({hovered.year ?? "—"})</span></p>
                                  </div>
                                </div>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>

                          {/* page dots */}
                          <div className="flex items-center justify-center gap-1.5 shrink-0 pb-0.5" onClick={e => e.stopPropagation()}>
                            {[0, 1].map(i => (
                              <button
                                key={i}
                                onClick={() => setMalPage(i)}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${i === malPage ? "scale-125" : "opacity-30 hover:opacity-60"}`}
                                style={{ backgroundColor: i === malPage ? ACCENT : undefined, background: i !== malPage ? "#ccc" : undefined }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </BentoCard>

            {/* PROJECTS CTA — col2-3, rows1-2 */}
            <BentoCard
              className={`${CARD} overflow-hidden group cursor-pointer`}
              style={{ gridColumn: "2 / 4", gridRow: "1 / 3" }}
              onClick={() => navigate("/projects")}
            >
              <motion.div custom={12} variants={fadeUp} initial="hidden" animate="show" className="p-5 h-full flex flex-col gap-4">

                {/* header */}
                <div className="flex items-center justify-between shrink-0">
                  <p className={`${LABEL} flex items-center gap-1.5`}><SiGithub size={9} />Projects</p>
                  <FiArrowUpRight size={13} className="text-[#ccc] dark:text-[#444] group-hover:text-[#999] dark:group-hover:text-[#666] transition-colors" />
                </div>

                {/* cycling project card */}
                <div className={`flex-1 min-h-0 relative overflow-hidden rounded-xl border ${isDark ? "border-white/[0.07]" : "border-[#ebebeb]"}`}>
                  <AnimatePresence mode="wait">
                    {(() => {
                      const p = projects[projIdx];
                      return (
                        <motion.div
                          key={projIdx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="absolute inset-0 flex"
                        >
                          {/* left color accent bar */}
                          <div className="w-1 shrink-0 rounded-l-xl" style={{ backgroundColor: p.color }} />

                          <div className="flex-1 flex flex-col justify-between p-4">
                            {/* top */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-2">
                                  <SiGithub size={11} className="text-[#999] dark:text-[#555] shrink-0" />
                                  <h3 className="text-[13px] font-bold truncate text-[#111] dark:text-[#eee]">{p.name}</h3>
                                  {p.wip && (
                                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{ color: ACCENT, backgroundColor: `${ACCENT}12` }}>WIP</span>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#888] dark:text-[#555] leading-snug">{p.description}</p>
                              </div>
                              <a href={p.url} onClick={e => e.stopPropagation()} className="shrink-0 text-[#ccc] dark:text-[#444] hover:text-[#888] transition-colors">
                                <FiArrowUpRight size={12} />
                              </a>
                            </div>

                            {/* bottom */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                                <span className="text-[10px] text-[#999] dark:text-[#555]">{p.language}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[#bbb] dark:text-[#444]">
                                <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>
                                <span className="text-[10px] tabular-nums">{p.stars}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>

                  {/* pagination dots */}
                  <div className="absolute bottom-3 right-3 flex gap-1 z-20">
                    {projects.map((_, i) => (
                      <button
                        key={i}
                        onClick={e => { e.stopPropagation(); setProjIdx(i); }}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: i === projIdx ? 14 : 4,
                          height: 4,
                          backgroundColor: i === projIdx ? projects[projIdx].color : (isDark ? "#333" : "#ddd"),
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* bottom stats + cta */}
                <div className="flex items-end justify-between shrink-0">
                  <div className="flex gap-5">
                    <div>
                      <p className="text-[22px] font-black text-[#111] dark:text-[#eee] leading-none tabular-nums">
                        <CountUp to={stats?.githubRepos ?? 28} duration={1.0} />
                      </p>
                      <p className="text-[10px] text-[#bbb] dark:text-[#555] mt-0.5">repos</p>
                    </div>
                    <div className={`border-l ${isDark ? "border-white/10" : "border-[#ebebeb]"} pl-5`}>
                      <p className="text-[22px] font-black leading-none tabular-nums" style={{ color: ACCENT }}>
                        <CountUp to={totalStars} duration={1.2} />
                      </p>
                      <p className="text-[10px] text-[#bbb] dark:text-[#555] mt-0.5">stars</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold" style={{ color: ACCENT }}>View all</span>
                    <FiArrowUpRight size={11} style={{ color: ACCENT }} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

              </motion.div>
            </BentoCard>

            {/* STEAM — col4, row7 (1×1, rotating game art) */}
            <BentoCard
              className="rounded-2xl overflow-hidden relative"
              style={{ backgroundColor: isDark ? "#1b2838" : "#f0f0f0", gridColumn: "4", gridRow: "7 / 9" }}
            >
              <motion.div custom={13} variants={fadeUp} initial="hidden" animate="show" className="w-full h-full relative">
                {loadingSteam ? (
                  /* skeleton */
                  <div className="absolute inset-0">
                    <div className="sk absolute inset-0 rounded-none" style={{ borderRadius: 0 }} />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-col gap-1.5">
                      <div className="sk h-2 w-8 rounded-full" style={{ opacity: 0.5 }} />
                      <div className="sk h-3 w-20 rounded-full" style={{ opacity: 0.4 }} />
                      <div className="sk h-2 w-12 rounded-full" style={{ opacity: 0.35 }} />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* cycling game art */}
                    <AnimatePresence mode="wait">
                      {(() => {
                        const games = steam?.recentGames ?? [];
                        const game = games[steamIdx % Math.max(games.length, 1)];
                        return game?.imageUrl ? (
                          <motion.div
                            key={steamIdx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0"
                          >
                            <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                            <div className="absolute bottom-2.5 left-2.5 right-2.5">
                              <p className="text-white/50 text-[8px] uppercase tracking-widest font-bold mb-0.5 flex items-center gap-1">
                                <span className="icon-pulse"><SiSteam size={7} /></span>Steam
                              </p>
                              <p className="text-white text-[11px] font-bold leading-tight truncate">{game.name}</p>
                              <p className="text-white/50 text-[9px]">{game.hoursPlayed}h played</p>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                          >
                            <span className="icon-pulse"><SiSteam size={24} className={isDark ? "text-[#c7d5e0]/20" : "text-[#ccc]"} /></span>
                            <p className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? "text-[#c7d5e0]/30" : "text-[#bbb]"}`}>Steam</p>
                          </motion.div>
                        );
                      })()}
                    </AnimatePresence>
                    {/* game count badge */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-black/40 backdrop-blur-sm">
                      <SiSteam size={8} className="text-white/60" />
                      <span className="text-[8px] text-white/60 font-semibold">{steam?.totalGames ?? 0}</span>
                    </div>
                  </>
                )}
              </motion.div>
            </BentoCard>


          </div>

          {/* ════ TIMELINE SECTION ════ */}
          {(() => {
            type TLEntry = {
              id: string;
              type: "job" | "academic" | "scholarship" | "volunteer";
              title: string;
              institution: string;
              url?: string;
              start: string;
              end: string | null;
              tags: string[];
              description: string;
            };

            const TYPE_LABEL: Record<TLEntry["type"], string> = {
              job: "Job",
              academic: "Academic",
              scholarship: "Scholarship",
              volunteer: "Volunteer",
            };
            const TYPE_COLOR: Record<TLEntry["type"], string> = {
              job: ACCENT,
              academic: "#40c463",
              scholarship: "#f59e0b",
              volunteer: "#a78bfa",
            };

            const entries: TLEntry[] = [
              {
                id: "uergs",
                type: "academic",
                title: "Engenharia da Computação",
                institution: "UERGS",
                url: "https://www.uergs.edu.br/",
                start: "Feb 2023",
                end: "Jan 2025",
                tags: ["C", "Python", "Microcontrollers", "Assembly"],
                description: "Academic projects on low-level programming, algorithm development, and embedded systems.",
              },
              {
                id: "eng-futuro-vol",
                type: "volunteer",
                title: "Desenvolvedor Voluntário",
                institution: "Engenharia do Futuro",
                url: "https://engenhariadofuturo.com.br/",
                start: "May 2023",
                end: "Feb 2024",
                tags: ["React", "Node.js", "TypeScript", "ViteJS"],
                description: "Led Front-End workshop, developed embedded firmware, web interface and backend API.",
              },
              {
                id: "include-gurias",
                type: "scholarship",
                title: "Bolsa Include Gurias",
                institution: "UERGS",
                url: "https://www.uergs.edu.br/",
                start: "Jun 2023",
                end: "Jan 2024",
                tags: ["Figma", "AWS", "Web Dev", "Auth"],
                description: "Architected institutional fullstack platform with custom headless CMS and admin dashboard.",
              },
              {
                id: "unicv",
                type: "academic",
                title: "Engenharia de Software",
                institution: "UNICV",
                url: "https://www.unicv.edu.br/",
                start: "Feb 2025",
                end: null,
                tags: ["Software Arch.", "Agile", "Databases"],
                description: "Robust system architecture, scalable development and agile methodology.",
              },
              {
                id: "eng-futuro",
                type: "job",
                title: "Dev. Full Stack",
                institution: "Engenharia do Futuro",
                url: "https://engenhariadofuturo.com.br/",
                start: "Apr 2025",
                end: null,
                tags: ["React", "TypeScript", "Python", "Web Serial API"],
                description: "Complete platform refactor, design system, and browser-based firmware flashing via Web Serial API.",
              },
              {
                id: "comunica-mulher",
                type: "scholarship",
                title: "Bolsa ComunicaMulher",
                institution: "ComunicaMulher",
                url: "https://reclame-mulher.vercel.app/",
                start: "Aug 2025",
                end: null,
                tags: ["Next.js", "Supabase", "TypeScript", "RLS"],
                description: "Complaint management system with moderation workflow, Supabase RLS policies and audit logging.",
              },
            ];

            return (
              <div className="pt-2.5 pb-2.5">
                <BentoCard className={`${CARD} p-5`}>
                  <motion.div custom={14} variants={fadeUp} initial="hidden" animate="show">
                    {/* header */}
                    <div className="flex items-center justify-between mb-5">
                      <p className={LABEL}>Timeline</p>
                      <div className="flex items-center gap-3">
                        {(["job", "academic", "scholarship", "volunteer"] as TLEntry["type"][]).map(t => (
                          <div key={t} className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TYPE_COLOR[t] }} />
                            <span className="text-[9px] text-[#bbb] dark:text-[#444]">{TYPE_LABEL[t]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* timeline entries */}
                    <div className="relative flex flex-col gap-0">
                      {/* vertical line */}
                      <div className="absolute left-[5px] top-2 bottom-2 w-px bg-[#ebebeb] dark:bg-[#282828]" />

                      {entries.map((entry, i) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 * i, duration: 0.3 }}
                          className="relative pl-7 pb-5 last:pb-0 group"
                        >
                          {/* dot */}
                          <div
                            className="absolute left-0 top-[5px] w-[11px] h-[11px] rounded-full border-2 border-white dark:border-[#181818] z-10 transition-transform group-hover:scale-125"
                            style={{ backgroundColor: TYPE_COLOR[entry.type] }}
                          />

                          <div className="flex items-start justify-between gap-4">
                            {/* left: content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="text-[13px] font-bold text-[#111] dark:text-[#eee] leading-none">{entry.title}</h3>
                                <span
                                  className="text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                                  style={{ color: TYPE_COLOR[entry.type], backgroundColor: `${TYPE_COLOR[entry.type]}18` }}
                                >
                                  {TYPE_LABEL[entry.type].toUpperCase()}
                                </span>
                              </div>
                              <a
                                href={entry.url || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-[#888] dark:text-[#555] hover:underline leading-none"
                                onClick={e => e.stopPropagation()}
                              >
                                {entry.institution}
                              </a>
                              <p className="text-[10px] text-[#aaa] dark:text-[#444] leading-snug mt-1.5 max-w-[560px]">
                                {entry.description}
                              </p>
                              {/* tags */}
                              <div className="flex flex-wrap gap-1 mt-2">
                                {entry.tags.map(tag => (
                                  <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded-md border leading-none ${isDark ? "text-[#555] border-[#282828] bg-[#1e1e1e]" : "text-[#aaa] border-[#ebebeb] bg-[#f8f8f8]"}`}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* right: date chip */}
                            <div className="shrink-0 text-right mt-0.5">
                              <span className={`text-[10px] font-semibold tabular-nums ${isDark ? "text-[#444]" : "text-[#ccc]"}`}>
                                {entry.start}
                              </span>
                              <div className={`text-[9px] ${isDark ? "text-[#333]" : "text-[#ddd]"}`}>→ {entry.end ?? "Present"}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </BentoCard>
              </div>
            );
          })()}

        </BentoSection>

        {/* ════ RIGHT SIDEBAR ════ */}
        <aside className="w-[210px] shrink-0 flex flex-col gap-2.5 h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>

          {/* Top Artists */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className={`${CARD} p-4`}>
            <p className={`${LABEL} mb-3 flex items-center gap-1.5`}>
              <span className="icon-pulse"><SiLastdotfm size={9} /></span>Top Artists
            </p>
            <div className="space-y-2.5">
              {loadingArtists
                ? [60, 80, 70, 55].map((w, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="sk w-3 h-2.5 rounded-full shrink-0" />
                      <div className="sk w-6 h-6 rounded-full shrink-0" />
                      <div className="sk h-3 rounded-full flex-1" style={{ maxWidth: `${w}%` }} />
                      <div className="sk h-2.5 w-5 rounded-full shrink-0" />
                    </div>
                  ))
                : (Array.isArray(topArtists) ? topArtists : []).slice(0, 4).map((artist, i) => (
                    <a key={i} href={artist.url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 group slide-up" style={{ "--delay": `${i*0.07}s` } as React.CSSProperties}>
                      <span className="text-[10px] text-[#ccc] dark:text-[#444] w-3 shrink-0">{i + 1}</span>
                      <div className="w-6 h-6 rounded-full bg-[#f0f0f0] dark:bg-[#252525] overflow-hidden shrink-0">
                        {artist.imageUrl && <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />}
                      </div>
                      <span className="text-[12px] font-medium truncate flex-1 transition-colors" style={{ color: "inherit" }} onMouseEnter={e => (e.currentTarget.style.color = ACCENT)} onMouseLeave={e => (e.currentTarget.style.color = "")}>{artist.name}</span>
                      <span className="text-[10px] text-[#ccc] dark:text-[#444] shrink-0">{Number(artist.playcount).toLocaleString()}</span>
                    </a>
                  ))
              }
            </div>
          </motion.div>

          {/* Social Cards */}
          {[
            { icon: <FiTwitter size={13} />, label: "@lucashdo", sub: "twitter.com/lucashdo", color: "#1da1f2", href: "https://twitter.com/lucashdo" },
            { icon: <SiDiscord size={13} />, label: discord?.displayName ?? "Lucas Diniz", sub: `${discord?.status ?? "offline"} on Discord`, color: "#5865f2", href: undefined },
            { icon: <SiGithub size={13} />, label: "LucasHenriqueDiniz", sub: `${stats?.githubRepos ?? "…"} public repos`, color: "#111", href: "https://github.com/LucasHenriqueDiniz" },
          ].map((s, i) => (
            <motion.a
              key={i}
              custom={4 + i}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              href={s.href ?? "#"}
              target="_blank"
              rel="noreferrer"
              className={`${CARD} p-3 flex items-center gap-3 hover:border-[#d5d5d5] dark:hover:border-[#333] transition-colors group`}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#f5f5f5] dark:bg-[#252525] shrink-0" style={{ color: s.color === "#111" ? (isDark ? "#eee" : "#111") : s.color }}>
                {s.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold truncate">{s.label}</p>
                <p className="text-[10px] text-[#aaa] dark:text-[#555] truncate">{s.sub}</p>
              </div>
              <FiExternalLink size={11} className="text-[#ddd] dark:text-[#333] group-hover:text-[#aaa] dark:group-hover:text-[#666] transition-colors shrink-0" />
            </motion.a>
          ))}

        </aside>
      </div>
      </div>
    </div>
  );
}
