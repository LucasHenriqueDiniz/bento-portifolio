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
