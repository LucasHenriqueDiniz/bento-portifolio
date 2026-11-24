import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import i18n from "@/i18n";
import { CommitsCard } from "./CommitsCard";

const HOUR = 3600 * 1000;
const commit = (n: number) => ({
  sha: `abcdef${n}000000`,
  message: `portfolio: change ${n}`,
  repo: "LucasHenriqueDiniz/bento-portifolio",
  url: `https://github.com/x/y/commit/abcdef${n}`,
  date: new Date(Date.now() - n * HOUR).toISOString(),
});

beforeEach(async () => {
  await i18n.changeLanguage("pt");
});

describe("CommitsCard", () => {
  it("shows the four newest commits, each linking to GitHub with its repository, sha and age", () => {
    render(<CommitsCard commits={[1, 2, 3, 4, 5, 6].map(commit)} isLoading={false} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(4);
    expect(links[0]).toHaveAttribute("href", "https://github.com/x/y/commit/abcdef1");
    expect(links[0]).toHaveTextContent("portfolio: change 1");
    expect(links[0]).toHaveTextContent("bento-portifolio");
    expect(links[0]).toHaveTextContent("abcdef1");
    expect(links[0]).toHaveTextContent("há 1 hora");
    expect(screen.queryByText("portfolio: change 5")).not.toBeInTheDocument();
  });

  it("says so when there is no commit to show", () => {
    render(<CommitsCard commits={[]} isLoading={false} />);

    expect(screen.getByText("Sem commits para mostrar")).toBeInTheDocument();
  });
});
