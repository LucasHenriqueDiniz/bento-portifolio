import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useClock } from "./useClock";

describe("useClock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:34:56Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats the current time for the given timezone", () => {
    const { result } = renderHook(() => useClock("America/Sao_Paulo"));

    // 12:34:56 UTC is 09:34:56 in America/Sao_Paulo (UTC-3)
    expect(result.current).toEqual({ h: "09", m: "34", s: "56" });
  });

  it("ticks forward once per second", () => {
    const { result } = renderHook(() => useClock("America/Sao_Paulo"));
    expect(result.current.s).toBe("56");

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.s).toBe("57");

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current).toEqual({ h: "09", m: "35", s: "02" });
  });

  it("supports a different timezone", () => {
    const { result } = renderHook(() => useClock("America/New_York"));

    // 12:34:56 UTC is 08:34:56 in America/New_York (UTC-4 in June, DST)
    expect(result.current).toEqual({ h: "08", m: "34", s: "56" });
  });
});
