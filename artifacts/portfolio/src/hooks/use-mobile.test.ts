import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useIsMobile } from "./use-mobile";

function mockViewport(width: number) {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: width });

  let changeHandler: (() => void) | undefined;
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: width < 768,
    media: query,
    addEventListener: (_event: string, handler: () => void) => {
      changeHandler = handler;
    },
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;

  return {
    resize: (nextWidth: number) => {
      Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: nextWidth });
      changeHandler?.();
    },
  };
}

describe("useIsMobile", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reports true below the mobile breakpoint", () => {
    mockViewport(500);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("reports false at or above the mobile breakpoint", () => {
    mockViewport(1024);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("updates when the viewport crosses the breakpoint", () => {
    const viewport = mockViewport(1024);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    act(() => viewport.resize(500));
    expect(result.current).toBe(true);
  });
});
