import {
  useGetDiscordPresence,
  useGetNowPlaying,
  useGetTopArtists,
  useGetSteamData,
  useGetLastWorkout,
  useGetStats,
} from "@workspace/api-client-react";
import { motion, useInView, animate } from "framer-motion";
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

/* ─── Fitness rings ────────────────────────────────── */
function ActivityRings({ move = 75, exercise = 55, stand = 80, inView }: {
  move?: number; exercise?: number; stand?: number; inView: boolean;
}) {
  const ring = (r: number, color: string, pct: number, delay: number) => {
    const circ = 2 * Math.PI * r;
    const target = circ * (1 - pct / 100);
    return (
      <>
        <circle cx={60} cy={60} r={r} fill="none" stroke="#f0f0f0" strokeWidth={9} />
        <circle
          cx={60} cy={60} r={r} fill="none" stroke={color} strokeWidth={9}
          strokeDasharray={circ}
          strokeDashoffset={inView ? undefined : circ}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          className={inView ? "ring-animate" : ""}
          style={{
            "--ring-circ": circ,
            "--ring-target": target,
            "--ring-delay": `${delay}s`,
            strokeDashoffset: inView ? target : circ,
          } as React.CSSProperties}
        />
      </>
    );
  };
  return (
    <svg viewBox="0 0 120 120" className="w-[88px] h-[88px]">
      {ring(52, "#ff3b30", move, 0)}
      {ring(38, "#30d158", exercise, 0.2)}
      {ring(24, "#0a84ff", stand, 0.4)}
    </svg>
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
  const githubRef   = useRef<HTMLDivElement>(null);
  const fitnessRef  = useRef<HTMLDivElement>(null);
  const workoutRef  = useRef<HTMLDivElement>(null);
  const langsRef    = useRef<HTMLDivElement>(null);

  const githubInView  = useInView(githubRef,  { once: true, margin: "-50px" });
  const fitnessInView = useInView(fitnessRef, { once: true, margin: "-50px" });
  const workoutInView = useInView(workoutRef, { once: true, margin: "-50px" });
  const langsInView   = useInView(langsRef,   { once: true, margin: "-50px" });

  /* Animated counters */
  const animDuration  = useCounter(workout?.duration    ?? 68,   workoutInView);
  const animVolume    = useCounter(workout?.totalVolume  ?? 8420, workoutInView, 1.4);
  const animExercises = useCounter(workout?.exercises?.length ?? 5, workoutInView, 0.8);
  const animCommits   = useCounter(stats?.totalCommitsThisYear ?? 847, githubInView);
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
    <div className="min-h-screen bg-[#f5f5f5] text-[#111] font-sans">

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 h-11 flex items-center border-b border-[#ebebeb] bg-white/80 backdrop-blur px-4">
        <div className="flex w-full max-w-[1480px] mx-auto items-center justify-between">
          <span className="font-bold text-[13px] tracking-tight">yourname.sh</span>
          <nav className="flex gap-5 text-[13px] text-[#888]">
            <Link href="/" className="hover:text-[#111] transition-colors">Home</Link>
            <Link href="/projects" className="hover:text-[#111] transition-colors">Projects</Link>
          </nav>
        </div>
      </header>

      {/* ── 3-COLUMN ── */}
      <div className="max-w-[1480px] mx-auto flex gap-2.5 p-2.5 items-start">

        {/* ════ LEFT SIDEBAR ════ */}
        <aside className="w-[220px] shrink-0 flex flex-col gap-2.5">

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

          {/* Photo */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show"
            className="rounded-2xl overflow-hidden border border-[#ebebeb] relative" style={{ aspectRatio: "3/4" }}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=350&auto=format&fit=crop&q=80" alt="photo" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
              <p className="text-white text-[10px] font-semibold uppercase tracking-wider">Photos</p>
            </div>
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
        <BentoSection className="flex-1 min-w-0">
          <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "112px" }}>

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

            {/* FITNESS RINGS — 1×2 */}
            <BentoCard className={`${CARD} p-4 flex flex-col col-span-1 row-span-2`}>
              <div ref={fitnessRef} className="flex flex-col h-full">
                <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col h-full">
                  <p className={`${LABEL} mb-3 flex items-center gap-1`}><Dumbbell size={9} />Fitness</p>
                  <div className="flex-1 flex items-center justify-center">
                    <ActivityRings
                      inView={fitnessInView}
                      move={workout ? Math.min((workout.weeklyStats.workoutsThisWeek / 5) * 100, 100) : 75}
                      exercise={workout ? Math.min((workout.duration / 90) * 100, 100) : 55}
                      stand={workout ? Math.min((workout.weeklyStats.streak / 7) * 100, 100) : 80}
                    />
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { color: "#ff3b30", label: `${workout?.weeklyStats.workoutsThisWeek ?? 4}x this week`, },
                      { color: "#30d158", label: `${workout?.duration ?? 68} min avg`, },
                      { color: "#0a84ff", label: `${workout?.weeklyStats.streak ?? 12} day streak`, },
                    ].map((r, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-[#777]">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }} />{r.label}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </BentoCard>

            {/* LAST WORKOUT — 2×1 */}
            <BentoCard className={`${CARD} p-4 flex flex-col justify-between col-span-2 row-span-1`}>
              <div ref={workoutRef} className="flex flex-col h-full justify-between">
                <motion.div custom={7} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col h-full justify-between">
                  <p className={LABEL}>Last Workout</p>
                  <div>
                    <p className="text-[12px] font-semibold text-[#555] truncate mb-2">{workout?.type ?? "Push (Chest / Shoulders / Triceps)"}</p>
                    <div className="flex gap-6">
                      <div>
                        <span className="text-[22px] font-black tabular-nums">{workoutInView ? animDuration : 0}</span>
                        <span className="text-[11px] text-[#aaa] ml-1">min</span>
                      </div>
                      <div>
                        <span className="text-[22px] font-black tabular-nums">{workoutInView ? animVolume.toLocaleString() : "0"}</span>
                        <span className="text-[11px] text-[#aaa] ml-1">kg</span>
                      </div>
                      <div>
                        <span className="text-[22px] font-black tabular-nums">{workoutInView ? animExercises : 0}</span>
                        <span className="text-[11px] text-[#aaa] ml-1">exercises</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </BentoCard>

            {/* DISCORD — improved with avatar ── 1×1 */}
            <BentoCard className="col-span-1 row-span-1 rounded-2xl border border-[#7289da]/30 overflow-hidden" style={{ backgroundColor: "#5865f2" }}>
              <motion.div custom={8} variants={fadeUp} initial="hidden" animate="show" className="p-4 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#4752c4]">
                      {discord?.avatarUrl
                        ? <img src={discord.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        : <SiDiscord size={16} className="m-auto mt-2 text-white/60" />
                      }
                    </div>
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#5865f2] status-dot"
                      style={{ backgroundColor: statusColor, color: statusColor }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-[12px] truncate leading-tight">{discord?.displayName ?? "Your Name"}</p>
                    <p className="text-white/50 text-[10px] capitalize truncate">{discord?.status ?? "dnd"}</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <p className="text-white/50 text-[9px] uppercase tracking-wider mb-0.5">Playing</p>
                  <p className="text-white font-semibold text-[12px] leading-tight truncate">{discord?.activity ?? "VS Code"}</p>
                  {discord?.activityDetail && (
                    <p className="text-white/40 text-[10px] truncate">{discord.activityDetail}</p>
                  )}
                </div>
              </motion.div>
            </BentoCard>

            {/* WAKATIME — 2×1 (fills gap below Last Workout) */}
            <BentoCard className={`${CARD} p-4 col-span-2 row-span-1 flex flex-col justify-between`}>
              <motion.div custom={9} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                  <p className={`${LABEL} flex items-center gap-1.5`}><SiWakatime size={9} />Wakatime</p>
                  <div className="flex gap-3 text-[11px] text-[#888]">
                    <span><strong className="text-[#111] font-bold">{waka.today.h}h {waka.today.m}m</strong> today</span>
                    <span><strong className="text-[#111] font-bold">{waka.week.h}h {waka.week.m}m</strong> this week</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {waka.langs.map((l, i) => (
                    <div key={l.name} className="flex items-center gap-2">
                      <span className="text-[10px] text-[#888] w-[72px] shrink-0 truncate">{l.name}</span>
                      <div className="flex-1 h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${l.pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                          style={{ backgroundColor: l.color }}
                          className="h-full rounded-full"
                        />
                      </div>
                      <span className="text-[10px] text-[#aaa] w-6 text-right shrink-0">{l.pct}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </BentoCard>

            {/* CURRENTLY READING — 1×1 (fills gap below Last Workout) */}
            <BentoCard className={`${CARD} p-4 col-span-1 row-span-1 flex flex-col justify-between overflow-hidden`}>
              <motion.div custom={10} variants={fadeUp} initial="hidden" animate="show" className="flex gap-3 h-full">
                <div className="w-10 shrink-0 rounded-md overflow-hidden shadow-sm self-start">
                  <img src={reading.cover} alt={reading.title} className="w-full h-auto object-cover" />
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <p className={`${LABEL} mb-1 flex items-center gap-1`}><FiBook size={9} />Reading</p>
                    <p className="text-[12px] font-bold leading-tight text-[#111] line-clamp-2">{reading.title}</p>
                  </div>
                  <div>
                    <div className="h-1 w-full bg-[#f0f0f0] rounded-full overflow-hidden mb-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round((reading.page / reading.total) * 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                        className="h-full bg-[#f97316] rounded-full"
                      />
                    </div>
                    <p className="text-[10px] text-[#aaa]">p. {reading.page} / {reading.total}</p>
                  </div>
                </div>
              </motion.div>
            </BentoCard>

            {/* TECH STACK — 4×1 */}
            <BentoCard className={`${CARD} p-4 col-span-4 row-span-1 flex flex-col justify-between`}>
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

            {/* GITHUB — 4×1 */}
            <BentoCard className={`${CARD} p-4 col-span-4 row-span-1 flex flex-col justify-between`}>
              <div ref={githubRef} className="flex flex-col h-full justify-between">
                <motion.div custom={10} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col h-full justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <p className={`${LABEL} flex items-center gap-1.5`}><SiGithub size={10} />GitHub</p>
                    <div className="flex gap-5 text-[11px] text-[#aaa]">
                      <span><strong className="text-[#111] tabular-nums">{githubInView ? animCommits : 0}</strong> commits this year</span>
                      <span><strong className="text-[#30a14e] tabular-nums">{githubInView ? animStreak : 0}</strong> day streak</span>
                      <span><strong className="text-[#111] tabular-nums">{githubInView ? animRepos : 0}</strong> repos</span>
                    </div>
                  </div>
                  <div className="overflow-hidden">
                    <GitHubGrid seed={stats?.totalCommitsThisYear ?? 847} inView={githubInView} />
                  </div>
                </motion.div>
              </div>
            </BentoCard>

            {/* STEAM — 2×1 */}
            <BentoCard className={`${CARD} p-4 col-span-2 row-span-1 flex flex-col justify-between`}>
              <motion.div custom={11} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col h-full justify-between">
                <p className={`${LABEL} flex items-center gap-1.5`}><SiSteam size={10} />Steam · {steam?.totalGames ?? 142} games</p>
                <div className="flex gap-3 mt-1">
                  {steam?.recentGames?.slice(0, 3).map((game, i) => (
                    <div key={game.appId} className="flex-1 min-w-0 flex flex-col gap-1 slide-up" style={{ "--delay": `${i*0.1}s` } as React.CSSProperties}>
                      <div className="w-full rounded-lg overflow-hidden bg-[#f0f0f0]" style={{ aspectRatio: "16/9" }}>
                        {game.imageUrl && <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover" />}
                      </div>
                      <p className="text-[11px] font-medium truncate text-[#555]">{game.name}</p>
                      <p className="text-[10px] text-[#aaa]">{game.hoursPlayed}h</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </BentoCard>

            {/* MYANIME LIST — 1×1 */}
            <BentoCard className="col-span-1 row-span-1 rounded-2xl overflow-hidden border border-[#ebebeb] p-4 flex flex-col justify-between" style={{ backgroundColor: "#2e51a2" }}>
              <motion.div custom={12} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col h-full justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60 flex items-center gap-1.5">
                  <SiMyanimelist size={10} />MyAnimeList
                </p>
                <div>
                  <div className="flex gap-4 mb-1">
                    <div>
                      <p className="text-white text-[20px] font-black leading-none">{malData.completed}</p>
                      <p className="text-white/50 text-[9px]">completed</p>
                    </div>
                    <div>
                      <p className="text-white text-[20px] font-black leading-none">{malData.watching}</p>
                      <p className="text-white/50 text-[9px]">watching</p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {malData.favorites.map((f) => (
                      <span key={f} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/15 text-white/70">{f}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </BentoCard>

            {/* LANGUAGES — 1×1 */}
            <BentoCard className={`${CARD} p-4 col-span-1 row-span-1 flex flex-col justify-between`}>
              <div ref={langsRef} className="flex flex-col h-full justify-between">
                <motion.div custom={13} variants={fadeUp} initial="hidden" animate="show" className="flex flex-col h-full justify-between">
                  <p className={LABEL}>Top Languages</p>
                  <div>
                    <div className="h-2.5 w-full rounded-full overflow-hidden flex mb-2.5">
                      {stats?.topLanguages?.map((l) => (
                        <motion.div
                          key={l.name}
                          initial={{ width: 0 }}
                          animate={langsInView ? { width: `${l.percentage}%` } : { width: 0 }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                          style={{ backgroundColor: l.color }}
                          className="h-full"
                        />
                      ))}
                    </div>
                    <div className="flex flex-col gap-1">
                      {stats?.topLanguages?.slice(0, 3).map((l) => (
                        <div key={l.name} className="flex items-center gap-1.5 text-[10px] text-[#666]">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                          <span className="font-medium">{l.name}</span>
                          <span className="text-[#aaa] ml-auto">{l.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </BentoCard>

          </div>
        </BentoSection>

        {/* ════ RIGHT SIDEBAR ════ */}
        <aside className="w-[210px] shrink-0 flex flex-col gap-2.5">

          {/* Top Artists */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className={`${CARD} p-4`}>
            <p className={`${LABEL} mb-3`}>Top Artists</p>
            <div className="space-y-2.5">
              {topArtists?.slice(0, 4).map((artist, i) => (
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
  );
}
