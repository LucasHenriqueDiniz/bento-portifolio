import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useFlipLock } from "./useFlipLock";

describe("useFlipLock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("runs the action and locks flipping until the duration elapses", () => {
    const { result } = renderHook(() => useFlipLock(700));
    const action = vi.fn();

    act(() => {
      const ran = result.current.runWithFlipLock(action);
      expect(ran).toBe(true);
    });

    expect(action).toHaveBeenCalledTimes(1);
    expect(result.current.isFlipping).toBe(true);

    act(() => {
      vi.advanceTimersByTime(699);
    });
    expect(result.current.isFlipping).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.isFlipping).toBe(false);
  });

  it("ignores re-entrant calls while already flipping", () => {
    const { result } = renderHook(() => useFlipLock(700));
    const first = vi.fn();
    const second = vi.fn();

    act(() => {
      result.current.runWithFlipLock(first);
    });

    let secondRan: boolean | undefined;
    act(() => {
      secondRan = result.current.runWithFlipLock(second);
    });

    expect(secondRan).toBe(false);
    expect(second).not.toHaveBeenCalled();
    expect(first).toHaveBeenCalledTimes(1);
  });

  it("allows a new flip once the lock has released", () => {
    const { result } = renderHook(() => useFlipLock(500));
    const first = vi.fn();
    const second = vi.fn();

    act(() => {
      result.current.runWithFlipLock(first);
    });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.isFlipping).toBe(false);

    act(() => {
      const ran = result.current.runWithFlipLock(second);
      expect(ran).toBe(true);
    });
    expect(second).toHaveBeenCalledTimes(1);
  });
});
