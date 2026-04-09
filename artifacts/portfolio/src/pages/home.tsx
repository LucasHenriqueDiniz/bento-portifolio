import {
  useGetDiscordPresence,
  useGetNowPlaying,
  useGetTopArtists,
  useGetSteamData,
  useGetLastWorkout,
  useGetStats,
} from "@workspace/api-client-react";
import { motion, useInView, animate, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  SiGithub, SiDiscord, SiLastdotfm, SiSteam, SiMyanimelist,
  SiWakatime, SiTypescript, SiReact, SiNodedotjs, SiGo,
  SiPostgresql, SiDocker, SiNextdotjs, SiTailwindcss, SiFigma,
  SiPython, SiRedis,
} from "react-icons/si";
import { FiTwitter, FiMail, FiExternalLink, FiBook, FiClock } from "react-icons/fi";
import { Dumbbell, Moon, Sun } from "lucide-react";
import { BentoCard, BentoSection } from "@/components/BentoCard";

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

/* ─── animated counter hook ───────────────────────── */
function useCounter(to: number, inView: boolean, duration = 1.2) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [to, inView, duration]);
  return val;
}

/* ─── GitHub grid ─────────────────────────────────── */
function GitHubGrid({ seed, inView }: { seed: number; inView: boolean }) {
  const WEEKS = 26, DAYS = 7;
  const cells = Array.from({ length: WEEKS * DAYS }, (_, i) => {
    const v = Math.abs(Math.sin(i * 9.1 + seed * 0.3) * 4) | 0;
    return Math.min(Math.abs(Math.cos(i * 3.7)) > 0.5 ? v : 0, 4);
  });
  const shades = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
  return (
    <div className="flex gap-[3px]" style={{ lineHeight: 0 }}>
      {Array.from({ length: WEEKS }).map((_, w) => (
        <div key={w} className="flex flex-col gap-[3px]">
          {Array.from({ length: DAYS }).map((_, d) => {
            const idx = w * DAYS + d;
            return (
              <div
                key={d}
                className={inView ? "gh-dot" : ""}
                style={{
                  width: 10, height: 10, borderRadius: 2,
                  backgroundColor: shades[cells[idx]],
                  "--dot-delay": `${idx * 3}ms`,
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      ))}
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
  const { data: discord } = useGetDiscordPresence();
  const { data: nowPlaying } = useGetNowPlaying();
  const { data: topArtists } = useGetTopArtists();
  const { data: steam } = useGetSteamData();
  const { data: workout } = useGetLastWorkout();
  const { data: stats } = useGetStats();

  const statusColor = STATUS_COLORS[discord?.status ?? "dnd"];
  const [weatherFlipped, setWeatherFlipped] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  /* inView refs for scroll-triggered animations */
  const githubRef  = useRef<HTMLDivElement>(null);
  const workoutRef = useRef<HTMLDivElement>(null);

  const githubInView  = useInView(githubRef,  { once: true, margin: "-50px" });
  const workoutInView = useInView(workoutRef, { once: true, margin: "-50px" });

  /* Animated counters */
  const animDuration = useCounter(workout?.duration    ?? 68,   workoutInView);
  const animVolume   = useCounter(workout?.totalVolume  ?? 8420, workoutInView, 1.4);
  const animCommits  = useCounter(stats?.totalCommitsThisYear ?? 847, githubInView);
  const animStreak    = useCounter(stats?.currentStreak ?? 12, githubInView, 0.9);
  const animRepos     = useCounter(stats?.githubRepos ?? 42, githubInView, 1.0);

  /* MAL mock data */
  const malData = {
    anime: {
      watching: 8,
      completed: 127,
      episodes: 3842,
      favorites: [
        { title: "Evangelion",      year: 1995, img: "https://picsum.photos/seed/eva26nge/80/120",  synopsis: "A traumatized teen pilots a giant biomech to defend humanity from catastrophic beings called Angels." },
        { title: "Hunter×Hunter",   year: 2011, img: "https://picsum.photos/seed/hxh2011z/80/120",  synopsis: "Young Gon ventures into a dangerous world to become a Hunter and find his missing father." },
        { title: "Vinland Saga",    year: 2019, img: "https://picsum.photos/seed/vinlandd/80/120",  synopsis: "A Viking warrior obsessed with revenge transforms into a man seeking a true warrior's purpose." },
        { title: "Steins;Gate",     year: 2011, img: "https://picsum.photos/seed/steinsgt/80/120",  synopsis: "A self-proclaimed mad scientist accidentally discovers time travel and faces its catastrophic consequences." },
        { title: "Attack on Titan", year: 2013, img: "https://picsum.photos/seed/aot2013x/80/120",  synopsis: "Soldiers fight titans besieging humanity while uncovering the dark truths about their world." },
        { title: "Mushishi",        year: 2005, img: "https://picsum.photos/seed/mushishi/80/120",  synopsis: "A wanderer solves the strange phenomena caused by mysterious life forms called Mushi." },
      ],
    },
    manga: {
      reading: 5,
      completed: 43,
      chapters: 2180,
      favorites: [
        { title: "Berserk",       year: 1989, img: "https://picsum.photos/seed/berserk9/80/120",  synopsis: "A lone swordsman with a tragic past fights through a brutal dark-fantasy world filled with demons." },
        { title: "Vagabond",      year: 1998, img: "https://picsum.photos/seed/vagabond/80/120",  synopsis: "A fictionalized journey of Miyamoto Musashi as he pursues becoming the greatest swordsman in Japan." },
        { title: "Punpun",        year: 2007, img: "https://picsum.photos/seed/punpun77/80/120",  synopsis: "A brutally honest coming-of-age story following a boy navigating trauma and the cruelty of growing up." },
        { title: "Chainsaw Man",  year: 2018, img: "https://picsum.photos/seed/chainsawm/80/120", synopsis: "A boy merged with a chainsaw devil hunts fiends for a shadowy government organization." },
        { title: "Jujutsu Kaisen",year: 2018, img: "https://picsum.photos/seed/jjk2018x/80/120",  synopsis: "A boy swallows a cursed relic and enters a world of sorcerers fighting monstrous cursed spirits." },
        { title: "One Piece",     year: 1997, img: "https://picsum.photos/seed/onepiece/80/120",  synopsis: "A rubber-powered pirate leads his crew across the seas in search of the legendary One Piece treasure." },
      ],
    },
  };
  const [malFlipped, setMalFlipped] = useState(false);
  const [malPage,    setMalPage]    = useState(0);   // 0 = items[0..4], 1 = items[1..5]
  const [malHover,   setMalHover]   = useState<string | null>(null);
  const malRef    = useRef<HTMLDivElement>(null);
  const malInView = useInView(malRef, { once: true, margin: "-50px" });

  useEffect(() => {
    const t = setInterval(() => setMalPage(p => (p + 1) % 2), 4500);
    return () => clearInterval(t);
  }, []);

  const animMalAnimeCompleted = useCounter(malData.anime.completed,  malInView, 1.0);
  const animMalAnimeWatching  = useCounter(malData.anime.watching,   malInView, 0.6);
  const animMalAnimeEpisodes  = useCounter(malData.anime.episodes,   malInView, 1.4);
  const animMalMangaCompleted = useCounter(malData.manga.completed,  malInView, 1.0);
  const animMalMangaReading   = useCounter(malData.manga.reading,    malInView, 0.5);
  const animMalMangaChapters  = useCounter(malData.manga.chapters,   malInView, 1.4);

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
              {["Full-stack developer","Gym rat (4x/week)","Last.fm scrobbler since 2018","Dark mode everything","127 anime completed"].map((f,i) => (
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
        <BentoSection className="flex-1 min-w-0 h-full overflow-hidden">
          <div className="grid gap-2.5 h-full" style={{ gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "calc((100dvh - 124px) / 7)" }}>

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

            {/* MAP — 2×2 (explicitly positioned so it stays at col2-3) */}
            <BentoCard
              className="rounded-2xl border border-[#ebebeb] dark:border-[#282828] overflow-hidden relative"
              style={{ gridColumn: "2 / 4", gridRow: "1 / 3" }}
            >
              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className="w-full h-full">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-43.35%2C-23.05%2C-43.05%2C-22.75&layer=mapnik"
                  className="w-full h-full grayscale opacity-80"
                  style={{ border: 0, pointerEvents: "none" }}
                  title="map"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="bg-white/90 dark:bg-[#181818]/90 backdrop-blur rounded-xl px-3 py-2 inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ef4444] status-dot" style={{ color: "#ef4444" }} />
                    <span className="text-[12px] font-semibold text-[#111] dark:text-[#eee]">Rio de Janeiro, Brazil</span>
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
                {nowPlaying?.albumArt ? (
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
                    <SiLastdotfm size={28} className="text-[#ccc] dark:text-[#444]" />
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
              <div ref={workoutRef} className="p-3.5 h-full flex flex-col gap-2.5">
                <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col h-full gap-2.5">

                  {/* header */}
                  <div className="flex items-center justify-between">
                    <p className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isDark ? "text-white/30" : "text-[#aaa]"}`}>
                      <Dumbbell size={9} className={isDark ? "text-white/40" : "text-[#ccc]"} />Last Workout
                    </p>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full border ${isDark ? "text-white/30 bg-white/5 border-white/[0.08]" : "text-[#888] bg-[#f5f5f5] border-[#e8e8e8]"}`}>
                      {workout?.type?.split("(")[0]?.trim() ?? "Push"}
                    </span>
                  </div>

                  {/* top stats row */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className={`rounded-xl p-2 border ${isDark ? "bg-white/5 border-white/5" : "bg-[#f8f8f8] border-[#ebebeb]"}`}>
                      <p className={`font-black tabular-nums text-[18px] leading-none ${isDark ? "text-white" : "text-[#111]"}`}>
                        {workoutInView ? animVolume.toLocaleString() : "0"}
                        <span className={`text-[9px] font-normal ml-0.5 ${isDark ? "text-white/30" : "text-[#bbb]"}`}>kg</span>
                      </p>
                      <p className={`text-[8px] uppercase tracking-wider mt-1 ${isDark ? "text-white/25" : "text-[#bbb]"}`}>total volume</p>
                    </div>
                    <div className={`rounded-xl p-2 border ${isDark ? "bg-white/5 border-white/5" : "bg-[#f8f8f8] border-[#ebebeb]"}`}>
                      <p className={`font-black tabular-nums text-[18px] leading-none ${isDark ? "text-white" : "text-[#111]"}`}>
                        {workout?.weeklyStats?.streak ?? 12}
                        <span className={`text-[9px] font-normal ml-0.5 ${isDark ? "text-white/30" : "text-[#bbb]"}`}>days</span>
                      </p>
                      <p className={`text-[8px] uppercase tracking-wider mt-1 ${isDark ? "text-white/25" : "text-[#bbb]"}`}>streak 🔥</p>
                    </div>
                  </div>

                  {/* sub stats */}
                  <div className="flex gap-3 px-0.5">
                    <span className={`text-[10px] ${isDark ? "text-white/30" : "text-[#bbb]"}`}>
                      <span className={`font-semibold ${isDark ? "text-white/60" : "text-[#666]"}`}>{workoutInView ? animDuration : 0}</span> min
                    </span>
                    <span className={isDark ? "text-white/15" : "text-[#ddd]"}>·</span>
                    <span className={`text-[10px] ${isDark ? "text-white/30" : "text-[#bbb]"}`}>
                      <span className={`font-semibold ${isDark ? "text-white/60" : "text-[#666]"}`}>{workout?.weeklyStats?.workoutsThisWeek ?? 4}×</span> this week
                    </span>
                  </div>

                  {/* divider */}
                  <div className={`border-t ${isDark ? "border-white/[0.06]" : "border-[#ebebeb]"}`} />

                  {/* exercise list */}
                  <div className="flex flex-col justify-between flex-1 min-h-0">
                    {(workout?.exercises ?? [
                      { name: "Bench Press",          sets: 4, reps: 8,  weight: 100 },
                      { name: "Incline DB Press",     sets: 3, reps: 10, weight: 36  },
                      { name: "Overhead Press",       sets: 4, reps: 8,  weight: 70  },
                      { name: "Lateral Raises",       sets: 3, reps: 15, weight: 14  },
                      { name: "Tricep Pushdown",      sets: 3, reps: 12, weight: 40  },
                    ]).map((ex, i) => (
                      <motion.div
                        key={ex.name}
                        initial={{ opacity: 0, x: -8 }}
                        animate={workoutInView ? { opacity: 1, x: 0 } : {}}
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

            {/* WAKATIME — 2×2 (expanded) */}
            <BentoCard className={`${CARD} p-4 col-span-2 row-span-2 flex flex-col`}>
              <motion.div custom={9} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col h-full">
                {/* header row */}
                <div className="flex items-start justify-between mb-3">
                  <p className={`${LABEL} flex items-center gap-1.5`}><SiWakatime size={9} />Wakatime</p>
                  <div className="flex gap-3 text-[10px] text-[#888] text-right">
                    <div>
                      <p className="font-black text-[#111] dark:text-[#eee] text-[16px] leading-none">{waka.today.h}h<span className="text-[12px]">{waka.today.m}m</span></p>
                      <p className="text-[9px] text-[#bbb] mt-0.5">today</p>
                    </div>
                    <div className="w-px bg-[#f0f0f0] dark:bg-[#282828]" />
                    <div>
                      <p className="font-black text-[#111] dark:text-[#eee] text-[16px] leading-none">{waka.week.h}h<span className="text-[12px]">{waka.week.m}m</span></p>
                      <p className="text-[9px] text-[#bbb] mt-0.5">this week</p>
                    </div>
                  </div>
                </div>

                {/* language bars — bigger with more breathing room */}
                <div className="flex flex-col justify-between flex-1">
                  {waka.langs.map((l, i) => (
                    <div key={l.name} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                          <span className="text-[11px] font-medium text-[#555]">{l.name}</span>
                        </div>
                        <span className="text-[11px] text-[#bbb] tabular-nums font-semibold">{l.pct}%</span>
                      </div>
                      <div className="h-2 bg-[#f0f0f0] dark:bg-[#282828] rounded-full overflow-hidden">
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
              </motion.div>
            </BentoCard>

            {/* DISCORD — 1×2 */}
            <BentoCard
              className="col-span-1 row-span-2 rounded-2xl overflow-hidden"
              style={{ backgroundColor: isDark ? "#23272a" : "#ffffff", border: isDark ? "none" : "1px solid #ebebeb" }}
            >
              <motion.div custom={8} variants={fadeUp} initial="hidden" animate="show" className="p-3 h-full flex flex-col">
                {/* header */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? "text-white/30" : "text-[#aaa]"}`}>Discord</span>
                  <SiDiscord size={13} className="text-[#5865f2]" />
                </div>
                {/* avatar */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full overflow-hidden ring-2 ${isDark ? "bg-[#36393f] ring-white/10" : "bg-[#f0f0f0] ring-[#ebebeb]"}`}>
                      {discord?.avatarUrl
                        ? <img src={discord.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        : <SiDiscord size={20} className="m-auto mt-3 text-[#5865f2]/60" />
                      }
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 status-dot ${isDark ? "border-[#23272a]" : "border-white"}`}
                      style={{ backgroundColor: statusColor, color: statusColor }}
                    />
                  </div>
                  <div className="text-center w-full min-w-0">
                    <p className={`font-bold text-[12px] truncate leading-tight ${isDark ? "text-white" : "text-[#111]"}`}>{discord?.displayName ?? "Your Name"}</p>
                    <p className={`text-[10px] capitalize mt-0.5 ${isDark ? "text-white/40" : "text-[#aaa]"}`}>{discord?.status ?? "dnd"}</p>
                  </div>
                </div>

                {/* divider */}
                <div className={`border-t my-2.5 ${isDark ? "border-white/5" : "border-[#ebebeb]"}`} />

                {/* activity */}
                <div className="flex flex-col gap-2 flex-1 min-h-0">
                  <div className={`rounded-lg p-2.5 border min-w-0 ${isDark ? "bg-white/5 border-white/5" : "bg-[#f8f8f8] border-[#ebebeb]"}`}>
                    <p className={`text-[8px] uppercase tracking-widest mb-1 ${isDark ? "text-white/30" : "text-[#aaa]"}`}>Playing</p>
                    <p className={`text-[10px] font-semibold truncate ${isDark ? "text-white/80" : "text-[#333]"}`}>{discord?.activity ?? "VS Code"}</p>
                    {discord?.activityDetail && (
                      <p className={`text-[9px] truncate mt-0.5 ${isDark ? "text-white/30" : "text-[#aaa]"}`}>{discord.activityDetail}</p>
                    )}
                  </div>
                  {discord?.customStatus && (
                    <p className={`text-[9px] text-center italic truncate px-1 ${isDark ? "text-white/25" : "text-[#bbb]"}`}>"{discord.customStatus}"</p>
                  )}
                </div>
              </motion.div>
            </BentoCard>

            {/* TECH STACK — 2×1 */}
            <BentoCard className={`${CARD} p-4 col-span-2 row-span-1 flex flex-col justify-between`}>
              <motion.div custom={11} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col h-full justify-between">
                <p className={`${LABEL} mb-2`}>Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {stack.map((tech, i) => (
                    <div
                      key={tech.label}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#f8f8f8] dark:bg-[#222] border border-[#f0f0f0] dark:border-[#2a2a2a] hover:border-[#e0e0e0] dark:hover:border-[#333] hover:bg-white dark:hover:bg-[#2a2a2a] transition-all cursor-default slide-up"
                      style={{ "--delay": `${i * 0.04}s` } as React.CSSProperties}
                    >
                      <span className="text-[13px]" style={{ color: tech.color }}>{tech.icon}</span>
                      <span className="text-[11px] font-medium text-[#555] dark:text-[#999]">{tech.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </BentoCard>

            {/* GITHUB — 2×2 */}
            <BentoCard className={`${CARD} p-4 col-span-2 row-span-2 flex flex-col`}>
              <div ref={githubRef} className="flex flex-col w-full h-full">
                <motion.div custom={10} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col h-full">
                  {/* header: label + stats */}
                  <div className="flex items-center gap-4 mb-3">
                    <p className={`${LABEL} flex items-center gap-1.5 shrink-0`}><SiGithub size={10} />GitHub</p>
                    <div className="flex gap-4 text-[11px] text-[#aaa] dark:text-[#555]">
                      <span>
                        <strong className="text-[#111] dark:text-[#eee] tabular-nums text-[13px] font-black">{githubInView ? animCommits : 0}</strong>
                        <span className="ml-1">commits</span>
                      </span>
                      <span>
                        <strong className="tabular-nums text-[13px] font-black" style={{ color: ACCENT }}>{githubInView ? animStreak : 0}</strong>
                        <span className="ml-1">day streak</span>
                      </span>
                      <span>
                        <strong className="text-[#111] dark:text-[#eee] tabular-nums text-[13px] font-black">{githubInView ? animRepos : 0}</strong>
                        <span className="ml-1">repos</span>
                      </span>
                    </div>
                  </div>
                  {/* contribution grid — fills remaining space */}
                  <div className="overflow-hidden flex-1 flex items-end">
                    <GitHubGrid seed={stats?.totalCommitsThisYear ?? 847} inView={githubInView} />
                  </div>
                </motion.div>
              </div>
            </BentoCard>

            {/* MYANIME LIST — 2×2 flip card */}
            <BentoCard
              className={`${CARD} col-span-2 row-span-2 cursor-pointer`}
              style={{ perspective: "1200px" }}
              onClick={() => { setMalFlipped(f => !f); setMalHover(null); }}
            >
              <motion.div ref={malRef} custom={12} variants={fadeUp} initial="hidden" animate="show" className="w-full h-full">
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
                          { val: animMalAnimeCompleted, label: "completed" },
                          { val: animMalAnimeWatching,  label: "watching"  },
                          { val: animMalAnimeEpisodes,  label: "episodes", fmt: true },
                        ]
                      : [
                          { val: animMalMangaCompleted, label: "completed" },
                          { val: animMalMangaReading,   label: "reading"   },
                          { val: animMalMangaChapters,  label: "chapters",  fmt: true },
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
                              <p className="text-[26px] font-black leading-none tabular-nums text-[#111] dark:text-[#eee]">
                                {s.fmt ? s.val.toLocaleString() : s.val}
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
                                    <p className="text-[10px] font-bold text-[#111] dark:text-[#eee] leading-tight truncate">{hovered.title} <span className="text-[9px] font-normal text-[#bbb] dark:text-[#555]">({hovered.year})</span></p>
                                    <p className="text-[9px] text-[#777] dark:text-[#888] leading-snug mt-0.5 line-clamp-2">{hovered.synopsis}</p>
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

            {/* STEAM — 2×1 */}
            <BentoCard
              className="col-span-2 row-span-1 rounded-2xl overflow-hidden"
              style={{ backgroundColor: isDark ? "#1b2838" : "#ffffff", border: isDark ? "none" : "1px solid #ebebeb" }}
            >
              <motion.div custom={11} variants={fadeUp} initial="hidden" animate="show" className="p-3.5 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <p className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isDark ? "text-[#c7d5e0]/50" : "text-[#aaa]"}`}>
                    <SiSteam size={9} className={isDark ? "text-[#c7d5e0]/60" : "text-[#ccc]"} />Steam · {steam?.totalGames ?? 142} games
                  </p>
                  <span className={`text-[9px] ${isDark ? "text-[#c7d5e0]/30" : "text-[#ccc]"}`}>Recently played</span>
                </div>
                <div className="flex gap-2.5 flex-1 items-end mt-1.5 overflow-hidden">
                  {(steam?.recentGames ?? []).slice(0, 3).map((game, i) => (
                    <div key={game.appId} className="flex-1 min-w-0 flex flex-col gap-1 slide-up overflow-hidden" style={{ "--delay": `${i*0.07}s` } as React.CSSProperties}>
                      <div className={`w-full rounded-lg overflow-hidden relative ${isDark ? "bg-[#2a475e]" : "bg-[#f0f0f0]"}`} style={{ aspectRatio: "16/9" }}>
                        {game.imageUrl
                          ? <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                          : <div className={`w-full h-full flex items-center justify-center ${isDark ? "bg-[#2a475e]" : "bg-[#e8edf0]"}`}><SiSteam size={16} className={isDark ? "text-[#c7d5e0]/20" : "text-[#bbb]"} /></div>
                        }
                      </div>
                      <div className="overflow-hidden">
                        <p className={`text-[10px] font-semibold truncate ${isDark ? "text-[#c7d5e0]" : "text-[#333]"}`}>{game.name}</p>
                        <p className={`text-[9px] ${isDark ? "text-[#c7d5e0]/40" : "text-[#bbb]"}`}>{game.hoursPlayed}h</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </BentoCard>


          </div>
        </BentoSection>

        {/* ════ RIGHT SIDEBAR ════ */}
        <aside className="w-[210px] shrink-0 flex flex-col gap-2.5 h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>

          {/* Top Artists */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className={`${CARD} p-4`}>
            <p className={`${LABEL} mb-3`}>Top Artists</p>
            <div className="space-y-2.5">
              {(Array.isArray(topArtists) ? topArtists : []).slice(0, 4).map((artist, i) => (
                <a key={i} href={artist.url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 group slide-up" style={{ "--delay": `${i*0.07}s` } as React.CSSProperties}>
                  <span className="text-[10px] text-[#ccc] dark:text-[#444] w-3 shrink-0">{i + 1}</span>
                  <div className="w-6 h-6 rounded-full bg-[#f0f0f0] dark:bg-[#252525] overflow-hidden shrink-0">
                    {artist.imageUrl && <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />}
                  </div>
                  <span className="text-[12px] font-medium truncate flex-1 transition-colors" style={{ color: "inherit" }} onMouseEnter={e => (e.currentTarget.style.color = ACCENT)} onMouseLeave={e => (e.currentTarget.style.color = "")}>{artist.name}</span>
                  <span className="text-[10px] text-[#ccc] dark:text-[#444] shrink-0">{Number(artist.playcount).toLocaleString()}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Social Cards */}
          {[
            { icon: <FiTwitter size={13} />, label: "@yourhandle", sub: "twitter.com/yourhandle", color: "#1da1f2" },
            { icon: <SiDiscord size={13} />, label: discord?.displayName ?? "Your Name", sub: `${discord?.status ?? "dnd"} on Discord`, color: "#5865f2" },
            { icon: <SiGithub size={13} />, label: "youruser", sub: `${stats?.githubRepos ?? 42} public repos`, color: "#111" },
          ].map((s, i) => (
            <motion.a
              key={i}
              custom={4 + i}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              href="#"
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
