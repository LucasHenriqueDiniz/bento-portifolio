import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SiLastdotfm } from "react-icons/si";
import { WidgetCard } from "@/components/WidgetCard";
import { fadeUpSoft } from "@/lib/animations";
import { CardHeader } from "@/components/CardHeader";
const ACCENT = "#d51007";

interface Artist {
  name: string;
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
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&entity=musicArtist&limit=1`);
    const data = await res.json();
    if (data.results?.[0]?.artistLinkUrl) {
      // iTunes não retorna imagens diretamente para artistas, vamos tentar álbum
      const albumRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&entity=album&limit=1`);
      const albumData = await albumRes.json();
      return albumData.results?.[0]?.artworkUrl100?.replace("100x100", "300x300");
    }
  } catch {
    // ignore
  }
  return undefined;
}

export const TopArtistsCard = React.memo(function TopArtistsCard({
  topArtists,
  isLoading,
  isDark,
}: TopArtistsCardProps) {
  const [images, setImages] = useState<Record<string, string>>({});

  const artists = Array.isArray(topArtists) ? topArtists : [];

  useEffect(() => {
    artists.slice(0, 5).forEach(async (artist) => {
      const img = await fetchArtistImage(artist.name);
      if (img) {
        setImages(prev => ({ ...prev, [artist.name]: img }));
      }
    });
  }, [artists]);

  function getGradientFromString(str: string): { from: string; to: string } {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return {
      from: `hsl(${hue}, 75%, 55%)`,
      to: `hsl(${(hue + 40) % 360}, 75%, 45%)`,
    };
  }

  function getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  return (
    <WidgetCard
      isLoading={isLoading}
      error={artists.length === 0 ? "Nenhum artista disponível" : null}
      loadingIcon={<SiLastdotfm size={28} className="text-[#d51007]" />}
      emptyIcon={<SiLastdotfm size={24} className="text-[#ccc] dark:text-[#444]" />}
      emptyMessage="Nenhum artista disponível"
      className="rounded-2xl h-full overflow-hidden"
      style={{
        backgroundColor: isDark ? "#181818" : "#ffffff",
        border: isDark ? "1px solid #282828" : "1px solid #ebebeb",
      }}
      glowColor="213, 16, 7"
    >
      {artists.length > 0 && (
        <div className="relative w-full h-full p-4 flex flex-col">
          <div className="mb-3 shrink-0">
            <CardHeader icon={<SiLastdotfm size={9} />} title="Top Artists" />
          </div>
          <div className="flex-1 flex flex-col justify-between space-y-2">
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
                  className="flex items-center gap-2.5 group hover:bg-[#f5f5f5] dark:hover:bg-[#222] rounded-lg p-1.5 -m-1.5 transition-colors"
                >
                  <span className="text-[11px] font-bold w-4 shrink-0 text-center" style={{ color: i === 0 ? ACCENT : isDark ? "#666" : "#ccc" }}>
                    {i + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 transition-all flex items-center justify-center relative" style={{ background: imgUrl ? undefined : `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`, border: `2px solid ${gradient.from}30` }}>
                    {imgUrl ? (
                      <img src={imgUrl} alt={artist.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold text-white drop-shadow-sm">{initials}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold truncate text-[#111] dark:text-[#eee] group-hover:text-[#d51007] transition-colors">{artist.name}</p>
                    <p className="text-[10px] text-[#888] dark:text-[#666]">{Number(artist.playcount).toLocaleString()} plays</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </WidgetCard>
  );
});
