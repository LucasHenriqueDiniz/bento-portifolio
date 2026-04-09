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
import { Dumbbell } from "lucide-react";
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

const CARD  = "bg-white border border-[#ebebeb] rounded-2xl";
const LABEL = "text-[10px] font-semibold uppercase tracking-widest text-[#aaa]";

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

function PolaroidStack() {
  const [current, setCurrent] = useState(0);
  const n = POLAROID_PHOTOS.length;

  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % n), 3600);
    return () => clearInterval(id);
  }, [n]);

  return (
    <div className="w-full h-full flex flex-col" style={{ padding: 10, background: "white" }}>
      {/* photo area fills available space */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={POLAROID_PHOTOS[current]}
            alt={POLAROID_CAPTIONS[current]}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>
      {/* caption strip */}
      <div className="h-8 flex items-center justify-center shrink-0">
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            className="text-[11px] text-[#888] tracking-wide"
            style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
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
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all"
            style={{
              width: i === current ? 14 : 5,
              height: 5,
              backgroundColor: i === current ? "#bbb" : "#ddd",
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
          className="eq-bar inline-block w-[3px] bg-[#ef4444] rounded-sm"
          style={{ height: 12, "--dur": `${dur}s`, animationDelay: `${i * 0.12}s` } as React.CSSProperties}
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
    watching: 8,
    completed: 127,
    episodes: 3842,
    score: 7.8,
    favorites: ["Evangelion", "HxH", "Vinland Saga"],
  };

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
    <div className="h-screen flex flex-col bg-[#f5f5f5] text-[#111] font-sans overflow-hidden">

      {/* ── NAV ── */}
      <header className="shrink-0 z-50 h-11 flex items-center border-b border-[#ebebeb] bg-white/80 backdrop-blur px-4">
        <div className="flex w-full max-w-[1480px] mx-auto items-center justify-between">
          <span className="font-bold text-[13px] tracking-tight">yourname.sh</span>
          <nav className="flex gap-5 text-[13px] text-[#888]">
            <Link href="/" className="hover:text-[#111] transition-colors">Home</Link>
            <Link href="/projects" className="hover:text-[#111] transition-colors">Projects</Link>
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
              <div className="flex gap-2 text-[#ccc]">
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#1da1f2] transition-colors"><FiTwitter size={12} /></a>
                <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-[#5865f2] transition-colors"><SiDiscord size={12} /></a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#111] transition-colors"><SiGithub size={12} /></a>
              </div>
            </div>
            <div className="flex gap-3 items-center mb-3">
              <div className="w-11 h-11 rounded-xl bg-[#f0f0f0] overflow-hidden shrink-0">
                <img src="https://api.dicebear.com/8.x/notionists/svg?seed=portfolio123&backgroundColor=c0aede" alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[13px] font-semibold leading-tight">Hey, I'm <span className="text-[#ef4444]">You</span></p>
                <p className="text-[11px] text-[#aaa] mt-0.5">Developer & Designer</p>
              </div>
            </div>
            <p className="text-[12px] text-[#777] leading-relaxed">Building things on the web. Crafting digital experiences one pixel at a time.</p>
          </motion.div>

          {/* Fun Facts */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show" className={`${CARD} p-4`}>
            <p className={`${LABEL} mb-3`}>Fun Facts</p>
            <ul className="space-y-2">
              {["Full-stack developer","Gym rat (4x/week)","Last.fm scrobbler since 2018","Dark mode everything","127 anime completed"].map((f,i) => (
                <li key={i} className="flex gap-2 text-[12px] text-[#666] slide-up" style={{ "--delay": `${i*0.08}s` } as React.CSSProperties}>
                  <span className="text-[#ccc] mt-px">•</span>{f}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Photos */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show"
            className="rounded-2xl border border-[#ebebeb] flex-1 min-h-[200px] overflow-hidden">
            <PolaroidStack />
          </motion.div>

          {/* Contact */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className={`${CARD} p-4`}>
            <p className={`${LABEL} mb-2 flex items-center gap-1`}><FiMail size={9} />Contact</p>
            <p className="text-[12px] text-[#777] leading-relaxed">
              Hit me up on{" "}<a href="https://twitter.com" className="text-[#1da1f2] hover:underline">Twitter</a>{" "}or email{" "}
              <a href="mailto:you@example.com" className="text-[#ef4444] hover:underline">you@example.com</a>
            </p>
          </motion.div>
        </aside>

        {/* ════ CENTER BENTO ════ */}
        <BentoSection className="flex-1 min-w-0 h-full overflow-hidden">
          <div className="grid gap-2.5 h-full" style={{ gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "calc((100dvh - 124px) / 7)" }}>

            {/* STATUS */}
            <BentoCard className={`${CARD} p-4 flex flex-col justify-between col-span-1 row-span-1`}>
              <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col h-full justify-between">
                <p className={`${LABEL} flex items-center gap-1.5`}>
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block status-dot"
                    style={{ backgroundColor: statusColor, color: statusColor }}
                  />
                  Status
                </p>
                <div>
                  <p className="text-[28px] font-black tracking-tight leading-none" style={{ color: statusColor }}>
                    {(discord?.status ?? "DND").toUpperCase()}
                  </p>
                  {discord?.customStatus && (
                    <p className="text-[11px] text-[#aaa] mt-1 truncate">{discord.customStatus}</p>
                  )}
                </div>
              </motion.div>
            </BentoCard>

            {/* MAP — 2×2 */}
            <BentoCard className="col-span-2 row-span-2 rounded-2xl border border-[#ebebeb] overflow-hidden relative">
              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className="w-full h-full">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-43.35%2C-23.05%2C-43.05%2C-22.75&layer=mapnik"
                  className="w-full h-full grayscale opacity-80"
                  style={{ border: 0, pointerEvents: "none" }}
                  title="map"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="bg-white/90 backdrop-blur rounded-xl px-3 py-2 inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ef4444] status-dot" style={{ color: "#ef4444" }} />
                    <span className="text-[12px] font-semibold text-[#111]">Rio de Janeiro, Brazil</span>
                  </div>
                </div>
              </motion.div>
            </BentoCard>

            {/* ALBUM ART — 1×2 */}
            <BentoCard className="col-span-1 row-span-2 rounded-2xl border border-[#ebebeb] overflow-hidden relative">
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
                  <div className="w-full h-full bg-[#f0f0f0] flex items-center justify-center">
                    <SiLastdotfm size={28} className="text-[#ccc]" />
                  </div>
                )}
              </motion.div>
            </BentoCard>

            {/* WEATHER / CLOCK FLIP — 1×1 */}
            <BentoCard
              className="col-span-1 row-span-1 rounded-2xl border border-[#ebebeb] cursor-pointer overflow-hidden"
              style={{ perspective: "800px" }}
              onClick={() => setWeatherFlipped(f => !f)}
            >
              <div
                className="relative w-full h-full transition-transform duration-500"
                style={{ transformStyle: "preserve-3d", transform: weatherFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                {/* FRONT — Weather */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between bg-white rounded-2xl" style={{ backfaceVisibility: "hidden" }}>
                  <p className={`${LABEL} flex items-center gap-1`}>☁ Weather · <span className="normal-case text-[#ccc]">click to flip</span></p>
                  <div>
                    <p className="text-[28px] font-black tracking-tight leading-none">27°C</p>
                    <p className="text-[11px] text-[#aaa] mt-1">Sunny · Rio de Janeiro</p>
                  </div>
                </div>
                {/* BACK — Clock */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between bg-white rounded-2xl" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <p className={`${LABEL} flex items-center gap-1.5`}><FiClock size={9} />Rio de Janeiro</p>
                  <div>
                    <div className="flex items-end gap-0.5 font-black tabular-nums leading-none">
                      <span className="text-[26px] text-[#111]">{clock.h}</span>
                      <span className="text-[20px] text-[#ccc] mb-0.5">:</span>
                      <span className="text-[26px] text-[#111]">{clock.m}</span>
                      <span className="text-[20px] text-[#ccc] mb-0.5">:</span>
                      <span className="text-[20px] text-[#aaa] mb-0.5">{clock.s}</span>
                    </div>
                    <p className="text-[11px] text-[#aaa] mt-1">UTC−3 · BRT</p>
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* LAST WORKOUT — 1×2 */}
            <BentoCard
              className="col-span-1 row-span-2 rounded-2xl overflow-hidden flex flex-col"
              style={{ background: "linear-gradient(160deg, #181818 0%, #0f0f0f 100%)" }}
            >
              <div ref={workoutRef} className="p-3.5 h-full flex flex-col gap-2.5">
                <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col h-full gap-2.5">

                  {/* header */}
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                      <Dumbbell size={9} className="text-white/40" />Last Workout
                    </p>
                    <span className="text-[8px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded-full border border-white/8">
                      {workout?.type?.split("(")[0]?.trim() ?? "Push"}
                    </span>
                  </div>

                  {/* top stats row */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="bg-white/5 border border-white/5 rounded-xl p-2">
                      <p className="text-white font-black tabular-nums text-[18px] leading-none">
                        {workoutInView ? animVolume.toLocaleString() : "0"}
                        <span className="text-[9px] text-white/30 font-normal ml-0.5">kg</span>
                      </p>
                      <p className="text-[8px] text-white/25 uppercase tracking-wider mt-1">total volume</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl p-2">
                      <p className="text-white font-black tabular-nums text-[18px] leading-none">
                        {workout?.weeklyStats?.streak ?? 12}
                        <span className="text-[9px] text-white/30 font-normal ml-0.5">days</span>
                      </p>
                      <p className="text-[8px] text-white/25 uppercase tracking-wider mt-1">streak 🔥</p>
                    </div>
                  </div>

                  {/* sub stats */}
                  <div className="flex gap-3 px-0.5">
                    <span className="text-[10px] text-white/30">
                      <span className="text-white/60 font-semibold">{workoutInView ? animDuration : 0}</span> min
                    </span>
                    <span className="text-white/15">·</span>
                    <span className="text-[10px] text-white/30">
                      <span className="text-white/60 font-semibold">{workout?.weeklyStats?.workoutsThisWeek ?? 4}×</span> this week
                    </span>
                  </div>

                  {/* divider */}
                  <div className="border-t border-white/6" />

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
                        <p className="text-[10px] text-white/55 font-medium truncate flex-1">{ex.name}</p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[9px] text-white/25">{ex.sets}×{ex.reps}</span>
                          <span className="text-[9px] font-semibold text-white/45 bg-white/5 px-1.5 py-0.5 rounded-md">
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
                      <p className="font-black text-[#111] text-[16px] leading-none">{waka.today.h}h<span className="text-[12px]">{waka.today.m}m</span></p>
                      <p className="text-[9px] text-[#bbb] mt-0.5">today</p>
                    </div>
                    <div className="w-px bg-[#f0f0f0]" />
                    <div>
                      <p className="font-black text-[#111] text-[16px] leading-none">{waka.week.h}h<span className="text-[12px]">{waka.week.m}m</span></p>
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
                      <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
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
            <BentoCard className="col-span-1 row-span-2 rounded-2xl overflow-hidden" style={{ backgroundColor: "#23272a" }}>
              <motion.div custom={8} variants={fadeUp} initial="hidden" animate="show" className="p-3 h-full flex flex-col">
                {/* header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Discord</span>
                  <SiDiscord size={13} className="text-[#5865f2]" />
                </div>
                {/* avatar */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#36393f] ring-2 ring-white/10">
                      {discord?.avatarUrl
                        ? <img src={discord.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        : <SiDiscord size={20} className="m-auto mt-3 text-[#5865f2]/60" />
                      }
                    </div>
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#23272a] status-dot"
                      style={{ backgroundColor: statusColor, color: statusColor }}
                    />
                  </div>
                  <div className="text-center w-full min-w-0">
                    <p className="text-white font-bold text-[12px] truncate leading-tight">{discord?.displayName ?? "Your Name"}</p>
                    <p className="text-white/40 text-[10px] capitalize mt-0.5">{discord?.status ?? "dnd"}</p>
                  </div>
                </div>

                {/* divider */}
                <div className="border-t border-white/5 my-2.5" />

                {/* activity */}
                <div className="flex flex-col gap-2 flex-1 min-h-0">
                  <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 min-w-0">
                    <p className="text-white/30 text-[8px] uppercase tracking-widest mb-1">Playing</p>
                    <p className="text-white/80 text-[10px] font-semibold truncate">{discord?.activity ?? "VS Code"}</p>
                    {discord?.activityDetail && (
                      <p className="text-white/30 text-[9px] truncate mt-0.5">{discord.activityDetail}</p>
                    )}
                  </div>
                  {discord?.customStatus && (
                    <p className="text-white/25 text-[9px] text-center italic truncate px-1">"{discord.customStatus}"</p>
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
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#f8f8f8] border border-[#f0f0f0] hover:border-[#e0e0e0] hover:bg-white transition-all cursor-default slide-up"
                      style={{ "--delay": `${i * 0.04}s` } as React.CSSProperties}
                    >
                      <span className="text-[13px]" style={{ color: tech.color }}>{tech.icon}</span>
                      <span className="text-[11px] font-medium text-[#555]">{tech.label}</span>
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
                    <div className="flex gap-4 text-[11px] text-[#aaa]">
                      <span>
                        <strong className="text-[#111] tabular-nums text-[13px] font-black">{githubInView ? animCommits : 0}</strong>
                        <span className="ml-1">commits</span>
                      </span>
                      <span>
                        <strong className="text-[#30a14e] tabular-nums text-[13px] font-black">{githubInView ? animStreak : 0}</strong>
                        <span className="ml-1">day streak</span>
                      </span>
                      <span>
                        <strong className="text-[#111] tabular-nums text-[13px] font-black">{githubInView ? animRepos : 0}</strong>
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

            {/* MYANIME LIST — 2×2 */}
            <BentoCard className="col-span-2 row-span-2 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%)" }}>
              <motion.div custom={12} variants={fadeUp} initial="hidden" animate="show" className="p-4 h-full flex flex-col justify-between">
                {/* header */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">MyAnimeList</span>
                  <SiMyanimelist size={14} style={{ color: "#6699ff" }} />
                </div>
                {/* big stats */}
                <div className="flex gap-5">
                  <div>
                    <p className="text-white text-[32px] font-black leading-none tabular-nums">{malData.completed}</p>
                    <p className="text-white/40 text-[9px] mt-1 uppercase tracking-wider">completed</p>
                  </div>
                  <div className="border-l border-white/10 pl-5">
                    <p className="text-white/70 text-[32px] font-black leading-none tabular-nums">{malData.watching}</p>
                    <p className="text-white/40 text-[9px] mt-1 uppercase tracking-wider">watching</p>
                  </div>
                </div>
                {/* divider */}
                <div className="border-t border-white/8" />
                {/* favorites */}
                <div>
                  <p className="text-white/25 text-[8px] uppercase tracking-widest mb-2">Favorites</p>
                  <div className="flex flex-wrap gap-1.5">
                    {malData.favorites.map((f) => (
                      <span key={f} className="text-[10px] px-2 py-1 rounded-lg bg-white/8 text-white/60 border border-white/10">{f}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </BentoCard>

            {/* STEAM — 2×1 */}
            <BentoCard className="col-span-2 row-span-1 rounded-2xl overflow-hidden" style={{ backgroundColor: "#1b2838" }}>
              <motion.div custom={11} variants={fadeUp} initial="hidden" animate="show" className="p-3.5 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#c7d5e0]/50 flex items-center gap-1.5">
                    <SiSteam size={9} className="text-[#c7d5e0]/60" />Steam · {steam?.totalGames ?? 142} games
                  </p>
                  <span className="text-[9px] text-[#c7d5e0]/30">Recently played</span>
                </div>
                <div className="flex gap-2.5 flex-1 items-end mt-1.5 overflow-hidden">
                  {(steam?.recentGames ?? []).slice(0, 3).map((game, i) => (
                    <div key={game.appId} className="flex-1 min-w-0 flex flex-col gap-1 slide-up overflow-hidden" style={{ "--delay": `${i*0.07}s` } as React.CSSProperties}>
                      <div className="w-full rounded-lg overflow-hidden bg-[#2a475e]" style={{ aspectRatio: "16/9" }}>
                        {game.imageUrl && <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-semibold truncate text-[#c7d5e0]">{game.name}</p>
                        <p className="text-[9px] text-[#c7d5e0]/40">{game.hoursPlayed}h</p>
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
                  <span className="text-[10px] text-[#ccc] w-3 shrink-0">{i + 1}</span>
                  <div className="w-6 h-6 rounded-full bg-[#f0f0f0] overflow-hidden shrink-0">
                    {artist.imageUrl && <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />}
                  </div>
                  <span className="text-[12px] font-medium truncate flex-1 group-hover:text-[#ef4444] transition-colors">{artist.name}</span>
                  <span className="text-[10px] text-[#ccc] shrink-0">{Number(artist.playcount).toLocaleString()}</span>
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
              className={`${CARD} p-3 flex items-center gap-3 hover:border-[#d5d5d5] transition-colors group`}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#f5f5f5] shrink-0" style={{ color: s.color }}>
                {s.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold truncate">{s.label}</p>
                <p className="text-[10px] text-[#aaa] truncate">{s.sub}</p>
              </div>
              <FiExternalLink size={11} className="text-[#ddd] group-hover:text-[#aaa] transition-colors shrink-0" />
            </motion.a>
          ))}

        </aside>
      </div>
      </div>
    </div>
  );
}
