import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SiSteam } from "react-icons/si";
import { WidgetCard } from "@/components/WidgetCard";
import { fadeUpSoft } from "@/lib/animations";
import { formatTimeAgo } from "@/lib/dateFormatter";

const CYCLE_MS = 5000;

interface SteamGame {
  name: string;
  imageUrl?: string | null;
  hoursPlayed: number;
  appId: string;
  lastPlayedAt?: number | null;
}

interface SteamData {
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
  const [index, setIndex] = React.useState(0);
  const [failedImages, setFailedImages] = React.useState<ReadonlySet<string>>(() => new Set());

  // The cycle lives here rather than in the page, so only this card re-renders on it.
  React.useEffect(() => {
    if (games.length < 2) return;
    const id = setInterval(() => setIndex((i) => i + 1), CYCLE_MS);
    return () => clearInterval(id);
  }, [games.length]);

  const game = games.length ? games[index % games.length] : undefined;
  const imageUrl = game?.imageUrl && !failedImages.has(game.appId) ? game.imageUrl : null;
  const ago = formatTimeAgo(game?.lastPlayedAt, i18n.language);

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
          className="w-full h-full relative rounded-2xl overflow-hidden"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={index}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                y: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
                opacity: { duration: 0.3, delay: 0.6 },
              }}
              className="absolute inset-0 rounded-2xl overflow-hidden"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={game.name}
                  className="w-full h-full object-cover rounded-2xl"
                  onError={() => setFailedImages((prev) => new Set(prev).add(game.appId))}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1b2838] to-[#2a475e] flex items-center justify-center rounded-2xl">
                  <SiSteam size={48} className="text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent rounded-2xl" />

              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <p className="text-white/60 text-[7px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1 drop-shadow-lg">
                  <SiSteam size={7} />
                  {t("steam.title")}
                </p>
                <p className="text-white text-[11px] font-bold leading-tight truncate drop-shadow-lg">{game.name}</p>
                <p className="text-white/75 text-[9px] font-medium drop-shadow-lg mt-0.5">
                  {game.hoursPlayed}
                  {t("steam.hours")}
                  {ago && ` · ${ago}`}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm border border-white/15 z-10 shadow-lg">
            <SiSteam size={10} className="text-white/90" />
            <span className="text-[9px] text-white font-bold">
              {steam?.totalGames ?? 0} {t("steam.games")}
            </span>
          </div>
        </motion.div>
      )}
    </WidgetCard>
  );
});
