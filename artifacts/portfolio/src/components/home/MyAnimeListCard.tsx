import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiMyanimelist } from "react-icons/si";
import { Star } from "lucide-react";
import { WidgetCard } from "@/components/WidgetCard";
import CountUp from "@/components/CountUp";
import { useFlipLock } from "@/hooks/useFlipLock";

interface ApiFavorite {
  malId: number;
  title: string;
  year: number | null;
  imageUrl: string;
  url: string;
  score?: number | null;
  synopsis?: string | null;
  type?: string | null;
  episodes?: number | null;
  chapters?: number | null;
}

interface MalApiData {
  animeStats?: {
    completed: number;
    watching: number;
    episodesWatched: number;
  };
  mangaStats?: {
    completed: number;
    reading: number;
    chaptersRead: number;
  };
  animeFavorites?: ApiFavorite[];
  mangaFavorites?: ApiFavorite[];
}

interface MyAnimeListCardProps {
  data: MalApiData | undefined;
  isLoading: boolean;
  isDark: boolean;
}

function TooltipContent({ item, isDark }: { item: ApiFavorite; isDark: boolean }) {
  const meta = [
    item.year ? String(item.year) : null,
    item.type ?? null,
    item.episodes ? `${item.episodes} eps` : item.chapters ? `${item.chapters} ch` : null,
    item.score ? `★ ${item.score}` : null,
  ].filter(Boolean).join(" · ");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.96 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute inset-x-0 bottom-full mb-2 z-50 pointer-events-none px-1"
    >
      <div
        className="rounded-xl p-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)] border backdrop-blur-md overflow-hidden"
        style={{
          backgroundColor: isDark ? "rgba(26,26,26,0.95)" : "rgba(255,255,255,0.95)",
          borderColor: isDark ? "#333" : "#e5e5e5",
        }}
      >
        <div className="flex items-start gap-2.5">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-10 h-14 rounded-md object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-[#111] dark:text-[#eee] truncate leading-tight">
              {item.title}
            </p>
            {meta && (
              <p className="text-[9px] text-[#888] dark:text-[#666] mt-0.5 flex items-center gap-1">
                {item.score && (
                  <span className="inline-flex items-center gap-0.5 text-amber-500">
                    <Star size={8} fill="currentColor" />
                    {item.score}
                  </span>
                )}
                <span>{meta}</span>
              </p>
            )}
            {item.synopsis && (
              <p className="text-[9px] text-[#666] dark:text-[#888] mt-1.5 leading-relaxed line-clamp-3">
                {item.synopsis}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const MyAnimeListCard = React.memo(function MyAnimeListCard({
  data,
  isLoading,
  isDark,
}: MyAnimeListCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [hoveredMalId, setHoveredMalId] = useState<number | null>(null);
  const { isFlipping, runWithFlipLock } = useFlipLock(700);

  const handleFlip = () => {
    runWithFlipLock(() => setFlipped((f) => !f));
  };

  const anime = data?.animeStats;
  const manga = data?.mangaStats;
  const animeFav = data?.animeFavorites ?? [];
  const mangaFav = data?.mangaFavorites ?? [];

  const hasData = Boolean(anime || manga);

  return (
    <WidgetCard
      isLoading={isLoading}
      error={!hasData && !isLoading ? "Dados do MyAnimeList indisponíveis" : null}
      loadingIcon={<SiMyanimelist size={28} style={{ color: "#2e51a2" }} />}
      emptyIcon={<SiMyanimelist size={24} style={{ color: "#2e51a2" }} />}
      emptyMessage="Dados do MyAnimeList indisponíveis"
      className="h-full cursor-pointer rounded-2xl overflow-hidden"
      style={{
        border: isDark ? "1px solid #282828" : "1px solid #ebebeb",
      }}
      glowColor="46, 81, 162"
      onClick={handleFlip}
      allowOverflow={true}
    >
      {hasData && (
        <div
          className="relative w-full h-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* FRONT — Anime */}
          <div
            className="absolute inset-0 flex flex-col gap-2 p-3 bg-white dark:bg-[#181818] rounded-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-center justify-between shrink-0">
              <div className="inline-flex items-center gap-1.5">
                <SiMyanimelist size={12} className="text-[#2e51a2]" />
                <span className="text-[9px] font-semibold text-[#2e51a2] uppercase tracking-wider">Anime</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#f5f5f5] dark:bg-[#252525] hover:bg-[#ebebeb] dark:hover:bg-[#2a2a2a] transition-colors"
              >
                <span className="text-[8px] font-medium text-[#666] dark:text-[#888]">manga</span>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#666] dark:text-[#888]">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            {anime && (
              <div className="flex gap-3 shrink-0">
                {[
                  { to: anime.completed, label: "completed", dur: 1.0 },
                  { to: anime.watching, label: "watching", dur: 0.6 },
                  { to: anime.episodesWatched, label: "episodes", dur: 1.4, sep: "," },
                ].map((s, i) => (
                  <div key={s.label} className={i > 0 ? "border-l border-[#ebebeb] dark:border-[#282828] pl-3" : ""}>
                    <p className="text-[18px] font-black leading-none text-[#111] dark:text-[#eee]">
                      <CountUp to={s.to} separator={s.sep ?? ""} duration={s.dur} />
                    </p>
                    <p className="text-[8px] font-semibold uppercase tracking-wider text-[#888] dark:text-[#666] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-[#ebebeb] dark:border-[#282828] shrink-0" />

            <div className="flex gap-1.5 flex-1 min-h-0 relative">
              {animeFav.slice(0, 5).map((item) => (
                <a
                  key={item.malId}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => setHoveredMalId(item.malId)}
                  onMouseLeave={() => setHoveredMalId(null)}
                  className="flex-1 relative min-w-0 rounded-lg overflow-hidden group"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}

              {/* Tooltip above images with smooth crossfade */}
              <AnimatePresence mode="wait">
                {hoveredMalId && (() => {
                  const item = animeFav.find(f => f.malId === hoveredMalId);
                  if (!item) return null;
                  return <TooltipContent key={item.malId} item={item} isDark={isDark} />;
                })()}
              </AnimatePresence>
            </div>
          </div>

          {/* BACK — Manga */}
          <div
            className="absolute inset-0 flex flex-col gap-2 p-3 bg-white dark:bg-[#181818] rounded-2xl"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="flex items-center justify-between shrink-0">
              <div className="inline-flex items-center gap-1.5">
                <SiMyanimelist size={12} className="text-[#2e51a2]" />
                <span className="text-[9px] font-semibold text-[#2e51a2] uppercase tracking-wider">Manga</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#f5f5f5] dark:bg-[#252525] hover:bg-[#ebebeb] dark:hover:bg-[#2a2a2a] transition-colors"
              >
                <span className="text-[8px] font-medium text-[#666] dark:text-[#888]">anime</span>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#666] dark:text-[#888]">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            </div>

            {manga && (
              <div className="flex gap-3 shrink-0">
                {[
                  { to: manga.completed, label: "completed", dur: 1.0 },
                  { to: manga.reading, label: "reading", dur: 0.6 },
                  { to: manga.chaptersRead, label: "chapters", dur: 1.4, sep: "," },
                ].map((s, i) => (
                  <div key={s.label} className={i > 0 ? "border-l border-[#ebebeb] dark:border-[#282828] pl-3" : ""}>
                    <p className="text-[18px] font-black leading-none text-[#111] dark:text-[#eee]">
                      <CountUp to={s.to} separator={s.sep ?? ""} duration={s.dur} />
                    </p>
                    <p className="text-[8px] font-semibold uppercase tracking-wider text-[#888] dark:text-[#666] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-[#ebebeb] dark:border-[#282828] shrink-0" />

            <div className="flex gap-1.5 flex-1 min-h-0 relative">
              {mangaFav.slice(0, 5).map((item) => (
                <a
                  key={item.malId}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => setHoveredMalId(item.malId)}
                  onMouseLeave={() => setHoveredMalId(null)}
                  className="flex-1 relative min-w-0 rounded-lg overflow-hidden group"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}

              {/* Tooltip above images with smooth crossfade */}
              <AnimatePresence mode="wait">
                {hoveredMalId && (() => {
                  const item = mangaFav.find(f => f.malId === hoveredMalId);
                  if (!item) return null;
                  return <TooltipContent key={item.malId} item={item} isDark={isDark} />;
                })()}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </WidgetCard>
  );
});
