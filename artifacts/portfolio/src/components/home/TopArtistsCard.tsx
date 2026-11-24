import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SiLastdotfm } from "react-icons/si";
import { WidgetCard } from "@/components/WidgetCard";

type Tab = "artists" | "tracks";

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
  topTracks: Track[] | undefined;
  isLoading: boolean;
  isDark: boolean;
}

interface Row {
  key: string;
  title: string;
  detail?: string;
  url: string;
  plays: number;
  imageKey: string;
}

async function fetchCover(term: string): Promise<string | undefined> {
  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=album&limit=1`);
    const data = await res.json();
    return data.results?.[0]?.artworkUrl100?.replace("100x100", "300x300");
  } catch {
    return undefined;
  }
}

const hueOf = (text: string) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = text.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash % 360);
};

const initialsOf = (name: string) => {
  const words = name.trim().split(/\s+/);
  return (words.length >= 2 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
};

/**
 * The five artists and the five tracks played most on Last.fm in the last 90 days, a
 * tab for each. Every row carries a bar of its plays against the first place.
 */
export const TopArtistsCard = React.memo(function TopArtistsCard({ topArtists, topTracks, isLoading }: TopArtistsCardProps) {
  const { t, i18n } = useTranslation("home");
  const still = useReducedMotion() ?? false;
  const [tab, setTab] = useState<Tab>("artists");
  const [images, setImages] = useState<Record<string, string>>({});

  const artists = Array.isArray(topArtists) ? topArtists : [];
  const tracks = Array.isArray(topTracks) ? topTracks : [];

  const artistRows: Row[] = artists.slice(0, 5).map((artist) => ({
    key: artist.name,
    title: artist.name,
    url: artist.url,
    plays: Number(artist.playcount) || 0,
    imageKey: artist.name,
  }));
  const trackRows: Row[] = tracks.slice(0, 5).map((track) => ({
    key: `${track.artist}-${track.name}`,
    title: track.name,
    detail: track.artist,
    url: track.url,
    plays: Number(track.playcount) || 0,
    imageKey: `${track.artist} ${track.name}`,
  }));

  const wanted = [...artistRows, ...trackRows].map((row) => row.imageKey).join("|");
  useEffect(() => {
    let mounted = true;
    wanted.split("|").filter(Boolean).forEach(async (term) => {
      const cover = await fetchCover(term);
      if (cover && mounted) setImages((prev) => ({ ...prev, [term]: cover }));
    });
    return () => {
      mounted = false;
    };
  }, [wanted]);

  const rows = tab === "artists" ? artistRows : trackRows;
  const top = Math.max(1, ...rows.map((row) => row.plays));
  const number = new Intl.NumberFormat(i18n.language?.startsWith("en") ? "en-US" : "pt-BR");

  return (
    <WidgetCard
      isLoading={isLoading}
      error={artists.length === 0 && tracks.length === 0 ? t("artists.error") : null}
      loadingIcon={<SiLastdotfm size={28} className="text-brand" />}
      emptyIcon={<SiLastdotfm size={24} className="text-faint" />}
      emptyMessage={t("artists.empty")}
      className="h-full rounded-2xl overflow-hidden bg-panel"
      style={{ border: "1px solid var(--border-base)" }}
      glowColor="213, 16, 7"
    >
      <div className="h-full flex flex-col p-3">
        <div className="flex items-center justify-between gap-2 shrink-0">
          <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-faint">
            <SiLastdotfm size={12} className="text-brand" aria-hidden />
            {t("artists.subtitle").replace(/^·\s*/, "")}
          </p>
          <div role="tablist" className="flex rounded-full bg-field p-0.5">
            {(["artists", "tracks"] as const).map((id) => {
              const selected = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setTab(id)}
                  className="relative rounded-full px-2 py-0.5 text-[9px] font-semibold transition-colors"
                  style={{ color: selected ? "var(--text-main)" : "var(--text-faint)" }}
                >
                  {selected && (
                    <motion.span
                      layoutId="top-artists-tab"
                      className="absolute inset-0 rounded-full bg-panel border border-base"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{t(id === "artists" ? "artists.tabArtists" : "artists.tabTracks")}</span>
                </button>
              );
            })}
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-[10px] text-faint">{t(tab === "artists" ? "artists.empty" : "artists.noTracks")}</span>
          </div>
        ) : (
          <ol key={tab} className="mt-2 flex-1 min-h-0 flex flex-col justify-between">
            {rows.map((row, i) => {
              const cover = images[row.imageKey];
              const hue = hueOf(row.title);
              return (
                <motion.li
                  key={row.key}
                  initial={still ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex items-center gap-2 overflow-hidden rounded-lg px-1 py-1"
                  >
                    {/* The row's plays against the first place. */}
                    <motion.span
                      aria-hidden
                      className="absolute inset-y-0 left-0 origin-left rounded-lg"
                      style={{
                        width: `${Math.max(8, (row.plays / top) * 100)}%`,
                        background: i === 0 ? "rgba(213, 16, 7, 0.16)" : "var(--bg-field)",
                      }}
                      initial={still ? false : { scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.1 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <span
                      className="relative w-3 shrink-0 text-center text-[10px] font-bold tabular-nums"
                      style={{ color: i === 0 ? "var(--accent)" : "var(--text-faint)" }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden ${tab === "artists" ? "rounded-full" : "rounded-md"}`}
                      style={cover ? undefined : { background: `linear-gradient(135deg, hsl(${hue}, 70%, 52%), hsl(${(hue + 40) % 360}, 70%, 42%))` }}
                    >
                      {cover ? (
                        <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[8px] font-bold text-white">{initialsOf(row.title)}</span>
                      )}
                    </span>
                    <span className="relative min-w-0 flex-1">
                      <span className="block truncate text-[10px] font-semibold leading-tight text-main transition-colors group-hover:text-brand">
                        {row.title}
                      </span>
                      {row.detail && <span className="block truncate text-[8px] leading-tight text-faint">{row.detail}</span>}
                    </span>
                    <span className="relative shrink-0 text-[9px] font-semibold tabular-nums text-sub">{number.format(row.plays)}</span>
                  </a>
                </motion.li>
              );
            })}
          </ol>
        )}
      </div>
    </WidgetCard>
  );
});
