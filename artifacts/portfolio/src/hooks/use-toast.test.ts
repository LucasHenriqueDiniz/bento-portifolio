import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { toast, useToast } from "./use-toast";

describe("useToast", () => {
  it("subscribes to toasts created via the toast() helper", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({ title: "Saved" });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe("Saved");
    expect(result.current.toasts[0].open).toBe(true);
  });

  it("update() patches the toast it was returned from", () => {
    const { result } = renderHook(() => useToast());
    let handle!: ReturnType<typeof toast>;

    act(() => {
      handle = toast({ title: "Loading" });
    });

    act(() => {
      handle.update({ id: handle.id, title: "Done", open: true });
    });

    expect(result.current.toasts[0].title).toBe("Done");
  });

  it("dismiss() (via the hook, with no id) closes the current toast", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({ title: "Closing soon" });
    });
    expect(result.current.toasts[0].open).toBe(true);

    act(() => {
      result.current.dismiss();
    });

    expect(result.current.toasts[0].open).toBe(false);
  });

  it("stops receiving updates after unmount", () => {
    const { result, unmount } = renderHook(() => useToast());
    unmount();

    act(() => {
      toast({ title: "After unmount" });
    });

    // The hook's last snapshot shouldn't change once its listener is removed.
    expect(result.current.toasts.some((t) => t.title === "After unmount")).toBe(false);
  });
});
