import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Swords } from "lucide-react";
import { Card } from "@/components/Card";
import CountUp from "@/components/CountUp";
import type { WowCharacter } from "@/lib/apiClient";

interface WowCardProps {
  character: WowCharacter | null | undefined;
  /** Shown as a small tag when the data is a recorded sample, not the live character. */
  sample?: boolean;
}

// The game's own item-quality colours.
const QUALITY: Record<string, string> = {
  POOR: "#9d9d9d",
  COMMON: "#d9d9d9",
  UNCOMMON: "#1eff00",
  RARE: "#0070dd",
  EPIC: "#a335ee",
  LEGENDARY: "#ff8000",
};

const STAT_COLOR: Record<string, string> = { health: "#5fd67f", power: "#6fb1ff" };

const FACTION: Record<string, { rgb: string; label: string }> = {
  Alliance: { rgb: "64, 132, 255", label: "#7fb0ff" },
  Horde: { rgb: "220, 50, 47", label: "#ff8a80" },
};

/**
 * A World of Warcraft: Forever character: the render floating over its faction's
 * colour, with level, professions and the gear as dots in the game's quality colours.
 */
export function WowCard({ character, sample = false }: WowCardProps) {
  const { t } = useTranslation("home");
  const still = useReducedMotion();

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

  const faction = FACTION[character.faction ?? ""] ?? { rgb: "224, 122, 95", label: "var(--accent)" };
  // Health and the power bar, then the two attributes this character has most of
  // (intellect and spirit for a priest, strength and stamina for a warrior).
  const ATTRIBUTES = ["strength", "agility", "stamina", "intellect", "spirit"];
  const vitals = [
    ...character.stats.filter((s) => s.key === "health" || s.key === "power"),
    ...character.stats
      .filter((s) => ATTRIBUTES.includes(s.key))
      .sort((x, y) => y.value - x.value)
      .slice(0, 2),
  ];
  const armoryUrl = `https://worldofwarcraft.blizzard.com/forever/${character.region}/armory/character/${character.slug}`;

  return (
    <Card className="h-full rounded-2xl border border-base overflow-hidden" glowColor={faction.rgb} glowIntensity={1.3}>
      <a
        href={armoryUrl}
        target="_blank"
        rel="noreferrer"
        className="relative h-full flex bg-[#0d1017] text-white outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        aria-label={`${character.name} ${character.surname}: ${t("wow.openArmory")}`}
      >
        {/* Faction light behind the character, slowly breathing. */}
        <motion.div
          aria-hidden
          className="absolute inset-y-0 left-0 w-1/2"
          style={{ background: `radial-gradient(circle at 45% 60%, rgba(${faction.rgb},0.55), transparent 68%)` }}
          animate={still ? undefined : { opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative w-[38%] shrink-0">
          {character.renderUrl && (
            <motion.img
              src={character.renderUrl}
              alt=""
              initial={{ opacity: 0, y: 14 }}
              animate={still ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -4, 0] }}
              transition={
                still
                  ? { duration: 0.4 }
                  : { opacity: { duration: 0.5 }, y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" } }
              }
              className="absolute inset-0 h-full w-full object-cover object-[50%_30%] scale-[2.2] origin-[50%_36%] drop-shadow-[0_6px_14px_rgba(0,0,0,0.6)]"
            />
          )}
        </div>

        <div className="relative flex-1 min-w-0 p-3 flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider" style={{ color: faction.label }}>
              <Swords size={11} />
              WoW Forever
            </span>
            {sample && (
              <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-white/20 text-white/60">
                {t("wow.sample")}
              </span>
            )}
          </div>

          <p className="mt-1.5 text-[14px] font-black leading-tight truncate">
            {character.name} {character.surname}
          </p>
          <p className="text-[10px] text-white/65 truncate">
            {t("wow.level", { level: character.level })} · {[character.race, character.className].filter(Boolean).join(" ")}
            {character.guild && ` · ${character.guild}`}
          </p>

          {/* Plain numbers: the API gives current values with no maximum, so a bar would
              always be full and say nothing. */}
          <dl className="mt-2 grid grid-cols-4 gap-1.5">
            {vitals.map((stat, i) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08, duration: 0.35 }}
                className="rounded-md bg-white/[0.06] border border-white/10 px-1.5 py-1"
              >
                <dd className="text-[12px] font-black leading-none tabular-nums" style={{ color: STAT_COLOR[stat.key] ?? "#fff" }}>
                  <CountUp to={stat.value} separator="." duration={1} />
                </dd>
                <dt className="mt-0.5 text-[8px] uppercase tracking-wider text-white/50 truncate">{stat.label}</dt>
              </motion.div>
            ))}
          </dl>

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {character.professions.map((p, i) => (
              <div key={p.name} className="min-w-[72px] flex-1">
                <div className="flex justify-between text-[9px]">
                  <span className="text-white/70 truncate">{p.name}</span>
                  <span className="text-white/45 tabular-nums">{p.value}</span>
                </div>
                <span className="mt-0.5 block h-1 rounded-full bg-white/10 overflow-hidden">
                  <motion.span
                    className="block h-full rounded-full bg-[#f0c060]"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((p.value / p.max) * 100, 100)}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-2 flex items-center justify-between gap-2">
            <ul className="flex flex-wrap gap-1" aria-label={t("wow.gear")}>
              {character.equipment.map((item, i) => (
                <motion.li
                  key={`${item.slot}-${item.name}`}
                  title={`${item.slot}: ${item.name}${item.itemLevel ? ` (${item.itemLevel})` : ""}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.035, type: "spring", stiffness: 300, damping: 18 }}
                  className="h-2.5 w-2.5 rounded-[3px]"
                  style={{ backgroundColor: QUALITY[item.quality] ?? QUALITY.COMMON, boxShadow: `0 0 6px ${QUALITY[item.quality] ?? QUALITY.COMMON}66` }}
                />
              ))}
            </ul>
            {character.averageItemLevel !== null && (
              <span className="shrink-0 text-[9px] text-white/55">
                ilvl <span className="font-bold text-white">{character.averageItemLevel}</span>
              </span>
            )}
          </div>
        </div>
      </a>
    </Card>
  );
}
