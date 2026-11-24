import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { onRequest } from "./[[path]]";

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

const item = (sha: string, message: string, isPrivate = false) => ({
  sha,
  html_url: `https://github.com/lucas/site/commit/${sha}`,
  commit: { message, author: { date: "2026-11-24T15:27:50.000-03:00" } },
  repository: { full_name: "lucas/site", private: isPrivate },
});

function stubGithub(respond: () => Response) {
  const calls: Array<{ url: string; auth: string | null }> = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ url: String(input), auth: new Headers(init?.headers).get("authorization") });
      return respond();
    })
  );
  return calls;
}

const ok = (items: unknown[]) => () =>
  new Response(JSON.stringify({ items }), { status: 200, headers: { "content-type": "application/json" } });

const request = (kv: ReturnType<typeof makeKv>) =>
  onRequest({
    request: new Request("https://x.test/api/portfolio/commits"),
    env: { GITHUB_USERNAME: "lucas", GITHUB_PAT: "pat", PORTFOLIO_CACHE: kv },
  } as unknown as Parameters<typeof onRequest>[0]);

beforeEach(() => {
  (globalThis as unknown as { caches: unknown }).caches = { default: { match: async () => undefined, put: async () => {} } };
});

afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(globalThis, "caches");
});

describe("portfolio/commits", () => {
  it("searches the account's public commits, newest first, and keeps the first line of each message", async () => {
    const calls = stubGithub(ok([item("aaaaaaa1", "portfolio: first line\n\nbody that stays out")]));

    const { commits } = (await (await request(makeKv())).json()) as { commits: unknown[] };

    const url = new URL(calls[0].url);
    expect(url.pathname).toBe("/search/commits");
    expect(url.searchParams.get("q")).toBe("author:lucas is:public");
    expect(url.searchParams.get("sort")).toBe("author-date");
    expect(url.searchParams.get("order")).toBe("desc");
    expect(calls[0].auth).toBe("Bearer pat");
    expect(commits).toEqual([
      {
        sha: "aaaaaaa1",
        message: "portfolio: first line",
        repo: "lucas/site",
        url: "https://github.com/lucas/site/commit/aaaaaaa1",
        date: "2026-11-24T15:27:50.000-03:00",
      },
    ]);
  });

  it("never returns a commit from a private repository, even if the search hands one back", async () => {
    stubGithub(ok([item("priv0001", "secret work", true), item("pub00001", "public work")]));

    const { commits } = (await (await request(makeKv())).json()) as { commits: Array<{ sha: string }> };

    expect(commits.map((commit) => commit.sha)).toEqual(["pub00001"]);
  });

  it("returns at most six commits", async () => {
    stubGithub(ok(Array.from({ length: 12 }, (_, i) => item(`sha${i}`, `commit ${i}`))));

    const { commits } = (await (await request(makeKv())).json()) as { commits: unknown[] };

    expect(commits).toHaveLength(6);
  });

  it("answers with the last commits it saw when GitHub fails", async () => {
    const kv = makeKv();
    stubGithub(ok([item("aaaaaaa1", "remembered")]));
    await request(kv);

    stubGithub(() => new Response("rate limited", { status: 403 }));
    const res = await request(kv);

    expect(res.status).toBe(200);
    expect(((await res.json()) as { commits: Array<{ message: string }> }).commits[0].message).toBe("remembered");
  });

  it("is an upstream error when GitHub fails and nothing was ever seen", async () => {
    stubGithub(() => new Response("rate limited", { status: 403 }));

    expect((await request(makeKv())).status).toBe(502);
  });
});
