import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

import { useBrasiliaWeather } from "./useBrasiliaWeather";

describe("useBrasiliaWeather", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts in a loading state showing the loading label", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    const { result } = renderHook(() => useBrasiliaWeather());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.description).toBe("weather.loading");
    expect(result.current.temperature).toBeNull();
  });

  it("populates temperature/description on a successful fetch", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ current: { temperature_2m: 21.5, weather_code: 3 } }),
      }),
    );

    const { result } = renderHook(() => useBrasiliaWeather());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.temperature).toBe(21.5);
    expect(result.current.description).toBe("weather.codes.3");
  });

  it("falls back to weather.codes.default for an unmapped code", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ current: { temperature_2m: 10, weather_code: 9999 } }),
      }),
    );

    const { result } = renderHook(() => useBrasiliaWeather());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.description).toBe("weather.codes.default");
  });

  it("shows the unavailable label on fetch failure with no cache", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    const { result } = renderHook(() => useBrasiliaWeather());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.description).toBe("weather.unavailable");
    expect(result.current.temperature).toBeNull();
  });

  it("keeps previously cached data on fetch failure", async () => {
    localStorage.setItem(
      "portfolio:query:weather:portoalegre",
      JSON.stringify({ v: 1, data: { temperature: 18, description: "weather.codes.1" }, ts: Date.now() }),
    );
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    const { result } = renderHook(() => useBrasiliaWeather());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.temperature).toBe(18);
    expect(result.current.description).toBe("weather.codes.1");
  });
});
