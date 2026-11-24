import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/apiClient", () => ({ getWowCharacter: vi.fn() }));

import { getWowCharacter } from "@/lib/apiClient";
import { setCache } from "@/lib/queryCache";
import { WOW_CHARACTER } from "@/test/fixtures/wowCharacter";
import { useGetWowCharacterCached } from "./usePortfolioQueries";

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  localStorage.clear();
  vi.mocked(getWowCharacter).mockReset();
});

// The home shows the WoW card when this gives a character and the tech stack otherwise.
describe("useGetWowCharacterCached", () => {
  it("gives the character the API serves", async () => {
    vi.mocked(getWowCharacter).mockResolvedValue({ character: WOW_CHARACTER });

    const { result } = renderHook(() => useGetWowCharacterCached(), { wrapper });

    await waitFor(() => expect(result.current.data?.name).toBe("Pequeno"));
  });

  it("gives null when the API has no character, even if one was remembered", async () => {
    setCache("/api/portfolio/wow", { character: WOW_CHARACTER });
    vi.mocked(getWowCharacter).mockResolvedValue({ character: null });

    const { result } = renderHook(() => useGetWowCharacterCached(), { wrapper });

    await waitFor(() => expect(result.current.isFetched).toBe(true));
    await waitFor(() => expect(result.current.data).toBeNull());
  });

  it("keeps the remembered character when the request fails", async () => {
    setCache("/api/portfolio/wow", { character: WOW_CHARACTER });
    vi.mocked(getWowCharacter).mockRejectedValue(new Error("502"));

    const { result } = renderHook(() => useGetWowCharacterCached(), { wrapper });

    // The hook retries before it gives up; the remembered character shows meanwhile.
    await waitFor(() => expect(getWowCharacter).toHaveBeenCalled());
    expect(result.current.data?.name).toBe("Pequeno");
  });
});
