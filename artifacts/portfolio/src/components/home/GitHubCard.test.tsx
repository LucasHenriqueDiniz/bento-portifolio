import { beforeEach, describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import i18n from "@/i18n";
import { GitHubCard } from "./GitHubCard";

const heatmapCells = (container: HTMLElement) =>
  // jsdom drops aspect-ratio from inline styles; the 2 px radius marks a day cell.
  [...container.querySelectorAll<HTMLElement>("div")].filter((el) => el.style.borderRadius === "2px");

beforeEach(async () => {
  await i18n.changeLanguage("pt");
});

describe("GitHubCard", () => {
  it("draws an empty calendar when there is no contribution data, not a made-up one", () => {
    const { container } = render(
      <GitHubCard stats={{ githubRepos: 82, githubContributions: 0, totalCommitsThisYear: 0 }} loadingStats={false} isDark={false} />
    );

    const cells = heatmapCells(container);
    expect(cells).toHaveLength(364);
    expect(new Set(cells.map((cell) => cell.style.backgroundColor))).toEqual(new Set(["rgb(235, 237, 240)"]));
  });

  it("colours the days that had contributions", () => {
    const contributionDays = Array.from({ length: 364 }, (_, i) => ({ date: `d${i}`, count: i === 363 ? 12 : 0 }));
    const { container } = render(
      <GitHubCard stats={{ githubRepos: 82, contributionDays }} loadingStats={false} isDark={false} />
    );

    const colours = heatmapCells(container).map((cell) => cell.style.backgroundColor);
    expect(colours.filter((c) => c !== "rgb(235, 237, 240)")).toEqual(["rgb(33, 110, 57)"]);
  });
});
