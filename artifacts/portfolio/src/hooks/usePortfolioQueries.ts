import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCache, setCache } from "@/lib/queryCache";
import {
  getGetNowPlayingQueryOptions,
  getGetTopArtistsQueryOptions,
  getGetSteamDataQueryOptions,
  getGetLastWorkoutQueryOptions,
  getGetStatsQueryOptions,
  getGetMalDataQueryOptions,
  getGetProjectsQueryOptions,
  type getNowPlaying,
  type getTopArtists,
  type getSteamData,
  type getLastWorkout,
  type getStats,
  type getMalData,
  type getProjects,
} from "@workspace/api-client-react";

function usePersistOnSuccess<T>(queryKey: string, data: T | undefined) {
  useEffect(() => {
    if (data !== undefined) {
      setCache(queryKey, data);
    }
  }, [queryKey, data]);
}

export function useGetNowPlayingCached() {
  const cached = getCache<Awaited<ReturnType<typeof getNowPlaying>>>("/api/portfolio/now-playing");
  const opts = getGetNowPlayingQueryOptions();

  const query = useQuery({
    ...opts,
    placeholderData: cached,
  }) as ReturnType<typeof import("@workspace/api-client-react").useGetNowPlaying>;

  usePersistOnSuccess("/api/portfolio/now-playing", query.data);

  return query;
}

export function useGetTopArtistsCached() {
  const cached = getCache<Awaited<ReturnType<typeof getTopArtists>>>("/api/portfolio/top-artists");
  const opts = getGetTopArtistsQueryOptions();

  const query = useQuery({
    ...opts,
    placeholderData: cached,
  }) as ReturnType<typeof import("@workspace/api-client-react").useGetTopArtists>;

  usePersistOnSuccess("/api/portfolio/top-artists", query.data);

  return query;
}

export function useGetSteamDataCached() {
  const cached = getCache<Awaited<ReturnType<typeof getSteamData>>>("/api/portfolio/steam");
  const opts = getGetSteamDataQueryOptions();

  const query = useQuery({
    ...opts,
    placeholderData: cached,
  }) as ReturnType<typeof import("@workspace/api-client-react").useGetSteamData>;

  usePersistOnSuccess("/api/portfolio/steam", query.data);

  return query;
}

export function useGetLastWorkoutCached() {
  const cached = getCache<Awaited<ReturnType<typeof getLastWorkout>>>("/api/portfolio/workout");
  const opts = getGetLastWorkoutQueryOptions();

  const query = useQuery({
    ...opts,
    placeholderData: cached,
  }) as ReturnType<typeof import("@workspace/api-client-react").useGetLastWorkout>;

  usePersistOnSuccess("/api/portfolio/workout", query.data);

  return query;
}

export function useGetStatsCached() {
  const cached = getCache<Awaited<ReturnType<typeof getStats>>>("/api/portfolio/stats");
  const opts = getGetStatsQueryOptions();

  const query = useQuery({
    ...opts,
    placeholderData: cached,
  }) as ReturnType<typeof import("@workspace/api-client-react").useGetStats>;

  usePersistOnSuccess("/api/portfolio/stats", query.data);

  return query;
}

export function useGetMalDataCached() {
  const cached = getCache<Awaited<ReturnType<typeof getMalData>>>("/api/portfolio/mal");
  const opts = getGetMalDataQueryOptions();

  const query = useQuery({
    ...opts,
    placeholderData: cached,
  }) as ReturnType<typeof import("@workspace/api-client-react").useGetMalData>;

  usePersistOnSuccess("/api/portfolio/mal", query.data);

  return query;
}

export function useGetProjectsCached() {
  const cached = getCache<Awaited<ReturnType<typeof getProjects>>>("/api/projects");
  const opts = getGetProjectsQueryOptions();

  const query = useQuery({
    ...opts,
    placeholderData: cached,
  }) as ReturnType<typeof import("@workspace/api-client-react").useGetProjects>;

  usePersistOnSuccess("/api/projects", query.data);

  return query;
}
