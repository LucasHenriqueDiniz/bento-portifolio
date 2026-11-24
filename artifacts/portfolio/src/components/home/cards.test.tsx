import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import i18n from "@/i18n";
import { AboutCard } from "./AboutCard";
import { FeaturedProjectsCard } from "./FeaturedProjectsCard";
import { ResumeCard } from "./ResumeCard";
import { WowCard, raceBackdropUrl } from "./WowCard";
import { WOW_CHARACTER } from "@/test/fixtures/wowCharacter";

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

describe("AboutCard", () => {
  it("types the role out, and names it whole for screen readers from the start", () => {
    vi.useFakeTimers();
    render(<AboutCard />);
    const role = screen.getByLabelText("Desenvolvedor full-stack");
    expect(role).toHaveTextContent("");

    act(() => vi.advanceTimersByTime(500 + 34 * 5));
    expect(role).toHaveTextContent("Desen");

    act(() => vi.advanceTimersByTime(34 * 40));
    expect(role).toHaveTextContent("Desenvolvedor full-stack");
    vi.useRealTimers();
  });

  it("links to the projects, the gallery and the four profiles", () => {
    render(<AboutCard />);

    expect(screen.getByRole("link", { name: "codar" })).toHaveAttribute("href", "/projects");
    expect(screen.getByRole("link", { name: "desenhar" })).toHaveAttribute("href", "/gallery");
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/LucasHenriqueDiniz");
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:lucashdo@protonmail.com");
  });
});

describe("FeaturedProjectsCard", () => {
  it("advances by itself, and with the arrow keys while it has focus", () => {
    vi.useFakeTimers();
    render(<FeaturedProjectsCard projects={projects} />);
    const tab = (name: string) => screen.getByRole("tab", { name: `Ir para ${name}` });
    expect(tab("Project One")).toHaveAttribute("aria-selected", "true");

    act(() => vi.advanceTimersByTime(6000));
    expect(tab("Project Two")).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowLeft" });
    expect(tab("Project One")).toHaveAttribute("aria-selected", "true");
    vi.useRealTimers();
  });

  it("opens the project page, links to its site and marks work in progress", () => {
    render(<FeaturedProjectsCard projects={projects} />);

    expect(screen.getByText("WIP")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Abrir site: Project One" })).toHaveAttribute("href", "https://one.test/");
    fireEvent.click(screen.getByRole("button", { name: /Ver projeto/ }));
    expect(setLocation).toHaveBeenCalledWith("/projects/one");
  });
});

describe("ResumeCard", () => {
  it("shows the current job on the sheet and opens the resume", () => {
    render(<ResumeCard />);

    expect(screen.getByText("Engenheiro de Software III · Appmax")).toBeInTheDocument();
    // The sheet rests in the card: it moves on hover through CSS only, and no inline
    // transform follows the pointer.
    const sheet = screen.getByTestId("resume-sheet");
    fireEvent.mouseMove(sheet, { clientX: 5, clientY: 5 });
    expect(sheet.style.transform).toBe("");
    fireEvent.click(screen.getByRole("button", { name: "Ver currículo completo" }));
    expect(setLocation).toHaveBeenCalledWith("/resume");
  });
});

describe("WowCard", () => {
  it("keeps to the character: no gear list", () => {
    render(<WowCard character={WOW_CHARACTER} />);

    expect(screen.getByLabelText("Nível 31")).toHaveTextContent("31");
    expect(screen.getByText("Gnome Priest · Alliance")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Profissões" }).children).toHaveLength(3);
    expect(screen.queryByText("Enchanter's Cowl")).not.toBeInTheDocument();
  });

  it("builds the armory's scene: the race's backdrop, the ground shadow and the render", () => {
    const { container } = render(<WowCard character={WOW_CHARACTER} />);

    const sources = [...container.querySelectorAll("img")].map((img) => img.getAttribute("src"));
    expect(sources).toEqual([
      "/wow/backdrops/gnome.webp",
      "https://render.worldofwarcraft.com/profile-foreground/foreground-shadow.png",
      WOW_CHARACTER.renderUrl,
    ]);
    expect(raceBackdropUrl("Night Elf")).toBe("/wow/backdrops/night_elf.webp");
    // A race without a local copy still asks Blizzard, and the card drops it on a 403.
    expect(raceBackdropUrl("Blood Elf")).toBe("https://render.worldofwarcraft.com/profile-backgrounds/v2/armory_bg_race_blood_elf.jpg");
    expect(raceBackdropUrl(null)).toBeNull();
  });

  it("drops the backdrop when Blizzard has none for the race", () => {
    render(<WowCard character={{ ...WOW_CHARACTER, race: "Blood Elf" }} />);

    fireEvent.error(screen.getByTestId("wow-backdrop"));

    expect(screen.queryByTestId("wow-backdrop")).not.toBeInTheDocument();
    expect(screen.getByText("Blood Elf Priest · Alliance")).toBeInTheDocument();
  });
});
