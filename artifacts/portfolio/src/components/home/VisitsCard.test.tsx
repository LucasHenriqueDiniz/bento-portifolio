import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import i18n from "@/i18n";
import { VisitsCard } from "./VisitsCard";

beforeEach(async () => {
  await i18n.changeLanguage("pt");
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("VisitsCard", () => {
  it("settles every tile on its digit, left to right", () => {
    const { container } = render(<VisitsCard count={864} />);
    const tiles = () => [...container.querySelectorAll("p[aria-label] > span")].map((tile) => tile.textContent);
    expect(screen.getByLabelText("864 visitas ao site")).toBeInTheDocument();
    expect(tiles()).not.toEqual(["8", "6", "4"]);

    // The first tile spins 6 times, 70 ms each; the last one 14 times.
    for (let i = 0; i < 6; i++) act(() => vi.advanceTimersByTime(70));
    expect(tiles()[0]).toBe("8");
    expect(tiles()[2]).not.toBe("4");

    for (let i = 0; i < 8; i++) act(() => vi.advanceTimersByTime(70));
    expect(tiles()).toEqual(["8", "6", "4"]);
  });

  it("shows a dash while the total has not arrived", () => {
    render(<VisitsCard count={undefined} />);

    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
