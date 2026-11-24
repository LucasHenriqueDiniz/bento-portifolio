import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import i18n from "@/i18n";
import { AboutCardV2 } from "./AboutCardV2";
import { FeaturedProjectsCardV2 } from "./FeaturedProjectsCardV2";
import { ResumeCardV2 } from "./ResumeCardV2";
import { VisitsCardV2 } from "./VisitsCardV2";
import { WowSheetCard } from "./WowSheetCard";
import { WOW_SAMPLE } from "./wowSample";

const { setLocation } = vi.hoisted(() => ({ setLocation: vi.fn() }));
vi.mock("wouter", () => ({ useLocation: () => ["/test", setLocation] }));

const projects = [
  { id: "one", name: "Project One", description: "First highlight", techStack: ["Astro", "D1"], highlight: "", url: "https://one.test/", wip: true },
  { id: "two", name: "Project Two", description: "Second highlight", techStack: ["React"], highlight: "" },
];

beforeEach(async () => {
  await i18n.changeLanguage("pt");
  setLocation.mockReset();
});

describe("VisitsCardV2", () => {
  it("says the total for screen readers and rolls one strip per digit", () => {
    const { container } = render(<VisitsCardV2 count={1864} />);

    expect(screen.getByLabelText("1.864 visitas ao site")).toBeInTheDocument();
    // Four digits, each a strip of 0-9; the thousands separator is not one.
    expect(container.querySelectorAll("p[aria-label] > span.overflow-hidden")).toHaveLength(4);
  });

  it("shows a dash while the total has not arrived", () => {
    render(<VisitsCardV2 count={undefined} />);

    expect(screen.getByText("—")).toBeInTheDocument();
  });
});

describe("AboutCardV2", () => {
  it("types the role out, and names it whole for screen readers from the start", () => {
    vi.useFakeTimers();
    render(<AboutCardV2 />);
    const role = screen.getByLabelText("Desenvolvedor full-stack");
    expect(role).toHaveTextContent("");

    act(() => vi.advanceTimersByTime(500 + 34 * 5));
    expect(role).toHaveTextContent("Desen");

    act(() => vi.advanceTimersByTime(34 * 40));
    expect(role).toHaveTextContent("Desenvolvedor full-stack");
    vi.useRealTimers();
  });

  it("links to the projects, the gallery and the four profiles", () => {
    render(<AboutCardV2 />);

    expect(screen.getByRole("link", { name: "codar" })).toHaveAttribute("href", "/projects");
    expect(screen.getByRole("link", { name: "desenhar" })).toHaveAttribute("href", "/gallery");
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/LucasHenriqueDiniz");
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:lucashdo@protonmail.com");
  });
});

describe("FeaturedProjectsCardV2", () => {
  it("advances by itself, and with the arrow keys while it has focus", () => {
    vi.useFakeTimers();
    render(<FeaturedProjectsCardV2 projects={projects} />);
    const tab = (name: string) => screen.getByRole("tab", { name: `Ir para ${name}` });
    expect(tab("Project One")).toHaveAttribute("aria-selected", "true");

    act(() => vi.advanceTimersByTime(6000));
    expect(tab("Project Two")).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowLeft" });
    expect(tab("Project One")).toHaveAttribute("aria-selected", "true");
    vi.useRealTimers();
  });

  it("opens the project page, links to its site and marks work in progress", () => {
    render(<FeaturedProjectsCardV2 projects={projects} />);

    expect(screen.getByText("WIP")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Abrir site: Project One" })).toHaveAttribute("href", "https://one.test/");
    fireEvent.click(screen.getByRole("button", { name: /Ver projeto/ }));
    expect(setLocation).toHaveBeenCalledWith("/projects/one");
  });
});

describe("ResumeCardV2", () => {
  it("shows the current job on the sheet and opens the resume", () => {
    render(<ResumeCardV2 />);

    expect(screen.getByText("Engenheiro de Software III · Appmax")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Ver currículo completo" }));
    expect(setLocation).toHaveBeenCalledWith("/resume");
  });
});

describe("WowSheetCard", () => {
  it("keeps to the character: no gear list", () => {
    render(<WowSheetCard character={WOW_SAMPLE} />);

    expect(screen.getByLabelText("Nível 31")).toHaveTextContent("31");
    expect(screen.getByText("Gnome Priest · Alliance")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Profissões" }).children).toHaveLength(3);
    expect(screen.queryByText("Enchanter's Cowl")).not.toBeInTheDocument();
  });
});
