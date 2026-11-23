import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { onRequest } from "./[[path]]";

function makeKv(seed: Record<string, string> = {}) {
  const store = new Map(Object.entries(seed));
  const puts: string[] = [];
  return {
    store,
    puts,
    get: async (key: string) => store.get(key) ?? null,
    put: async (key: string, value: string) => {
      puts.push(key);
      store.set(key, value);
    },
  };
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const recentTrack = (name: string) => ({
  recenttracks: {
    track: [
      {
        artist: { "#text": "Evanescence" },
        image: [{ size: "extralarge", "#text": "https://lastfm.test/art.jpg" }],
        album: { "#text": "Fallen" },
        name,
        url: "https://www.last.fm/music/Evanescence/_/x",
        date: { uts: "1795398689" },
      },
    ],
  },
});

const request = (route: string, kv: ReturnType<typeof makeKv>) =>
  onRequest({
    request: new Request(`https://x.test/api/portfolio/${route}`),
    env: { LASTFM_API_KEY: "test-key", LASTFM_USERNAME: "someone", PORTFOLIO_CACHE: kv },
  } as unknown as Parameters<typeof onRequest>[0]);

beforeEach(() => {
  (globalThis as unknown as { caches: unknown }).caches = { default: { match: async () => undefined, put: async () => {} } };
});

afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(globalThis, "caches");
});

describe("route cache", () => {
  it("does not serve now-playing from a KV copy, which could be ten minutes old", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse(recentTrack("Tourniquet"))));
    const kv = makeKv({ "portfolio/now-playing": JSON.stringify({ isPlaying: true, track: "Going Under" }) });

    const body = (await (await request("now-playing", kv)).json()) as { track: string };

    expect(body.track).toBe("Tourniquet");
    expect(kv.puts).not.toContain("portfolio/now-playing");
  });

  it("still serves routes refreshed every five minutes or more from the KV copy", async () => {
    const upstream = vi.fn(async () => jsonResponse({ topartists: { artist: [] } }));
    vi.stubGlobal("fetch", upstream);
    const kv = makeKv({ "portfolio/top-artists": JSON.stringify([{ name: "Evanescence" }]) });

    const body = (await (await request("top-artists", kv)).json()) as Array<{ name: string }>;

    expect(body[0].name).toBe("Evanescence");
    expect(upstream).not.toHaveBeenCalled();
  });

  it("rewrites the last known track only when it changed", async () => {
    let track = "Tourniquet";
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse(recentTrack(track))));
    const kv = makeKv();

    await request("now-playing", kv);
    await request("now-playing", kv);
    track = "Going Under";
    await request("now-playing", kv);

    expect(kv.puts.filter((key) => key === "lastfm:last-track")).toHaveLength(2);
  });
});
