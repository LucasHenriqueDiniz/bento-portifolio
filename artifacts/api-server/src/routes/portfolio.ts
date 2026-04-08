import { Router, type IRouter } from "express";
import {
  GetNowPlayingResponse,
  GetTopArtistsResponse,
  GetDiscordPresenceResponse,
  GetSteamDataResponse,
  GetLastWorkoutResponse,
  GetProjectsResponse,
  GetStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/portfolio/now-playing", async (req, res): Promise<void> => {
  const data = GetNowPlayingResponse.parse({
    isPlaying: true,
    track: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    albumArt:
      "https://picsum.photos/seed/afterhours/300/300",
    trackUrl: "https://www.last.fm/music/The+Weeknd/_/Blinding+Lights",
  });
  res.json(data);
});

router.get("/portfolio/top-artists", async (req, res): Promise<void> => {
  const data = GetTopArtistsResponse.parse([
    {
      name: "The Weeknd",
      playcount: "1247",
      imageUrl: "https://picsum.photos/seed/weeknd/100/100",
      url: "https://www.last.fm/music/The+Weeknd",
    },
    {
      name: "Daft Punk",
      playcount: "987",
      imageUrl: "https://picsum.photos/seed/daftpunk/100/100",
      url: "https://www.last.fm/music/Daft+Punk",
    },
    {
      name: "BROCKHAMPTON",
      playcount: "854",
      imageUrl: "https://picsum.photos/seed/brockh/100/100",
      url: "https://www.last.fm/music/BROCKHAMPTON",
    },
    {
      name: "Frank Ocean",
      playcount: "732",
      imageUrl: "https://picsum.photos/seed/frankocean/100/100",
      url: "https://www.last.fm/music/Frank+Ocean",
    },
    {
      name: "Tyler, the Creator",
      playcount: "698",
      imageUrl: "https://picsum.photos/seed/tyler/100/100",
      url: "https://www.last.fm/music/Tyler,+the+Creator",
    },
  ]);
  res.json(data);
});

router.get("/portfolio/discord", async (req, res): Promise<void> => {
  const data = GetDiscordPresenceResponse.parse({
    status: "dnd",
    username: "youruser#0001",
    displayName: "Your Name",
    avatarUrl: "https://api.dicebear.com/8.x/notionists/svg?seed=discorduser&backgroundColor=5865f2&radius=50",
    activity: "Visual Studio Code",
    activityDetail: "Editing portfolio.tsx",
    activityImageUrl: "https://cdn.discordapp.com/app-icons/383226320970055681/81b59e956512e6f91e72f61f0b75f686.png",
    customStatus: "building stuff ✨",
  });
  res.json(data);
});

router.get("/portfolio/steam", async (req, res): Promise<void> => {
  const data = GetSteamDataResponse.parse({
    username: "yoursteamuser",
    avatarUrl: null,
    currentGame: null,
    totalGames: 142,
    recentGames: [
      {
        name: "Cyberpunk 2077",
        hoursPlayed: 87.4,
        imageUrl:
          "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
        appId: "1091500",
      },
      {
        name: "Elden Ring",
        hoursPlayed: 124.2,
        imageUrl:
          "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
        appId: "1245620",
      },
      {
        name: "Hollow Knight",
        hoursPlayed: 43.1,
        imageUrl:
          "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg",
        appId: "367520",
      },
    ],
  });
  res.json(data);
});

router.get("/portfolio/workout", async (req, res): Promise<void> => {
  const data = GetLastWorkoutResponse.parse({
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    type: "Push (Chest / Shoulders / Triceps)",
    duration: 68,
    totalVolume: 8420,
    exercises: [
      { name: "Bench Press", sets: 4, reps: 8, weight: 100 },
      { name: "Incline Dumbbell Press", sets: 3, reps: 10, weight: 36 },
      { name: "Overhead Press", sets: 4, reps: 8, weight: 70 },
      { name: "Lateral Raises", sets: 3, reps: 15, weight: 14 },
      { name: "Tricep Pushdown", sets: 3, reps: 12, weight: 40 },
    ],
    weeklyStats: {
      workoutsThisWeek: 4,
      totalVolumeThisWeek: 31800,
      avgDuration: 65,
      streak: 12,
    },
  });
  res.json(data);
});

router.get("/portfolio/projects", async (req, res): Promise<void> => {
  const data = GetProjectsResponse.parse([
    {
      id: "1",
      title: "Portfolio Site",
      description:
        "Personal portfolio with live data integrations — music, gaming, fitness, Discord presence.",
      tags: ["React", "TypeScript", "Vite", "Framer Motion"],
      imageUrl: null,
      githubUrl: "https://github.com/youruser/portfolio",
      liveUrl: null,
      featured: true,
      year: 2025,
    },
    {
      id: "2",
      title: "DevTracker",
      description:
        "Track your coding sessions, visualize productivity patterns, and set daily goals.",
      tags: ["React", "Node.js", "PostgreSQL", "Chart.js"],
      imageUrl: null,
      githubUrl: "https://github.com/youruser/devtracker",
      liveUrl: "https://devtracker.app",
      featured: true,
      year: 2024,
    },
    {
      id: "3",
      title: "CLI Tools Collection",
      description:
        "A curated set of command-line utilities for developer productivity. Built with Go.",
      tags: ["Go", "CLI", "Open Source"],
      imageUrl: null,
      githubUrl: "https://github.com/youruser/cli-tools",
      liveUrl: null,
      featured: false,
      year: 2024,
    },
    {
      id: "4",
      title: "API Gateway Template",
      description:
        "Production-ready Express API gateway with auth, rate limiting, logging and OpenAPI codegen.",
      tags: ["Node.js", "Express", "TypeScript", "OpenAPI"],
      imageUrl: null,
      githubUrl: "https://github.com/youruser/api-gateway",
      liveUrl: null,
      featured: true,
      year: 2023,
    },
    {
      id: "5",
      title: "Real-time Collaboration Board",
      description:
        "Multiplayer whiteboard app with WebSockets, room management, and history replay.",
      tags: ["React", "WebSockets", "Canvas API", "Redis"],
      imageUrl: null,
      githubUrl: "https://github.com/youruser/collab-board",
      liveUrl: "https://board.yoursite.dev",
      featured: false,
      year: 2023,
    },
    {
      id: "6",
      title: "Finance Dashboard",
      description:
        "Personal finance tracker with bank CSV import, categorization, and spending analytics.",
      tags: ["React", "D3.js", "PostgreSQL", "TypeScript"],
      imageUrl: null,
      githubUrl: "https://github.com/youruser/finance-dash",
      liveUrl: null,
      featured: false,
      year: 2022,
    },
  ]);
  res.json(data);
});

router.get("/portfolio/stats", async (req, res): Promise<void> => {
  const data = GetStatsResponse.parse({
    githubContributions: 1284,
    githubRepos: 42,
    totalCommitsThisYear: 847,
    currentStreak: 12,
    longestStreak: 34,
    topLanguages: [
      { name: "TypeScript", percentage: 42, color: "#3178C6" },
      { name: "Go", percentage: 23, color: "#00ADD8" },
      { name: "Python", percentage: 18, color: "#3572A5" },
      { name: "Rust", percentage: 10, color: "#DEA584" },
      { name: "Shell", percentage: 7, color: "#89E051" },
    ],
  });
  res.json(data);
});

export default router;
