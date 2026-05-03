import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SiLastdotfm } from "react-icons/si";
import { WidgetCard } from "@/components/WidgetCard";
import { useFlipLock } from "@/hooks/useFlipLock";
import CountUp from "@/components/CountUp";

const ACCENT = "var(--accent)";

interface Artist {
  name: string;
  url: string;
  imageUrl?: string;
  playcount: string | number;
}

interface Track {
  name: string;
  artist: string;
  url: string;
  imageUrl?: string;
  playcount: string | number;
}

interface TopArtistsCardProps {
  topArtists: Artist[] | undefined;
  isLoading: boolean;
  isDark: boolean;
}

async function fetchArtistImage(artist: string): Promise<string | undefined> {
  try {
    const albumRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&entity=album&limit=1`);
    const albumData = await albumRes.json();
    return albumData.results?.[0]?.artworkUrl100?.replace("100x100", "300x300");
  } catch {
    return undefined;
  }
}

export const TopArtistsCard = React.memo(function TopArtistsCard({
  topArtists,
  isLoading,
  isDark,
}: TopArtistsCardProps) {
  const { t } = useTranslation("home");
  const [flipped, setFlipped] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [images, setImages] = useState<Record<string, string>>({});
  const { isFlipping, runWithFlipLock } = useFlipLock(700);

  const artists = Array.isArray(topArtists) ? topArtists : [];

  useEffect(() => {
    let mounted = true;
    artists.slice(0, 5).forEach(async (artist) => {
      const img = await fetchArtistImage(artist.name);
      if (img && mounted) setImages(prev => ({ ...prev, [artist.name]: img }));
    });
    return () => { mounted = false; };
  }, [artists]);

  useEffect(() => {
    if (!flipped || tracks.length > 0) return;
    let mounted = true;
    setLoadingTracks(true);
    fetch(`${import.meta.env.VITE_API_URL || ""}/api/portfolio/top-tracks`)
      .then(r => r.json())
      .then((data) => {
        if (!mounted) return;
        const arr = Array.isArray(data) ? data : [];
        setTracks(arr);
        setLoadingTracks(false);
        // Fetch images for tracks
        arr.slice(0, 5).forEach(async (track: Track) => {
          const query = `${track.artist} ${track.name}`;
          const img = await fetchArtistImage(query);
          if (img && mounted) setImages(prev => ({ ...prev, [`${track.artist}-${track.name}`]: img }));
        });
      })
      .catch(() => {
        if (mounted) {
          setTracks([]);
          setLoadingTracks(false);
        }
      });
    return () => { mounted = false; };
  }, [flipped, tracks.length]);

  const handleFlip = () => {
    runWithFlipLock(() => setFlipped(f => !f));
  };

  function getGradientFromString(str: string): { from: string; to: string } {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return { from: `hsl(${hue}, 75%, 55%)`, to: `hsl(${(hue + 40) % 360}, 75%, 45%)` };
  }

  function getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }

  return (
    <WidgetCard
      isLoading={isLoading && !flipped}
      error={!flipped && artists.length === 0 ? t("artists.error") : null}
      loadingIcon={<SiLastdotfm size={28} className="text-brand" />}
      emptyIcon={<SiLastdotfm size={24} className="text-faint" />}
      emptyMessage={t("artists.empty")}
      className="h-full cursor-pointer rounded-2xl overflow-hidden"
      style={{
        border: `1px solid var(--border-base)`,
      }}
      glowColor="213, 16, 7"
      onClick={handleFlip}
      allowOverflow={true}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT — Artists */}
        <div
          className="absolute inset-0 flex flex-col gap-2 p-3 bg-panel rounded-2xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center justify-between shrink-0">
            <div className="inline-flex items-center gap-1.5">
              <SiLastdotfm size={12} className="text-brand" />
              <span className="text-[9px] font-semibold text-brand uppercase tracking-wider">{t("artists.title")}</span>
              <span className="text-[8px] text-faint ml-1">{t("artists.subtitle")}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleFlip(); }}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-field hover:bg-panel-hover transition-colors"
            >
              <span className="text-[8px] font-medium text-faint">{t("artists.flipTracks")}</span>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-faint">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            {artists.slice(0, 5).map((artist, i) => {
              const gradient = getGradientFromString(artist.name);
              const initials = getInitials(artist.name);
              const imgUrl = images[artist.name];
              return (
                <a
                  key={i}
                  href={artist.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 group hover:bg-panel-hover rounded-lg py-0.5 px-1 transition-colors"
                >
                  <span className="text-[10px] font-bold w-3.5 shrink-0 text-center tabular-nums" style={{ color: i === 0 ? ACCENT : isDark ? "#555" : "#bbb" }}>
                    {i + 1}
                  </span>
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center" style={{ background: imgUrl ? undefined : `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`, border: imgUrl ? undefined : `1.5px solid ${gradient.from}30` }}>
                    {imgUrl ? (
                      <img src={imgUrl} alt={artist.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[8px] font-bold text-white drop-shadow-sm">{initials}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[10px] font-semibold truncate text-main group-hover:text-brand transition-colors leading-tight">{artist.name}</p>
                    <p className="text-[8px] text-faint inline-flex items-center gap-0.5 leading-tight">
                      <CountUp to={Number(artist.playcount) || 0} separator="," duration={0.9} />
                      <span>{t("artists.tracks")}</span>
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* BACK — Tracks */}
        <div
          className="absolute inset-0 flex flex-col gap-2 p-3 bg-panel rounded-2xl"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex items-center justify-between shrink-0">
            <div className="inline-flex items-center gap-1.5">
              <SiLastdotfm size={12} className="text-brand" />
              <span className="text-[9px] font-semibold text-brand uppercase tracking-wider">{t("artists.topTracks")}</span>
              <span className="text-[8px] text-faint ml-1">{t("artists.subtitle")}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleFlip(); }}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-field hover:bg-panel-hover transition-colors"
            >
              <span className="text-[8px] font-medium text-faint">{t("artists.flipArtists")}</span>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-faint">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            {loadingTracks ? (
              <div className="flex-1 flex items-center justify-center">
                <SiLastdotfm size={20} className="text-brand animate-pulse" />
              </div>
            ) : tracks.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                 <span className="text-[10px] text-faint">{t("artists.noTracks")}</span>
              </div>
            ) : (
              tracks.slice(0, 5).map((track, i) => {
                const gradient = getGradientFromString(track.name + track.artist);
                const initials = getInitials(track.name);
                const imgUrl = images[`${track.artist}-${track.name}`];
                return (
                  <a
                    key={i}
                    href={track.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 group hover:bg-panel-hover rounded-lg py-0.5 px-1 transition-colors"
                  >
                    <span className="text-[10px] font-bold w-3.5 shrink-0 text-center tabular-nums" style={{ color: i === 0 ? ACCENT : isDark ? "#555" : "#bbb" }}>
                      {i + 1}
                    </span>
                    <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0 flex items-center justify-center" style={{ background: imgUrl ? undefined : `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`, border: imgUrl ? undefined : `1.5px solid ${gradient.from}30` }}>
                      {imgUrl ? (
                        <img src={imgUrl} alt={track.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[8px] font-bold text-white drop-shadow-sm">{initials}</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[10px] font-semibold truncate text-main group-hover:text-brand transition-colors leading-tight">{track.name}</p>
                      <p className="text-[8px] text-faint inline-flex items-center gap-0.5 leading-tight">
                        <span>{track.artist} ·</span>
                        <CountUp to={Number(track.playcount) || 0} separator="," duration={0.9} />
                        <span>{t("artists.tracks")}</span>
                      </p>
                    </div>
                  </a>
                );
              })
            )}
          </div>
        </div>
      </div>
    </WidgetCard>
  );
});
