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
        <motion.div custom={4} variants={fadeUpSoft} initial="hidden" animate="show" className="relative w-full h-full overflow-hidden">
          {art ? (
            <img
              src={art}
              alt={nowPlaying?.artist ? `${track} — ${nowPlaying.artist}` : track}
              className={`w-full h-full object-cover ${nowPlaying?.isPlaying ? "album-drift" : ""}`}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/25" />

          <span className="absolute left-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm border border-white/15">
            <SiLastdotfm size={11} className="text-white/90" aria-hidden />
          </span>

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              {nowPlaying?.isPlaying && (
                <span className="flex h-2.5 items-end gap-[2px]" aria-hidden>
                  {[0.7, 1.1, 0.85].map((duration, bar) => (
                    <span
                      key={bar}
                      className="eq-bar w-[2px] h-full rounded-full bg-[#ff4b41]"
                      style={{ ["--dur" as string]: `${duration}s`, animationDelay: `${bar * 0.12}s` }}
                    />
                  ))}
                </span>
              )}
              <p className="text-white/75 text-[9px] uppercase tracking-widest font-semibold">{status}</p>
            </div>
            <p className="text-white text-[13px] font-bold leading-tight truncate">{track}</p>
            <p className="text-white/65 text-[11px] truncate">{nowPlaying?.artist}</p>
          </div>
        </motion.div>
      )}
    </WidgetCard>
  );
});
