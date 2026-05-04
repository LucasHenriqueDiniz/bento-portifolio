import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { SiMyanimelist } from "react-icons/si";
import { Star } from "lucide-react";
import { WidgetCard } from "@/components/WidgetCard";
import { PortalTooltip } from "@/components/PortalTooltip";
import CountUp from "@/components/CountUp";
import { useFlipLock } from "@/hooks/useFlipLock";
import { getMalDetails } from "@/lib/apiClient";

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

function MalSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-12 h-[72px] rounded-lg bg-field shrink-0" />
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="h-4 bg-field rounded w-3/4" />
          <div className="h-3 bg-field rounded w-1/2" />
          <div className="h-3 bg-field rounded w-1/3" />
        </div>
      </div>
      <div className="border-t border-base pt-2 space-y-1.5">
        <div className="h-3 bg-field rounded w-full" />
        <div className="h-3 bg-field rounded w-5/6" />
        <div className="h-3 bg-field rounded w-4/6" />
      </div>
    </div>
  );
}

function MalTooltipContent({ item, loading }: { item: ApiFavorite; loading: boolean }) {
  if (loading) {
    return <MalSkeleton />;
  }

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
  detailItem,
  detailLoading,
  onHoverDetail,
}: {
  frontItem: ApiFavorite;
  backItem?: ApiFavorite;
  flipped: boolean;
  onFlip: () => void;
  detailItem?: ApiFavorite;
  detailLoading: boolean;
  onHoverDetail: () => void;
}) {
  const currentItem = flipped && backItem ? backItem : frontItem;
  const mergedItem = detailItem ? { ...currentItem, ...detailItem } : currentItem;

  return (
    <div className="flex-1 h-full min-w-0" style={{ perspective: "400px" }}>
      <PortalTooltip 
        content={<MalTooltipContent item={mergedItem} loading={detailLoading} />} 
        width={320} 
        placement="top" 
        offsetY={0}
      >
        <div
          className="relative w-full h-full rounded-lg overflow-hidden group cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onFlip();
          }}
          onMouseEnter={onHoverDetail}
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

  // Detail states
  const [animeDetails, setAnimeDetails] = useState<Record<number, ApiFavorite>>({});
  const [mangaDetails, setMangaDetails] = useState<Record<number, ApiFavorite>>({});
  const [animeDetailsLoading, setAnimeDetailsLoading] = useState(false);
  const [mangaDetailsLoading, setMangaDetailsLoading] = useState(false);
  const [animeDetailsFailed, setAnimeDetailsFailed] = useState(false);
  const [mangaDetailsFailed, setMangaDetailsFailed] = useState(false);

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

  // Fetch anime details in background after basic data loads
  useEffect(() => {
    if (animeFav.length === 0 || animeDetailsLoading || Object.keys(animeDetails).length > 0) return;

    const fetchAnimeDetails = async () => {
      setAnimeDetailsLoading(true);
      setAnimeDetailsFailed(false);
      try {
        const ids = animeFav.map((a) => a.malId);
        const details = await getMalDetails("anime", ids);
        setAnimeDetails(details);
      } catch {
        setAnimeDetailsFailed(true);
      } finally {
        setAnimeDetailsLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [animeFav]);

  // Fetch manga details in background after anime details (1s delay)
  useEffect(() => {
    if (mangaFav.length === 0 || mangaDetailsLoading || Object.keys(mangaDetails).length > 0) return;

    const fetchMangaDetails = async () => {
      // Wait for anime details to finish, then wait 1s more
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMangaDetailsLoading(true);
      setMangaDetailsFailed(false);
      try {
        const ids = mangaFav.map((m) => m.malId);
        const details = await getMalDetails("manga", ids);
        setMangaDetails(details);
      } catch {
        setMangaDetailsFailed(true);
      } finally {
        setMangaDetailsLoading(false);
      }
    };

    fetchMangaDetails();
  }, [mangaFav]);

  // Retry on hover functions
  const handleAnimeHoverDetail = useCallback((index: number) => {
    if (animeDetailsFailed && !animeDetailsLoading) {
      const item = animeFav[index];
      if (!item) return;
      
      setAnimeDetailsLoading(true);
      setAnimeDetailsFailed(false);
      getMalDetails("anime", [item.malId])
        .then((details) => {
          setAnimeDetails((prev) => ({ ...prev, ...details }));
        })
        .catch(() => setAnimeDetailsFailed(true))
        .finally(() => setAnimeDetailsLoading(false));
    }
  }, [animeDetailsFailed, animeDetailsLoading, animeFav]);

  const handleMangaHoverDetail = useCallback((index: number) => {
    if (mangaDetailsFailed && !mangaDetailsLoading) {
      const item = mangaFav[index];
      if (!item) return;
      
      setMangaDetailsLoading(true);
      setMangaDetailsFailed(false);
      getMalDetails("manga", [item.malId])
        .then((details) => {
          setMangaDetails((prev) => ({ ...prev, ...details }));
        })
        .catch(() => setMangaDetailsFailed(true))
        .finally(() => setMangaDetailsLoading(false));
    }
  }, [mangaDetailsFailed, mangaDetailsLoading, mangaFav]);

  // Wave flip: all 5 cards flip in sequence with 150ms delay, driven by 1 timer
  useEffect(() => {
    if (!hasData) return;
    const timer = setInterval(() => {
      // Determine which side is currently visible
      const isAnimeVisible = !flipped;
      const targets = isAnimeVisible ? animeBack : mangaBack;
      const setters = isAnimeVisible ? setAnimeFlips : setMangaFlips;

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
                    detailItem={animeDetails[item.malId]}
                    detailLoading={animeDetailsLoading && !animeDetails[item.malId]}
                    onHoverDetail={() => handleAnimeHoverDetail(i)}
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
                    detailItem={mangaDetails[item.malId]}
                    detailLoading={mangaDetailsLoading && !mangaDetails[item.malId]}
                    onHoverDetail={() => handleMangaHoverDetail(i)}
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