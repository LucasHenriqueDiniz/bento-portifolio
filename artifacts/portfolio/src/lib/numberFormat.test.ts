import { describe, expect, it } from "vitest";
import { formatCount, formatPercent, formatTimeOfDay } from "./numberFormat";

describe("formatCount", () => {
  it("groups thousands with a dot in pt", () => {
    expect(formatCount(5404, "pt")).toBe("5.404");
    expect(formatCount(12296, "pt")).toBe("12.296");
  });

  it("groups thousands with a comma in en", () => {
    expect(formatCount(5404, "en")).toBe("5,404");
    expect(formatCount(12296, "en")).toBe("12,296");
  });

  it("leaves small numbers untouched", () => {
    expect(formatCount(8, "pt")).toBe("8");
  });
});

describe("formatPercent", () => {
  it("uses the locale decimal separator", () => {
    expect(formatPercent(99.18, "pt")).toBe("99,18%");
    expect(formatPercent(99.18, "en")).toBe("99.18%");
  });

  it("keeps a single decimal as-is instead of padding it", () => {
    expect(formatPercent(6.1, "pt")).toBe("6,1%");
  });

  it("drops the decimal part for whole percentages", () => {
    expect(formatPercent(10, "pt")).toBe("10%");
  });
});

describe("formatTimeOfDay", () => {
  it("formats an ISO timestamp as hours and minutes", () => {
    expect(formatTimeOfDay("2026-08-18T00:42:37.209Z", "pt")).toMatch(/^\d{2}:\d{2}$/);
  });

  it("returns null for an unparseable timestamp", () => {
    expect(formatTimeOfDay("nope", "pt")).toBeNull();
  });
});
