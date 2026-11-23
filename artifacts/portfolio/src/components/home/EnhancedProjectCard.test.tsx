import { Profiler } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import i18n from "@/i18n";
import { EnhancedProjectCard, type Project } from "./EnhancedProjectCard";

const project = (n: number): Project => ({
  id: `p${n}`,
  name: `Project ${n}`,
  description: `Description ${n}`,
  techStack: ["TypeScript"],
  highlight: "",
});
const projects = [project(1), project(2), project(3)];

beforeEach(async () => {
  await i18n.changeLanguage("pt");
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("EnhancedProjectCard", () => {
  it("advances to the next project after seven seconds", () => {
    render(<EnhancedProjectCard projects={projects} />);
    expect(screen.getByText("1/3")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(7000));

    expect(screen.getByText("2/3")).toBeInTheDocument();
  });

  it("animates the progress bar in CSS instead of re-rendering while it fills", () => {
    const onRender = vi.fn();
    render(
      <Profiler id="projects" onRender={onRender}>
        <EnhancedProjectCard projects={projects} />
      </Profiler>
    );
    const rendersAfterMount = onRender.mock.calls.length;

    act(() => vi.advanceTimersByTime(6900));

    expect(onRender).toHaveBeenCalledTimes(rendersAfterMount);
    expect(screen.getByTestId("project-progress").style.animation).toContain("project-progress 7000ms");
  });

  it("holds the current project and hides the bar while hovered", () => {
    const { container } = render(<EnhancedProjectCard projects={projects} />);

    fireEvent.mouseEnter(container.querySelector('[aria-roledescription="carousel"]')!);
    act(() => vi.advanceTimersByTime(15000));

    expect(screen.getByText("1/3")).toBeInTheDocument();
    expect(screen.queryByTestId("project-progress")).not.toBeInTheDocument();
  });
});
