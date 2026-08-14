import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DevModeProvider, useDevMode } from "@/contexts/DevModeContext";
import { useDevModeQuery } from "./useDevModeQuery";

function useTestSubject(queryResult: { data: string | undefined; isLoading: boolean; error: Error | null }) {
  const devMode = useDevMode();
  const query = useDevModeQuery(queryResult);
  return { devMode, query };
}

describe("useDevModeQuery", () => {
  it("passes through the real loading state when dev mode is off", () => {
    const { result } = renderHook(
      () => useTestSubject({ data: "value", isLoading: false, error: null }),
      { wrapper: DevModeProvider },
    );

    expect(result.current.query.isLoading).toBe(false);
    expect(result.current.query.data).toBe("value");
  });

  it("forces isLoading to true when dev mode is on, regardless of the real state", () => {
    const { result } = renderHook(
      () => useTestSubject({ data: "value", isLoading: false, error: null }),
      { wrapper: DevModeProvider },
    );

    act(() => result.current.devMode.toggleDevMode());

    expect(result.current.query.isLoading).toBe(true);
    expect(result.current.query.data).toBe("value"); // other fields pass through unchanged
  });

  it("throws when used outside a DevModeProvider", () => {
    expect(() =>
      renderHook(() => useTestSubject({ data: undefined, isLoading: true, error: null })),
    ).toThrow("useDevMode must be used within a DevModeProvider");
  });
});
