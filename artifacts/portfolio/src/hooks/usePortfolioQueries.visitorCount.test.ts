import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/apiClient", () => ({
  incrementVisitorCount: vi.fn(),
  getVisitorCount: vi.fn(),
}));

import { getVisitorCount, incrementVisitorCount } from "@/lib/apiClient";
import { useVisitorCount } from "./usePortfolioQueries";

describe("useVisitorCount", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.mocked(incrementVisitorCount).mockReset();
    vi.mocked(getVisitorCount).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sets the count from a successful increment and caches it", async () => {
    vi.mocked(incrementVisitorCount).mockResolvedValue({ count: 7 });

    const { result } = renderHook(() => useVisitorCount());

    await waitFor(() => expect(result.current).toBe(7));
    expect(getVisitorCount).not.toHaveBeenCalled();
    expect(JSON.parse(localStorage.getItem("portfolio:query:/api/portfolio/visitors")!).data).toBe(7);
  });

  it("falls back to a plain GET when increment fails", async () => {
    vi.mocked(incrementVisitorCount).mockRejectedValue(new Error("increment failed"));
    vi.mocked(getVisitorCount).mockResolvedValue({ count: 3 });

    const { result } = renderHook(() => useVisitorCount());

    await waitFor(() => expect(result.current).toBe(3));
  });

  it("stays undefined and logs a warning when both increment and fallback fail", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(incrementVisitorCount).mockRejectedValue(new Error("increment failed"));
    vi.mocked(getVisitorCount).mockRejectedValue(new Error("get failed"));

    const { result } = renderHook(() => useVisitorCount());

    await waitFor(() => expect(warnSpy).toHaveBeenCalledWith("visitor count fallback failed:", expect.any(Error)));
    expect(result.current).toBeUndefined();
  });

  it("only calls incrementVisitorCount once even if the hook re-renders", async () => {
    vi.mocked(incrementVisitorCount).mockResolvedValue({ count: 1 });

    const { result, rerender } = renderHook(() => useVisitorCount());
    await waitFor(() => expect(result.current).toBe(1));

    rerender();
    rerender();

    expect(incrementVisitorCount).toHaveBeenCalledTimes(1);
  });

  it("counts a visit once per tab session: a reload only reads the total", async () => {
    vi.mocked(incrementVisitorCount).mockResolvedValue({ count: 10 });
    vi.mocked(getVisitorCount).mockResolvedValue({ count: 12 });

    const first = renderHook(() => useVisitorCount());
    await waitFor(() => expect(first.result.current).toBe(10));
    first.unmount();

    const reload = renderHook(() => useVisitorCount());
    await waitFor(() => expect(reload.result.current).toBe(12));

    expect(incrementVisitorCount).toHaveBeenCalledTimes(1);
    expect(getVisitorCount).toHaveBeenCalledTimes(1);
  });

  it("tries to count again on the next load when the increment failed", async () => {
    vi.mocked(incrementVisitorCount).mockRejectedValueOnce(new Error("offline")).mockResolvedValue({ count: 4 });
    vi.mocked(getVisitorCount).mockResolvedValue({ count: 3 });

    const first = renderHook(() => useVisitorCount());
    await waitFor(() => expect(first.result.current).toBe(3));
    first.unmount();

    const second = renderHook(() => useVisitorCount());
    await waitFor(() => expect(second.result.current).toBe(4));
    expect(incrementVisitorCount).toHaveBeenCalledTimes(2);
  });
});
