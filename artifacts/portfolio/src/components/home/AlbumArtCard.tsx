import { memo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SiLastdotfm } from "react-icons/si";
import { WidgetCard } from "@/components/WidgetCard";
import { fadeUpSoft } from "@/lib/animations";
import { formatTimeAgo } from "@/lib/dateFormatter";

interface AlbumArtCardProps {
  nowPlaying:
    | {
        albumArt?: string | null;
        track?: string | null;
        artist?: string | null;
        isPlaying?: boolean;
        timestamp?: number | null;
      }
    | undefined;
  isLoading: boolean;
  isDark: boolean;
}

/**
 * The track playing now on Last.fm, or the last one played. A track without album
 * art still shows, over a placeholder: missing art is not missing music.
 */
export const AlbumArtCard = memo(function AlbumArtCard({ nowPlaying, isLoading }: AlbumArtCardProps) {
  const { t, i18n } = useTranslation("home");
  // Remembers which URL failed, so a new track with working art shows it again.
  const [failedArt, setFailedArt] = useState<string | null>(null);

  const track = nowPlaying?.track;
  const art = nowPlaying?.albumArt && nowPlaying.albumArt !== failedArt ? nowPlaying.albumArt : null;
  const ago = formatTimeAgo(nowPlaying?.timestamp, i18n.language);
  const status = nowPlaying?.isPlaying
    ? t("album.listening")
    : ago
      ? `${t("album.lastPlayed")} ${ago}`
      : t("album.lastPlayed");

  return (
    <WidgetCard
      isLoading={isLoading}
      error={!track ? t("album.empty") : null}
      loadingIcon={<SiLastdotfm size={28} className="text-brand" />}
      emptyIcon={<SiLastdotfm size={24} className="text-brand" />}
      className="rounded-2xl overflow-hidden relative h-full"
      style={{ border: "1px solid var(--border-base)" }}
      glowColor="var(--accent-glow)"
    >
      {track && (
        <motion.div custom={4} variants={fadeUpSoft} initial="hidden" animate="show" className="w-full h-full">
          {art ? (
            <img
              src={art}
              alt={nowPlaying?.artist ? `${track} — ${nowPlaying.artist}` : track}
              className="w-full h-full object-cover"
              onError={() => setFailedArt(art)}
            />
          ) : (
            <div
              data-testid="album-art-placeholder"
              className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#d51007]/45 via-[#3a0a08] to-black"
            >
              <SiLastdotfm size={48} className="text-white/25" aria-hidden />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-1 mb-0.5">
              {nowPlaying?.isPlaying && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
              <p className="text-white/70 text-[9px] uppercase tracking-widest font-semibold">{status}</p>
            </div>
            <p className="text-white text-[13px] font-bold leading-tight truncate">{track}</p>
            <p className="text-white/60 text-[11px] truncate">{nowPlaying?.artist}</p>
          </div>
        </motion.div>
      )}
    </WidgetCard>
  );
});
