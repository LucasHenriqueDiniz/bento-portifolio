import { memo } from "react";
import { motion } from "framer-motion";
import { SiLastdotfm } from "react-icons/si";
import { WidgetCard } from "@/components/WidgetCard";
import { fadeUpSoft } from "@/lib/animations";

/**
 * Now playing data from Last.fm API
 * @interface AlbumArtCardProps
 * @property {Object | undefined} nowPlaying - Current playing track data
 * @property {string} [nowPlaying.albumArt] - Album art URL
 * @property {string} [nowPlaying.track] - Track name
 * @property {string} [nowPlaying.artist] - Artist name
 * @property {boolean} isLoading - Loading state
 * @property {boolean} isDark - Dark mode flag
 */
interface AlbumArtCardProps {
  nowPlaying:
    | { albumArt?: string; track?: string; artist?: string }
    | undefined;
  isLoading: boolean;
  isDark: boolean;
}

/**
 * AlbumArtCard - Displays currently playing track from Last.fm with album art
 * Shows album cover with track and artist info overlay
 * @component
 * @param {AlbumArtCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const AlbumArtCard = memo(function AlbumArtCard({
  nowPlaying,
  isLoading,
  isDark,
}: AlbumArtCardProps) {
  return (
    <WidgetCard
      isLoading={isLoading}
      error={!nowPlaying?.albumArt ? "Nenhuma música tocando" : null}
      loadingIcon={
        <SiLastdotfm size={28} className="text-[#ccc] dark:text-[#444]" />
      }
      emptyIcon={
        <SiLastdotfm size={24} className="text-[#ccc] dark:text-[#444]" />
      }
      className={`rounded-2xl overflow-hidden relative
        /* Mobile: full width, order 13 (tier-3) */
        col-span-1 order-13
        /* Tablet: column 4, rows 1-5 */
        md:col-start-4 md:col-end-5 md:row-start-1 md:row-end-5
        /* Desktop: column 5, rows 1-5 */
        lg:col-start-5 lg:col-end-6 lg:row-start-1 lg:row-end-5`}
      style={{
        border: "1px solid",
        borderColor: isDark ? "#282828" : "#ebebeb",
      }}
    >
      {nowPlaying?.albumArt && (
        <motion.div
          custom={4}
          variants={fadeUpSoft}
          initial="hidden"
          animate="show"
          className="w-full h-full"
        >
          <img
            src={nowPlaying.albumArt}
            alt="album"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white/70 text-[9px] uppercase tracking-widest font-semibold mb-0.5">
              Listening
            </p>
            <p className="text-white text-[13px] font-bold leading-tight truncate">
              {nowPlaying.track}
            </p>
            <p className="text-white/60 text-[11px] truncate">
              {nowPlaying.artist}
            </p>
          </div>
        </motion.div>
      )}
    </WidgetCard>
  );
});
