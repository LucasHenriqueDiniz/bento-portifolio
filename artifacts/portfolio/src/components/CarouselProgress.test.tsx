import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { CAROUSEL_SLIDE_MS, CarouselProgress, useCarousel } from "./CarouselProgress";

function Harness({ paused }: { paused: boolean }) {
  const { index } = useCarousel(3, paused);
  return (
    <>
      <output>{index}</output>
      <CarouselProgress count={3} index={index} paused={paused} />
    </>
  );
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const slide = () => screen.getByRole("status").textContent;
const fill = () => screen.getByTestId("carousel-progress-fill");

describe("carousel progress", () => {
  it("advances a slide per turn and wraps around", () => {
    render(<Harness paused={false} />);

    act(() => vi.advanceTimersByTime(CAROUSEL_SLIDE_MS));
    expect(slide()).toBe("1");
    act(() => vi.advanceTimersByTime(CAROUSEL_SLIDE_MS));
    act(() => vi.advanceTimersByTime(CAROUSEL_SLIDE_MS));
    expect(slide()).toBe("0");
  });

  it("freezes the bar where it is while paused, instead of showing it full", () => {
    const { rerender } = render(<Harness paused={false} />);
    expect(fill().style.animationPlayState).toBe("running");

    rerender(<Harness paused />);

    expect(fill().style.animation).toContain("project-progress");
    expect(fill().style.animationPlayState).toBe("paused");
  });

  it("does not advance while paused, and finishes the same turn after resuming", () => {
    const { rerender } = render(<Harness paused={false} />);
    act(() => vi.advanceTimersByTime(4000));

    rerender(<Harness paused />);
    act(() => vi.advanceTimersByTime(60000));
    expect(slide()).toBe("0");

    rerender(<Harness paused={false} />);
    act(() => vi.advanceTimersByTime(1999));
    expect(slide()).toBe("0");
    act(() => vi.advanceTimersByTime(1));
    expect(slide()).toBe("1");
  });

  it("shows the current bar full and still under reduced motion", () => {
    render(<CarouselProgress count={3} index={1} paused={false} still />);

    expect(screen.queryByTestId("carousel-progress-fill")).not.toBeInTheDocument();
  });
});
