import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { SiMyanimelist } from "react-icons/si";
import { Star } from "lucide-react";
import { WidgetCard } from "@/components/WidgetCard";
import { PortalTooltip } from "@/components/PortalTooltip";
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

const WAVE_INTERVAL_MS = 8000;
const CARD_STAGGER_MS = 150;

function MalTooltipContent({ item }: { item: ApiFavorite }) {
  const meta = [
    item.year ? String(item.year) : null,
    item.type ?? null,
    item.episodes ? `${item.episodes} eps` : item.chapters ? `${item.chapters} ch` : null,
  ].filter(Boolean).join(" · ");

  return (
    <div>
      <div className="flex items-start gap-3">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-12 h-[72px] rounded-lg object-cover shrink-0 shadow-sm"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-main leading-tight">
            {item.title}
          </p>
          {meta && (
            <p className="text-[12px] text-faint mt-1">
              {meta}
            </p>
          )}
          {item.score && (
            <div className="flex items-center gap-1 mt-1.5">
              <span className="inline-flex items-center gap-0.5 text-amber-500 text-[12px] font-bold">
                <Star size={12} fill="currentColor" />
                {item.score}
              </span>
              <span className="text-[11px] text-faint">/ 10</span>
            </div>
          )}
        </div>
      </div>
      {item.synopsis && (
        <p className="text-[12px] text-sub mt-2.5 leading-relaxed line-clamp-4 border-t border-base pt-2">
          {item.synopsis}
        </p>
      )}
    </div>
  );
}

function CoverCard({
  frontItem,
  backItem,
  flipped,
  onFlip,
}: {
  frontItem: ApiFavorite;
  backItem?: ApiFavorite;
  flipped: boolean;
  onFlip: () => void;
}) {
  const currentItem = flipped && backItem ? backItem : frontItem;

  return (
    <div className="flex-1 h-full min-w-0" style={{ perspective: "400px" }}>
      <PortalTooltip content={<MalTooltipContent item={currentItem} />} width={320} placement="top" offsetY={0}>
        <div
          className="relative w-full h-full rounded-lg overflow-hidden group cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onFlip();
          }}
        >
          <div
            className="relative w-full h-full transition-transform"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transition: "transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)",
              willChange: "transform",
            }}
          >
            {/* FRONT */}
            <div
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden" }}
            >
              <img
                src={frontItem.imageUrl}
                alt={frontItem.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* BACK */}
            {backItem && (
              <div
                className="absolute inset-0"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <img
                  src={backItem.imageUrl}
                  alt={backItem.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </div>
      </PortalTooltip>
    </div>
  );
}

export const MyAnimeListCard = React.memo(function MyAnimeListCard({
  data,
  isLoading,
  isDark,
}: MyAnimeListCardProps) {
  const { t } = useTranslation("home");
  const [flipped, setFlipped] = useState(false);
  const [animeFlips, setAnimeFlips] = useState<boolean[]>([false, false, false, false, false]);
  const [mangaFlips, setMangaFlips] = useState<boolean[]>([false, false, false, false, false]);
  const hoveredRef = useRef<Set<number>>(new Set());
  const { runWithFlipLock } = useFlipLock(700);

  const handleFlip = () => {
    runWithFlipLock(() => setFlipped((f) => !f));
  };

  const anime = data?.animeStats;
  const manga = data?.mangaStats;
  const animeFav = data?.animeFavorites ?? [];
  const mangaFav = data?.mangaFavorites ?? [];

  const hasAnimeStats = Boolean(
    anime && ((anime.completed ?? 0) > 0 || (anime.watching ?? 0) > 0 || (anime.episodesWatched ?? 0) > 0)
  );
  const hasMangaStats = Boolean(
    manga && ((manga.completed ?? 0) > 0 || (manga.reading ?? 0) > 0 || (manga.chaptersRead ?? 0) > 0)
  );
  const hasData = hasAnimeStats || hasMangaStats || animeFav.length > 0 || mangaFav.length > 0;

  const animeFront = animeFav.slice(0, 5);
  const animeBack = animeFav.slice(5, 10);
  const mangaFront = mangaFav.slice(0, 5);
  const mangaBack = mangaFav.slice(5, 10);

  // Wave flip: all 5 cards flip in sequence with 150ms delay, driven by 1 timer
  useEffect(() => {
    if (!hasData) return;
    const timer = setInterval(() => {
      // Determine which side is currently visible
      const isAnimeVisible = !flipped;
      const targets = isAnimeVisible ? animeBack : mangaBack;
      const setters = isAnimeVisible ? setAnimeFlips : setMangaFlips;
      const getters = isAnimeVisible ? animeFlips : mangaFlips;

      targets.forEach((backItem, i) => {
        if (!backItem) return;
        setTimeout(() => {
          if (hoveredRef.current.has(i)) return; // skip if hovered
          setters((prev) => {
            const next = [...prev];
            next[i] = !next[i];
            return next;
          });
        }, i * CARD_STAGGER_MS);
      });
    }, WAVE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [hasData, flipped, animeBack, mangaBack]);

  const toggleAnimeFlip = useCallback((index: number) => {
    setAnimeFlips((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }, []);

  const toggleMangaFlip = useCallback((index: number) => {
    setMangaFlips((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }, []);

  return (
    <WidgetCard
      isLoading={isLoading}
      error={!hasData && !isLoading ? t("mal.error") : null}
      loadingIcon={<SiMyanimelist size={28} className="text-brand" />}
      emptyIcon={<SiMyanimelist size={24} className="text-brand" />}
      emptyMessage={t("mal.error")}
      className="h-full cursor-pointer rounded-2xl overflow-hidden"
      style={{
        border: `1px solid var(--border-base)`,
      }}
      glowColor="var(--accent-glow)"
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
            className="absolute inset-0 flex flex-col gap-2 p-3 bg-panel rounded-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-center justify-between shrink-0">
              <div className="inline-flex items-center gap-1.5">
                <SiMyanimelist size={12} className="text-brand" />
                <span className="text-[9px] font-semibold text-brand uppercase tracking-wider">{t("mal.anime")}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-field hover:bg-panel-hover transition-colors"
              >
                <span className="text-[8px] font-medium text-faint">{t("mal.flipManga")}</span>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-faint">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            {anime && (
              <div className="flex gap-3 shrink-0">
                {[
                  { to: anime.completed, label: t("mal.completed"), dur: 1.0 },
                  { to: anime.watching, label: t("mal.watching"), dur: 0.6 },
                  { to: anime.episodesWatched, label: t("mal.episodes"), dur: 1.4, sep: "," },
                ].map((s, i) => (
                  <div key={s.label} className={i > 0 ? "border-l border-base pl-3" : ""}>
                    <p className="text-[18px] font-black leading-none text-main">
                      <CountUp to={s.to} separator={s.sep ?? ""} duration={s.dur} />
                    </p>
                    <p className="text-[8px] font-semibold uppercase tracking-wider text-faint mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-base shrink-0" />

            <div className="flex gap-1.5 flex-1 min-h-0">
              {animeFront.map((item, i) => (
                <div
                  key={item.malId}
                  className="flex-1 h-full min-w-0"
                  onMouseEnter={() => hoveredRef.current.add(i)}
                  onMouseLeave={() => hoveredRef.current.delete(i)}
                >
                  <CoverCard
                    frontItem={item}
                    backItem={animeBack[i]}
                    flipped={animeFlips[i]}
                    onFlip={() => toggleAnimeFlip(i)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* BACK — Manga */}
          <div
            className="absolute inset-0 flex flex-col gap-2 p-3 bg-panel rounded-2xl"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="flex items-center justify-between shrink-0">
              <div className="inline-flex items-center gap-1.5">
                <SiMyanimelist size={12} className="text-brand" />
                <span className="text-[9px] font-semibold text-brand uppercase tracking-wider">{t("mal.manga")}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-field hover:bg-panel-hover transition-colors"
              >
                <span className="text-[8px] font-medium text-faint">{t("mal.flipAnime")}</span>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-faint">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            </div>

            {manga && (
              <div className="flex gap-3 shrink-0">
                {[
                  { to: manga.completed, label: t("mal.completed"), dur: 1.0 },
                  { to: manga.reading, label: t("mal.reading"), dur: 0.6 },
                  { to: manga.chaptersRead, label: t("mal.chapters"), dur: 1.4, sep: "," },
                ].map((s, i) => (
                  <div key={s.label} className={i > 0 ? "border-l border-base pl-3" : ""}>
                    <p className="text-[18px] font-black leading-none text-main">
                      <CountUp to={s.to} separator={s.sep ?? ""} duration={s.dur} />
                    </p>
                    <p className="text-[8px] font-semibold uppercase tracking-wider text-faint mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-base shrink-0" />

            <div className="flex gap-1.5 flex-1 min-h-0">
              {mangaFront.map((item, i) => (
                <div
                  key={item.malId}
                  className="flex-1 h-full min-w-0"
                  onMouseEnter={() => hoveredRef.current.add(i + 5)}
                  onMouseLeave={() => hoveredRef.current.delete(i + 5)}
                >
                  <CoverCard
                    frontItem={item}
                    backItem={mangaBack[i]}
                    flipped={mangaFlips[i]}
                    onFlip={() => toggleMangaFlip(i)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </WidgetCard>
  );
});

export default MyAnimeListCard;
