import { Profiler } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { Card } from "./Card";
import { CardGlowProvider } from "./CardGlowContext";

const RECT = { left: 100, top: 100, right: 300, bottom: 200, width: 200, height: 100, x: 100, y: 100, toJSON: () => ({}) };

// Frames queue up like in a browser and run when the test says a frame passed.
let frames: FrameRequestCallback[] = [];
const nextFrame = () => {
  const pending = frames;
  frames = [];
  pending.forEach((cb) => cb(0));
};
const moveMouse = (clientX: number, clientY: number) => {
  fireEvent.mouseMove(document, { clientX, clientY });
  nextFrame();
};

beforeEach(() => {
  frames = [];
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => frames.push(cb));
  vi.stubGlobal("cancelAnimationFrame", () => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function renderCard(onRender = () => {}) {
  const view = render(
    <CardGlowProvider>
      <Profiler id="card" onRender={onRender}>
        <Card>content</Card>
      </Profiler>
    </CardGlowProvider>
  );
  const card = view.container.querySelector(".card-hover") as HTMLElement;
  card.getBoundingClientRect = () => RECT as DOMRect;
  return card;
}

describe("CardGlowProvider", () => {
  it("writes the glow position and strength into the card's CSS variables", () => {
    const card = renderCard();

    moveMouse(290, 150);

    expect(card.style.getPropertyValue("--glow-x")).toBe("95%");
    expect(card.style.getPropertyValue("--glow-y")).toBe("50%");
    expect(Number(card.style.getPropertyValue("--glow-opacity"))).toBeCloseTo((0.9 - 0.35) / 0.65);
  });

  it("lights the nearest edge of a card the mouse is close to, and nothing far away", () => {
    const card = renderCard();

    moveMouse(350, 150);
    expect(card.style.getPropertyValue("--glow-x")).toBe("100%");
    expect(Number(card.style.getPropertyValue("--glow-opacity"))).toBeGreaterThan(0);

    moveMouse(2000, 2000);
    expect(card.style.getPropertyValue("--glow-opacity")).toBe("0");
  });

  it("paints at most once per frame however many mousemoves arrive", () => {
    const card = renderCard();
    const writes = vi.spyOn(card.style, "setProperty");

    for (let i = 0; i < 10; i++) fireEvent.mouseMove(document, { clientX: 150 + i, clientY: 150 });
    nextFrame();

    // One frame, three variables.
    expect(writes).toHaveBeenCalledTimes(3);
    expect(card.style.getPropertyValue("--glow-x")).toBe("29.5%");
  });

  it("moves the glow without re-rendering the card", () => {
    const onRender = vi.fn();
    renderCard(onRender);
    const rendersAfterMount = onRender.mock.calls.length;

    for (let i = 0; i < 20; i++) moveMouse(100 + i * 10, 150);

    expect(onRender).toHaveBeenCalledTimes(rendersAfterMount);
  });
});
