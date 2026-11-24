import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import i18n from "@/i18n";
import { voxelGame } from "@/constants/voxelGame";
import VoxelGamePage from "./voxel-game";

beforeEach(async () => {
  await i18n.changeLanguage("pt");
});

const renderPage = () =>
  render(
    <HelmetProvider>
      <VoxelGamePage />
    </HelmetProvider>
  );

describe("voxel game page", () => {
  it("stands without a name or pictures: working title, every pillar and placeholders", () => {
    renderPage();

    expect(screen.getByRole("heading", { level: 1, name: voxelGame.name })).toBeInTheDocument();
    expect(screen.getByText("Título provisório")).toBeInTheDocument();
    for (const pillar of voxelGame.pillars) {
      expect(screen.getByRole("heading", { level: 3, name: pillar.title.pt })).toBeInTheDocument();
    }
    expect(screen.getByTestId("hero-shot-placeholder")).toBeInTheDocument();
    expect(screen.getAllByText("Imagem em breve")).toHaveLength(6);
    expect(within(screen.getByRole("main")).queryByRole("img")).not.toBeInTheDocument();
  });

  it("reads in English when the site does", async () => {
    await i18n.changeLanguage("en");
    renderPage();

    expect(screen.getByText(voxelGame.tagline.en)).toBeInTheDocument();
    expect(screen.getByText("Working title")).toBeInTheDocument();
  });
});
