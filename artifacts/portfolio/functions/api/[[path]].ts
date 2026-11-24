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
  DAILY_INGEST_DB?: D1Database;
  PORTFOLIO_DB?: D1Database;
};

const JIKAN_BASE = "https://jikan.lucashdo.com/v1";
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

// Routes refreshed more often than this skip the global KV copy and live in the
// per-location edge cache only. Keeping a 30-second payload fresh in KV would cost up
// to ~2,900 writes a day, and the free plan allows 1,000; the old way, serving the KV
// copy for its full ten-minute life, left now-playing up to ten minutes behind.
const KV_CACHE_MIN_TTL_SEC = 300;

async function cached(
  request: Request,
  cacheKey: string,
  ttlSec: number,
  env: Env,
  producer: () => Promise<Response>
): Promise<Response> {
  const key = new Request(new URL(`https://cache.local/${cacheKey}`), { method: "GET" });
  const hit = await caches.default.match(key);
  if (hit) return hit;

  const kv = ttlSec >= KV_CACHE_MIN_TTL_SEC ? env.PORTFOLIO_CACHE : undefined;
  if (kv) {
    const kvCached = await kv.get(cacheKey, { type: "text" });
    if (kvCached) {
      return new Response(kvCached, {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": `public, max-age=${ttlSec}`,
        },
      });
    }
  }

  const fresh = await producer();
  if (fresh.ok) {
    await caches.default.put(key, fresh.clone());
    if (kv) {
      const text = await fresh.clone().text();
      if (text) {
        await kv.put(cacheKey, text, { expirationTtl: Math.max(ttlSec * 2, 600) });
      }
    }
  }
  return fresh;
}

// Writes only when the value changed: a route refreshed every 30 seconds would
// otherwise spend a KV write (1,000 a day on the free plan) on every refresh.
async function putIfChanged(env: Env, key: string, value: string): Promise<void> {
  if (!env.PORTFOLIO_CACHE) return;
  const stored = await env.PORTFOLIO_CACHE.get(key, { type: "text" });
  if (stored !== value) await env.PORTFOLIO_CACHE.put(key, value);
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

const rateLimitDelayMs = (res: Response, attempt: number) => {
  const retryAfter = Number(res.headers.get("Retry-After"));
  return Number.isFinite(retryAfter) && retryAfter > 0
    ? Math.min(retryAfter * 1000, 10000)
    : 1000 + attempt * 500;
};

// The last payload that carried real data, kept without expiry so a card shows what
// was last true instead of going blank when the upstream fails or comes back empty.
// `asStale` rewrites the fields that only make sense live ("playing now").
async function withLastKnown<T>(
  env: Env,
  kvKey: string,
  maxAgeSec: number,
  produce: () => Promise<T>,
  asStale: (last: T) => T = (last) => last
): Promise<Response> {
  try {
    const fresh = await produce();
    // A failed write of the fallback copy must not cost the visitor the fresh answer.
    await putIfChanged(env, kvKey, JSON.stringify(fresh)).catch(() => undefined);
    return json(fresh, maxAgeSec);
  } catch (error) {
    const last = env.PORTFOLIO_CACHE ? await env.PORTFOLIO_CACHE.get(kvKey, { type: "text" }) : null;
    if (last) return json(asStale(JSON.parse(last) as T), maxAgeSec);
    throw error;
  }
}

const LASTFM_PLACEHOLDER_ART = "2a96cbd8b46e442fc41c2b86b821562f";
const KV_LAST_TRACK_KEY = "lastfm:last-track";

const EMPTY_NOW_PLAYING = {
  isPlaying: false,
  timestamp: null,
  track: null,
  artist: null,
  album: null,
  albumArt: null,
  trackUrl: null,
};

// Scrobbles from YouTube carry the video title as the track name and the channel as
// the artist, e.g. "Evanescence - Tourniquet (Remastered 2023) - Official Visualizer"
// by "Amy Lee". Bracketed tags and trailing video labels are dropped before searching.
const BRACKETED_TAG = /\s*[([][^)\]]*[)\]]/g;
const TRAILING_VIDEO_LABEL = /\s+-\s+(?:official|lyrics?|audio|video|visuali[sz]er|remaster(?:ed)?|live|hd|4k)\b.*$/i;
const TITLE_DASH = /\s+-\s+/;
const TITLE_DASHES = /\s+-\s+/g;

const cleanTitle = (track: string) => track.replace(BRACKETED_TAG, "").replace(TRAILING_VIDEO_LABEL, "").trim();

// iTunes matches loosely, so the scrobble artist can stay in front of the title.
const itunesSearchTerm = (artist: string, track: string) =>
  `${artist} ${cleanTitle(track).replace(TITLE_DASHES, " ")}`.trim();

// Deezer requires every word to match, so a channel name finds nothing: a
// "Band - Song" title supplies the band instead of the scrobble artist.
const deezerSearchTerm = (artist: string, track: string) => {
  const title = cleanTitle(track);
  return TITLE_DASH.test(title) ? title.replace(TITLE_DASHES, " ") : `${artist} ${title}`.trim();
};

async function fetchItunesArtwork(artist: string, track: string): Promise<string | null> {
  try {
    const term = encodeURIComponent(itunesSearchTerm(artist, track));
    const res = await fetchWithTimeout(`https://itunes.apple.com/search?term=${term}&entity=song&limit=1`, {}, 4000);
    if (!res.ok) return null;
    const body = (await res.json()) as { results?: Array<{ artworkUrl100?: unknown }> };
    const artwork = textOrNull(body?.results?.[0]?.artworkUrl100);
    return artwork ? artwork.replace("100x100", "600x600") : null;
  } catch {
    return null;
  }
}

async function fetchDeezerArtwork(artist: string, track: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(deezerSearchTerm(artist, track));
    const res = await fetchWithTimeout(`https://api.deezer.com/search?q=${query}&limit=1`, {}, 4000);
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: Array<{ album?: { cover_xl?: unknown } }> };
    return textOrNull(body?.data?.[0]?.album?.cover_xl);
  } catch {
    return null;
  }
}

// iTunes rate-limits the egress addresses Cloudflare shares between tenants (403 and
// 429 seen from the edge), so a lookup that worked once can fail on the next refresh.
// Art already found for this same track is kept rather than searched for again.
async function rememberedArt(env: Env, track: string, artist: string | null): Promise<string | null> {
  const raw = env.PORTFOLIO_CACHE ? await env.PORTFOLIO_CACHE.get(KV_LAST_TRACK_KEY, { type: "text" }) : null;
  if (!raw) return null;
  try {
    const last = JSON.parse(raw) as { track?: unknown; artist?: unknown; albumArt?: unknown };
    return last.track === track && (last.artist ?? null) === artist ? textOrNull(last.albumArt) : null;
  } catch {
    return null;
  }
}

const KV_LAST_WORKOUT_KEY = "lyfta:last-workout";

const EMPTY_WORKOUT = {
  date: null as string | null,
  type: null as string | null,
  duration: 0,
  totalVolume: 0,
  exercises: [] as unknown[],
  weeklyStats: { workoutsThisWeek: 0, totalVolumeThisWeek: 0, avgDuration: 0, streak: 0 },
};

// Monday 00:00 of the week `now` falls in.
const startOfWeek = (now: Date) => {
  const monday = new Date(now);
  const dayOfWeek = now.getDay();
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const isoDate = (date: Date) => date.toISOString().split("T")[0];

const KV_LAST_STEAM_KEY = "steam:last-good";
const STEAM_SPACEWAR_APP_ID = 480;
const HYDRA_ICON_URL = "https://raw.githubusercontent.com/hydralauncher/hydra/refs/heads/main/resources/icon.png";

interface SteamApiGame {
  appid: number;
  name?: string;
  playtime_forever?: number;
  rtime_last_played?: number;
}

// Newer games keep their header image under a hashed path that only the Store API
// reports; the fixed `/steam/apps/{id}/header.jpg` answers 404 for them. Null means
// the Store API had nothing, and the fixed path is the best guess left.
async function fetchSteamHeaderImage(appId: number): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(`https://store.steampowered.com/api/appdetails?appids=${appId}&filters=basic`, {}, 4000);
    if (!res.ok) return null;
    const body = (await res.json()) as Record<string, { data?: { header_image?: unknown } } | undefined>;
    return textOrNull(body?.[String(appId)]?.data?.header_image);
  } catch {
    return null;
  }
}

// Hours are lifetime totals; `lastPlayedAt` comes from the owned library, the only
// Steam endpoint that reports a last launch time.
const toSteamGame = (game: SteamApiGame, lastPlayedSec: number | undefined, headerUrl: string | null = null) => {
  const name = String(game.name ?? "");
  const isSpacewar = ["spacewar", "spacewars"].includes(name.toLowerCase()) || Number(game.appid) === STEAM_SPACEWAR_APP_ID;
  return {
    name,
    hoursPlayed: Math.round((Number(game.playtime_forever ?? 0) / 60) * 10) / 10,
    imageUrl: isSpacewar
      ? HYDRA_ICON_URL
      : headerUrl ?? `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
    appId: String(game.appid),
    lastPlayedAt: lastPlayedSec ? lastPlayedSec * 1000 : null,
  };
};

async function fetchJikanUserResource<T>(user: string, resource: "statistics" | "favorites", retries = 2): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    const res = await fetchWithTimeout(`${JIKAN_BASE}/users/${user}/${resource}`, { headers: JIKAN_HEADERS });
    if (res.status === 429 || res.status === 403) {
      await delay(rateLimitDelayMs(res, i));
      continue;
    }
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as any;
      throw new Error(`jikan-edge ${resource} request failed (${body?.error?.code ?? res.status})`);
    }
    return (await res.json()) as T;
  }
  throw new Error(`jikan-edge ${resource} request failed by rate limit`);
}

async function fetchJikanDetails(type: "anime" | "manga", id: number, retries = 2): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    const res = await fetchWithTimeout(`${JIKAN_BASE}/${type}/${id}`, { headers: JIKAN_HEADERS });
    if (res.status === 429 || res.status === 403) {
      await delay(rateLimitDelayMs(res, i));
      continue;
    }
    if (!res.ok) return null;
    const body = (await res.json()) as any;
    return body?.data ?? null;
  }
  return null;
}

const VISITOR_KEY = "visitor-count";
const VISITOR_COUNTER = "visitors";

const kvVisitorCount = async (env: Env) => {
  const current = Number((await env.PORTFOLIO_CACHE?.get(VISITOR_KEY, { type: "text" })) ?? "0");
  return Number.isFinite(current) ? current : 0;
};

// One statement adds the visit and reads the total, so two visits at once both count.
// The KV version read the number, added one and wrote it back, and lost one of them.
async function addVisit(db: D1Database, env: Env): Promise<number> {
  const add = () =>
    db
      .prepare("UPDATE counters SET value = value + 1 WHERE name = ? RETURNING value")
      .bind(VISITOR_COUNTER)
      .first<{ value: number }>();

  const added = await add();
  if (added) return added.value;

  // First visit on this database: carry over the total KV had, then count this one.
  await db
    .prepare("INSERT OR IGNORE INTO counters (name, value) VALUES (?, ?)")
    .bind(VISITOR_COUNTER, await kvVisitorCount(env))
    .run();
  const seeded = await add();
  if (!seeded) throw new Error("visitor counter row missing after seeding");
  return seeded.value;
}

async function readVisits(db: D1Database, env: Env): Promise<number> {
  const row = await db
    .prepare("SELECT value FROM counters WHERE name = ?")
    .bind(VISITOR_COUNTER)
    .first<{ value: number }>();
  return row ? row.value : kvVisitorCount(env);
}

const DAILY_INGEST_STATS_URL = "https://daily-ingest.lucas-hdo.workers.dev/api/public/stats";

const finiteOrNull = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const textOrNull = (value: unknown) => (typeof value === "string" && value ? value : null);

// Telemetry rows are daily; a machine is "online" when its newest reading carries
// today's date in the collector's timezone (same rule the daily-ingest worker uses).
const SAO_PAULO_DATE_FMT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

interface MetricRow {
  source: string;
  entity: string;
  metric: string;
  value: number;
  date: string;
}

// Every measurement is nullable, and a null means "unknown", never zero — the card
// hides those lines instead of reporting a made-up value.
const buildMachineStatus = (rows: MetricRow[]) => {
  if (!rows.length) return null;
  const value = (entity: string, metric: string) =>
    finiteOrNull(rows.find((row) => row.entity === entity && row.metric === metric)?.value);
  const disks = rows
    .filter((row) => row.metric === "disk_used_pct" && finiteOrNull(row.value) !== null)
    .map((row) => ({ name: row.entity, usedPct: row.value }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return {
    online: rows[0].date === SAO_PAULO_DATE_FMT.format(new Date()),
    uptimeHours: value("host", "uptime_h"),
    cpuPct: value("cpu", "cpu_used_pct"),
    cpuTempC: value("cpu", "temp_c"),
    ramPct: value("ram", "mem_used_pct"),
    gpuPct: value("gpu", "gpu_used_pct"),
    gpuTempC: value("gpu", "temp_c"),
    disks,
  };
};

const MACHINE_METRICS_SQL = `
  SELECT source, entity, metric, value, date FROM metrics
   WHERE (source = 'machine.stats'
          AND date = (SELECT MAX(date) FROM metrics WHERE source = 'machine.stats'))
      OR (source = 'server.stats'
          AND date = (SELECT MAX(date) FROM metrics WHERE source = 'server.stats'))`;

// When the D1 binding is absent (plain local dev), the public stats endpoint still
// covers the server; the PC block is simply unknown there.
const fetchServerFromPublicStats = async () => {
  const res = await fetchWithTimeout(DAILY_INGEST_STATS_URL, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`daily-ingest stats request failed (${res.status})`);
  const body = (await res.json()) as any;
  return {
    at: textOrNull(body?.at) ?? new Date().toISOString(),
    pc: null,
    server: {
      online: body?.servidor?.online === true,
      uptimeHours: finiteOrNull(body?.servidor?.noArHoras),
      cpuPct: null,
      cpuTempC: finiteOrNull(body?.servidor?.cpuTempC),
      ramPct: finiteOrNull(body?.servidor?.ramPct),
      gpuPct: null,
      gpuTempC: null,
      disks:
        finiteOrNull(body?.servidor?.discoPct) !== null
          ? [{ name: "root", usedPct: body.servidor.discoPct as number }]
          : [],
    },
  };
};

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const path = new URL(request.url).pathname.replace(/^\/api\/?/, "");

  if (request.method === "POST" && path === "portfolio/visitors/increment") {
    try {
      if (env.PORTFOLIO_DB) return json({ count: await addVisit(env.PORTFOLIO_DB, env) }, 0);
      // No database bound (plain local dev): the old, non-atomic KV counter.
      if (!env.PORTFOLIO_CACHE) return json({ count: 0 }, 0);
      const count = (await kvVisitorCount(env)) + 1;
      await env.PORTFOLIO_CACHE.put(VISITOR_KEY, String(count));
      return json({ count }, 0);
    } catch {
      return new Response("Upstream error", { status: 502 });
    }
  }

  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    if (path === "portfolio/now-playing") {
      return await cached(request, path, 30, env, async () => {
        const key = env.LASTFM_API_KEY ?? "";
        const user = env.LASTFM_USERNAME ?? "Amayacrab";
        if (!key) return json(EMPTY_NOW_PLAYING, 30);
        const u = `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${user}&api_key=${key}&format=json&limit=1`;
        return withLastKnown(
          env,
          KV_LAST_TRACK_KEY,
          30,
          async () => {
            const r = await fetchWithTimeout(u);
            if (!r.ok) throw new Error(`last.fm recent tracks request failed (${r.status})`);
            const body = (await r.json()) as any;
            const track = body?.recenttracks?.track?.[0];
            const trackName = textOrNull(track?.name);
            if (!trackName) throw new Error("last.fm returned no recent track");

            const artist = textOrNull(track.artist?.["#text"]) ?? textOrNull(track.artist);
            const lastfmArt =
              textOrNull(track.image?.find((img: any) => img.size === "extralarge")?.["#text"]) ??
              textOrNull(track.image?.find((img: any) => img.size === "large")?.["#text"]);
            const albumArt =
              (lastfmArt && !lastfmArt.includes(LASTFM_PLACEHOLDER_ART) ? lastfmArt : null) ??
              (await rememberedArt(env, trackName, artist)) ??
              (await fetchItunesArtwork(artist ?? "", trackName)) ??
              (await fetchDeezerArtwork(artist ?? "", trackName));

            return {
              isPlaying: track["@attr"]?.nowplaying === "true",
              timestamp: track.date?.uts ? Number(track.date.uts) * 1000 : null,
              track: trackName,
              artist,
              album: textOrNull(track.album?.["#text"]) ?? textOrNull(track.album),
              albumArt,
              trackUrl: textOrNull(track.url),
            };
          },
          (last) => ({ ...last, isPlaying: false })
        );
      });
    }

    if (path === "portfolio/top-artists") {
      return await cached(request, path, 300, env, async () => {
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
      return await cached(request, path, 300, env, async () => {
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
      return await cached(request, path, 120, env, async () => {
        const key = env.STEAM_API_KEY ?? "";
        const id = env.STEAM_ID ?? "";
        if (!key || !id) return json({ username: "unknown", avatarUrl: null, currentGame: null, totalGames: 0, recentGames: [] }, 60);
        return withLastKnown(
          env,
          KV_LAST_STEAM_KEY,
          120,
          async () => {
            const [profileRes, recentRes, ownedRes] = await Promise.all([
              fetchWithTimeout(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${id}`),
              fetchWithTimeout(`https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${key}&steamid=${id}&count=5&format=json`),
              fetchWithTimeout(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${id}&include_appinfo=true&include_played_free_games=true&format=json`),
            ]);
            if (!profileRes.ok || !recentRes.ok || !ownedRes.ok) {
              throw new Error(`steam request failed (${profileRes.status}/${recentRes.status}/${ownedRes.status})`);
            }
            const profileJson = (await profileRes.json()) as any;
            const recentJson = (await recentRes.json()) as any;
            const ownedJson = (await ownedRes.json()) as any;
            const player = profileJson?.response?.players?.[0];
            const owned: SteamApiGame[] = Array.isArray(ownedJson?.response?.games) ? ownedJson.response.games : [];
            const recent: SteamApiGame[] = Array.isArray(recentJson?.response?.games) ? recentJson.response.games : [];
            const lastPlayedByApp = new Map(owned.map((g) => [String(g.appid), Number(g.rtime_last_played) || 0]));

            // GetRecentlyPlayedGames only covers the last two weeks. Past that, the owned
            // library ordered by last launch still says what was played last.
            const lastPlayed = recent.length
              ? recent
              : owned
                  .filter((g) => (lastPlayedByApp.get(String(g.appid)) ?? 0) > 0)
                  .sort((a, b) => (lastPlayedByApp.get(String(b.appid)) ?? 0) - (lastPlayedByApp.get(String(a.appid)) ?? 0));
            const picked = lastPlayed.slice(0, 5);
            const headers = await Promise.all(picked.map((g) => fetchSteamHeaderImage(g.appid)));
            const recentGames = picked.map((g, i) => toSteamGame(g, lastPlayedByApp.get(String(g.appid)), headers[i]));
            if (!recentGames.length) throw new Error("steam returned no played games");

            return {
              username: player?.personaname ?? "unknown",
              avatarUrl: player?.avatarfull ?? null,
              currentGame: player?.gameextrainfo ?? null,
              totalGames: ownedJson?.response?.game_count ?? owned.length,
              recentGames,
            };
          },
          (last) => ({ ...last, currentGame: null })
        );
      });
    }

    if (path === "portfolio/workout") {
      return await cached(request, path, 300, env, async () => {
        const key = env.LYFTA_API_KEY ?? "";
        // Without a key there is no workout to show. This used to answer with a made-up
        // "Push" session (bench press 100 kg), which the card displayed as real.
        if (!key) return json(EMPTY_WORKOUT, 300);
        return withLastKnown(
          env,
          KV_LAST_WORKOUT_KEY,
          300,
          async () => {
            const r = await fetchWithTimeout("https://my.lyfta.app/api/v1/workouts?limit=5&page=1", {
              headers: { Authorization: `Bearer ${key}` },
            });
            if (!r.ok) throw new Error(`lyfta workouts request failed (${r.status})`);
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
              return {
                name: ex.excercise_name ?? ex.exercise_name ?? ex.name ?? "Exercise",
                sets,
                reps,
                weight,
                exercise_image: ex.exercise_image ?? "",
              };
            });
            const calcVolume = exercises.reduce((acc: number, ex: any) => acc + ex.sets * ex.reps * ex.weight, 0);

            // Monday to Sunday of the current week
            const firstDay = startOfWeek(new Date());
            const lastDay = new Date(firstDay);
            lastDay.setDate(firstDay.getDate() + 6);
            lastDay.setHours(23, 59, 59, 999);

            const weekWorkouts = workouts.filter((wo) => {
              const woDate = new Date(wo.workout_perform_date ?? 0);
              return woDate >= firstDay && woDate <= lastDay;
            });

            const weekWorkoutCount = weekWorkouts.length;
            const weekTotalVolume = weekWorkouts.reduce((a: number, wo: any) => a + Number(wo.total_volume ?? wo.totalLiftedWeight ?? 0), 0);
            const weekAvgDuration = weekWorkoutCount > 0
              ? Math.round(weekWorkouts.reduce((a: number, wo: any) => a + Number(wo.duration ?? 0), 0) / weekWorkoutCount)
              : 0;

            return {
              date: (w.workout_perform_date ?? new Date().toISOString()).split(/[T ]/)[0],
              type: w.title ?? "Workout",
              duration: Number(w.duration ?? 60),
              totalVolume: Number(w.total_volume ?? w.totalLiftedWeight ?? calcVolume),
              exercises,
              weeklyStats: {
                workoutsThisWeek: weekWorkoutCount,
                totalVolumeThisWeek: weekTotalVolume,
                avgDuration: weekAvgDuration,
                streak: 0,
              },
            };
          },
          // The stored week totals belong to the week they were counted in. When even the
          // latest workout predates this Monday, nothing was trained this week.
          (last) => (last.date < isoDate(startOfWeek(new Date())) ? { ...last, weeklyStats: EMPTY_WORKOUT.weeklyStats } : last)
        );
      });
    }

    if (path === "portfolio/stats") {
      return await cached(request, path, 600, env, async () => {
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

      // Cached like the other routes: it used to call jikan-edge on every request
      // (~0.9 s each) and rewrite the KV fallback copy every time.
      try {
        return await cached(request, path, 900, env, async () => {
          type JikanEdgeFavorite = { malId: number; title: string; url?: string; startYear?: number | null; imageUrl?: string | null };
          const [statsJson, favsJson] = await Promise.all([
            fetchJikanUserResource<{ data?: { anime?: { completed?: number; watching?: number; episodesWatched?: number | null }; manga?: { completed?: number; reading?: number; chaptersRead?: number | null } } }>(user, "statistics"),
            fetchJikanUserResource<{ data?: { anime?: JikanEdgeFavorite[]; manga?: JikanEdgeFavorite[] } }>(user, "favorites"),
          ]);

          const anime = statsJson.data?.anime;
          const manga = statsJson.data?.manga;
          const favAnime = Array.isArray(favsJson.data?.anime) ? favsJson.data?.anime : [];
          const favManga = Array.isArray(favsJson.data?.manga) ? favsJson.data?.manga : [];

          // Return basic data only - details fetched separately via /mal/details
          const toBasic = (type: "anime" | "manga") => (a: JikanEdgeFavorite) => ({
            malId: a.malId,
            title: a.title,
            year: a.startYear ?? null,
            imageUrl: a.imageUrl ?? null,
            url: a.url ?? `https://myanimelist.net/${type}/${a.malId}`,
          });

          const payload = {
            animeStats: {
              completed: anime?.completed ?? 0,
              watching: anime?.watching ?? 0,
              episodesWatched: anime?.episodesWatched ?? 0,
            },
            mangaStats: {
              completed: manga?.completed ?? 0,
              reading: manga?.reading ?? 0,
              chaptersRead: manga?.chaptersRead ?? 0,
            },
            animeFavorites: favAnime.slice(0, 10).map(toBasic("anime")),
            mangaFavorites: favManga.slice(0, 10).map(toBasic("manga")),
          };

          if (payload.animeFavorites.length || payload.mangaFavorites.length) {
            lastGoodMal = payload;
            await putIfChanged(env, KV_MAL_KEY, JSON.stringify(payload)).catch(() => undefined);
          }

          return json(payload, 900);
        });
      } catch {
        if (lastGoodMal) return json(lastGoodMal, 300);
        if (env.PORTFOLIO_CACHE) {
          const kvFallback = await env.PORTFOLIO_CACHE.get(KV_MAL_KEY, { type: "text" });
          if (kvFallback) {
            lastGoodMal = JSON.parse(kvFallback);
            return json(lastGoodMal, 300);
          }
        }
        return json({ animeStats: { completed: 0, watching: 0, episodesWatched: 0 }, mangaStats: { completed: 0, reading: 0, chaptersRead: 0 }, animeFavorites: [], mangaFavorites: [] }, 30);
      }
    }

    if (path.startsWith("portfolio/mal/details")) {
      const url = new URL(request.url);
      const type = url.searchParams.get("type");
      const idsParam = url.searchParams.get("ids");
      if (!type || !idsParam) return new Response("Missing type or ids", { status: 400 });
      if (type !== "anime" && type !== "manga") {
        return new Response("Invalid type: must be 'anime' or 'manga'", { status: 400 });
      }

      const ids = idsParam.split(",").map(Number).filter(Boolean);
      const MAX_IDS = 20;
      if (ids.length > MAX_IDS) {
        return new Response(`Too many ids: max ${MAX_IDS}`, { status: 400 });
      }
      const results: Record<number, any> = {};
      
      // Check KV cache first
      const kvCacheKeys = ids.map((id) => `mal:detail:${type}:${id}`);
      const cachedResults: Record<number, any> = {};
      
      if (env.PORTFOLIO_CACHE) {
        const kv = env.PORTFOLIO_CACHE;
        const stored = await Promise.all(kvCacheKeys.map((key) => kv.get(key, { type: "text" })));
        stored.forEach((value, i) => {
          if (!value) return;
          try {
            cachedResults[ids[i]] = JSON.parse(value);
          } catch { /* ignore */ }
        });
      }
      
      // Fetch missing details with 1s delay between requests
      const missingIds = ids.filter((id) => !cachedResults[id]);
      for (let i = 0; i < missingIds.length; i++) {
        const id = missingIds[i];
        if (i > 0) await delay(1000); // 1s delay between requests
        
        const details = await fetchJikanDetails(type, id, 1);
        if (details) {
          const result = {
            score: details?.score ?? null,
            synopsis: details?.synopsis ?? null,
            type: details?.type ?? null,
            episodes: type === "anime" ? (details?.episodes ?? null) : null,
            chapters: type === "manga" ? (details?.chapters ?? null) : null,
          };
          results[id] = result;
          
          // Cache in KV for 7 days
          if (env.PORTFOLIO_CACHE) {
            await env.PORTFOLIO_CACHE.put(
              `mal:detail:${type}:${id}`,
              JSON.stringify(result),
              { expirationTtl: 604800 } // 7 days
            );
          }
        }
      }
      
      // Merge cached + fresh results
      const finalResults: Record<number, any> = { ...cachedResults, ...results };
      return json(finalResults, 300);
    }

    if (path === "portfolio/machines") {
      // Awaited so an upstream failure lands in the handler's catch as a 502 instead of
      // rejecting the whole request.
      return await cached(request, path, 300, env, async () => {
        if (env.DAILY_INGEST_DB) {
          // A D1 failure (missing table, binding misconfigured) downgrades to the
          // public-stats fallback below instead of failing the whole request.
          const rows = (await env.DAILY_INGEST_DB.prepare(MACHINE_METRICS_SQL)
            .all()
            .then((result) => result.results ?? [])
            .catch(() => [])) as unknown as MetricRow[];
          if (rows.length) {
            return json(
              {
                at: new Date().toISOString(),
                pc: buildMachineStatus(rows.filter((row) => row.source === "machine.stats")),
                server: buildMachineStatus(rows.filter((row) => row.source === "server.stats")),
              },
              300
            );
          }
        }
        return json(await fetchServerFromPublicStats(), 300);
      });
    }

    if (path === "portfolio/visitors") {
      if (env.PORTFOLIO_DB) return json({ count: await readVisits(env.PORTFOLIO_DB, env) }, 0);
      return json({ count: await kvVisitorCount(env) }, 0);
    }

    return new Response("Not found", { status: 404 });
  } catch {
    if (path === "portfolio/mal") {
      return json({ animeStats: { completed: 0, watching: 0, episodesWatched: 0 }, mangaStats: { completed: 0, reading: 0, chaptersRead: 0 }, animeFavorites: [], mangaFavorites: [] }, 60);
    }
    return new Response("Upstream error", { status: 502 });
  }
};
