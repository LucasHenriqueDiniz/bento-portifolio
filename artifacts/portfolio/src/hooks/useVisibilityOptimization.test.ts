import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useVisibilityOptimization } from "./useVisibilityOptimization";

type ObserverCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

function mockIntersectionObservers() {
  const instances: Array<{ callback: ObserverCallback; options: IntersectionObserverInit | undefined }> = [];

  class FakeIntersectionObserver {
    callback: ObserverCallback;
    options: IntersectionObserverInit | undefined;
    constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
      this.callback = callback;
      this.options = options;
      instances.push(this);
    }
    observe() {}
    disconnect() {}
    unobserve() {}
    takeRecords() {
      return [];
    }
  }

  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  return instances;
}

// The hook's effect only creates observers once `ref.current` is a real
// element, so every test attaches a stub node during render, before the
// effect fires on the initial commit.
function renderWithRef(threshold?: number) {
  return renderHook(() => {
    const optimization = useVisibilityOptimization(threshold);
    if (!optimization.ref.current) {
      (optimization.ref as { current: HTMLElement | null }).current = document.createElement("div");
    }
    return optimization;
  });
}

describe("useVisibilityOptimization", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts visible and animatable by default", () => {
    mockIntersectionObservers();
    const { result } = renderWithRef();

    expect(result.current.isVisible).toBe(true);
    expect(result.current.isNearViewport).toBe(true);
    expect(result.current.shouldAnimate).toBe(true);
  });

  it("stops animating once the element leaves the viewport", () => {
    const instances = mockIntersectionObservers();
    const { result } = renderWithRef();

    act(() => {
      instances[0].callback([{ isIntersecting: false }]);
    });

    expect(result.current.isVisible).toBe(false);
    expect(result.current.shouldAnimate).toBe(false);
  });

  it("stops animating when near-viewport tracking reports out of range, even if still visible", () => {
    const instances = mockIntersectionObservers();
    const { result } = renderWithRef();

    act(() => {
      instances[1].callback([{ isIntersecting: false }]);
    });

    expect(result.current.isVisible).toBe(true);
    expect(result.current.isNearViewport).toBe(false);
    expect(result.current.shouldAnimate).toBe(false);
  });

  it("passes the given threshold to the visibility observer", () => {
    const instances = mockIntersectionObservers();
    renderWithRef(0.5);

    expect(instances[0].options?.threshold).toBe(0.5);
  });
});
