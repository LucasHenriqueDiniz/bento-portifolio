type Env = {
  LASTFM_API_KEY?: string;
  LASTFM_USERNAME?: string;
  DISCORD_ID?: string;
  STEAM_API_KEY?: string;
  STEAM_ID?: string;
  LYFTA_API_KEY?: string;
  GITHUB_USERNAME?: string;
  GITHUB_PAT?: string;
  MAL_USERNAME?: string;
  PORTFOLIO_CACHE?: KVNamespace;
};

const JIKAN_BASE = "https://api.jikan.moe/v4";
const JIKAN_HEADERS: Record<string, string> = {
  Accept: "application/json",
  "User-Agent": "lucashdo-portfolio/1.0 (+https://lucashdo.com)",
};

let lastGoodMal: any | null = null;
const KV_MAL_KEY = "mal";

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

const json = (data: unknown, maxAgeSec: number) =>
  new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${maxAgeSec}`,
    },
  });

async function cached(
  request: Request,
  cacheKey: string,
  ttlSec: number,
  env: Env,
  producer: () => Promise<Response>
): Promise<Response> {
  if (env.PORTFOLIO_CACHE) {
    const kvCached = await env.PORTFOLIO_CACHE.get(cacheKey, { type: "text" });
    if (kvCached) {
      return new Response(kvCached, {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": `public, max-age=${ttlSec}`,
        },
      });
    }
  }

  const key = new Request(new URL(`https://cache.local/${cacheKey}`), { method: "GET" });
  const hit = await caches.default.match(key);
  if (hit) return hit;

  const fresh = await producer();
  if (fresh.ok) {
    await caches.default.put(key, fresh.clone());
    if (env.PORTFOLIO_CACHE) {
      const text = await fresh.clone().text();
      if (text) {
        await env.PORTFOLIO_CACHE.put(cacheKey, text, { expirationTtl: Math.max(ttlSec * 2, 600) });
      }
    }
  }
  return fresh;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithTimeout = async (url: string, init: RequestInit = {}, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

async function fetchJikanUserResource<T>(user: string, resource: "statistics" | "favorites", retries = 2): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    const res = await fetchWithTimeout(`${JIKAN_BASE}/users/${user}/${resource}`, { headers: JIKAN_HEADERS });
    if (res.status === 429 || res.status === 403) {
      await delay(1000 + i * 500);
      continue;
    }
    if (!res.ok) throw new Error(`Jikan ${resource} request failed (${res.status})`);
    return (await res.json()) as T;
  }
  throw new Error(`Jikan ${resource} request failed by rate limit`);
}

async function fetchJikanDetails(type: "anime" | "manga", id: number, retries = 2): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    const res = await fetch(`${JIKAN_BASE}/${type}/${id}`, { headers: JIKAN_HEADERS });
    if (res.status === 429 || res.status === 403) {
      await delay(1000 + i * 500);
      continue;
    }
    if (!res.ok) return null;
    const body = (await res.json()) as any;
    return body?.data ?? null;
  }
  return null;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const path = new URL(request.url).pathname.replace(/^\/api\/?/, "");

  try {
    if (path === "portfolio/now-playing") {
      return cached(request, path, 30, env, async () => {
        const key = env.LASTFM_API_KEY ?? "";
        const user = env.LASTFM_USERNAME ?? "Amayacrab";
        if (!key) return json({ isPlaying: false, track: null, artist: null, album: null, albumArt: null, trackUrl: null }, 30);
        const u = `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${user}&api_key=${key}&format=json&limit=1`;
        const r = await fetch(u);
        const body = (await r.json()) as any;
        const track = body?.recenttracks?.track?.[0];
        const data = track
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
          : { isPlaying: false, track: null, artist: null, album: null, albumArt: null, trackUrl: null };
        return json(data, 30);
      });
    }

    if (path === "portfolio/top-artists") {
      return cached(request, path, 300, env, async () => {
        const key = env.LASTFM_API_KEY ?? "";
        const user = env.LASTFM_USERNAME ?? "Amayacrab";
        if (!key) return json([], 60);
        const u = `https://ws.audioscrobbler.com/2.0/?method=user.getTopArtists&user=${user}&api_key=${key}&format=json&period=3month&limit=5`;
        const r = await fetch(u);
        const body = (await r.json()) as any;
        const raw = body?.topartists?.artist ?? [];
        const artists = (Array.isArray(raw) ? raw : [raw]).map((a: any) => ({
          name: a.name,
          playcount: String(a.playcount),
          imageUrl:
            a.image?.find((img: any) => img.size === "medium")?.["#text"] ||
            a.image?.find((img: any) => img.size === "small")?.["#text"] ||
            null,
          url: a.url,
        }));
        return json(artists, 300);
      });
    }

    if (path === "portfolio/top-tracks") {
      return cached(request, path, 300, env, async () => {
        const key = env.LASTFM_API_KEY ?? "";
        const user = env.LASTFM_USERNAME ?? "Amayacrab";
        if (!key) return json([], 60);
        const u = `https://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user=${user}&api_key=${key}&format=json&period=3month&limit=5`;
        const r = await fetch(u);
        const body = (await r.json()) as any;
        const raw = body?.toptracks?.track ?? [];
        const tracks = (Array.isArray(raw) ? raw : [raw]).map((t: any) => ({
          name: t.name,
          artist: t.artist?.name ?? "",
          playcount: String(t.playcount),
          imageUrl:
            t.image?.find((img: any) => img.size === "medium")?.["#text"] ||
            t.image?.find((img: any) => img.size === "small")?.["#text"] ||
            null,
          url: t.url,
        }));
        return json(tracks, 300);
      });
    }

    if (path === "portfolio/steam") {
      return cached(request, path, 120, env, async () => {
        const key = env.STEAM_API_KEY ?? "";
        const id = env.STEAM_ID ?? "";
        if (!key || !id) return json({ username: "unknown", avatarUrl: null, currentGame: null, totalGames: 0, recentGames: [] }, 60);
        const [profileRes, recentRes, ownedRes] = await Promise.all([
          fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${id}`),
          fetch(`https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${key}&steamid=${id}&count=5&format=json`),
          fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${id}&include_appinfo=true&include_played_free_games=true&format=json`),
        ]);
        const profileJson = (await profileRes.json()) as any;
        const recentJson = (await recentRes.json()) as any;
        const ownedJson = (await ownedRes.json()) as any;
        const player = profileJson?.response?.players?.[0];
        const rawRecent = recentJson?.response?.games ?? [];
        const recentGames = (Array.isArray(rawRecent) ? rawRecent : [rawRecent]).slice(0, 5).map((g: any) => ({
          name: g.name,
          hoursPlayed: Math.round((((g.playtime_2weeks ?? g.playtime_forever) ?? 0) / 60) * 10) / 10,
          imageUrl: g.name === "Spacewars"
            ? "https://raw.githubusercontent.com/hydralauncher/hydra/refs/heads/main/resources/icon.png"
            : `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appid}/header.jpg`,
          appId: String(g.appid),
        }));
        return json({
          username: player?.personaname ?? "unknown",
          avatarUrl: player?.avatarfull ?? null,
          currentGame: player?.gameextrainfo ?? null,
          totalGames: ownedJson?.response?.game_count ?? 0,
          recentGames,
        }, 120);
      });
    }

    if (path === "portfolio/workout") {
      return cached(request, path, 300, env, async () => {
        const key = env.LYFTA_API_KEY ?? "";
        if (!key) {
          return json({
            date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
            type: "Push",
            duration: 60,
            totalVolume: 8000,
            exercises: [
              { name: "Bench Press", sets: 4, reps: 8, weight: 100 },
              { name: "Incline Press", sets: 3, reps: 10, weight: 36 },
              { name: "Overhead Press", sets: 4, reps: 8, weight: 70 },
            ],
            weeklyStats: { workoutsThisWeek: 3, totalVolumeThisWeek: 25000, avgDuration: 60, streak: 5 },
          }, 180);
        }
        const r = await fetch("https://my.lyfta.app/api/v1/workouts?limit=5&page=1", {
          headers: { Authorization: `Bearer ${key}` },
        });
        const body = (await r.json()) as any;
        const workouts = (Array.isArray(body) ? body : body?.workouts ?? []) as any[];
        const w = workouts[0];
        if (!w) throw new Error("no workouts");
        const rawExercises = w.exercises ?? [];
        const exercises = (Array.isArray(rawExercises) ? rawExercises : [rawExercises]).slice(0, 6).map((ex: any) => {
          const setsArr: any[] = Array.isArray(ex.sets) ? ex.sets : [];
          const sets = setsArr.length || Number(ex.sets_count ?? 3);
          const weight = setsArr.length ? Math.max(...setsArr.map((s: any) => Number(s.weight ?? 0))) : Number(ex.weight ?? 0);
          const reps = setsArr.length ? Math.max(...setsArr.map((s: any) => Number(s.reps ?? 0))) : Number(ex.reps ?? 10);
          return { name: ex.excercise_name ?? ex.exercise_name ?? ex.name ?? "Exercise", sets, reps, weight };
        });
        const calcVolume = exercises.reduce((acc: number, ex: any) => acc + ex.sets * ex.reps * ex.weight, 0);
        return json({
          date: (w.workout_perform_date ?? new Date().toISOString()).split(/[T ]/)[0],
          type: w.title ?? "Workout",
          duration: Number(w.duration ?? 60),
          totalVolume: Number(w.total_volume ?? w.totalLiftedWeight ?? calcVolume),
          exercises,
          weeklyStats: {
            workoutsThisWeek: workouts.length,
            totalVolumeThisWeek: workouts.reduce((a: number, wo: any) => a + Number(wo.total_volume ?? wo.totalLiftedWeight ?? 0), 0),
            avgDuration: Math.round(workouts.reduce((a: number, wo: any) => a + Number(wo.duration ?? 0), 0) / workouts.length),
            streak: 0,
          },
        }, 300);
      });
    }

    if (path === "portfolio/stats") {
      return cached(request, path, 600, env, async () => {
        const userName = env.GITHUB_USERNAME ?? "LucasHenriqueDiniz";
        const pat = env.GITHUB_PAT ?? "";
        const authHeaders = {
          "User-Agent": "portfolio-app/1.0",
          ...(pat ? { Authorization: `Bearer ${pat}` } : {}),
        };
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${userName}`, { headers: authHeaders }),
          fetch(`https://api.github.com/users/${userName}/repos?per_page=100&sort=pushed`, { headers: authHeaders }),
        ]);
        const user = (await userRes.json()) as any;
        const repos = (await reposRes.json()) as any[];
        const langCounts: Record<string, number> = {};
        (Array.isArray(repos) ? repos : []).filter((r) => !r.fork && r.language).forEach((r) => {
          langCounts[r.language] = (langCounts[r.language] ?? 0) + 1;
        });
        const totalLangCount = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
        const topLanguages = Object.entries(langCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([name, count]) => ({
            name,
            percentage: Math.round((count / totalLangCount) * 100),
            color: LANG_COLORS[name] ?? "#888",
          }));
        let githubContributions = 0;
        let totalCommitsThisYear = 0;
        let currentStreak = 0;
        let longestStreak = 0;
        let contributionDays: Array<{ date: string; count: number }> = [];

        if (pat) {
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
            body: JSON.stringify({ query: gqlQuery, variables: { login: userName } }),
          });
          const gqlJson = (await gqlRes.json()) as any;
          const collection = gqlJson?.data?.user?.contributionsCollection;
          const calendar = collection?.contributionCalendar;

          if (calendar) {
            githubContributions = calendar.totalContributions ?? 0;
            totalCommitsThisYear =
              (collection.totalCommitContributions ?? 0) +
              (collection.restrictedContributionsCount ?? 0);

            const days: { date: string; count: number }[] = (calendar.weeks ?? [])
              .flatMap((w: any) => w.contributionDays ?? [])
              .map((d: any) => ({ date: d.date as string, count: d.contributionCount as number }));
            contributionDays = days;

            const todayStr = new Date().toISOString().split("T")[0];
            let i = days.length - 1;
            if (i >= 0 && days[i].date === todayStr && days[i].count === 0) i--;
            let run = 0;
            while (i >= 0 && days[i].count > 0) {
              run++;
              i--;
            }
            currentStreak = run;

            let best = 0;
            run = 0;
            for (const d of days) {
              if (d.count > 0) {
                run++;
                best = Math.max(best, run);
              } else {
                run = 0;
              }
            }
            longestStreak = best;
          }
        }

        return json(
          {
            githubContributions,
            githubRepos: user.public_repos ?? 0,
            totalCommitsThisYear,
            currentStreak,
            longestStreak,
            contributionDays,
            topLanguages,
          },
          600
        );
      });
    }

    if (path === "portfolio/mal") {
      const user = env.MAL_USERNAME ?? "Amayacrab";

      try {
        const [statsJson, favsJson] = await Promise.all([
          fetchJikanUserResource<{ data?: { anime?: { completed?: number; watching?: number; episodes_watched?: number }; manga?: { completed?: number; reading?: number; chapters_read?: number } } }>(user, "statistics"),
          fetchJikanUserResource<{ data?: { anime?: Array<{ mal_id: number; title: string; start_year?: number | null; images?: { jpg?: { image_url?: string } } }>; manga?: Array<{ mal_id: number; title: string; start_year?: number | null; images?: { jpg?: { image_url?: string } } }> } }>(user, "favorites"),
        ]);

        const anime = statsJson.data?.anime;
        const manga = statsJson.data?.manga;
        const favAnime = Array.isArray(favsJson.data?.anime) ? favsJson.data?.anime : [];
        const favManga = Array.isArray(favsJson.data?.manga) ? favsJson.data?.manga : [];

        // Fetch details for each favorite to get score, synopsis, type, episodes/chapters
        const animeDetails = await Promise.all(
          favAnime.slice(0, 10).map(async (a: any) => {
            const details = await fetchJikanDetails("anime", a.mal_id, 1);
            return {
              malId: a.mal_id,
              title: a.title,
              year: a.start_year ?? null,
              imageUrl: a.images?.jpg?.image_url ?? null,
              url: `https://myanimelist.net/anime/${a.mal_id}`,
              score: details?.score ?? null,
              synopsis: details?.synopsis ?? null,
              type: details?.type ?? null,
              episodes: details?.episodes ?? null,
            };
          })
        );

        const mangaDetails = await Promise.all(
          favManga.slice(0, 10).map(async (m: any) => {
            const details = await fetchJikanDetails("manga", m.mal_id, 1);
            return {
              malId: m.mal_id,
              title: m.title,
              year: m.start_year ?? null,
              imageUrl: m.images?.jpg?.image_url ?? null,
              url: `https://myanimelist.net/manga/${m.mal_id}`,
              score: details?.score ?? null,
              synopsis: details?.synopsis ?? null,
              type: details?.type ?? null,
              chapters: details?.chapters ?? null,
            };
          })
        );

        const payload = {
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
          animeFavorites: animeDetails,
          mangaFavorites: mangaDetails,
        };

        if (payload.animeFavorites.length || payload.mangaFavorites.length) {
          lastGoodMal = payload;
        }

        return json(payload, 900);
      } catch {
        if (lastGoodMal) return json(lastGoodMal, 300);
        return json({ animeStats: { completed: 0, watching: 0, episodesWatched: 0 }, mangaStats: { completed: 0, reading: 0, chaptersRead: 0 }, animeFavorites: [], mangaFavorites: [] }, 30);
      }
    }

    if (path === "portfolio/projects") {
      return json([], 120);
    }

    return new Response("Not found", { status: 404 });
  } catch {
    if (path === "portfolio/mal") {
      return json({ animeStats: { completed: 0, watching: 0, episodesWatched: 0 }, mangaStats: { completed: 0, reading: 0, chaptersRead: 0 }, animeFavorites: [], mangaFavorites: [] }, 60);
    }
    return new Response("Upstream error", { status: 502 });
  }
};
