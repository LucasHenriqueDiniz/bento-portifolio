import {
  useGetDiscordPresence,
  useGetNowPlaying,
  useGetTopArtists,
  useGetSteamData,
  useGetLastWorkout,
  useGetStats,
} from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { SiGithub, SiDiscord, SiLastdotfm, SiSteam } from "react-icons/si";
import { FiTwitter, FiMail, FiExternalLink } from "react-icons/fi";
import { Dumbbell } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.045, duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const STATUS_COLORS: Record<string, string> = {
  online: "#22c55e",
  idle: "#eab308",
  dnd: "#ef4444",
  offline: "#9ca3af",
};

function EqBar({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      animate={{ scaleY: [0.35, 1, 0.35] }}
      transition={{ repeat: Infinity, duration: 0.75, delay, ease: "easeInOut" }}
      style={{ height: 11 }}
      className="inline-block w-[3px] bg-[#ef4444] rounded-sm origin-bottom"
    />
  );
}

function GitHubGrid({ seed }: { seed: number }) {
  const WEEKS = 26;
  const DAYS = 7;
  const cells = Array.from({ length: WEEKS * DAYS }, (_, i) => {
    const v = Math.abs(Math.sin(i * 9.1 + seed * 0.3) * 4) | 0;
    const prob = Math.abs(Math.cos(i * 3.7)) > 0.5 ? v : 0;
    return Math.min(prob, 4);
  });
  const shades = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
  return (
    <div className="flex gap-[3px]" style={{ lineHeight: 0 }}>
      {Array.from({ length: WEEKS }).map((_, w) => (
        <div key={w} className="flex flex-col gap-[3px]">
          {Array.from({ length: DAYS }).map((_, d) => (
            <div
              key={d}
              className="w-[10px] h-[10px] rounded-[2px]"
              style={{ backgroundColor: shades[cells[w * DAYS + d]] }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function ActivityRings({ move = 75, exercise = 55, stand = 80 }: { move?: number; exercise?: number; stand?: number }) {
  const ring = (r: number, color: string, pct: number) => {
    const c = 2 * Math.PI * r;
    return (
      <>
        <circle cx={60} cy={60} r={r} fill="none" stroke="#f0f0f0" strokeWidth={9} />
        <circle
          cx={60} cy={60} r={r} fill="none" stroke={color} strokeWidth={9}
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)}
          strokeLinecap="round" transform="rotate(-90 60 60)"
        />
      </>
    );
  };
  return (
    <svg viewBox="0 0 120 120" className="w-[88px] h-[88px]">
      {ring(52, "#ff3b30", move)}
      {ring(38, "#30d158", exercise)}
      {ring(24, "#0a84ff", stand)}
    </svg>
  );
}

const CARD = "bg-white border border-[#ebebeb] rounded-2xl";
const LABEL = "text-[10px] font-semibold uppercase tracking-widest text-[#aaa]";

export default function Home() {
  const { data: discord } = useGetDiscordPresence();
  const { data: nowPlaying } = useGetNowPlaying();
  const { data: topArtists } = useGetTopArtists();
  const { data: steam } = useGetSteamData();
  const { data: workout } = useGetLastWorkout();
  const { data: stats } = useGetStats();

  const statusColor = STATUS_COLORS[discord?.status ?? "dnd"];

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#111] font-sans">

      {/* ── TOP NAV ── */}
      <header
        data-testid="header"
        className="sticky top-0 z-50 h-11 flex items-center border-b border-[#ebebeb] bg-white/80 backdrop-blur px-4"
      >
        <div className="flex w-full max-w-[1480px] mx-auto items-center justify-between">
          <span className="font-bold text-[13px] tracking-tight text-[#111]">yourname.sh</span>
          <nav className="flex gap-5 text-[13px] text-[#888]">
            <Link href="/" data-testid="nav-home" className="hover:text-[#111] transition-colors">Home</Link>
            <Link href="/projects" data-testid="nav-projects" className="hover:text-[#111] transition-colors">Projects</Link>
          </nav>
        </div>
      </header>

      {/* ── 3-COLUMN LAYOUT ── */}
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
                <img
                  src="https://api.dicebear.com/8.x/notionists/svg?seed=portfolio123&backgroundColor=c0aede"
                  alt="avatar" className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[13px] font-semibold leading-tight">
                  Hey, I'm <span className="text-[#ef4444]">You</span>
                </p>
                <p className="text-[11px] text-[#aaa] mt-0.5">Developer & Designer</p>
              </div>
            </div>
            <p className="text-[12px] text-[#777] leading-relaxed">
              Building things on the web. Crafting digital experiences one pixel at a time.
            </p>
          </motion.div>

          {/* Fun Facts */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show" className={`${CARD} p-4`}>
            <p className={`${LABEL} mb-3`}>Fun Facts</p>
            <ul className="space-y-2">
              {[
                "Full-stack developer",
                "Gym rat (4x/week)",
                "Last.fm scrobbler since 2018",
                "Dark mode everything",
                "1000+ hrs in games",
              ].map((f, i) => (
                <li key={i} className="flex gap-2 text-[12px] text-[#666]">
                  <span className="text-[#ccc] mt-px">•</span>{f}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Photo */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show"
            className="rounded-2xl overflow-hidden border border-[#ebebeb] relative"
            style={{ aspectRatio: "3/4" }}>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=350&auto=format&fit=crop&q=80"
              alt="photo" className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
              <p className="text-white text-[10px] font-semibold uppercase tracking-wider">Photos</p>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className={`${CARD} p-4`}>
            <p className={`${LABEL} mb-2 flex items-center gap-1`}><FiMail size={9} />Contact</p>
            <p className="text-[12px] text-[#777] leading-relaxed">
              Hit me up on{" "}
              <a href="https://twitter.com" className="text-[#1da1f2] hover:underline">Twitter</a>
              {" "}or email{" "}
              <a href="mailto:you@example.com" className="text-[#ef4444] hover:underline">you@example.com</a>
            </p>
          </motion.div>
        </aside>

        {/* ════ CENTER BENTO GRID ════ */}
        <main className="flex-1 min-w-0">
          <div
            className="grid gap-2.5"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              gridAutoRows: "136px",
            }}
          >

            {/* STATUS */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show"
              data-testid="card-status"
              className={`${CARD} p-4 flex flex-col justify-between col-span-1 row-span-1`}>
              <p className={`${LABEL} flex items-center gap-1.5`}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: statusColor }} />
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

            {/* MAP — 2×2 */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show"
              data-testid="card-location"
              className="col-span-2 row-span-2 rounded-2xl border border-[#ebebeb] overflow-hidden relative">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-43.35%2C-23.05%2C-43.05%2C-22.75&layer=mapnik"
                className="w-full h-full grayscale opacity-80"
                style={{ border: 0, pointerEvents: "none" }}
                title="map"
              />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="bg-white/90 backdrop-blur rounded-xl px-3 py-2 inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
                  <span className="text-[12px] font-semibold text-[#111]">Rio de Janeiro, Brazil</span>
                </div>
              </div>
            </motion.div>

            {/* ALBUM ART / PHOTO — 1×2 */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show"
              className="col-span-1 row-span-2 rounded-2xl border border-[#ebebeb] overflow-hidden relative">
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

            {/* WEATHER — 1×1 */}
            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show"
              data-testid="card-weather"
              className={`${CARD} p-4 flex flex-col justify-between col-span-1 row-span-1`}>
              <p className={`${LABEL} flex items-center gap-1`}>☁ Weather</p>
              <div>
                <p className="text-[28px] font-black tracking-tight leading-none">27°C</p>
                <p className="text-[11px] text-[#aaa] mt-1">Sunny · Rio de Janeiro</p>
              </div>
            </motion.div>

            {/* FITNESS RINGS — 1×2 */}
            <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show"
              data-testid="card-fitness"
              className={`${CARD} p-4 flex flex-col col-span-1 row-span-2`}>
              <p className={`${LABEL} mb-3 flex items-center gap-1`}><Dumbbell size={9} />Fitness</p>
              <div className="flex-1 flex items-center justify-center">
                <ActivityRings
                  move={workout ? Math.min((workout.weeklyStats.workoutsThisWeek / 5) * 100, 100) : 75}
                  exercise={workout ? Math.min((workout.duration / 90) * 100, 100) : 55}
                  stand={workout ? Math.min((workout.weeklyStats.streak / 7) * 100, 100) : 80}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[11px] text-[#777]">
                  <span className="w-2 h-2 rounded-full bg-[#ff3b30]" />
                  {workout?.weeklyStats.workoutsThisWeek ?? 4}x this week
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#777]">
                  <span className="w-2 h-2 rounded-full bg-[#30d158]" />
                  {workout?.duration ?? 68} min last session
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#777]">
                  <span className="w-2 h-2 rounded-full bg-[#0a84ff]" />
                  {workout?.weeklyStats.streak ?? 12} day streak
                </div>
              </div>
            </motion.div>

            {/* LAST WORKOUT — 2×1 */}
            <motion.div custom={7} variants={fadeUp} initial="hidden" animate="show"
              data-testid="card-workout"
              className={`${CARD} p-4 flex flex-col justify-between col-span-2 row-span-1`}>
              <p className={LABEL}>Last Workout</p>
              <div>
                <p className="text-[12px] font-semibold text-[#555] truncate mb-2">
                  {workout?.type ?? "Push (Chest / Shoulders / Triceps)"}
                </p>
                <div className="flex gap-6">
                  <div>
                    <span className="text-[22px] font-black">{workout?.duration ?? 68}</span>
                    <span className="text-[11px] text-[#aaa] ml-1">min</span>
                  </div>
                  <div>
                    <span className="text-[22px] font-black">{(workout?.totalVolume ?? 8420).toLocaleString()}</span>
                    <span className="text-[11px] text-[#aaa] ml-1">kg</span>
                  </div>
                  <div>
                    <span className="text-[22px] font-black">{workout?.exercises?.length ?? 5}</span>
                    <span className="text-[11px] text-[#aaa] ml-1">exercises</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* DISCORD — 1×1 */}
            <motion.div custom={8} variants={fadeUp} initial="hidden" animate="show"
              data-testid="card-discord"
              className="col-span-1 row-span-1 rounded-2xl border border-[#7289da]/30 bg-[#5865f2] p-4 flex flex-col justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60 flex items-center gap-1.5">
                <SiDiscord size={10} />Discord
              </p>
              <div>
                <p className="text-white font-bold text-[13px] leading-tight truncate">
                  {discord?.activity ?? "Visual Studio Code"}
                </p>
                {discord?.activityDetail && (
                  <p className="text-white/50 text-[11px] truncate mt-0.5">{discord.activityDetail}</p>
                )}
              </div>
            </motion.div>

            {/* WHAT I USE — full width 1×1 */}
            <motion.div custom={9} variants={fadeUp} initial="hidden" animate="show"
              data-testid="card-tools"
              className={`${CARD} p-4 col-span-4 row-span-1 flex flex-col justify-between`}>
              <p className={`${LABEL} mb-2`}>What I Use</p>
              <div className="grid grid-cols-2 gap-x-8">
                <div>
                  <p className="text-[10px] font-semibold text-[#aaa] mb-1.5">Hardware</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {["MacBook Pro M3 Max", "iPhone 15 Pro Max", "Dell 27\" 4K", "AirPods Pro 2"].map((item) => (
                      <p key={item} className="text-[12px] text-[#555] flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#ddd]" />{item}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-[#aaa] mb-1.5">Software</p>
                  <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                    {["VS Code", "Figma", "Warp", "Raycast", "Arc Browser", "Linear"].map((item) => (
                      <p key={item} className="text-[12px] text-[#555] flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#ddd]" />{item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* GITHUB — full width 1×1 */}
            <motion.div custom={10} variants={fadeUp} initial="hidden" animate="show"
              data-testid="card-github"
              className={`${CARD} p-4 col-span-4 row-span-1 flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`${LABEL} flex items-center gap-1.5`}><SiGithub size={10} />GitHub</p>
                <div className="flex gap-5 text-[11px] text-[#aaa]">
                  <span><strong className="text-[#111]">{stats?.totalCommitsThisYear ?? 847}</strong> commits this year</span>
                  <span><strong className="text-[#30a14e]">{stats?.currentStreak ?? 12}</strong> day streak</span>
                  <span><strong className="text-[#111]">{stats?.githubRepos ?? 42}</strong> repos</span>
                </div>
              </div>
              <div className="overflow-hidden">
                <GitHubGrid seed={stats?.totalCommitsThisYear ?? 847} />
              </div>
            </motion.div>

            {/* STEAM — 2×1 */}
            <motion.div custom={11} variants={fadeUp} initial="hidden" animate="show"
              data-testid="card-steam"
              className={`${CARD} p-4 col-span-2 row-span-1 flex flex-col justify-between`}>
              <p className={`${LABEL} flex items-center gap-1.5`}>
                <SiSteam size={10} />Steam · {steam?.totalGames ?? 142} games
              </p>
              <div className="flex gap-3 mt-1">
                {steam?.recentGames?.slice(0, 3).map((game) => (
                  <div key={game.appId} className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="w-full rounded-lg overflow-hidden bg-[#f0f0f0]" style={{ aspectRatio: "16/9" }}>
                      {game.imageUrl && (
                        <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <p className="text-[11px] font-medium truncate text-[#555]">{game.name}</p>
                    <p className="text-[10px] text-[#aaa]">{game.hoursPlayed}h</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* LANGUAGES — 2×1 */}
            <motion.div custom={12} variants={fadeUp} initial="hidden" animate="show"
              data-testid="card-languages"
              className={`${CARD} p-4 col-span-2 row-span-1 flex flex-col justify-between`}>
              <p className={LABEL}>Top Languages</p>
              <div>
                <div className="h-2.5 w-full rounded-full overflow-hidden flex mb-2.5">
                  {stats?.topLanguages?.map((l) => (
                    <div key={l.name} style={{ width: `${l.percentage}%`, backgroundColor: l.color }} className="h-full" />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {stats?.topLanguages?.map((l) => (
                    <div key={l.name} className="flex items-center gap-1.5 text-[11px] text-[#666]">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                      <span className="font-medium">{l.name}</span>
                      <span className="text-[#aaa]">{l.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </main>

        {/* ════ RIGHT SIDEBAR ════ */}
        <aside className="w-[210px] shrink-0 flex flex-col gap-2.5">

          {/* Currently Listening */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show"
            data-testid="card-listening"
            className={`${CARD} p-4`}>
            <p className={`${LABEL} mb-3 flex items-center gap-1.5`}>
              <SiLastdotfm size={10} className="text-[#ef4444]" />Currently Listening
            </p>
            {nowPlaying?.albumArt && (
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-3">
                <img src={nowPlaying.albumArt} alt="album" className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                {nowPlaying?.isPlaying && (
                  <span className="flex items-end gap-[2px]" style={{ height: 12 }}>
                    <EqBar delay={0} />
                    <EqBar delay={0.15} />
                    <EqBar delay={0.3} />
                    <EqBar delay={0.1} />
                  </span>
                )}
                <p className="font-bold text-[13px] truncate leading-tight">{nowPlaying?.track ?? "Not playing"}</p>
              </div>
              <p className="text-[11px] text-[#aaa] truncate">{nowPlaying?.artist ?? "—"}</p>
            </div>
          </motion.div>

          {/* Top Artists */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show"
            className={`${CARD} p-4`}>
            <p className={`${LABEL} mb-3`}>Top Artists</p>
            <div className="space-y-2.5">
              {topArtists?.slice(0, 4).map((artist, i) => (
                <a key={i} href={artist.url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 group">
                  <span className="text-[10px] text-[#ccc] w-3 shrink-0">{i + 1}</span>
                  <div className="w-6 h-6 rounded-full bg-[#f0f0f0] overflow-hidden shrink-0">
                    {artist.imageUrl && <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />}
                  </div>
                  <span className="text-[12px] font-medium truncate flex-1 group-hover:text-[#ef4444] transition-colors">
                    {artist.name}
                  </span>
                  <span className="text-[10px] text-[#ccc] shrink-0">
                    {Number(artist.playcount).toLocaleString()}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Social Cards */}
          {[
            {
              icon: <FiTwitter size={13} />,
              label: "@yourhandle",
              sub: "twitter.com/yourhandle",
              color: "#1da1f2",
              testId: "card-twitter",
            },
            {
              icon: <SiDiscord size={13} />,
              label: discord?.displayName ?? "Your Name",
              sub: "discord.gg/yourserver",
              color: "#5865f2",
              testId: "card-discord-social",
            },
            {
              icon: <SiGithub size={13} />,
              label: "youruser",
              sub: `${stats?.githubRepos ?? 42} public repos`,
              color: "#111",
              testId: "card-github-social",
            },
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
              data-testid={s.testId}
              className={`${CARD} p-3 flex items-center gap-3 hover:border-[#d5d5d5] transition-colors group`}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#f5f5f5] shrink-0"
                style={{ color: s.color }}
              >
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
