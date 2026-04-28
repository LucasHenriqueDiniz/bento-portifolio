import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SiMyanimelist } from "react-icons/si";
import { WidgetCard } from "@/components/WidgetCard";
import { Tooltip } from "@/components/Tooltip";
import CountUp from "@/components/CountUp";
import { useFlipLock } from "@/hooks/useFlipLock";

/**
 * Favorite anime/manga item
 * @interface Favorite
 * @property {string} title - Title name
 * @property {number | null} year - Release year
 * @property {string} img - Cover image URL
 * @property {number} [score] - User score (optional)
 * @property {string} [synopsis] - Synopsis (optional)
 */
interface Favorite {
  title: string;
  year: number | null;
  img: string;
  score?: number;
  synopsis?: string;
}

/**
 * MyAnimeList data structure
 * @interface MALData
 * @property {Object} anime - Anime statistics
 * @property {number} anime.watching - Currently watching count
 * @property {number} anime.completed - Completed count
 * @property {number} anime.episodes - Total episodes watched
 * @property {Favorite[]} anime.favorites - Favorite anime list
 * @property {Object} manga - Manga statistics
 * @property {number} manga.reading - Currently reading count
 * @property {number} manga.completed - Completed count
 * @property {number} manga.chapters - Total chapters read
 * @property {Favorite[]} manga.favorites - Favorite manga list
 */
interface MALData {
  anime: {
    watching: number;
    completed: number;
    episodes: number;
    favorites: Favorite[];
  };
  manga: {
    reading: number;
    completed: number;
    chapters: number;
    favorites: Favorite[];
  };
}

/**
 * Props for MyAnimeListCard component
 * @interface MyAnimeListCardProps
 * @property {MALData} malData - Processed MAL data
 * @property {unknown} malApi - Raw API response
 * @property {boolean} isLoading - Loading state
 * @property {1 | 2 | 3 | 4} [tier] - Visual hierarchy tier (optional, defaults to 2)
 */
interface MyAnimeListCardProps {
  malData: MALData;
  malApi: unknown;
  isLoading: boolean;
  tier?: 1 | 2 | 3 | 4;
}

/**
 * MyAnimeListCard - Flip card showing anime stats on front, manga on back
 * Displays favorites with pagination and hover details
 * @component
 * @param {MyAnimeListCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const MyAnimeListCard = React.memo(function MyAnimeListCard({
  malData,
  malApi,
  isLoading,
  tier = 2,
}: MyAnimeListCardProps) {
  const [malFlipped, setMalFlipped] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { isFlipping, runWithFlipLock } = useFlipLock(700);
  const staggerTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Auto-flip all cards with staggered delay when not hovering
  useEffect(() => {
    if (isHovered || hoveredCard !== null || isFlipping) return;

    const flipAllCards = () => {
      // Flip each card with 0.1s delay
      [0, 1, 2, 3, 4].forEach((idx) => {
        const timeout = setTimeout(() => {
          setFlippedCards((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(idx)) {
              newSet.delete(idx);
            } else {
              newSet.add(idx);
            }
            return newSet;
          });
        }, idx * 100); // 0.1s = 100ms delay between each

        staggerTimeoutsRef.current.push(timeout);
      });
    };

    const interval = setInterval(flipAllCards, 6000); // Flip all every 6 seconds

    return () => {
      clearInterval(interval);
      staggerTimeoutsRef.current.forEach(clearTimeout);
      staggerTimeoutsRef.current = [];
    };
  }, [isHovered, hoveredCard, isFlipping]);

  useEffect(() => {
    return () => {
      staggerTimeoutsRef.current.forEach(clearTimeout);
      staggerTimeoutsRef.current = [];
    };
  }, []);

  const handleFlip = () => {
    runWithFlipLock(() => {
      setMalFlipped((f) => !f);
      setFlippedCards(new Set());
      setHoveredCard(null);
    });
  };

  const handleCardClick = (index: number, e: React.MouseEvent) => {
    if (isFlipping) return;

    e.stopPropagation();
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const renderFace = (type: "anime" | "manga") => {
    const data = type === "anime" ? malData.anime : malData.manga;
    const favorites =
      type === "anime" ? malData.anime.favorites : malData.manga.favorites;
    const isBack = type === "manga";

    return (
      <div
        className="absolute inset-0 flex flex-col gap-2 p-3 bg-white dark:bg-[#181818] rounded-2xl"
        style={{
          backfaceVisibility: "hidden",
          transform: isBack ? "rotateY(180deg)" : "rotateY(0deg)",
          overflow: "visible", // Allow tooltip to overflow
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - simple like LastFM */}
        <div
          className="flex items-center justify-between shrink-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleFlip();
          }}
        >
          <div className="inline-flex items-center gap-1.5">
            <SiMyanimelist size={12} className="text-[#2e51a2]" />
            <span className="text-[9px] font-semibold text-[#2e51a2] uppercase tracking-wider capitalize">
              {type}
            </span>
          </div>
          <motion.div
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#f5f5f5] dark:bg-[#252525] hover:bg-[#ebebeb] dark:hover:bg-[#2a2a2a] transition-colors"
            whileHover={{ x: 2 }}
          >
            <span className="text-[8px] font-medium text-[#666] dark:text-[#888]">
              {isBack ? "anime" : "manga"}
            </span>
            <svg
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#666] dark:text-[#888]"
            >
              <polyline
                points={isBack ? "15 18 9 12 15 6" : "9 18 15 12 9 6"}
              ></polyline>
            </svg>
          </motion.div>
        </div>

        {/* Stats row - mais compacto */}
        <div
          className="flex gap-3 shrink-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleFlip();
          }}
        >
          {[
            { to: data.completed, label: "completed", dur: 1.0 },
            {
              to:
                type === "anime"
                  ? (data as MALData["anime"]).watching
                  : (data as MALData["manga"]).reading,
              label: type === "anime" ? "watching" : "reading",
              dur: 0.6,
            },
            {
              to:
                type === "anime"
                  ? (data as MALData["anime"]).episodes
                  : (data as MALData["manga"]).chapters,
              label: type === "anime" ? "episodes" : "chapters",
              dur: 1.4,
              sep: ",",
            },
          ].map((s, i) => (
            <div
              key={s.label}
              className={
                i > 0
                  ? "border-l border-[#ebebeb] dark:border-[#282828] pl-3"
                  : ""
              }
            >
              <p className="text-[20px] font-black leading-none text-[#111] dark:text-[#eee]">
                <CountUp to={s.to} separator={s.sep ?? ""} duration={s.dur} />
              </p>
              <p className="text-[8px] font-semibold uppercase tracking-wider text-[#888] dark:text-[#666] mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#ebebeb] dark:border-[#282828] shrink-0" />

        {/* Favorites grid - individual flipping cards */}
        <div className="flex-1 min-h-0 flex flex-col gap-2 relative">
          <div className="flex gap-2 flex-1 relative max-h-[165px]">
            {favorites.slice(0, 5).map((frontItem, idx) => {
              const backItem = favorites[idx + 5]; // 6-10
              const isCardFlipped = flippedCards.has(idx);
              const isCardHovered = hoveredCard === idx;
              const currentItem = isCardFlipped ? backItem : frontItem;

              return (
                <React.Fragment key={`card-${idx}`}>
                  <div
                    className="flex-1 relative min-w-0"
                    style={{ perspective: "1000px" }}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={(e) => handleCardClick(idx, e)}
                  >
                    <motion.div
                      className="relative w-full h-full cursor-pointer"
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                      animate={{
                        rotateY: isCardFlipped ? 180 : 0,
                      }}
                      transition={{
                        duration: 0.6,
                        ease: "easeInOut",
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Front face (1-5) */}
                      <div
                        className="absolute inset-0 rounded-lg bg-[#f5f5f5] dark:bg-[#252525]"
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                        }}
                      >
                        <img
                          src={frontItem.img}
                          alt={frontItem.title}
                          className="w-full h-full object-cover rounded-lg"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      </div>

                      {/* Back face (6-10) */}
                      {backItem && (
                        <div
                          className="absolute inset-0 rounded-lg bg-[#f5f5f5] dark:bg-[#252525]"
                          style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          <img
                            src={backItem.img}
                            alt={backItem.title}
                            className="w-full h-full object-cover rounded-lg"
                          />

                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        </div>
                      )}
                    </motion.div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Tooltips layer - outside overflow context */}
          <div className="absolute inset-0 pointer-events-none">
            {favorites.slice(0, 5).map((frontItem, idx) => {
              const backItem = favorites[idx + 5];
              const isCardFlipped = flippedCards.has(idx);
              const isCardHovered = hoveredCard === idx;
              const currentItem = isCardFlipped ? backItem : frontItem;

              // Calculate position for each tooltip
              const cardWidth = 100 / 5; // 5 cards
              const leftPosition = `${cardWidth * idx + cardWidth / 2}%`;

              return currentItem ? (
                <div
                  key={`tooltip-${idx}`}
                  className="absolute top-0 -translate-y-2"
                  style={{
                    left: leftPosition,
                    transform: "translateX(-50%) translateY(-100%)",
                  }}
                >
                  <Tooltip
                    isVisible={isCardHovered}
                    title={currentItem.title}
                    subtitle={currentItem.year?.toString()}
                    score={currentItem.score}
                    synopsis={currentItem.synopsis}
                    position="top"
                  />
                </div>
              ) : null;
            })}
          </div>

          {/* Page dots - removed, no longer needed */}
        </div>
      </div>
    );
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="
        /* Mobile: full width, order 12 (tier-3) */
        col-span-1 order-12
        /* Tablet: columns 2-4, rows 13-17 */
        md:col-start-2 md:col-end-4 md:row-start-13 md:row-end-17
        /* Desktop: columns 2-4, rows 13-17 */
        lg:col-start-2 lg:col-end-4 lg:row-start-13 lg:row-end-17"
    >
      <WidgetCard
        isLoading={isLoading}
        error={!malApi ? "Dados do MyAnimeList indisponíveis" : null}
        loadingIcon={<SiMyanimelist size={28} style={{ color: "#2e51a2" }} />}
        emptyIcon={<SiMyanimelist size={24} style={{ color: "#2e51a2" }} />}
        emptyMessage="Dados do MyAnimeList indisponíveis"
        tier={tier}
        className={`h-full cursor-pointer border rounded-2xl transition-all duration-300 ${
          isFlipping
            ? "shadow-none border-transparent"
            : "border-[#ebebeb] dark:border-[#282828]"
        }`}
        glowColor="46, 81, 162"
        onClick={handleFlip}
        allowOverflow={true}
      >
        {Boolean(malApi) && (
          <div
            className="relative w-full h-full transition-transform duration-700"
            style={{
              transformStyle: "preserve-3d",
              transform: malFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {renderFace("anime")}
            {renderFace("manga")}
          </div>
        )}
      </WidgetCard>
    </div>
  );
});
