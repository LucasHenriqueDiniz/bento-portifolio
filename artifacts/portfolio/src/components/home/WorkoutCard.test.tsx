import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import i18n from "@/i18n";
import { WorkoutCard } from "./WorkoutCard";

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

describe("WorkoutCard", () => {
  it("draws one bar per exercise, the tallest for the most volume moved", () => {
    render(<WorkoutCard workout={workout} />);

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
    render(<WorkoutCard workout={workout} />);

    expect(screen.getAllByRole("listitem").map((bar) => bar.lastElementChild?.textContent)).toEqual(["–", "75", "26"]);
  });

  it("walks the focus along the bars when left alone", () => {
    vi.useFakeTimers();
    render(<WorkoutCard workout={workout} />);
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
    const { container } = render(<WorkoutCard workout={workout} />);
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
    render(<WorkoutCard workout={{ ...workout, date: null as unknown as string, exercises: [] }} />);

    expect(screen.getByText("Dados de treino indisponíveis")).toBeInTheDocument();
  });

  it("names the exercise in focus with the load of the set, not the volume it adds up to", () => {
    render(<WorkoutCard workout={{ ...workout, exercises: [workout.exercises[1]] }} />);

    // 3 x 15 x 75 is 3,375 kg of volume; the line shows the 75 kg on the bar.
    expect(screen.getByText("3×15 · 75 kg")).toBeInTheDocument();
  });

  it("rolls the total in as an odometer and says it whole to screen readers", () => {
    render(<WorkoutCard workout={workout} />);

    const total = screen.getByRole("img", { name: "9.090 kg" });
    // Four digits, each a strip of 0-9; the thousands separator stays still.
    expect(total.querySelectorAll("span.overflow-hidden")).toHaveLength(4);
  });

  it("pulses its icon while loading instead of saying the data is missing", () => {
    render(<WorkoutCard workout={undefined} isLoading />);

    expect(screen.queryByText("Dados de treino indisponíveis")).not.toBeInTheDocument();
  });
});
