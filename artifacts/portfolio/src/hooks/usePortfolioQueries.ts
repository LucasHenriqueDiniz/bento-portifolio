import { useEffect } from "react";
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
  getProjects,
} from "@/lib/apiClient";

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
  });

  usePersistOnSuccess("/api/portfolio/now-playing", query.data);

  return query;
}

export function useGetTopArtistsCached() {
  const cached = getCache<Awaited<ReturnType<typeof getTopArtists>>>("/api/portfolio/top-artists");
  const query = useQuery({
    queryKey: ["/api/portfolio/top-artists"],
    queryFn: ({ signal }) => getTopArtists({ signal }),
    placeholderData: cached,
  });

  usePersistOnSuccess("/api/portfolio/top-artists", query.data);

  return query;
}

export function useGetTopTracksCached() {
  const cached = getCache<Awaited<ReturnType<typeof getTopTracks>>>("/api/portfolio/top-tracks");
  const query = useQuery({
    queryKey: ["/api/portfolio/top-tracks"],
    queryFn: ({ signal }) => getTopTracks({ signal }),
    placeholderData: cached,
  });

  usePersistOnSuccess("/api/portfolio/top-tracks", query.data);

  return query;
}

export function useGetSteamDataCached() {
  const cached = getCache<Awaited<ReturnType<typeof getSteamData>>>("/api/portfolio/steam");
  const query = useQuery({
    queryKey: ["/api/portfolio/steam"],
    queryFn: ({ signal }) => getSteamData({ signal }),
    placeholderData: cached,
  });

  usePersistOnSuccess("/api/portfolio/steam", query.data);

  return query;
}

export function useGetLastWorkoutCached() {
  const cached = getCache<Awaited<ReturnType<typeof getLastWorkout>>>("/api/portfolio/workout");
  const query = useQuery({
    queryKey: ["/api/portfolio/workout"],
    queryFn: ({ signal }) => getLastWorkout({ signal }),
    placeholderData: cached,
  });

  usePersistOnSuccess("/api/portfolio/workout", query.data);

  return query;
}

export function useGetStatsCached() {
  const cached = getCache<Awaited<ReturnType<typeof getStats>>>("/api/portfolio/stats");
  const query = useQuery({
    queryKey: ["/api/portfolio/stats"],
    queryFn: ({ signal }) => getStats({ signal }),
    placeholderData: cached,
  });

  usePersistOnSuccess("/api/portfolio/stats", query.data);

  return query;
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
  });

  useEffect(() => {
    if (query.data === undefined) return;
    if (isEmptyMalData(query.data)) {
      removeCache(key);
      return;
    }
    setCache(key, query.data);
  }, [query.data]);

  return query;
}

export function useGetProjectsCached() {
  const cached = getCache<Awaited<ReturnType<typeof getProjects>>>("/api/projects");
  const query = useQuery({
    queryKey: ["/api/portfolio/projects"],
    queryFn: ({ signal }) => getProjects({ signal }),
    placeholderData: cached,
  });

  usePersistOnSuccess("/api/portfolio/projects", query.data);

  return query;
}
