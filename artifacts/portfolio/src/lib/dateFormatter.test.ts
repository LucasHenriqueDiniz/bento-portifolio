import { describe, expect, it } from "vitest";
import { formatDateRange, formatTimeAgo } from "./dateFormatter";

describe("formatDateRange", () => {
  it("formats a range within the same year", () => {
    expect(formatDateRange("2024-01", "2024-06")).toBe("Jan - Jun 2024");
  });

  it("formats a range spanning different years", () => {
    expect(formatDateRange("2023-11", "2024-02")).toBe("Nov 2023 - Feb 2024");
  });

  it("uses the present label when endDate is missing", () => {
    expect(formatDateRange("2024-01", null, "en-US", "Present")).toBe("Jan 2024 - Present");
  });

  it("uses the present label when endDate is undefined", () => {
    expect(formatDateRange("2024-01", undefined)).toBe("Jan 2024 - Present");
  });

  it("respects a custom locale for month names", () => {
    expect(formatDateRange("2024-01", "2024-06", "pt-BR")).toBe("jan. - jun. 2024");
  });

  it("respects a custom present label", () => {
    expect(formatDateRange("2024-01", null, "en-US", "Atual")).toBe("Jan 2024 - Atual");
  });
});

describe("formatTimeAgo", () => {
  const now = Date.UTC(2026, 10, 23, 12);
  const ago = (seconds: number) => now - seconds * 1000;

  it("reads each distance in the largest whole unit, in the visitor's language", () => {
    expect(formatTimeAgo(ago(5 * 60), "pt", now)).toBe("há 5 minutos");
    expect(formatTimeAgo(ago(3 * 86400), "pt", now)).toBe("há 3 dias");
    expect(formatTimeAgo(ago(20 * 86400), "en", now)).toBe("2 weeks ago");
  });

  it("says yesterday and now instead of one day and zero seconds", () => {
    expect(formatTimeAgo(ago(26 * 3600), "pt", now)).toBe("ontem");
    expect(formatTimeAgo(ago(10), "en", now)).toBe("now");
  });

  it("gives null when there is no timestamp", () => {
    expect(formatTimeAgo(null, "pt", now)).toBeNull();
    expect(formatTimeAgo(undefined, "pt", now)).toBeNull();
  });
});
