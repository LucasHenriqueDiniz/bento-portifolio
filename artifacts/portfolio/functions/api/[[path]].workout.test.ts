import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { onRequest } from "./[[path]]";

interface WorkoutBody {
  date: string | null;
  type: string | null;
  exercises: Array<{ name: string; sets: number; reps: number; weight: number }>;
  weeklyStats: { workoutsThisWeek: number; totalVolumeThisWeek: number };
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

const today = new Date().toISOString().split("T")[0];

const lyftaWorkouts = [
  {
    title: "Arnold PPL (Pull Day)",
    workout_perform_date: `${today} 10:00:00`,
    duration: 60,
    total_volume: 9090,
    exercises: [{ excercise_name: "Pull-up", exercise_image: "", sets: [{ weight: 0, reps: 9 }, { weight: 0, reps: 8 }] }],
  },
];

const stored = (date: string) =>
  JSON.stringify({
    date,
    type: "Arnold PPL (Pull Day)",
    duration: 60,
    totalVolume: 9090,
    exercises: [{ name: "Pull-up", sets: 2, reps: 9, weight: 0, exercise_image: "" }],
    weeklyStats: { workoutsThisWeek: 3, totalVolumeThisWeek: 25000, avgDuration: 60, streak: 0 },
  });

const request = (kv: ReturnType<typeof makeKv>, key = "test-key") =>
  onRequest({
    request: new Request("https://x.test/api/portfolio/workout"),
    env: { LYFTA_API_KEY: key, PORTFOLIO_CACHE: kv },
  } as unknown as Parameters<typeof onRequest>[0]);

beforeEach(() => {
  (globalThis as unknown as { caches: unknown }).caches = { default: { match: async () => undefined, put: async () => {} } };
});

afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(globalThis, "caches");
});

describe("portfolio/workout", () => {
  it("answers an empty workout without a Lyfta key, never a made-up one", async () => {
    const body = (await (await request(makeKv(), "")).json()) as WorkoutBody;

    expect(body.date).toBeNull();
    expect(body.exercises).toEqual([]);
    expect(body.weeklyStats.workoutsThisWeek).toBe(0);
  });

  it("maps the latest Lyfta workout", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse(lyftaWorkouts)));

    const body = (await (await request(makeKv())).json()) as WorkoutBody;

    expect(body).toMatchObject({ date: today, type: "Arnold PPL (Pull Day)" });
    expect(body.exercises[0]).toMatchObject({ name: "Pull-up", sets: 2, reps: 9, weight: 0 });
    expect(body.weeklyStats.workoutsThisWeek).toBe(1);
  });

  it("serves the last known workout when Lyfta fails, keeping this week's totals", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ message: "Unauthorized" }, 401)));

    const res = await request(makeKv({ "lyfta:last-workout": stored(today) }));
    const body = (await res.json()) as WorkoutBody;

    expect(res.status).toBe(200);
    expect(body.type).toBe("Arnold PPL (Pull Day)");
    expect(body.weeklyStats.workoutsThisWeek).toBe(3);
  });

  it("zeroes the week totals of a last known workout from an earlier week", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({}, 503)));

    const body = (await (await request(makeKv({ "lyfta:last-workout": stored("2020-01-06") }))).json()) as WorkoutBody;

    expect(body.date).toBe("2020-01-06");
    expect(body.weeklyStats).toMatchObject({ workoutsThisWeek: 0, totalVolumeThisWeek: 0 });
  });
});
