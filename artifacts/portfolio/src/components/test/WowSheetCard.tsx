import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Swords } from "lucide-react";
import { Card } from "@/components/Card";
import type { WowCharacter } from "@/lib/apiClient";

const ITEM_MS = 2600;
const GOLD = "#e8c56a";

// The game's own item-quality colours.
const QUALITY: Record<string, string> = {
  POOR: "#9d9d9d",
  COMMON: "#ffffff",
  UNCOMMON: "#1eff00",
  RARE: "#3d9bff",
  EPIC: "#b85cff",
  LEGENDARY: "#ff8000",
};

const FACTION_RGB: Record<string, string> = { Alliance: "52, 110, 230", Horde: "200, 40, 40" };

// Dust motes drifting up through the faction light: position, size and timing each.
const MOTES = [
  { left: "58%", size: 2, delay: 0, duration: 6 },
  { left: "66%", size: 3, delay: 1.4, duration: 7.5 },
  { left: "74%", size: 2, delay: 2.8, duration: 5.5 },
  { left: "82%", size: 2, delay: 0.7, duration: 8 },
  { left: "90%", size: 3, delay: 3.5, duration: 6.5 },
  { left: "70%", size: 1.5, delay: 4.4, duration: 7 },
];

interface WowSheetCardProps {
  character: WowCharacter | null | undefined;
  sample?: boolean;
}

/**
 * The character as a page of the game's own interface: gold trim, the render standing
 * on the right, and the gear shown one piece at a time like an item tooltip, its name
 * in the colour of its quality.
 */
export function WowSheetCard({ character, sample = false }: WowSheetCardProps) {
  const { t } = useTranslation("home");
  const still = useReducedMotion();
  const [itemIndex, setItemIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const itemCount = character?.equipment.length ?? 0;

  useEffect(() => {
    if (itemCount < 2 || paused || still) return;
    const timer = setInterval(() => setItemIndex((i) => (i + 1) % itemCount), ITEM_MS);
    return () => clearInterval(timer);
  }, [itemCount, paused, still]);

  if (!character) {
    return (
      <Card className="h-full rounded-2xl bg-panel border border-base" glowColor="var(--accent-glow)">
        <div className="h-full flex flex-col items-center justify-center gap-2">
          <Swords size={22} className="text-faint" />
          <p className="text-[11px] text-faint">{t("wow.empty")}</p>
        </div>
      </Card>
    );
  }

  const rgb = FACTION_RGB[character.faction ?? ""] ?? "224, 122, 95";
  const item = itemCount ? character.equipment[itemIndex % itemCount] : null;
  const itemColor = item ? QUALITY[item.quality] ?? QUALITY.COMMON : QUALITY.COMMON;
  const armoryUrl = `https://worldofwarcraft.blizzard.com/forever/${character.region}/armory/character/${character.slug}`;

  return (
    <Card className="h-full rounded-2xl overflow-hidden" glowColor="232, 197, 106" glowIntensity={1.2}>
      <div
        className="relative h-full overflow-hidden rounded-2xl text-white"
        style={{
          background: `radial-gradient(120% 140% at 82% 55%, rgba(${rgb},0.55) 0%, rgba(${rgb},0.12) 42%, transparent 62%), linear-gradient(135deg, #14100a 0%, #0b0d14 60%)`,
          boxShadow: `inset 0 0 0 1px ${GOLD}55, inset 0 0 0 3px #0b0d14, inset 0 0 0 4px ${GOLD}22`,
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {!still &&
          MOTES.map((mote, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute bottom-0 rounded-full"
              style={{ left: mote.left, width: mote.size, height: mote.size, backgroundColor: GOLD, boxShadow: `0 0 6px ${GOLD}` }}
              animate={{ y: [0, -190], opacity: [0, 0.9, 0] }}
              transition={{ duration: mote.duration, delay: mote.delay, repeat: Infinity, ease: "linear" }}
            />
          ))}

        {/* Blizzard's render is a 1600x1200 canvas with the character small in its middle,
            so it is zoomed in on rather than fitted. */}
        {character.renderUrl && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[44%]">
            <motion.img
              src={character.renderUrl}
              alt=""
              initial={{ opacity: 0, x: 24 }}
              animate={still ? { opacity: 1, x: 0 } : { opacity: 1, x: 0, y: [0, -3, 0] }}
              transition={
                still
                  ? { duration: 0.4 }
                  : { opacity: { duration: 0.6 }, x: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }
              }
              className="absolute inset-0 h-full w-full object-cover object-[50%_30%] scale-[2.6] origin-[50%_34%] drop-shadow-[0_8px_18px_rgba(0,0,0,0.7)]"
            />
          </div>
        )}

        <div className="relative h-full w-[60%] p-3.5 flex flex-col">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
              <Swords size={11} />
              WoW Forever
            </span>
            {sample && (
              <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-white/20 text-white/60">
                {t("wow.sample")}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2.5">
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
              className="shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-[13px] font-black tabular-nums"
              style={{ color: GOLD, boxShadow: `inset 0 0 0 1.5px ${GOLD}, 0 0 14px ${GOLD}44`, background: "radial-gradient(circle, #2a2110, #120e07)" }}
              aria-label={t("wow.level", { level: character.level })}
            >
              {character.level}
            </motion.span>
            <div className="min-w-0">
              <a
                href={armoryUrl}
                target="_blank"
                rel="noreferrer"
                className="block truncate text-[15px] font-black leading-tight tracking-tight bg-clip-text text-transparent outline-none focus-visible:underline hover:brightness-125"
                style={{ backgroundImage: `linear-gradient(180deg, #fff3c4, ${GOLD} 55%, #b8862e)` }}
                aria-label={`${character.name} ${character.surname}: ${t("wow.openArmory")}`}
              >
                {character.name} {character.surname}
              </a>
              <p className="truncate text-[10px] text-white/65">
                {[character.race, character.className].filter(Boolean).join(" ")}
                {character.faction && ` · ${character.faction}`}
              </p>
            </div>
          </div>

          {item && (
            <div className="relative mt-2.5 h-[44px] rounded-md bg-black/45 border border-white/10 overflow-hidden" aria-live="off">
              {/* The position stays put while the piece above it changes. */}
              <span className="absolute right-2 bottom-1.5 z-10 text-[9px] tabular-nums text-white/45">
                {(itemIndex % itemCount) + 1}/{itemCount}
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={itemIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: still ? 0 : 0.25 }}
                  className="h-full px-2 py-1.5 flex flex-col justify-center border-l-2"
                  style={{ borderColor: itemColor }}
                >
                  <p className="truncate text-[11px] font-bold leading-tight" style={{ color: itemColor, textShadow: `0 0 10px ${itemColor}55` }}>
                    {item.name}
                  </p>
                  <p className="mt-0.5 pr-9 truncate text-[9px] text-white/55">
                    {item.slot}
                    {item.itemLevel !== null && ` · ${t("wow.itemLevel", { level: item.itemLevel })}`}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          <ul className="mt-auto flex gap-3" aria-label={t("wow.professions")}>
            {character.professions.slice(0, 3).map((p, i) => (
              <li key={p.name} className="min-w-0 flex-1">
                <p className="flex justify-between gap-1 text-[9px]">
                  <span className="truncate text-white/70">{p.name}</span>
                  <span className="shrink-0 tabular-nums text-white/45">{p.value}</span>
                </p>
                <span className="mt-0.5 block h-1 rounded-full bg-white/10 overflow-hidden">
                  <motion.span
                    className="block h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, #b8862e, ${GOLD})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((p.value / p.max) * 100, 100)}%` }}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
