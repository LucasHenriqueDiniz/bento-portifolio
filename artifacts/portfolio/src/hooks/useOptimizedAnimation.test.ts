import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useOptimizedAnimation } from "./useOptimizedAnimation";

describe("useOptimizedAnimation", () => {
  let rafCallbacks: Map<number, FrameRequestCallback>;
  let nextRafId: number;
  let now: number;

  beforeEach(() => {
    rafCallbacks = new Map();
    nextRafId = 1;
    // Start comfortably above 0 so the first call isn't throttled by the
    // hook's own initial `lastUpdateRef.current = 0`.
    now = 1000;
    vi.stubGlobal("performance", { now: () => now });
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((cb: FrameRequestCallback) => {
        const id = nextRafId++;
        rafCallbacks.set(id, cb);
        return id;
      }),
    );
    vi.stubGlobal(
      "cancelAnimationFrame",
      vi.fn((id: number) => {
        rafCallbacks.delete(id);
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function flushRaf() {
    const pending = [...rafCallbacks.values()];
    rafCallbacks.clear();
    pending.forEach((cb) => cb(now));
  }

  it("schedules the callback via requestAnimationFrame and runs it once flushed", () => {
    const { result } = renderHook(() => useOptimizedAnimation());
    const callback = vi.fn();

    result.current.throttledUpdate(callback);
    expect(callback).not.toHaveBeenCalled();

    flushRaf();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("throttles calls that arrive within the throttle window", () => {
    const { result } = renderHook(() => useOptimizedAnimation());
    const callback = vi.fn();

    result.current.throttledUpdate(callback, 16);
    flushRaf();
    expect(callback).toHaveBeenCalledTimes(1);

    now += 5; // still within the 16ms window
    result.current.throttledUpdate(callback, 16);
    expect(rafCallbacks.size).toBe(0); // no new rAF scheduled
  });

  it("allows a new update once the throttle window has passed", () => {
    const { result } = renderHook(() => useOptimizedAnimation());
    const callback = vi.fn();

    result.current.throttledUpdate(callback, 16);
    flushRaf();
    expect(callback).toHaveBeenCalledTimes(1);

    now += 20; // past the 16ms window
    result.current.throttledUpdate(callback, 16);
    flushRaf();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("cleanup cancels a pending animation frame", () => {
    const { result } = renderHook(() => useOptimizedAnimation());
    const callback = vi.fn();

    result.current.throttledUpdate(callback);
    result.current.cleanup();

    flushRaf();
    expect(callback).not.toHaveBeenCalled();
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });
});
