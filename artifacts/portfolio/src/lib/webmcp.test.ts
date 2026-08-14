import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("wouter/use-browser-location", () => ({
  navigate: vi.fn(),
}));

import { navigate } from "wouter/use-browser-location";
import { registerWebMcpTools } from "./webmcp";

describe("registerWebMcpTools", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    // @ts-expect-error cleaning up a test-only shim
    delete (navigator as any).modelContext;
  });

  it("is a no-op when navigator.modelContext is unsupported", () => {
    expect(() => registerWebMcpTools()).not.toThrow();
  });

  it("registers a navigate_to_page tool when modelContext is present", () => {
    const provideContext = vi.fn();
    // @ts-expect-error test-only shim for an experimental browser API
    navigator.modelContext = { provideContext };

    registerWebMcpTools();

    expect(provideContext).toHaveBeenCalledTimes(1);
    const { tools } = provideContext.mock.calls[0][0];
    expect(tools).toHaveLength(1);
    expect(tools[0].name).toBe("navigate_to_page");
  });

  it("navigates to the given path when the tool is executed", async () => {
    const provideContext = vi.fn();
    // @ts-expect-error test-only shim for an experimental browser API
    navigator.modelContext = { provideContext };

    registerWebMcpTools();
    const { tools } = provideContext.mock.calls[0][0];
    const result = await tools[0].execute({ path: "/projects" });

    expect(navigate).toHaveBeenCalledWith("/projects");
    expect(result.content[0].text).toBe("Navigated to /projects");
  });

  it("normalizes a path missing a leading slash", async () => {
    const provideContext = vi.fn();
    // @ts-expect-error test-only shim for an experimental browser API
    navigator.modelContext = { provideContext };

    registerWebMcpTools();
    const { tools } = provideContext.mock.calls[0][0];
    await tools[0].execute({ path: "resume" });

    expect(navigate).toHaveBeenCalledWith("/resume");
  });

  it("does not throw if provideContext itself throws", () => {
    // @ts-expect-error test-only shim for an experimental browser API
    navigator.modelContext = {
      provideContext: () => {
        throw new Error("boom");
      },
    };

    expect(() => registerWebMcpTools()).not.toThrow();
  });
});
