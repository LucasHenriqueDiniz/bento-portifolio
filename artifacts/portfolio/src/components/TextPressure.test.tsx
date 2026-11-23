import { afterEach, describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import TextPressure from "./TextPressure";

const fontLinks = () => [...document.head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map((l) => l.href);

afterEach(() => {
  document.head.querySelectorAll('link[rel="stylesheet"]').forEach((l) => l.remove());
});

describe("TextPressure", () => {
  it("loads Roboto Flex from Google Fonts by default, not the dead Cloudinary file", () => {
    const { container } = render(<TextPressure text="Arte" />);

    expect(fontLinks()).toEqual([
      "https://fonts.googleapis.com/css2?family=Roboto+Flex:wdth,wght@25..151,100..1000&display=swap",
    ]);
    expect(container.querySelector("style")!.textContent).not.toContain("@font-face");
    expect(container.querySelector("style")!.textContent).not.toContain("cloudinary");
    expect(container.querySelector("h1")!.style.fontFamily).toBe('"Roboto Flex"');
  });

  it("adds the stylesheet once for several titles", () => {
    render(<TextPressure text="Um" />);
    render(<TextPressure text="Dois" />);

    expect(fontLinks()).toHaveLength(1);
  });

  it("still declares a font file through @font-face when given one", () => {
    const { container } = render(<TextPressure text="Arte" fontFamily="Mine" fontUrl="/fonts/mine.woff2" />);

    expect(fontLinks()).toEqual([]);
    expect(container.querySelector("style")!.textContent).toContain("src: url('/fonts/mine.woff2')");
  });
});
