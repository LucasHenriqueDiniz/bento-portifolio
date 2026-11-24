import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import i18n from "@/i18n";
import { WorkoutStoriesCard } from "./WorkoutStoriesCard";
import { GitHubCardV2, lastWeeks } from "./GitHubCardV2";

const workout = {
  date: "2026-11-22",
  type: "Arnold PPL (Pull Day)",
  duration: 60,
  totalVolume: 9090,
  exercises: [
    { name: "Pull-up", sets: 2, reps: 9, weight: 0, exercise_image: "https://img.test/pull-up.png" },
    { name: "Seated Row", sets: 3, reps: 15, weight: 75, exercise_image: "https://img.test/row.png" },
  ],
  weeklyStats: { workoutsThisWeek: 2, totalVolumeThisWeek: 0, avgDuration: 60, streak: 0 },
};

beforeEach(async () => {
  await i18n.changeLanguage("pt");
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("WorkoutStoriesCard", () => {
  it("plays one exercise at a time and moves on by itself", () => {
    render(<WorkoutStoriesCard workout={workout} />);
    expect(screen.getByText("Pull-up")).toBeInTheDocument();
    expect(screen.getByText("peso corporal")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(3199));
    expect(screen.getByRole("tab", { name: "Pull-up" })).toHaveAttribute("aria-selected", "true");
    act(() => vi.advanceTimersByTime(1));

    // The selected segment, not the slide's text: the old slide animates out first.
    expect(screen.getByRole("tab", { name: "Seated Row" })).toHaveAttribute("aria-selected", "true");
  });

  it("holds the exercise while hovered, and jumps when a segment is clicked", () => {
    const { container } = render(<WorkoutStoriesCard workout={workout} />);

    fireEvent.mouseEnter(container.querySelector(".p-3")!);
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByRole("tab", { name: "Pull-up" })).toHaveAttribute("aria-selected", "true");

    fireEvent.click(screen.getByRole("tab", { name: "Seated Row" }));
    expect(screen.getByRole("tab", { name: "Seated Row" })).toHaveAttribute("aria-selected", "true");
  });

  it("keeps the workout's own totals in the footer", () => {
    render(<WorkoutStoriesCard workout={workout} />);

    expect(screen.getByText("Arnold PPL (Pull Day)")).toBeInTheDocument();
    expect(screen.getByText("9.090 kg · 60 min")).toBeInTheDocument();
  });
});

describe("GitHubCardV2", () => {
  const days = Array.from({ length: 28 }, (_, i) => ({ date: `2026-11-${String(i + 1).padStart(2, "0")}`, count: i === 27 ? 8 : i % 3 }));

  it("cuts the days into calendar weeks and keeps the last ones", () => {
    const weeks = lastWeeks(days, 2);

    expect(weeks).toHaveLength(2);
    expect(weeks[0].map((d) => d.date)).toEqual(["2026-11-15", "2026-11-16", "2026-11-17", "2026-11-18", "2026-11-19", "2026-11-20", "2026-11-21"]);
    expect(weeks[1][6].date).toBe("2026-11-28");
  });

  it("draws one cell per day, says each day's count and marks today", () => {
    const { container } = render(
      <GitHubCardV2 stats={{ githubContributions: 4654, githubRepos: 82, currentStreak: 2, longestStreak: 23, contributionDays: days, topLanguages: [{ name: "TypeScript", percentage: 58, color: "#3178C6" }] }} />
    );

    const cells = container.querySelectorAll(".gh-cell");
    expect(cells).toHaveLength(28);
    expect(container.querySelector(".gh-cell-today")).toHaveAttribute("title", "8 contribuições · 28 de nov.");
    expect(cells[1]).toHaveAttribute("title", "1 contribuição · 2 de nov.");
    expect(screen.getByText("recorde 23", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("says the data is unavailable when there is none", () => {
    render(<GitHubCardV2 stats={undefined} />);

    expect(screen.getByText("Dados do GitHub indisponíveis")).toBeInTheDocument();
  });
});
