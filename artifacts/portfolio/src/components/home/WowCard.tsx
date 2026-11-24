import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Swords } from "lucide-react";
import { Card } from "@/components/Card";
import type { WowCharacter } from "@/lib/apiClient";

const GOLD = "#e8c56a";
const FACTION_RGB: Record<string, string> = { Alliance: "52, 110, 230", Horde: "200, 40, 40" };

// The scene Blizzard's own armory page builds: a backdrop of the character's race, a
// shadow on the ground and the render standing on it. The page stacks these three
// pictures as flat planes; nothing in it is a 3D model.
const RENDER_HOST = "https://render.worldofwarcraft.com";
const SHADOW_URL = `${RENDER_HOST}/profile-foreground/foreground-shadow.png`;
/** "Night Elf" -> armory_bg_race_night_elf.jpg, the naming the armory uses. */
export const raceBackdropUrl = (race: string | null) =>
  race ? `${RENDER_HOST}/profile-backgrounds/v2/armory_bg_race_${race.trim().toLowerCase().replace(/\s+/g, "_")}.jpg` : null;

// Dust motes drifting up through the faction light: position, size and timing each.
const MOTES = [
  { left: "56%", size: 2, delay: 0, duration: 6 },
  { left: "64%", size: 3, delay: 1.4, duration: 7.5 },
  { left: "73%", size: 2, delay: 2.8, duration: 5.5 },
  { left: "82%", size: 2, delay: 0.7, duration: 8 },
  { left: "90%", size: 3, delay: 3.5, duration: 6.5 },
  { left: "69%", size: 1.5, delay: 4.4, duration: 7 },
];

interface WowCardProps {
  character: WowCharacter | null | undefined;
  sample?: boolean;
}

/**
 * A World of Warcraft: Forever character, as the scene Blizzard's armory builds: the
 * backdrop of its race, a shadow on the ground and the render standing on it, under
 * gold trim, with the level, the name, race and class, and the professions.
 */
export function WowCard({ character, sample = false }: WowCardProps) {
  const { t } = useTranslation("home");
  const still = useReducedMotion();
  // Not every race has a backdrop on Blizzard's server; without one the card keeps its
  // plain dark ground.
  const [backdropFailed, setBackdropFailed] = useState(false);

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
  const backdrop = backdropFailed ? null : raceBackdropUrl(character.race);
  const armoryUrl = `https://worldofwarcraft.blizzard.com/forever/${character.region}/armory/character/${character.slug}`;

  return (
    <Card className="h-full" glowColor="232, 197, 106" glowIntensity={1.2}>
      <div className="h-full" style={{ borderRadius: "inherit" }}>
        <div
          className="relative h-full overflow-hidden text-white"
          style={{
            borderRadius: "inherit",
            background: "linear-gradient(135deg, #17120a 0%, #0b0d14 62%)",
            // Gold trim drawn inside the card's own corner radius.
            boxShadow: `inset 0 0 0 1px ${GOLD}66, inset 0 0 0 4px #0b0d14, inset 0 0 0 5px ${GOLD}26`,
          }}
        >
          {backdrop && (
            <motion.img
              src={backdrop}
              alt=""
              data-testid="wow-backdrop"
              onError={() => setBackdropFailed(true)}
              initial={{ opacity: 0, scale: 1.12 }}
              animate={{ opacity: 1, scale: 1.06 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[60%_52%]"
            />
          )}
          {/* Darkens the left, where the text sits, and the edges. */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#0b0d14] from-10% via-[#0b0d14]/75 via-45% to-transparent" />
          <motion.div
            aria-hidden
            className="absolute inset-0"
            style={{
              borderRadius: "inherit",
              background: `radial-gradient(90% 110% at 76% 60%, rgba(${rgb},${backdrop ? 0.28 : 0.6}) 0%, rgba(${rgb},0.08) 42%, transparent 62%)`,
            }}
            animate={still ? undefined : { opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

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

          {/* Blizzard's render is a 1600x1200 canvas with the character small in its
              middle, so it is zoomed in on rather than fitted. */}
          {character.renderUrl && (
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[50%]">
              <img
                src={SHADOW_URL}
                alt=""
                aria-hidden
                className="absolute left-1/2 bottom-[-9%] w-[86%] -translate-x-1/2 opacity-80"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              {/* The zoom sits on its own element: the entrance animation owns the
                  image's transform and would overwrite it. */}
              <div className="absolute inset-0" style={{ transform: "scale(2.5)", transformOrigin: "50% 56%" }}>
                <motion.img
                  src={character.renderUrl}
                  alt=""
                  initial={{ opacity: 0, x: 12, scale: 0.94 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full w-full object-cover object-[50%_30%]"
                  style={{ filter: `drop-shadow(0 4px 6px rgba(0,0,0,0.75)) drop-shadow(0 0 7px rgba(${rgb},0.45))` }}
                />
              </div>
            </div>
          )}

          <div className="relative h-full w-[56%] p-4 flex flex-col">
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

            <div className="mt-3 flex items-center gap-3">
              <motion.span
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
                className="shrink-0 h-11 w-11 rounded-full flex items-center justify-center text-[15px] font-black tabular-nums"
                style={{ color: GOLD, boxShadow: `inset 0 0 0 1.5px ${GOLD}, 0 0 16px ${GOLD}44`, background: "radial-gradient(circle, #2a2110, #120e07)" }}
                aria-label={t("wow.level", { level: character.level })}
              >
                {character.level}
              </motion.span>
              <motion.div
                className="min-w-0"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <a
                  href={armoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[17px] font-black leading-[1.1] tracking-tight bg-clip-text text-transparent outline-none focus-visible:underline hover:brightness-125"
                  style={{ backgroundImage: `linear-gradient(180deg, #fff3c4, ${GOLD} 55%, #b8862e)` }}
                  aria-label={`${character.name} ${character.surname}: ${t("wow.openArmory")}`}
                >
                  {character.name}
                  <br />
                  {character.surname}
                </a>
              </motion.div>
            </div>

            <motion.p
              className="mt-2 text-[10px] text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
            >
              {[character.race, character.className].filter(Boolean).join(" ")}
              {character.faction && ` · ${character.faction}`}
            </motion.p>

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
                      transition={{ delay: 0.6 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
