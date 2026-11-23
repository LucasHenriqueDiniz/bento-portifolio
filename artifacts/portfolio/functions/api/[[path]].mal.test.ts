import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

interface MalBody {
  animeStats: { completed: number };
  animeFavorites: Array<{ title: string }>;
}

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

const jikanEdge = (url: string) =>
  url.endsWith("/statistics")
    ? jsonResponse({ data: { anime: { completed: 273, watching: 2, episodesWatched: 4111 }, manga: { completed: 10 } } })
    : jsonResponse({ data: { anime: [{ malId: 1, title: "Cowboy Bebop", imageUrl: "https://img.test/1.jpg" }], manga: [] } });

// The route keeps an in-memory copy of the last good payload per isolate, so each test
// loads the module afresh.
let onRequest: (typeof import("./[[path]]"))["onRequest"];

const request = (kv: ReturnType<typeof makeKv>) =>
  onRequest({
    request: new Request("https://x.test/api/portfolio/mal"),
    env: { MAL_USERNAME: "someone", PORTFOLIO_CACHE: kv },
  } as unknown as Parameters<typeof onRequest>[0]);

beforeEach(async () => {
  vi.resetModules();
  ({ onRequest } = await import("./[[path]]"));
  (globalThis as unknown as { caches: unknown }).caches = { default: { match: async () => undefined, put: async () => {} } };
});

afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(globalThis, "caches");
});

describe("portfolio/mal", () => {
  it("serves repeat requests from the cache, without calling jikan-edge or writing KV again", async () => {
    const upstream = vi.fn(async (url: string) => jikanEdge(url));
    vi.stubGlobal("fetch", upstream);
    const kv = makeKv();

    const first = (await (await request(kv)).json()) as MalBody;
    const callsAfterFirst = upstream.mock.calls.length;
    const writesAfterFirst = kv.puts.length;
    const second = (await (await request(kv)).json()) as MalBody;

    expect(first.animeFavorites[0].title).toBe("Cowboy Bebop");
    expect(second).toEqual(first);
    expect(callsAfterFirst).toBe(2);
    expect(upstream).toHaveBeenCalledTimes(2);
    expect(kv.puts).toHaveLength(writesAfterFirst);
  });

  it("falls back to the last good payload when jikan-edge fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ error: { code: "upstream" } }, 500)));
    const kv = makeKv({ mal: JSON.stringify({ animeStats: { completed: 270 }, animeFavorites: [{ title: "Monster" }] }) });

    const body = (await (await request(kv)).json()) as MalBody;

    expect(body.animeFavorites[0].title).toBe("Monster");
  });
});
