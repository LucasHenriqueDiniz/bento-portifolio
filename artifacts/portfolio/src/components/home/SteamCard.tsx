import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SiSteam } from "react-icons/si";
import { WidgetCard } from "@/components/WidgetCard";
import { CarouselProgress, useCarousel } from "@/components/CarouselProgress";
import { fadeUpSoft } from "@/lib/animations";
import { formatTimeAgo } from "@/lib/dateFormatter";

interface SteamGame {
  name: string;
  imageUrl?: string | null;
  hoursPlayed: number;
  appId: string;
  lastPlayedAt?: number | null;
}

interface SteamData {
  currentGame?: string | null;
  recentGames?: SteamGame[];
  totalGames?: number;
}

interface SteamCardProps {
  steam: SteamData | undefined;
  isLoading: boolean;
  isDark: boolean;
}

/**
 * The games played last on Steam, cycling every few seconds, with lifetime hours
 * and how long ago each one was played.
 */
export const SteamCard = React.memo(function SteamCard({ steam, isLoading }: SteamCardProps) {
  const { t, i18n } = useTranslation("home");
  const games = steam?.recentGames ?? [];
  const still = useReducedMotion() ?? false;
  const [paused, setPaused] = React.useState(false);
  // The cycle lives here rather than in the page, so only this card re-renders on it.
  const { index } = useCarousel(games.length, paused || still);
  const [failedImages, setFailedImages] = React.useState<ReadonlySet<string>>(() => new Set());

  const game = games.length ? games[index] : undefined;
  const imageUrl = game?.imageUrl && !failedImages.has(game.appId) ? game.imageUrl : null;
  const ago = formatTimeAgo(game?.lastPlayedAt, i18n.language);
  const playingNow = Boolean(game && steam?.currentGame && steam.currentGame === game.name);

  return (
    <WidgetCard
      isLoading={isLoading}
      error={!game ? t("steam.error") : null}
      loadingIcon={<SiSteam size={28} className="text-brand" />}
      emptyIcon={<SiSteam size={24} className="text-brand" />}
      className="h-full rounded-2xl overflow-hidden"
      style={{ border: `1px solid var(--border-base)` }}
      glowColor="var(--accent-glow)"
    >
      {game && (
        <motion.div
          custom={13}
          variants={fadeUpSoft}
          initial="hidden"
          animate="show"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="w-full h-full relative rounded-2xl overflow-hidden"
        >
          <AnimatePresence>
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={game.name}
                  className="w-full h-full object-cover"
                  onError={() => setFailedImages((prev) => new Set(prev).add(game.appId))}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1b2838] to-[#2a475e] flex items-center justify-center">
                  <SiSteam size={48} className="text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/30" />

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-[9px] uppercase tracking-widest font-semibold mb-1 flex items-center gap-1.5 text-white/70">
                  {playingNow ? (
                    <>
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-70 animate-ping" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>
                      {t("steam.playing")}
                    </>
                  ) : (
                    <>
                      <SiSteam size={9} aria-hidden />
                      {t("steam.title")}
                    </>
                  )}
                </p>
                <p className="text-white text-[13px] font-bold leading-tight truncate">{game.name}</p>
                <p className="text-white/70 text-[10px] font-medium mt-0.5 tabular-nums">
                  {game.hoursPlayed}
                  {t("steam.hours")}
                  {ago && ` · ${ago}`}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute left-2.5 right-2.5 top-2.5 z-10 flex items-center gap-2">
            <CarouselProgress count={games.length} index={index} paused={paused} still={still} className="flex-1" />
            <span className="ml-auto shrink-0 rounded-full bg-black/55 backdrop-blur-sm border border-white/15 px-2 py-0.5 text-[9px] font-bold text-white tabular-nums">
              {steam?.totalGames ?? 0} {t("steam.games")}
            </span>
          </div>
        </motion.div>
      )}
    </WidgetCard>
  );
});
