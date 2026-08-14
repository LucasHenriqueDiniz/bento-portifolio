import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getProjects, getVisitorCount, setBaseUrl } from "./apiClient";

function jsonResponse(body: unknown, init: { status?: number; contentType?: string } = {}) {
  return {
    ok: (init.status ?? 200) < 400,
    status: init.status ?? 200,
    statusText: init.status ? "Error" : "OK",
    headers: { get: (name: string) => (name.toLowerCase() === "content-type" ? (init.contentType ?? "application/json") : null) },
    json: async () => body,
  };
}

describe("apiClient", () => {
  beforeEach(() => {
    setBaseUrl(undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves with the parsed JSON body on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([{ id: "1" }])));
    await expect(getProjects()).resolves.toEqual([{ id: "1" }]);
  });

  it("sends the request against the configured base URL", async () => {
    setBaseUrl("https://api.example.com/");
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ count: 1 }));
    vi.stubGlobal("fetch", fetchMock);

    await getVisitorCount();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/api/portfolio/visitors",
      expect.anything(),
    );
  });

  it("throws with the status and statusText when the response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(null, { status: 500 })));
    await expect(getProjects()).rejects.toThrow("500 Error");
  });

  it("throws a descriptive error when the response isn't JSON (e.g. dev server SPA fallback)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse("<html></html>", { contentType: "text/html" })),
    );
    await expect(getProjects()).rejects.toThrow(/Expected JSON from .* got "text\/html"/);
  });

  it("defaults to a 'no content-type' message when the header is missing", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse("", { contentType: "" })));
    await expect(getProjects()).rejects.toThrow(/no content-type/);
  });
});
