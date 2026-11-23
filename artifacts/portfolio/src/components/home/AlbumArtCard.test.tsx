import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import i18n from "@/i18n";
import { AlbumArtCard } from "./AlbumArtCard";

const HOUR = 3600 * 1000;

beforeEach(async () => {
  await i18n.changeLanguage("pt");
});

describe("AlbumArtCard", () => {
  it("shows the last track even when it has no album art", () => {
    render(
      <AlbumArtCard
        nowPlaying={{ track: "Tourniquet", artist: "Amy Lee", albumArt: null, isPlaying: false, timestamp: Date.now() - 26 * HOUR }}
        isLoading={false}
        isDark
      />
    );

    expect(screen.getByText("Tourniquet")).toBeInTheDocument();
    expect(screen.getByText("Amy Lee")).toBeInTheDocument();
    expect(screen.getByText("Ouvi por último ontem")).toBeInTheDocument();
    expect(screen.getByTestId("album-art-placeholder")).toBeInTheDocument();
    expect(screen.queryByText("Nenhuma música tocando")).not.toBeInTheDocument();
  });

  it("shows the album art and the playing state while a track plays", () => {
    render(
      <AlbumArtCard
        nowPlaying={{ track: "Tourniquet", artist: "Evanescence", albumArt: "https://art.test/a.jpg", isPlaying: true, timestamp: null }}
        isLoading={false}
        isDark
      />
    );

    expect(screen.getByRole("img", { name: "Tourniquet — Evanescence" })).toHaveAttribute("src", "https://art.test/a.jpg");
    expect(screen.getByText("Ouvindo")).toBeInTheDocument();
  });

  it("is empty only when there is no track at all", () => {
    render(<AlbumArtCard nowPlaying={{ track: null, albumArt: null }} isLoading={false} isDark />);

    expect(screen.getByText("Nenhuma música tocando")).toBeInTheDocument();
  });
});
