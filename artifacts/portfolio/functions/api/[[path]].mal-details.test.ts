import { describe, expect, it } from "vitest";
import { onRequest } from "./[[path]]";

function makeContext(url: string, env: Record<string, unknown> = {}) {
  return {
    request: new Request(url, { method: "GET" }),
    env,
  } as any;
}

describe("portfolio/mal/details validation", () => {
  it("returns 400 when type or ids is missing", async () => {
    const res = await onRequest(makeContext("https://x.test/api/portfolio/mal/details?type=anime"));
    expect(res.status).toBe(400);
  });

  it("returns 400 for an invalid type", async () => {
    const res = await onRequest(
      makeContext("https://x.test/api/portfolio/mal/details?type=movie&ids=1,2")
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 when more than 20 ids are requested", async () => {
    const ids = Array.from({ length: 21 }, (_, i) => i + 1).join(",");
    const res = await onRequest(
      makeContext(`https://x.test/api/portfolio/mal/details?type=anime&ids=${ids}`)
    );
    expect(res.status).toBe(400);
  });
});
