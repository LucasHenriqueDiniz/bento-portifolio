import { describe, expect, it } from "vitest";
import { reducer } from "./use-toast";

type ToasterToast = Parameters<typeof reducer>[0]["toasts"][number];

function makeToast(overrides: Partial<ToasterToast> = {}): ToasterToast {
  return { id: "1", open: true, ...overrides };
}

describe("toast reducer", () => {
  it("ADD_TOAST prepends a toast", () => {
    const state = reducer({ toasts: [] }, { type: "ADD_TOAST", toast: makeToast({ id: "a" }) });
    expect(state.toasts.map((t) => t.id)).toEqual(["a"]);
  });

  it("ADD_TOAST enforces the single-toast limit, keeping only the newest", () => {
    const withFirst = reducer({ toasts: [] }, { type: "ADD_TOAST", toast: makeToast({ id: "a" }) });
    const withSecond = reducer(withFirst, { type: "ADD_TOAST", toast: makeToast({ id: "b" }) });

    expect(withSecond.toasts.map((t) => t.id)).toEqual(["b"]);
  });

  it("UPDATE_TOAST merges partial fields into the matching toast by id", () => {
    const state = { toasts: [makeToast({ id: "a", title: "Original" })] };
    const next = reducer(state, { type: "UPDATE_TOAST", toast: { id: "a", title: "Updated" } });

    expect(next.toasts[0]).toMatchObject({ id: "a", title: "Updated", open: true });
  });

  it("UPDATE_TOAST leaves non-matching toasts untouched", () => {
    const state = { toasts: [makeToast({ id: "a", title: "A" })] };
    const next = reducer(state, { type: "UPDATE_TOAST", toast: { id: "other", title: "changed" } });

    expect(next.toasts[0]).toEqual(state.toasts[0]);
  });

  it("DISMISS_TOAST with an id closes only that toast", () => {
    const state = { toasts: [makeToast({ id: "a", open: true })] };
    const next = reducer(state, { type: "DISMISS_TOAST", toastId: "a" });

    expect(next.toasts[0].open).toBe(false);
  });

  it("DISMISS_TOAST without an id closes every toast", () => {
    const state = { toasts: [makeToast({ id: "a", open: true })] };
    const next = reducer(state, { type: "DISMISS_TOAST", toastId: undefined });

    expect(next.toasts.every((t) => t.open === false)).toBe(true);
  });

  it("REMOVE_TOAST with an id filters out just that toast", () => {
    const state = { toasts: [makeToast({ id: "a" })] };
    const next = reducer(state, { type: "REMOVE_TOAST", toastId: "a" });

    expect(next.toasts).toEqual([]);
  });

  it("REMOVE_TOAST without an id clears all toasts", () => {
    const state = { toasts: [makeToast({ id: "a" }), makeToast({ id: "b" })] };
    const next = reducer(state, { type: "REMOVE_TOAST", toastId: undefined });

    expect(next.toasts).toEqual([]);
  });
});
