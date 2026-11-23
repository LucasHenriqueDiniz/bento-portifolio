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
const projects = [
  { ...project(1), url: "https://one.test/", wip: true },
  project(2),
  project(3),
];

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

  it("moves with the arrow keys only while the carousel has focus", () => {
    const { container } = render(<EnhancedProjectCard projects={projects} />);
    const carousel = container.querySelector('[aria-roledescription="carousel"]') as HTMLElement;

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByText("1/3")).toBeInTheDocument();

    fireEvent.keyDown(carousel, { key: "ArrowRight" });
    expect(screen.getByText("2/3")).toBeInTheDocument();
    fireEvent.keyDown(carousel, { key: "ArrowLeft" });
    expect(screen.getByText("1/3")).toBeInTheDocument();
  });

  it("links straight to the project's site and marks work in progress", () => {
    render(<EnhancedProjectCard projects={projects} />);

    const site = screen.getByRole("link", { name: "Abrir site: Project 1" });
    expect(site).toHaveAttribute("href", "https://one.test/");
    expect(site).toHaveAttribute("rel", "noreferrer");
    expect(screen.getByText("WIP")).toBeInTheDocument();
  });

  it("names its navigation buttons for screen readers", () => {
    render(<EnhancedProjectCard projects={projects} />);

    expect(screen.getByRole("button", { name: "Anterior" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Próximo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ir para 2" })).toBeInTheDocument();
  });
});
