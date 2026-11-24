import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { onRequest } from "./[[path]]";
import { clearWowTokenCache } from "../lib/wow";

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

const BASE = "https://us.api.blizzard.com/profile/wow/character/pequeno-ibuprofeno";

// Shapes of the live answers for the routes the card reads.
const answers: Record<string, unknown> = {
  "": {
    name: "Pequeno",
    surname: "Ibuprofeno",
    level: 31,
    race: { name: "Gnome" },
    character_class: { name: "Priest" },
    faction: { name: "Alliance" },
    average_item_level: 26,
  },
  "/character-media": {
    assets: [
      { key: "avatar", value: "https://render.test/avatar.jpg" },
      { key: "main-raw", value: "https://render.test/main-raw.png" },
    ],
  },
  "/equipment": {
    equipped_items: [
      { slot: { type: "HEAD", name: "Head" }, name: "Enchanter's Cowl", quality: { type: "UNCOMMON" }, level: { value: 33 } },
      { slot: { type: "SHIRT", name: "Shirt" }, name: "White Linen Shirt", quality: { type: "COMMON" }, level: { value: 1 } },
    ],
  },
  "/statistics": { health: 727, power: 2751, power_type: { name: "Mana" }, intellect: { effective: 149 } },
  "/professions": {
    primaries: [{ profession: { name: "Engineering" }, tiers: [{ skill_points: 150, max_skill_points: 150 }] }],
    secondaries: [{ profession: { name: "Cooking" }, skill_points: 1, max_skill_points: 75 }],
  },
};

function stubBattlenet(overrides: Record<string, () => Response> = {}) {
  const calls: Array<{ url: string; auth: string | null }> = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, auth: new Headers(init?.headers).get("authorization") });
      if (url === "https://oauth.battle.net/token") return (overrides.token ?? (() => jsonResponse({ access_token: "tok", expires_in: 86400 })))();
      const route = url.slice(BASE.length).split("?")[0];
      if (!url.startsWith(BASE) || !(route in answers)) throw new Error(`unexpected fetch ${url}`);
      return (overrides[route] ?? (() => jsonResponse(answers[route])))();
    })
  );
  return calls;
}

const request = (kv: ReturnType<typeof makeKv>, env: Record<string, unknown> = { BATTLENET_CLIENT_ID: "id", BATTLENET_CLIENT_SECRET: "secret" }) =>
  onRequest({
    request: new Request("https://x.test/api/portfolio/wow"),
    env: { ...env, PORTFOLIO_CACHE: kv },
  } as unknown as Parameters<typeof onRequest>[0]);

beforeEach(() => {
  clearWowTokenCache();
  (globalThis as unknown as { caches: unknown }).caches = { default: { match: async () => undefined, put: async () => {} } };
});

afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(globalThis, "caches");
});

describe("portfolio/wow", () => {
  it("reads the character from the Forever namespace with the application's token", async () => {
    const calls = stubBattlenet();

    const { character } = (await (await request(makeKv())).json()) as { character: Record<string, unknown> };

    expect(calls[0]).toEqual({ url: "https://oauth.battle.net/token", auth: `Basic ${btoa("id:secret")}` });
    expect(calls[1].url).toBe(`${BASE}?namespace=profile-forever-us&locale=en_US`);
    expect(calls[1].auth).toBe("Bearer tok");
    expect(character).toMatchObject({
      name: "Pequeno",
      surname: "Ibuprofeno",
      level: 31,
      race: "Gnome",
      className: "Priest",
      faction: "Alliance",
      guild: null,
      averageItemLevel: 26,
      renderUrl: "https://render.test/main-raw.png",
      avatarUrl: "https://render.test/avatar.jpg",
    });
    expect(character.equipment).toEqual([{ slot: "Head", name: "Enchanter's Cowl", quality: "UNCOMMON", itemLevel: 33 }]);
    expect(character.stats).toEqual([
      { key: "health", label: "Health", value: 727 },
      { key: "power", label: "Mana", value: 2751 },
      { key: "intellect", label: "Intellect", value: 149 },
    ]);
    expect(character.professions).toEqual([
      { name: "Engineering", value: 150, max: 150 },
      { name: "Cooking", value: 1, max: 75 },
    ]);
  });

  it("still answers when an optional part (the render) is not served yet", async () => {
    stubBattlenet({ "/character-media": () => jsonResponse({}, 404) });

    const { character } = (await (await request(makeKv())).json()) as { character: { name: string; renderUrl: string | null } };

    expect(character.name).toBe("Pequeno");
    expect(character.renderUrl).toBeNull();
  });

  it("answers no character, and calls nothing, without the application's credentials", async () => {
    const calls = stubBattlenet();

    await expect((await request(makeKv(), {})).json()).resolves.toEqual({ character: null });
    expect(calls).toHaveLength(0);
  });

  it("serves the last known character when Battle.net refuses the token", async () => {
    stubBattlenet({ token: () => jsonResponse({ error: "invalid_client" }, 401) });
    const kv = makeKv({ "wow:last-character": JSON.stringify({ character: { name: "Pequeno", level: 30 } }) });

    const res = await request(kv);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ character: { name: "Pequeno", level: 30 } });
  });
});
