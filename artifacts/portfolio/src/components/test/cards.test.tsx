import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import i18n from "@/i18n";
import { WorkoutCardV2 } from "./WorkoutCardV2";
import { WowCard } from "./WowCard";
import { WOW_SAMPLE } from "./wowSample";

const workout = {
  date: "2026-11-22",
  type: "Arnold PPL (Pull Day)",
  duration: 60,
  totalVolume: 9090,
  exercises: [
    { name: "Pull-up", sets: 2, reps: 9, weight: 0 },
    { name: "Seated Row", sets: 3, reps: 15, weight: 75 },
    { name: "Biceps Curl", sets: 3, reps: 11, weight: 26 },
  ],
  weeklyStats: { workoutsThisWeek: 2, totalVolumeThisWeek: 0, avgDuration: 60, streak: 0 },
};

beforeEach(async () => {
  await i18n.changeLanguage("pt");
});

describe("WorkoutCardV2", () => {
  it("draws one bar per exercise, the tallest for the most volume moved", () => {
    render(<WorkoutCardV2 workout={workout} />);

    const bars = screen.getAllByRole("listitem");
    expect(bars.map((b) => b.getAttribute("aria-label"))).toEqual([
      "Pull-up: 2×9",
      "Seated Row: 3×15 · 75 kg",
      "Biceps Curl: 3×11 · 26 kg",
    ]);
    const height = (bar: HTMLElement) => (bar.firstElementChild?.firstElementChild as HTMLElement).style.height;
    expect(height(bars[1])).toBe("100%");
    // 858 of 3375 kg; and a bodyweight exercise keeps a short bar instead of none.
    expect(parseFloat(height(bars[2]))).toBeCloseTo(25.42, 1);
    expect(height(bars[0])).toBe("18%");
  });

  it("writes each exercise's load under its bar", () => {
    render(<WorkoutCardV2 workout={workout} />);

    expect(screen.getAllByRole("listitem").map((bar) => bar.lastElementChild?.textContent)).toEqual(["–", "75", "26"]);
  });

  it("walks the focus along the bars when left alone", () => {
    vi.useFakeTimers();
    render(<WorkoutCardV2 workout={workout} />);
    const current = () => screen.getAllByRole("listitem").findIndex((bar) => bar.getAttribute("aria-current") === "true");
    expect(current()).toBe(0);

    act(() => vi.advanceTimersByTime(2400));
    expect(current()).toBe(1);
    act(() => vi.advanceTimersByTime(2400 * 2));
    expect(current()).toBe(0);
    vi.useRealTimers();
  });

  it("gives the focus to a hovered bar, holds it there, and names that exercise", () => {
    vi.useFakeTimers();
    const { container } = render(<WorkoutCardV2 workout={workout} />);
    const bars = screen.getAllByRole("listitem");

    fireEvent.mouseEnter(bars[2]);
    act(() => vi.advanceTimersByTime(10000));
    expect(bars[2]).toHaveAttribute("aria-current", "true");

    fireEvent.mouseLeave(container.querySelector('[role="list"]')!);
    act(() => vi.advanceTimersByTime(2400));
    expect(bars[2]).toHaveAttribute("aria-current", "false");
    vi.useRealTimers();
  });

  it("says the workout is unavailable when there is none", () => {
    render(<WorkoutCardV2 workout={{ ...workout, date: null as unknown as string, exercises: [] }} />);

    expect(screen.getByText("Dados de treino indisponíveis")).toBeInTheDocument();
  });
});

describe("WowCard", () => {
  it("shows the character, its strongest attributes and one dot per item", () => {
    render(<WowCard character={WOW_SAMPLE} />);

    expect(screen.getByText("Pequeno Ibuprofeno")).toBeInTheDocument();
    expect(screen.getByText("Nível 31 · Gnome Priest")).toBeInTheDocument();
    // A priest: intellect and spirit, not strength.
    expect(screen.getByText("Intellect")).toBeInTheDocument();
    expect(screen.getByText("Spirit")).toBeInTheDocument();
    expect(screen.queryByText("Strength")).not.toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Equipamento" }).children).toHaveLength(15);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://worldofwarcraft.blizzard.com/forever/us/armory/character/pequeno-ibuprofeno"
    );
  });

  it("tags a recorded sample as one, and live data not", () => {
    const { rerender } = render(<WowCard character={WOW_SAMPLE} sample />);
    expect(screen.getByText("amostra")).toBeInTheDocument();

    rerender(<WowCard character={WOW_SAMPLE} />);
    expect(screen.queryByText("amostra")).not.toBeInTheDocument();
  });

  it("says the character is unavailable when there is none", () => {
    render(<WowCard character={null} />);

    expect(screen.getByText("Personagem indisponível")).toBeInTheDocument();
  });
});
