import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { onRequest } from "./[[path]]";

const DAY = 24 * 3600;
const NOW_SEC = Math.floor(Date.now() / 1000);

const profile = { response: { players: [{ personaname: "Amayacrab", avatarfull: "https://avatars.test/a.jpg" }] } };

// What GetRecentlyPlayedGames answers when nothing was played in the last two weeks.
const noRecentGames = { response: { total_count: 0 } };

const ownedGames = {
  response: {
    game_count: 806,
    games: [
      { appid: 620, name: "Portal 2", playtime_forever: 1830, rtime_last_played: NOW_SEC - 40 * DAY },
      { appid: 1145360, name: "Hades", playtime_forever: 3075, rtime_last_played: NOW_SEC - 20 * DAY },
      { appid: 400, name: "Portal", playtime_forever: 240, rtime_last_played: NOW_SEC - 300 * DAY },
      { appid: 70, name: "Half-Life", playtime_forever: 0, rtime_last_played: 0 },
    ],
  },
};

interface SteamBody {
  currentGame: string | null;
  totalGames: number;
  recentGames: Array<{ name: string; hoursPlayed: number; imageUrl: string; appId: string; lastPlayedAt: number | null }>;
}

function makeKv(seed: Record<string, string> = {}) {
  const store = new Map(Object.entries(seed));
  return {
    store,
    get: async (key: string) => store.get(key) ?? null,
    put: async (key: string, value: string) => {
      store.set(key, value);
    },
  };
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

// The Store API answers `{ "<appid>": { success: false } }` for apps it does not list.
const storeHasNoDetails = (appId: string) => jsonResponse({ [appId]: { success: false } });

function stubSteam(answers: {
  profile?: Response;
  recent?: Response;
  owned?: Response;
  store?: (appId: string) => Response;
}) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      if (url.startsWith("https://store.steampowered.com/api/appdetails")) {
        const appId = new URL(url).searchParams.get("appids")!;
        return (answers.store ?? storeHasNoDetails)(appId);
      }
      if (url.includes("GetPlayerSummaries")) return answers.profile ?? jsonResponse(profile);
      if (url.includes("GetRecentlyPlayedGames")) return answers.recent ?? jsonResponse(noRecentGames);
      if (url.includes("GetOwnedGames")) return answers.owned ?? jsonResponse(ownedGames);
      throw new Error(`unexpected fetch ${url}`);
    })
  );
}

const request = (kv: ReturnType<typeof makeKv>) =>
  onRequest({
    request: new Request("https://x.test/api/portfolio/steam"),
    env: { STEAM_API_KEY: "test-key", STEAM_ID: "123", PORTFOLIO_CACHE: kv },
  } as unknown as Parameters<typeof onRequest>[0]);

beforeEach(() => {
  (globalThis as unknown as { caches: unknown }).caches = { default: { match: async () => undefined, put: async () => {} } };
});

afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(globalThis, "caches");
});

describe("portfolio/steam", () => {
  it("falls back to the owned library, last launched first, when nothing was played in two weeks", async () => {
    stubSteam({});

    const body = (await (await request(makeKv())).json()) as SteamBody;

    expect(body.totalGames).toBe(806);
    expect(body.recentGames.map((g) => g.name)).toEqual(["Hades", "Portal 2", "Portal"]);
    expect(body.recentGames[0]).toEqual({
      name: "Hades",
      hoursPlayed: 51.3,
      imageUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg",
      appId: "1145360",
      lastPlayedAt: (NOW_SEC - 20 * DAY) * 1000,
    });
  });

  it("uses the header image the Store API reports, and the fixed path where it reports none", async () => {
    const hashedHeader = "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145360/0a1b2c/header.jpg?t=1";
    stubSteam({
      store: (appId) =>
        appId === "1145360"
          ? jsonResponse({ [appId]: { success: true, data: { header_image: hashedHeader } } })
          : storeHasNoDetails(appId),
    });

    const body = (await (await request(makeKv())).json()) as SteamBody;

    expect(body.recentGames.map((g) => g.imageUrl)).toEqual([
      hashedHeader,
      "https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/400/header.jpg",
    ]);
  });

  it("falls back to the fixed header path when the Store API is down", async () => {
    stubSteam({ store: () => jsonResponse({}, 503) });

    const body = (await (await request(makeKv())).json()) as SteamBody;

    expect(body.recentGames[0].imageUrl).toBe("https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg");
  });

  it("keeps the two-week list when there is one, dated from the owned library", async () => {
    stubSteam({
      recent: jsonResponse({
        response: { total_count: 1, games: [{ appid: 620, name: "Portal 2", playtime_2weeks: 90, playtime_forever: 1830 }] },
      }),
    });

    const body = (await (await request(makeKv())).json()) as SteamBody;

    expect(body.recentGames).toEqual([
      expect.objectContaining({ name: "Portal 2", hoursPlayed: 30.5, lastPlayedAt: (NOW_SEC - 40 * DAY) * 1000 }),
    ]);
  });

  it("serves the last known games, with nothing playing now, when Steam fails", async () => {
    stubSteam({ owned: jsonResponse({}, 503) });
    const kv = makeKv({
      "steam:last-good": JSON.stringify({ currentGame: "Hades", totalGames: 806, recentGames: [{ name: "Hades", appId: "1145360" }] }),
    });

    const res = await request(kv);
    const body = (await res.json()) as SteamBody;

    expect(res.status).toBe(200);
    expect(body.recentGames[0].name).toBe("Hades");
    expect(body.currentGame).toBeNull();
  });

  it("answers 502 for a private library with no games ever stored", async () => {
    stubSteam({ owned: jsonResponse({ response: {} }) });

    const res = await request(makeKv());

    expect(res.status).toBe(502);
  });
});
