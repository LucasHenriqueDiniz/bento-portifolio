export interface NowPlaying {
  isPlaying: boolean;
  track: string | null;
  artist: string | null;
  album: string | null;
  albumArt: string | null;
  trackUrl: string | null;
}

export interface TopArtist {
  name: string;
  playcount: string;
  imageUrl?: string | null;
  url: string;
}

export interface SteamGame {
  name: string;
  hoursPlayed: number;
  imageUrl?: string | null;
  appId: string;
}

export interface SteamData {
  username: string;
  avatarUrl?: string | null;
  currentGame?: string | null;
  recentGames: SteamGame[];
  totalGames: number;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface WeeklyWorkoutStats {
  workoutsThisWeek: number;
  totalVolumeThisWeek: number;
  avgDuration: number;
  streak: number;
}

export interface WorkoutData {
  date: string;
  type: string;
  duration: number;
  totalVolume: number;
  exercises: WorkoutExercise[];
  weeklyStats: WeeklyWorkoutStats;
}

export interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
}

export interface PortfolioStats {
  githubContributions: number;
  githubRepos: number;
  totalCommitsThisYear: number;
  currentStreak: number;
  longestStreak: number;
  topLanguages: LanguageStat[];
}

export interface MalMediaItem {
  malId: number;
  title: string;
  year?: number | null;
  imageUrl?: string | null;
  url: string;
  score?: number | null;
  synopsis?: string | null;
  type?: string | null;
  episodes?: number | null;
  chapters?: number | null;
}

export interface MalData {
  animeStats: {
    completed: number;
    watching: number;
    episodesWatched: number;
  };
  mangaStats: {
    completed: number;
    reading: number;
    chaptersRead: number;
  };
  animeFavorites: MalMediaItem[];
  mangaFavorites: MalMediaItem[];
}

export interface ProjectApiItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured: boolean;
  year: number;
}

let baseUrl = "";

export const setBaseUrl = (next?: string) => {
  baseUrl = (next ?? "").replace(/\/$/, "");
};

const buildUrl = (path: string) => `${baseUrl}${path}`;

const fetchJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(buildUrl(path), {
    ...init,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
};

export const getNowPlaying = (options?: RequestInit) =>
  fetchJson<NowPlaying>("/api/portfolio/now-playing", options);

export const getTopArtists = (options?: RequestInit) =>
  fetchJson<TopArtist[]>("/api/portfolio/top-artists", options);

export const getSteamData = (options?: RequestInit) =>
  fetchJson<SteamData>("/api/portfolio/steam", options);

export const getLastWorkout = (options?: RequestInit) =>
  fetchJson<WorkoutData>("/api/portfolio/workout", options);

export const getStats = (options?: RequestInit) =>
  fetchJson<PortfolioStats>("/api/portfolio/stats", options);

export const getMalData = (options?: RequestInit) =>
  fetchJson<MalData>("/api/portfolio/mal", options);

export const getProjects = (options?: RequestInit) =>
  fetchJson<ProjectApiItem[]>("/api/portfolio/projects", options);
