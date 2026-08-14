import { describe, expect, it } from "vitest";
import { getAvailableLocales, getLocaleDisplayName, useResumeTranslation } from "./useResumeTranslation";
import { renderHook } from "@testing-library/react";

describe("useResumeTranslation", () => {
  it("defaults to English when no locale is given", () => {
    const { result } = renderHook(() => useResumeTranslation());
    expect(result.current.title).toBe("Resume");
  });

  it("returns the pt-BR translation tree for pt-BR", () => {
    const { result } = renderHook(() => useResumeTranslation("pt-BR"));
    expect(result.current.title).toBe("Currículo");
  });

  it("falls back to English for an unsupported locale", () => {
    // @ts-expect-error intentionally passing an unsupported locale to exercise the fallback chain
    const { result } = renderHook(() => useResumeTranslation("fr"));
    expect(result.current.title).toBe("Resume");
  });
});

describe("getAvailableLocales", () => {
  it("lists en and pt-BR", () => {
    expect(getAvailableLocales()).toEqual(["en", "pt-BR"]);
  });
});

describe("getLocaleDisplayName", () => {
  it("returns the display name for each supported locale", () => {
    expect(getLocaleDisplayName("en")).toBe("English");
    expect(getLocaleDisplayName("pt-BR")).toBe("Português (BR)");
  });
});
