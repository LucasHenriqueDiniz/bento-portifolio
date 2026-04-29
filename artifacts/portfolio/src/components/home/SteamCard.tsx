import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiSteam } from "react-icons/si";
import { WidgetCard } from "@/components/WidgetCard";
import { fadeUpSoft } from "@/lib/animations";

/**
 * Steam game data
 * @interface SteamGame
 * @property {string} name - Game name
 * @property {string} [imageUrl] - Game library hero image URL (best quality)
 * @property {string} [capsuleUrl] - Game capsule image URL (616x353)
 * @property {string} [headerUrl] - Game header image URL (460x215)
 * @property {string} [iconUrl] - Game icon URL (small)
 * @property {number} hoursPlayed - Hours played
 * @property {string} appId - Steam app ID
 */
interface SteamGame {
  name: string;
  imageUrl?: string;
  capsuleUrl?: string;
  headerUrl?: string;
  iconUrl?: string;
  hoursPlayed: number;
  appId: string;
}

/**
 * Steam profile data
 * @interface SteamData
 * @property {SteamGame[]} [recentGames] - Recently played games
 * @property {number} [totalGames] - Total games owned
 */
interface SteamData {
  recentGames?: SteamGame[];
  totalGames?: number;
}

/**
 * Props for SteamCard component
 * @interface SteamCardProps
 * @property {SteamData | undefined} steam - Steam profile data
 * @property {boolean} isLoading - Loading state
 * @property {number} steamIdx - Current game index for cycling
 * @property {boolean} isDark - Dark mode flag
 */
interface SteamCardProps {
  steam: SteamData | undefined;
  isLoading: boolean;
  steamIdx: number;
  isDark: boolean;
}

/**
 * SteamCard - Displays recently played Steam games with cycling images
 * Shows game art with name, playtime, and total games badge
 * Tries multiple image URLs in order: library_hero -> capsule -> header -> icon -> placeholder
 * @component
 * @param {SteamCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const SteamCard = React.memo(function SteamCard({
  steam,
  isLoading,
  steamIdx,
  isDark,
}: SteamCardProps) {
  const [imageErrors, setImageErrors] = React.useState<Set<string>>(new Set());
  const [currentImageType, setCurrentImageType] = React.useState<
    Map<string, "hero" | "capsule" | "header" | "icon" | "none">
  >(new Map());

  const getImageUrl = (game: SteamGame): string | null => {
    const key = game.appId;
    const currentType = currentImageType.get(key) || "hero";

    // Se já tentamos todas as opções, retorna null
    if (currentType === "none") return null;

    // Tentar em ordem: library_hero -> capsule -> header -> icon
    if (
      currentType === "hero" &&
      game.imageUrl &&
      !imageErrors.has(`${key}-hero`)
    ) {
      return game.imageUrl;
    }
    if (
      (currentType === "hero" || currentType === "capsule") &&
      game.capsuleUrl &&
      !imageErrors.has(`${key}-capsule`)
    ) {
      return game.capsuleUrl;
    }
    if (
      (currentType === "hero" ||
        currentType === "capsule" ||
        currentType === "header") &&
      game.headerUrl &&
      !imageErrors.has(`${key}-header`)
    ) {
      return game.headerUrl;
    }
    if (game.iconUrl && !imageErrors.has(`${key}-icon`)) {
      return game.iconUrl;
    }

    return null;
  };

  const handleImageError = (game: SteamGame) => {
    const key = game.appId;
    const currentType = currentImageType.get(key) || "hero";

    // Marcar erro para a URL atual
    setImageErrors((prev) => new Set(prev).add(`${key}-${currentType}`));

    // Tentar próxima opção
    setCurrentImageType((prev) => {
      const next = new Map(prev);
      if (currentType === "hero") {
        next.set(key, "capsule");
      } else if (currentType === "capsule") {
        next.set(key, "header");
      } else if (currentType === "header") {
        next.set(key, "icon");
      } else {
        next.set(key, "none");
      }
      return next;
    });
  };

  return (
    <WidgetCard
      isLoading={isLoading}
      error={
        !steam || !steam.recentGames || steam.recentGames.length === 0
          ? "Nenhum jogo recente"
          : null
      }
      loadingIcon={
        <SiSteam
          size={28}
          className={isDark ? "text-[#1b2838]" : "text-[#1b2838]"}
        />
      }
      emptyIcon={
        <SiSteam
          size={24}
          className={isDark ? "text-[#1b2838]" : "text-[#1b2838]"}
        />
      }
      className="h-full rounded-2xl overflow-hidden"
      style={{
        border: isDark ? "1px solid #282828" : "1px solid #ebebeb",
      }}
      glowColor="27, 40, 56"
    >
      {steam?.recentGames && steam.recentGames.length > 0 && (
        <motion.div
          custom={13}
          variants={fadeUpSoft}
          initial="hidden"
          animate="show"
          className="w-full h-full relative rounded-2xl overflow-hidden"
        >
          {/* cycling game art */}
          <AnimatePresence mode="popLayout">
            {(() => {
              const games = steam.recentGames;
              const game = games[steamIdx % games.length];
              const imageUrl = game ? getImageUrl(game) : null;

              return game ? (
                <motion.div
                  key={steamIdx}
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
                    <>
                      <img
                        src={imageUrl}
                        alt={game.name}
                        className="w-full h-full object-cover rounded-2xl"
                        onError={() => handleImageError(game)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent rounded-2xl" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1b2838] to-[#2a475e] flex items-center justify-center rounded-2xl">
                      <SiSteam size={48} className="text-white/20" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent rounded-2xl" />
                    </div>
                  )}
                  
                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <p className="text-white/60 text-[7px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1 drop-shadow-lg">
                      <SiSteam size={7} />
                      Steam
                    </p>
                    <p className="text-white text-[11px] font-bold leading-tight truncate drop-shadow-lg">
                      {game.name}
                    </p>
                    <p className="text-white/75 text-[9px] font-medium drop-shadow-lg mt-0.5">
                      {game.hoursPlayed}h played
                    </p>
                  </div>
                </motion.div>
              ) : null;
            })()}
          </AnimatePresence>
          
          {/* game count badge */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm border border-white/15 z-10 shadow-lg">
            <SiSteam size={10} className="text-white/90" />
            <span className="text-[9px] text-white font-bold">{steam.totalGames ?? 0} games</span>
          </div>
        </motion.div>
      )}
    </WidgetCard>
  );
});
