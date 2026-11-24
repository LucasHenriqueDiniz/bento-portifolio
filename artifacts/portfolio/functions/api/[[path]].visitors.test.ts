import { describe, expect, it } from "vitest";
import { onRequest } from "./[[path]]";

function makeKvStub(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  return {
    get: async (key: string) => store.get(key) ?? null,
    put: async (key: string, value: string) => {
      store.set(key, value);
    },
    store,
  };
}

function makeContext(url: string, env: Record<string, unknown>, method = "GET") {
  return {
    request: new Request(url, { method }),
    env,
  } as any;
}

describe("portfolio/visitors", () => {
  it("returns count 0 when nothing has been recorded yet", async () => {
    const env = { PORTFOLIO_CACHE: makeKvStub() };
    const res = await onRequest(makeContext("https://x.test/api/portfolio/visitors", env));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ count: 0 });
  });

  it("returns the current count from KV", async () => {
    const env = { PORTFOLIO_CACHE: makeKvStub({ "visitor-count": "42" }) };
    const res = await onRequest(makeContext("https://x.test/api/portfolio/visitors", env));

    await expect(res.json()).resolves.toEqual({ count: 42 });
  });

  it("increments the count on POST and persists it", async () => {
    const kv = makeKvStub({ "visitor-count": "5" });
    const env = { PORTFOLIO_CACHE: kv };
    const res = await onRequest(
      makeContext("https://x.test/api/portfolio/visitors/increment", env, "POST")
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ count: 6 });
    expect(kv.store.get("visitor-count")).toBe("6");
  });

  it("returns a 502 when the KV increment fails", async () => {
    const env = {
      PORTFOLIO_CACHE: {
        get: async () => {
          throw new Error("kv unavailable");
        },
        put: async () => {},
      },
    };
    const res = await onRequest(
      makeContext("https://x.test/api/portfolio/visitors/increment", env, "POST")
    );

    expect(res.status).toBe(502);
  });

  it("rejects unsupported methods on the increment route", async () => {
    const env = { PORTFOLIO_CACHE: makeKvStub() };
    const res = await onRequest(
      makeContext("https://x.test/api/portfolio/visitors/increment", env, "GET")
    );

    expect(res.status).toBe(404);
  });
});

// A counters table with the two statements the route runs. `first` awaits before it
// touches the value, so a read-then-write implementation would lose concurrent visits.
function makeDbStub(initial?: number) {
  const state = { value: initial as number | undefined };
  const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
  return {
    state,
    prepare: (sql: string) => ({
      bind: (...args: unknown[]) => ({
        first: async () => {
          await tick();
          if (sql.startsWith("UPDATE")) {
            if (state.value === undefined) return null;
            state.value += 1;
            return { value: state.value };
          }
          return state.value === undefined ? null : { value: state.value };
        },
        run: async () => {
          await tick();
          if (sql.startsWith("INSERT OR IGNORE") && state.value === undefined) state.value = args[1] as number;
        },
      }),
    }),
  };
}

const increment = (env: Record<string, unknown>) =>
  onRequest(makeContext("https://x.test/api/portfolio/visitors/increment", env, "POST"));

describe("portfolio/visitors on D1", () => {
  it("counts every one of fifty visits that arrive at once", async () => {
    const db = makeDbStub(100);
    const env = { PORTFOLIO_DB: db, PORTFOLIO_CACHE: makeKvStub() };

    const counts = await Promise.all(
      Array.from({ length: 50 }, async () => ((await (await increment(env)).json()) as { count: number }).count)
    );

    expect(db.state.value).toBe(150);
    expect(new Set(counts).size).toBe(50);
  });

  it("carries the KV total over on the first visit, then stops reading KV", async () => {
    const db = makeDbStub();
    const kv = makeKvStub({ "visitor-count": "860" });
    const env = { PORTFOLIO_DB: db, PORTFOLIO_CACHE: kv };

    await expect((await increment(env)).json()).resolves.toEqual({ count: 861 });
    kv.store.set("visitor-count", "5");
    await expect((await increment(env)).json()).resolves.toEqual({ count: 862 });
    expect(kv.store.get("visitor-count")).toBe("5");
  });

  it("reads the total from D1, or from KV before the first visit is counted", async () => {
    const read = async (env: Record<string, unknown>) =>
      (await onRequest(makeContext("https://x.test/api/portfolio/visitors", env))).json();

    await expect(read({ PORTFOLIO_DB: makeDbStub(900), PORTFOLIO_CACHE: makeKvStub({ "visitor-count": "860" }) })).resolves.toEqual({ count: 900 });
    await expect(read({ PORTFOLIO_DB: makeDbStub(), PORTFOLIO_CACHE: makeKvStub({ "visitor-count": "860" }) })).resolves.toEqual({ count: 860 });
  });
});
