import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import i18n from "@/i18n";
import { GitHubCard, lastWeeks } from "./GitHubCard";

beforeEach(async () => {
  await i18n.changeLanguage("pt");
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("GitHubCard", () => {
  const days = Array.from({ length: 28 }, (_, i) => ({ date: `2026-11-${String(i + 1).padStart(2, "0")}`, count: i === 27 ? 8 : i % 3 }));

  it("cuts the days into calendar weeks and keeps the last ones", () => {
    const weeks = lastWeeks(days, 2);

    expect(weeks).toHaveLength(2);
    expect(weeks[0].map((d) => d.date)).toEqual(["2026-11-15", "2026-11-16", "2026-11-17", "2026-11-18", "2026-11-19", "2026-11-20", "2026-11-21"]);
    expect(weeks[1][6].date).toBe("2026-11-28");
  });

  it("draws one cell per day, says each day's count and marks today", () => {
    const { container } = render(
      <GitHubCard stats={{ githubContributions: 4654, githubRepos: 82, currentStreak: 2, longestStreak: 23, contributionDays: days, topLanguages: [{ name: "TypeScript", percentage: 58, color: "#3178C6" }] }} />
    );

    const cells = container.querySelectorAll(".gh-cell");
    expect(cells).toHaveLength(28);
    expect(container.querySelector(".gh-cell-today")).toHaveAttribute("title", "8 contribuições · 28 de nov.");
    expect(cells[1]).toHaveAttribute("title", "1 contribuição · 2 de nov.");
    expect(screen.getByText("recorde 23", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("says the data is unavailable when there is none", () => {
    render(<GitHubCard stats={undefined} />);

    expect(screen.getByText("Dados do GitHub indisponíveis")).toBeInTheDocument();
  });
});
