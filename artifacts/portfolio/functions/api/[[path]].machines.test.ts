import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { onRequest } from "./[[path]]";

const TODAY_SAO_PAULO = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const row = (source: string, entity: string, metric: string, value: number, date = TODAY_SAO_PAULO) => ({
  source,
  entity,
  metric,
  value,
  date,
});

const D1_ROWS = [
  row("machine.stats", "host", "uptime_h", 16.6),
  row("machine.stats", "cpu", "cpu_used_pct", 77),
  row("machine.stats", "ram", "mem_used_pct", 47.8),
  row("machine.stats", "gpu", "temp_c", 58),
  row("machine.stats", "gpu", "gpu_used_pct", 30),
  row("machine.stats", "C", "disk_used_pct", 74.5),
  row("machine.stats", "E", "disk_used_pct", 69),
  row("server.stats", "host", "uptime_h", 6.6),
  row("server.stats", "cpu", "temp_c", 72),
  row("server.stats", "ram", "mem_used_pct", 10),
  row("server.stats", "root", "disk_used_pct", 6.1),
];

function makeDb(rows: unknown[]) {
  return {
    prepare: () => ({ all: async () => ({ results: rows }) }),
  };
}

function makeContext(env: Record<string, unknown> = {}) {
  return { request: new Request("https://x.test/api/portfolio/machines"), env } as any;
}

beforeEach(() => {
  // The edge cache is a Workers global that jsdom does not provide.
  (globalThis as any).caches = {
    default: { match: async () => undefined, put: async () => {} },
  };
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete (globalThis as any).caches;
});

describe("portfolio/machines", () => {
  it("builds both machines from the D1 telemetry rows", async () => {
    const res = await onRequest(makeContext({ DAILY_INGEST_DB: makeDb(D1_ROWS) }));

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;

    expect(body.pc).toEqual({
      online: true,
      uptimeHours: 16.6,
      cpuPct: 77,
      cpuTempC: null,
      ramPct: 47.8,
      gpuPct: 30,
      gpuTempC: 58,
      disks: [
        { name: "C", usedPct: 74.5 },
        { name: "E", usedPct: 69 },
      ],
    });
    expect(body.server).toEqual({
      online: true,
      uptimeHours: 6.6,
      cpuPct: null,
      cpuTempC: 72,
      ramPct: 10,
      gpuPct: null,
      gpuTempC: null,
      disks: [{ name: "root", usedPct: 6.1 }],
    });
  });

  it("reports a machine as offline when its newest reading is not from today", async () => {
    const staleRows = D1_ROWS.map((entry) =>
      entry.source === "machine.stats" ? { ...entry, date: "2026-08-10" } : entry
    );

    const body = (await (await onRequest(makeContext({ DAILY_INGEST_DB: makeDb(staleRows) }))).json()) as any;

    expect(body.pc.online).toBe(false);
    expect(body.pc.cpuPct).toBe(77);
    expect(body.server.online).toBe(true);
  });

  it("falls back to the public stats endpoint when the D1 binding is absent", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            at: "2026-08-18T00:42:37.209Z",
            servidor: { online: true, noArHoras: 5, cpuTempC: 70, ramPct: 10, discoPct: 6.1 },
          }),
          { status: 200 }
        )
      )
    );

    const body = (await (await onRequest(makeContext())).json()) as any;

    expect(body.pc).toBeNull();
    expect(body.server).toEqual({
      online: true,
      uptimeHours: 5,
      cpuPct: null,
      cpuTempC: 70,
      ramPct: 10,
      gpuPct: null,
      gpuTempC: null,
      disks: [{ name: "root", usedPct: 6.1 }],
    });
  });

  it("answers 502 when D1 is empty and the public endpoint fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 503 })));

    const res = await onRequest(makeContext({ DAILY_INGEST_DB: makeDb([]) }));

    expect(res.status).toBe(502);
  });
});
