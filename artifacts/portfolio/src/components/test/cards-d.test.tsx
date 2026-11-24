import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import i18n from "@/i18n";
import { jobExperiences } from "@/constants/jobExperiences";
import { ResumeDeckCard } from "./ResumeDeckCard";
import { VisitsBoardCard } from "./VisitsBoardCard";
import { homeCellSize } from "./useHomeCell";

const { setLocation } = vi.hoisted(() => ({ setLocation: vi.fn() }));
vi.mock("wouter", () => ({ useLocation: () => ["/test", setLocation] }));

beforeEach(async () => {
  await i18n.changeLanguage("pt");
  setLocation.mockReset();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("homeCellSize", () => {
  it("gives the size a card has on the home grid for the window", () => {
    // Measured on the home at 1440x900: 469x201 for the two-column cards.
    expect(homeCellSize(1440, 900, 2, 2)).toEqual({ width: 469, height: 201 });
    expect(homeCellSize(1440, 900, 1, 2)).toEqual({ width: 231, height: 201 });
    expect(homeCellSize(1920, 1080, 2, 2)).toEqual({ width: 629, height: 246 });
  });

  it("keeps the smallest desktop cell below the breakpoint where the home stacks", () => {
    expect(homeCellSize(375, 812, 1, 2)).toEqual(homeCellSize(1024, 812, 1, 2));
  });
});

describe("ResumeDeckCard", () => {
  it("puts the current job on top and pages through the history", () => {
    render(<ResumeDeckCard />);
    expect(screen.getByText(`1/${jobExperiences.length}`)).toBeInTheDocument();
    expect(screen.getByText(jobExperiences[0].institution)).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(3200));

    expect(screen.getByText(`2/${jobExperiences.length}`)).toBeInTheDocument();
  });

  it("holds the deck while hovered and opens the resume on click", () => {
    render(<ResumeDeckCard />);
    const card = screen.getByRole("button", { name: "Ver currículo completo" });

    fireEvent.mouseEnter(card);
    act(() => vi.advanceTimersByTime(20000));
    expect(screen.getByText(`1/${jobExperiences.length}`)).toBeInTheDocument();

    fireEvent.click(card);
    expect(setLocation).toHaveBeenCalledWith("/resume");
  });
});

describe("VisitsBoardCard", () => {
  it("settles every tile on its digit, left to right", () => {
    const { container } = render(<VisitsBoardCard count={864} />);
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
    render(<VisitsBoardCard count={undefined} />);

    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
