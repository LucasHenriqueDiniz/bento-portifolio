import { describe, expect, it } from "vitest";
import { formatDateRange } from "./dateFormatter";

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
