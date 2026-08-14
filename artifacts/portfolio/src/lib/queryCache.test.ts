import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getCache, removeCache, setCache } from "./queryCache";

describe("queryCache", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns undefined when nothing is cached", () => {
    expect(getCache("missing-key")).toBeUndefined();
  });

  it("round-trips a value through set/getCache", () => {
    setCache("my-key", { count: 42 });
    expect(getCache("my-key")).toEqual({ count: 42 });
  });

  it("removes a cached value via removeCache", () => {
    setCache("my-key", "value");
    removeCache("my-key");
    expect(getCache("my-key")).toBeUndefined();
  });

  it("expires entries older than 7 days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
    setCache("stale-key", "old-value");

    vi.setSystemTime(new Date("2024-01-09T00:00:01Z")); // > 7 days later
    expect(getCache("stale-key")).toBeUndefined();
  });

  it("keeps entries within the 7 day window", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
    setCache("fresh-key", "still-good");

    vi.setSystemTime(new Date("2024-01-06T00:00:00Z")); // < 7 days later
    expect(getCache("fresh-key")).toBe("still-good");
  });

  it("ignores entries from a different storage version", () => {
    localStorage.setItem("portfolio:query:versioned-key", JSON.stringify({ v: 999, data: "x", ts: Date.now() }));
    expect(getCache("versioned-key")).toBeUndefined();
  });

  it("returns undefined for corrupted JSON instead of throwing", () => {
    localStorage.setItem("portfolio:query:broken-key", "{not valid json");
    expect(() => getCache("broken-key")).not.toThrow();
    expect(getCache("broken-key")).toBeUndefined();
  });
});
