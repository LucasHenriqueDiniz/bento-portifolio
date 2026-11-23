import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import i18n from "@/i18n";
import { SteamCard } from "./SteamCard";

const DAY = 24 * 3600 * 1000;

beforeEach(async () => {
  await i18n.changeLanguage("pt");
});

describe("SteamCard", () => {
  it("shows the game played last with its hours and how long ago", () => {
    render(
      <SteamCard
        steam={{
          totalGames: 806,
          recentGames: [
            { name: "Hades", hoursPlayed: 51.3, appId: "1145360", imageUrl: "https://img.test/h.jpg", lastPlayedAt: Date.now() - 21 * DAY },
          ],
        }}
        isLoading={false}
        isDark
      />
    );

    expect(screen.getByText("Hades")).toBeInTheDocument();
    expect(screen.getByText("51.3h jogadas · há 3 semanas")).toBeInTheDocument();
    expect(screen.getByText("806 jogos")).toBeInTheDocument();
  });

  it("is empty when there is no game to show", () => {
    render(<SteamCard steam={{ totalGames: 806, recentGames: [] }} isLoading={false} isDark />);

    expect(screen.getByText("Nenhum jogo recente")).toBeInTheDocument();
  });
});
