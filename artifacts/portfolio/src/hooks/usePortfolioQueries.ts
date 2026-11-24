import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCache, removeCache, setCache } from "@/lib/queryCache";
import {
  getNowPlaying,
  getTopArtists,
  getTopTracks,
  getSteamData,
  getLastWorkout,
  getStats,
  getMalData,
  getMachinesStatus,
  getVisitorCount,
  incrementVisitorCount,
} from "@/lib/apiClient";

const QUERY_STABILITY_OPTIONS = {
  retry: 2,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  staleTime: 1000 * 60 * 5,
} as const;

const hasItems = <T>(value: T[] | undefined | null) => Array.isArray(value) && value.length > 0;

const hasNowPlayingData = (data: Awaited<ReturnType<typeof getNowPlaying>> | undefined) =>
  Boolean(data && (data.isPlaying || data.track || data.artist || data.album || data.albumArt || data.trackUrl));

const hasSteamData = (data: Awaited<ReturnType<typeof getSteamData>> | undefined) =>
  Boolean(data && ((data.recentGames?.length ?? 0) > 0 || (data.totalGames ?? 0) > 0));

const hasWorkoutData = (data: Awaited<ReturnType<typeof getLastWorkout>> | undefined) =>
  Boolean(data && ((data.exercises?.length ?? 0) > 0 || (data.totalVolume ?? 0) > 0 || (data.duration ?? 0) > 0));

const hasStatsData = (data: Awaited<ReturnType<typeof getStats>> | undefined) =>
  Boolean(data && ((data.githubRepos ?? 0) > 0 || (data.totalCommitsThisYear ?? 0) > 0 || (data.githubContributions ?? 0) > 0));

function usePersistOnSuccess<T>(queryKey: string, data: T | undefined) {
  useEffect(() => {
    if (data !== undefined) {
      setCache(queryKey, data);
    }
  }, [queryKey, data]);
}

export function useGetNowPlayingCached() {
  const cached = getCache<Awaited<ReturnType<typeof getNowPlaying>>>("/api/portfolio/now-playing");
  const query = useQuery({
    queryKey: ["/api/portfolio/now-playing"],
    queryFn: ({ signal }) => getNowPlaying({ signal }),
    placeholderData: cached,
    ...QUERY_STABILITY_OPTIONS,
  });

  const data = hasNowPlayingData(query.data) ? query.data : cached;
  usePersistOnSuccess("/api/portfolio/now-playing", hasNowPlayingData(data) ? data : undefined);

  return { ...query, data };
}

export function useGetTopArtistsCached() {
  const cached = getCache<Awaited<ReturnType<typeof getTopArtists>>>("/api/portfolio/top-artists");
  const query = useQuery({
    queryKey: ["/api/portfolio/top-artists"],
    queryFn: ({ signal }) => getTopArtists({ signal }),
    placeholderData: cached,
    ...QUERY_STABILITY_OPTIONS,
  });

  const data = hasItems(query.data) ? query.data : cached;
  usePersistOnSuccess("/api/portfolio/top-artists", hasItems(data) ? data : undefined);

  return { ...query, data };
}

export function useGetTopTracksCached() {
  const cached = getCache<Awaited<ReturnType<typeof getTopTracks>>>("/api/portfolio/top-tracks");
  const query = useQuery({
    queryKey: ["/api/portfolio/top-tracks"],
    queryFn: ({ signal }) => getTopTracks({ signal }),
    placeholderData: cached,
    ...QUERY_STABILITY_OPTIONS,
  });

  const data = hasItems(query.data) ? query.data : cached;
  usePersistOnSuccess("/api/portfolio/top-tracks", hasItems(data) ? data : undefined);

  return { ...query, data };
}

export function useGetSteamDataCached() {
  const cached = getCache<Awaited<ReturnType<typeof getSteamData>>>("/api/portfolio/steam");
  const query = useQuery({
    queryKey: ["/api/portfolio/steam"],
    queryFn: ({ signal }) => getSteamData({ signal }),
    placeholderData: cached,
    ...QUERY_STABILITY_OPTIONS,
  });

  const data = hasSteamData(query.data) ? query.data : cached;
  usePersistOnSuccess("/api/portfolio/steam", hasSteamData(data) ? data : undefined);

  return { ...query, data };
}

export function useGetLastWorkoutCached() {
  const cached = getCache<Awaited<ReturnType<typeof getLastWorkout>>>("/api/portfolio/workout");
  const query = useQuery({
    queryKey: ["/api/portfolio/workout"],
    queryFn: ({ signal }) => getLastWorkout({ signal }),
    placeholderData: cached,
    ...QUERY_STABILITY_OPTIONS,
  });

  const data = hasWorkoutData(query.data) ? query.data : cached;
  usePersistOnSuccess("/api/portfolio/workout", hasWorkoutData(data) ? data : undefined);

  return { ...query, data };
}

export function useGetStatsCached() {
  const cached = getCache<Awaited<ReturnType<typeof getStats>>>("/api/portfolio/stats");
  const query = useQuery({
    queryKey: ["/api/portfolio/stats"],
    queryFn: ({ signal }) => getStats({ signal }),
    placeholderData: cached,
    ...QUERY_STABILITY_OPTIONS,
  });

  const data = hasStatsData(query.data) ? query.data : cached;
  usePersistOnSuccess("/api/portfolio/stats", hasStatsData(data) ? data : undefined);

  return { ...query, data };
}

export function useGetMalDataCached() {
  const key = "/api/portfolio/mal";
  const cached = getCache<Awaited<ReturnType<typeof getMalData>>>(key);
  const isEmptyMalData = (payload: unknown) => {
    if (!payload || typeof payload !== "object") return true;
    const data = payload as Partial<Awaited<ReturnType<typeof getMalData>>>;
    const anime = data.animeStats;
    const manga = data.mangaStats;
    const animeEmpty =
      (anime?.completed ?? 0) === 0 &&
      (anime?.watching ?? 0) === 0 &&
      (anime?.episodesWatched ?? 0) === 0;
    const mangaEmpty =
      (manga?.completed ?? 0) === 0 &&
      (manga?.reading ?? 0) === 0 &&
      (manga?.chaptersRead ?? 0) === 0;
    return animeEmpty && mangaEmpty && (data.animeFavorites?.length ?? 0) === 0 && (data.mangaFavorites?.length ?? 0) === 0;
  };

  const safeCached = isEmptyMalData(cached) ? undefined : cached;
  if (!safeCached && cached) {
    removeCache(key);
  }

  const query = useQuery({
    queryKey: [key],
    queryFn: ({ signal }) => getMalData({ signal }),
    placeholderData: safeCached,
    ...QUERY_STABILITY_OPTIONS,
  });

  useEffect(() => {
    if (query.data === undefined) return;
    if (isEmptyMalData(query.data)) {
      removeCache(key);
      return;
    }
    setCache(key, query.data);
  }, [query.data]);

  const data = isEmptyMalData(query.data) ? safeCached : query.data;
  return { ...query, data };
}

// Set once a visit has been counted in this tab. sessionStorage lasts until the tab
// closes, so a reload shows the total without counting the same visit again.
const VISIT_COUNTED_KEY = "portfolio:visit-counted";

const visitAlreadyCounted = () => {
  try {
    return sessionStorage.getItem(VISIT_COUNTED_KEY) === "1";
  } catch {
    return false;
  }
};

const markVisitCounted = () => {
  try {
    sessionStorage.setItem(VISIT_COUNTED_KEY, "1");
  } catch {
    // Storage unavailable (private mode): the next load counts again.
  }
};

export function useVisitorCount() {
  const key = "/api/portfolio/visitors";
  const cached = getCache<number>(key);
  const [count, setCount] = useState<number | undefined>(cached);
  const hasRequested = useRef(false);

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    const show = (result: { count: number }) => {
      setCount(result.count);
      setCache(key, result.count);
    };
    const readOnly = () => getVisitorCount().then(show).catch((e) => console.warn("visitor count fallback failed:", e));

    if (visitAlreadyCounted()) {
      readOnly();
      return;
    }
    incrementVisitorCount()
      .then((result) => {
        markVisitCounted();
        show(result);
      })
      .catch(readOnly);
  }, []);

  return count;
}

// `online: false` is a valid reading (the machine is off), so having at least one
// machine block is the only emptiness signal here.
const hasMachinesStatus = (data: Awaited<ReturnType<typeof getMachinesStatus>> | undefined) =>
  Boolean(data && typeof data.at === "string" && (data.pc || data.server));

export function useGetMachinesStatusCached() {
  const cached = getCache<Awaited<ReturnType<typeof getMachinesStatus>>>("/api/portfolio/machines");
  const query = useQuery({
    queryKey: ["/api/portfolio/machines"],
    queryFn: ({ signal }) => getMachinesStatus({ signal }),
    placeholderData: cached,
    ...QUERY_STABILITY_OPTIONS,
  });

  const data = hasMachinesStatus(query.data) ? query.data : cached;
  usePersistOnSuccess("/api/portfolio/machines", hasMachinesStatus(data) ? data : undefined);

  return { ...query, data };
}
