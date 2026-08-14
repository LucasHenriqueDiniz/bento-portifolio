import { describe, expect, it } from "vitest";
import { createFadeUp, fadeUp, fadeUpSoft } from "./animations";

describe("createFadeUp", () => {
  it("uses sensible defaults", () => {
    const variants = createFadeUp();
    expect(variants.hidden).toEqual({ opacity: 0, y: 8 });
  });

  it("applies custom y/duration options to the hidden state", () => {
    const variants = createFadeUp({ y: 20, duration: 0.5 });
    expect(variants.hidden).toEqual({ opacity: 0, y: 20 });
  });

  it("computes a staggered delay in the show variant", () => {
    const variants = createFadeUp({ delayStep: 0.1 });
    const show = variants.show as (i?: number) => { transition: { delay: number } };
    expect(show(3).transition.delay).toBeCloseTo(0.3);
  });

  it("defaults the stagger index to 0 when show is called without args", () => {
    const variants = createFadeUp({ delayStep: 0.1 });
    const show = variants.show as (i?: number) => { transition: { delay: number } };
    expect(show().transition.delay).toBe(0);
  });
});

describe("preset variants", () => {
  it("fadeUp uses the library defaults", () => {
    expect(fadeUp.hidden).toEqual({ opacity: 0, y: 8 });
  });

  it("fadeUpSoft uses a smaller y offset", () => {
    expect(fadeUpSoft.hidden).toEqual({ opacity: 0, y: 6 });
  });
});
