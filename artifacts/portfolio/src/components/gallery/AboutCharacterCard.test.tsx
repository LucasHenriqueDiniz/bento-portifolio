import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AboutCharacterCard } from "./AboutCharacterCard";

const CHARACTER_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <g id="eye-left"></g><g id="eye-right"></g>
  <g id="lid-left"></g><g id="lid-right"></g>
  <g id="brow-left"></g><g id="brow-right"></g>
</svg>`;

const mockSvgFetch = (body = CHARACTER_SVG) =>
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve(body) }),
  );

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("AboutCharacterCard", () => {
  it("renders the inline character artwork once the svg resolves", async () => {
    mockSvgFetch();
    const { container } = render(<AboutCharacterCard />);

    await waitFor(() => expect(container.querySelector("svg")).not.toBeNull());
  });

  it("requests the svg through the configured base url", async () => {
    mockSvgFetch();
    render(<AboutCharacterCard />);

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const requested = vi.mocked(fetch).mock.calls[0][0];
    expect(String(requested)).toBe(`${import.meta.env.BASE_URL}svgs/character.svg`);
  });

  it("shows the background intro text and hides it when disabled", async () => {
    mockSvgFetch();
    const { rerender } = render(<AboutCharacterCard backgroundText="LUCAS" />);

    await waitFor(() => expect(screen.getByText("LUCAS")).toBeInTheDocument());

    rerender(<AboutCharacterCard backgroundText="LUCAS" showBackgroundText={false} />);
    expect(screen.queryByText("LUCAS")).toBeNull();
  });

  it("still renders its stage when the svg request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const { container } = render(<AboutCharacterCard />);

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(container.querySelector(".character-stage")).not.toBeNull();
    expect(container.querySelector("svg")).toBeNull();
  });
});
