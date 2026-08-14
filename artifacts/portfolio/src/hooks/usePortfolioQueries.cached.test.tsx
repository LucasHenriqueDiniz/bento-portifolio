import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/apiClient", () => ({
  getStats: vi.fn(),
  getMalData: vi.fn(),
}));

import { getMalData, getStats } from "@/lib/apiClient";
import { getCache } from "@/lib/queryCache";
import { useGetMalDataCached, useGetStatsCached } from "./usePortfolioQueries";

function createWrapper() {
  // retry: false so a rejected queryFn settles immediately instead of
  // burning real time on react-query's exponential backoff retries.
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

const EMPTY_STATS = {
  githubContributions: 0,
  githubRepos: 0,
  totalCommitsThisYear: 0,
  currentStreak: 0,
  longestStreak: 0,
  topLanguages: [],
};

const REAL_STATS = { ...EMPTY_STATS, githubRepos: 12, totalCommitsThisYear: 340 };

const EMPTY_MAL = {
  animeStats: { completed: 0, watching: 0, episodesWatched: 0 },
  mangaStats: { completed: 0, reading: 0, chaptersRead: 0 },
  animeFavorites: [],
  mangaFavorites: [],
};

const REAL_MAL = {
  ...EMPTY_MAL,
  animeStats: { completed: 10, watching: 2, episodesWatched: 500 },
};

describe("useGetStatsCached", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(getStats).mockReset();
  });

  it("returns fresh data once the query resolves", async () => {
    vi.mocked(getStats).mockResolvedValue(REAL_STATS);
    const { result } = renderHook(() => useGetStatsCached(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.data).toEqual(REAL_STATS));
  });

  it("falls back to cached data when the query resolves empty", async () => {
    localStorage.setItem(
      "portfolio:query:/api/portfolio/stats",
      JSON.stringify({ v: 1, data: REAL_STATS, ts: Date.now() }),
    );
    vi.mocked(getStats).mockResolvedValue(EMPTY_STATS);

    const { result } = renderHook(() => useGetStatsCached(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isFetched).toBe(true));
    expect(result.current.data).toEqual(REAL_STATS);
  });

  it("persists fresh non-empty data to localStorage", async () => {
    vi.mocked(getStats).mockResolvedValue(REAL_STATS);
    renderHook(() => useGetStatsCached(), { wrapper: createWrapper() });

    await waitFor(() => expect(getCache("/api/portfolio/stats")).toEqual(REAL_STATS));
  });
});

describe("useGetMalDataCached", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(getMalData).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns fresh data once the query resolves", async () => {
    vi.mocked(getMalData).mockResolvedValue(REAL_MAL);
    const { result } = renderHook(() => useGetMalDataCached(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.data).toEqual(REAL_MAL));
  });

  it("clears a stale empty cache entry on mount instead of using it as placeholder data", () => {
    localStorage.setItem(
      "portfolio:query:/api/portfolio/mal",
      JSON.stringify({ v: 1, data: EMPTY_MAL, ts: Date.now() }),
    );
    vi.mocked(getMalData).mockResolvedValue(REAL_MAL);

    const { result } = renderHook(() => useGetMalDataCached(), { wrapper: createWrapper() });

    expect(result.current.data).toBeUndefined();
    expect(getCache("/api/portfolio/mal")).toBeUndefined();
  });

  it("removes the cache entry when a fresh fetch resolves empty", async () => {
    localStorage.setItem(
      "portfolio:query:/api/portfolio/mal",
      JSON.stringify({ v: 1, data: REAL_MAL, ts: Date.now() }),
    );
    vi.mocked(getMalData).mockResolvedValue(EMPTY_MAL);

    const { result } = renderHook(() => useGetMalDataCached(), { wrapper: createWrapper() });

    await waitFor(() => expect(getCache("/api/portfolio/mal")).toBeUndefined());
    expect(result.current.data).toEqual(REAL_MAL); // still shows the pre-fetch placeholder until removed
  });
});
