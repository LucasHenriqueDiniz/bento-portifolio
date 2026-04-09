import { Router, type IRouter } from "express";
import {
  GetNowPlayingResponse,
  GetTopArtistsResponse,
  GetDiscordPresenceResponse,
  GetSteamDataResponse,
  GetLastWorkoutResponse,
  GetProjectsResponse,
  GetStatsResponse,
  GetMalDataResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

/* ── env vars ─────────────────────────────────────────── */
const LASTFM_KEY      = process.env.LASTFM_API_KEY ?? "";
const LASTFM_USER     = process.env.LASTFM_USERNAME ?? "Amayacrab";
const DISCORD_ID      = process.env.DISCORD_ID ?? "";
const STEAM_KEY       = process.env.STEAM_API_KEY ?? "";
const STEAM_ID        = process.env.STEAM_ID ?? "";
const LYFTA_KEY       = process.env.LYFTA_API_KEY ?? "";
const GITHUB_USER     = process.env.GITHUB_USERNAME ?? "LucasHenriqueDiniz";
const GITHUB_PAT      = process.env.GITHUB_PAT ?? "";

/* ── simple in-memory cache ───────────────────────────── */
type CacheEntry = { data: unknown; expires: number };
const cache = new Map<string, CacheEntry>();

function fromCache<T>(key: string): T | null {
  const e = cache.get(key);
  return e && e.expires > Date.now() ? (e.data as T) : null;
}
function toCache(key: string, data: unknown, ttlMs: number) {
  cache.set(key, { data, expires: Date.now() + ttlMs });
}

/* ── language colour map ──────────────────────────────── */
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#DEA584",
  C: "#555555",
  "C++": "#F34B7D",
  "C#": "#178600",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Shell: "#89E051",
  Java: "#B07219",
  Kotlin: "#7F52FF",
  Swift: "#F05138",
  Dart: "#00B4AB",
  Ruby: "#CC342D",
  PHP: "#4F5D95",
};

/* ═══════════════════════════════════════════════════════
   LAST.FM — now playing
   ═══════════════════════════════════════════════════════ */
router.get("/portfolio/now-playing", async (_req, res): Promise<void> => {
  const cached = fromCache<object>("now-playing");
  if (cached) { res.json(cached); return; }

  try {
    const url =
      `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks` +
      `&user=${LASTFM_USER}&api_key=${LASTFM_KEY}&format=json&limit=1`;
    const r = await fetch(url);
    const json = await r.json() as any;
    const track = json?.recenttracks?.track?.[0];

    const data = GetNowPlayingResponse.parse(
      track
        ? {
            isPlaying: track["@attr"]?.nowplaying === "true",
            track: track.name ?? null,
            artist: track.artist?.["#text"] ?? track.artist ?? null,
            album: track.album?.["#text"] ?? track.album ?? null,
            albumArt:
              track.image?.find((img: any) => img.size === "extralarge")?.["#text"] ||
              track.image?.find((img: any) => img.size === "large")?.["#text"] ||
              null,
            trackUrl: track.url ?? null,
          }
        : { isPlaying: false, track: null, artist: null, album: null, albumArt: null, trackUrl: null },
    );

    toCache("now-playing", data, 30_000);
    res.json(data);
  } catch {
    res.json(GetNowPlayingResponse.parse({ isPlaying: false, track: null, artist: null, album: null, albumArt: null, trackUrl: null }));
  }
});

/* ═══════════════════════════════════════════════════════
   LAST.FM — top artists (1 month)
   ═══════════════════════════════════════════════════════ */
router.get("/portfolio/top-artists", async (_req, res): Promise<void> => {
  const cached = fromCache<object[]>("top-artists");
  if (cached) { res.json(cached); return; }

  try {
    const url =
      `https://ws.audioscrobbler.com/2.0/?method=user.getTopArtists` +
      `&user=${LASTFM_USER}&api_key=${LASTFM_KEY}&format=json&period=1month&limit=5`;
    const r = await fetch(url);
    const json = await r.json() as any;
    const artists: any[] = json?.topartists?.artist ?? [];

    const data = GetTopArtistsResponse.parse(
      artists.map((a) => ({
        name: a.name,
        playcount: String(a.playcount),
        imageUrl:
          a.image?.find((img: any) => img.size === "medium")?.["#text"] ||
          a.image?.find((img: any) => img.size === "small")?.["#text"] ||
          null,
        url: a.url,
      })),
    );

    toCache("top-artists", data, 300_000);
    res.json(data);
  } catch {
    res.json([]);
  }
});

/* ═══════════════════════════════════════════════════════
   DISCORD — presence via Lanyard
   ═══════════════════════════════════════════════════════ */
router.get("/portfolio/discord", async (_req, res): Promise<void> => {
  const cached = fromCache<object>("discord");
  if (cached) { res.json(cached); return; }

  try {
    const r = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    const json = await r.json() as any;
    const d = json?.data;

    const user      = d?.discord_user;
    const statusStr = d?.discord_status ?? "offline";
    const activity  = d?.activities?.find((a: any) => a.type === 0);
    const customAct = d?.activities?.find((a: any) => a.type === 4);
    const spotify   = d?.listening_to_spotify ? d?.spotify : null;

    let activityImageUrl: string | null = null;
    if (activity?.assets?.large_image) {
      const img = activity.assets.large_image as string;
      if (img.startsWith("mp:external/")) {
        activityImageUrl = `https://media.discordapp.net/external/${img.replace("mp:external/", "")}`;
      } else {
        activityImageUrl = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
      }
    }

    const data = GetDiscordPresenceResponse.parse({
      status: ["online", "idle", "dnd", "offline"].includes(statusStr) ? statusStr : "offline",
      username: user?.global_name ?? user?.username ?? "unknown",
      displayName: user?.display_name ?? user?.global_name ?? user?.username ?? "unknown",
      avatarUrl: user?.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
        : null,
      activity: activity?.name ?? (spotify ? `🎵 ${spotify.song}` : null),
      activityDetail: activity?.details ?? (spotify ? spotify.artist : null),
      activityImageUrl,
      customStatus: customAct?.state ?? null,
    });

    toCache("discord", data, 15_000);
    res.json(data);
  } catch {
    res.json(GetDiscordPresenceResponse.parse({ status: "offline", username: "unknown", displayName: "Unknown", avatarUrl: null, activity: null, activityDetail: null, activityImageUrl: null, customStatus: null }));
  }
});

/* ═══════════════════════════════════════════════════════
   STEAM — profile + recent games + total game count
   ═══════════════════════════════════════════════════════ */
router.get("/portfolio/steam", async (_req, res): Promise<void> => {
  const cached = fromCache<object>("steam");
  if (cached) { res.json(cached); return; }

  try {
    const [profileRes, recentRes, ownedRes] = await Promise.all([
      fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_KEY}&steamids=${STEAM_ID}`),
      fetch(`https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${STEAM_KEY}&steamid=${STEAM_ID}&count=5&format=json`),
      fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_KEY}&steamid=${STEAM_ID}&include_appinfo=true&include_played_free_games=true&format=json`),
    ]);

    const profileJson = await profileRes.json() as any;
    const recentJson  = await recentRes.json() as any;
    const ownedJson   = await ownedRes.json() as any;

    const player      = profileJson?.response?.players?.[0];
    const recentGames = ((recentJson?.response?.games ?? []) as any[]).slice(0, 5).map((g) => ({
      name: g.name,
      hoursPlayed: Math.round((g.playtime_2weeks ?? g.playtime_forever ?? 0) / 60 * 10) / 10,
      imageUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appid}/header.jpg`,
      appId: String(g.appid),
    }));

    const data = GetSteamDataResponse.parse({
      username:    player?.personaname ?? "unknown",
      avatarUrl:   player?.avatarfull ?? null,
      currentGame: player?.gameextrainfo ?? null,
      totalGames:  ownedJson?.response?.game_count ?? 0,
      recentGames,
    });

    toCache("steam", data, 120_000);
    res.json(data);
  } catch {
    res.json(GetSteamDataResponse.parse({ username: "unknown", avatarUrl: null, currentGame: null, totalGames: 0, recentGames: [] }));
  }
});

/* ═══════════════════════════════════════════════════════
   LYFTA — last workout
   ═══════════════════════════════════════════════════════ */
router.get("/portfolio/workout", async (_req, res): Promise<void> => {
  const cached = fromCache<object>("workout");
  if (cached) { res.json(cached); return; }

  try {
    const r = await fetch("https://my.lyfta.app/api/v1/workouts?limit=5&page=1", {
      headers: { Authorization: `Bearer ${LYFTA_KEY}` },
    });
    const json = await r.json() as any;
    const workouts: any[] = Array.isArray(json) ? json : (json?.workouts ?? []);
    const w = workouts[0];
    if (!w) throw new Error("no workouts");

    const exercises = ((w.exercises ?? []) as any[]).slice(0, 6).map((ex) => {
      const setsArr: any[] = Array.isArray(ex.sets) ? ex.sets : [];
      const setsCount = setsArr.length || Number(ex.sets_count ?? 3);
      const maxWeight = setsArr.length
        ? Math.max(...setsArr.map((s: any) => Number(s.weight ?? 0)))
        : Number(ex.weight ?? 0);
      const maxReps = setsArr.length
        ? Math.max(...setsArr.map((s: any) => Number(s.reps ?? 0)))
        : Number(ex.reps ?? 10);
      return {
        name:   ex.excercise_name ?? ex.exercise_name ?? ex.name ?? "Exercise",
        sets:   setsCount,
        reps:   maxReps,
        weight: maxWeight,
      };
    });

    const calcVolume = exercises.reduce((acc, ex) => acc + ex.sets * ex.reps * ex.weight, 0);

    const streakDates = workouts.map((wo: any) => (wo.workout_perform_date ?? "").split(/[T ]/)[0]).filter(Boolean);
    let streak = 0;
    if (streakDates.length > 0) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const sorted = [...new Set(streakDates)].sort().reverse();
      let prev = today;
      for (const d of sorted) {
        const dt = new Date(d); dt.setHours(0, 0, 0, 0);
        const diff = Math.round((prev.getTime() - dt.getTime()) / 86400000);
        if (diff <= 1) { streak++; prev = dt; } else break;
      }
    }

    const data = GetLastWorkoutResponse.parse({
      date:        (w.workout_perform_date ?? new Date().toISOString()).split(/[T ]/)[0],
      type:        w.title ?? "Workout",
      duration:    Number(w.duration ?? 60),
      totalVolume: Number(w.total_volume ?? w.totalLiftedWeight ?? calcVolume),
      exercises,
      weeklyStats: {
        workoutsThisWeek: workouts.length,
        totalVolumeThisWeek: workouts.reduce((a: number, wo: any) => a + Number(wo.total_volume ?? wo.totalLiftedWeight ?? 0), 0),
        avgDuration:       Math.round(workouts.reduce((a: number, wo: any) => a + Number(wo.duration ?? 0), 0) / workouts.length),
        streak,
      },
    });

    toCache("workout", data, 300_000);
    res.json(data);
  } catch {
    res.json(GetLastWorkoutResponse.parse({
      date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      type: "Push", duration: 60, totalVolume: 8000,
      exercises: [
        { name: "Bench Press", sets: 4, reps: 8, weight: 100 },
        { name: "Incline Press", sets: 3, reps: 10, weight: 36 },
        { name: "Overhead Press", sets: 4, reps: 8, weight: 70 },
      ],
      weeklyStats: { workoutsThisWeek: 3, totalVolumeThisWeek: 25000, avgDuration: 60, streak: 5 },
    }));
  }
});

/* ═══════════════════════════════════════════════════════
   GITHUB — stats via GraphQL (contributions, streaks)
             + REST (repos, languages)
   ═══════════════════════════════════════════════════════ */
router.get("/portfolio/stats", async (_req, res): Promise<void> => {
  const cached = fromCache<object>("stats");
  if (cached) { res.json(cached); return; }

  try {
    const authHeaders = {
      "User-Agent": "portfolio-app/1.0",
      ...(GITHUB_PAT ? { Authorization: `Bearer ${GITHUB_PAT}` } : {}),
    };

    /* ── REST: repos + languages ── */
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers: authHeaders }),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`, { headers: authHeaders }),
    ]);
    const user  = await userRes.json() as any;
    const repos = (await reposRes.json()) as any[];

    const langCounts: Record<string, number> = {};
    (Array.isArray(repos) ? repos : [])
      .filter((r) => !r.fork && r.language)
      .forEach((r) => { langCounts[r.language] = (langCounts[r.language] ?? 0) + 1; });

    const totalLangCount = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
    const topLanguages = Object.entries(langCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / totalLangCount) * 100),
        color: LANG_COLORS[name] ?? "#888",
      }));

    /* ── GraphQL: contributions + streaks ── */
    let githubContributions = 0;
    let totalCommitsThisYear = 0;
    let currentStreak = 0;
    let longestStreak = 0;

    if (GITHUB_PAT) {
      const gqlQuery = `
        query($login: String!) {
          user(login: $login) {
            contributionsCollection {
              totalCommitContributions
              restrictedContributionsCount
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `;

      const gqlRes = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ query: gqlQuery, variables: { login: GITHUB_USER } }),
      });

      const gqlJson = await gqlRes.json() as any;
      const collection = gqlJson?.data?.user?.contributionsCollection;
      const calendar   = collection?.contributionCalendar;

      if (calendar) {
        githubContributions  = calendar.totalContributions ?? 0;
        totalCommitsThisYear = (collection.totalCommitContributions ?? 0) +
                               (collection.restrictedContributionsCount ?? 0);

        /* flatten days oldest → newest */
        const days: { date: string; count: number }[] = (calendar.weeks ?? [])
          .flatMap((w: any) => w.contributionDays ?? [])
          .map((d: any) => ({ date: d.date as string, count: d.contributionCount as number }));

        /* current streak — walk backwards from today */
        const todayStr = new Date().toISOString().split("T")[0];
        let i = days.length - 1;
        /* skip today if no contributions yet (don't break streak) */
        if (i >= 0 && days[i].date === todayStr && days[i].count === 0) i--;
        let run = 0;
        while (i >= 0 && days[i].count > 0) { run++; i--; }
        currentStreak = run;

        /* longest streak */
        let best = 0; run = 0;
        for (const d of days) {
          if (d.count > 0) { run++; best = Math.max(best, run); } else { run = 0; }
        }
        longestStreak = best;
      }
    }

    const data = GetStatsResponse.parse({
      githubContributions,
      githubRepos: user.public_repos ?? 0,
      totalCommitsThisYear,
      currentStreak,
      longestStreak,
      topLanguages,
    });

    toCache("stats", data, 600_000);
    res.json(data);
  } catch (err) {
    console.error("GitHub stats error:", err);
    res.json(GetStatsResponse.parse({ githubContributions: 0, githubRepos: 0, totalCommitsThisYear: 0, currentStreak: 0, longestStreak: 0, topLanguages: [] }));
  }
});

/* ═══════════════════════════════════════════════════════
   PROJECTS — static (curated list)
   ═══════════════════════════════════════════════════════ */
router.get("/portfolio/projects", async (_req, res): Promise<void> => {
  const data = GetProjectsResponse.parse([
    {
      id: "1",
      title: "lucashdo.com",
      description: "Personal portfolio with live data integrations — music, gaming, fitness, Discord presence.",
      tags: ["React", "TypeScript", "Vite", "Framer Motion"],
      imageUrl: null,
      githubUrl: `https://github.com/${GITHUB_USER}/portfolio`,
      liveUrl: "https://lucashdo.com",
      featured: true,
      year: 2025,
    },
    {
      id: "2",
      title: "pingo-api",
      description: "REST API boilerplate with auth, rate limiting, logging and OpenAPI codegen.",
      tags: ["Node.js", "TypeScript", "Express", "OpenAPI"],
      imageUrl: null,
      githubUrl: `https://github.com/${GITHUB_USER}/pingo-api`,
      liveUrl: null,
      featured: true,
      year: 2024,
    },
    {
      id: "3",
      title: "animelist-tracker",
      description: "Track your anime watchlist synced with MyAnimeList, with stats and recommendations.",
      tags: ["React", "TypeScript", "MAL API"],
      imageUrl: null,
      githubUrl: `https://github.com/${GITHUB_USER}/animelist-tracker`,
      liveUrl: null,
      featured: false,
      year: 2024,
    },
    {
      id: "4",
      title: "workout-logger",
      description: "Workout logging app with volume tracking, streak counter and progress charts.",
      tags: ["React Native", "Expo", "Supabase"],
      imageUrl: null,
      githubUrl: `https://github.com/${GITHUB_USER}/workout-logger`,
      liveUrl: null,
      featured: false,
      year: 2023,
    },
  ]);
  res.json(data);
});

/* ═══════════════════════════════════════════════════════
   MAL — Jikan API (no auth required)
   ═══════════════════════════════════════════════════════ */
const MAL_USER = process.env.MAL_USERNAME ?? "Amayacrab";
const JIKAN_BASE = "https://api.jikan.moe/v4";

router.get("/portfolio/mal", async (_req, res): Promise<void> => {
  const cached = fromCache<ReturnType<typeof GetMalDataResponse.parse>>("mal");
  if (cached) { res.json(cached); return; }

  try {
    const [statsRes, favsRes] = await Promise.all([
      fetch(`${JIKAN_BASE}/users/${MAL_USER}/statistics`),
      fetch(`${JIKAN_BASE}/users/${MAL_USER}/favorites`),
    ]);

    const [statsJson, favsJson] = await Promise.all([
      statsRes.json() as Promise<{ data?: { anime?: { completed?: number; watching?: number; episodes_watched?: number }; manga?: { completed?: number; reading?: number; chapters_read?: number } } }>,
      favsRes.json() as Promise<{ data?: { anime?: Array<{ mal_id: number; title: string; start_year?: number | null; images?: { jpg?: { image_url?: string } } }>; manga?: Array<{ mal_id: number; title: string; start_year?: number | null; images?: { jpg?: { image_url?: string } } }> } }>,
    ]);

    const anime = statsJson.data?.anime;
    const manga = statsJson.data?.manga;
    const favAnime = favsJson.data?.anime ?? [];
    const favManga = favsJson.data?.manga ?? [];

    const data = GetMalDataResponse.parse({
      animeStats: {
        completed: anime?.completed ?? 0,
        watching: anime?.watching ?? 0,
        episodesWatched: anime?.episodes_watched ?? 0,
      },
      mangaStats: {
        completed: manga?.completed ?? 0,
        reading: manga?.reading ?? 0,
        chaptersRead: manga?.chapters_read ?? 0,
      },
      animeFavorites: favAnime.map((a) => ({
        malId: a.mal_id,
        title: a.title,
        year: a.start_year ?? null,
        imageUrl: a.images?.jpg?.image_url ?? null,
        url: `https://myanimelist.net/anime/${a.mal_id}`,
      })),
      mangaFavorites: favManga.map((m) => ({
        malId: m.mal_id,
        title: m.title,
        year: m.start_year ?? null,
        imageUrl: m.images?.jpg?.image_url ?? null,
        url: `https://myanimelist.net/manga/${m.mal_id}`,
      })),
    });

    toCache("mal", data, 900_000);
    res.json(data);
  } catch (err) {
    console.error("MAL/Jikan error:", err);
    res.json(GetMalDataResponse.parse({
      animeStats: { completed: 0, watching: 0, episodesWatched: 0 },
      mangaStats: { completed: 0, reading: 0, chaptersRead: 0 },
      animeFavorites: [],
      mangaFavorites: [],
    }));
  }
});

export default router;
