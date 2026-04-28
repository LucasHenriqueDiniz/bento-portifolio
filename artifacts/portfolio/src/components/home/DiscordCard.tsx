import React from "react";
import { motion } from "framer-motion";
import { SiDiscord } from "react-icons/si";
import { WidgetCard } from "@/components/WidgetCard";
import { fadeUpSoft } from "@/lib/animations";

const STATUS_COLORS: Record<string, string> = {
  online: "#22c55e",
  idle: "#eab308",
  dnd: "#ef4444",
  offline: "#9ca3af",
};

/**
 * Discord presence data from Lanyard API
 * @interface DiscordData
 * @property {string} [avatarUrl] - User avatar URL
 * @property {string} [displayName] - User display name
 * @property {string} [status] - User status (online, idle, dnd, offline)
 * @property {string} [activity] - Current activity name
 * @property {string} [activityDetail] - Activity details
 * @property {string} [customStatus] - Custom status message
 */
interface DiscordData {
  avatarUrl?: string;
  displayName?: string;
  status?: string;
  activity?: string;
  activityDetail?: string;
  customStatus?: string;
}

/**
 * Props for DiscordCard component
 * @interface DiscordCardProps
 * @property {DiscordData | undefined} discord - Discord presence data
 * @property {boolean} isLoading - Loading state
 * @property {boolean} isDark - Dark mode flag
 */
interface DiscordCardProps {
  discord: DiscordData | undefined;
  isLoading: boolean;
  isDark: boolean;
}

/**
 * DiscordCard - Displays Discord presence with avatar, status, and activity
 * Compact layout optimized for small card size
 * @component
 * @param {DiscordCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const DiscordCard = React.memo(function DiscordCard({
  discord,
  isLoading,
  isDark,
}: DiscordCardProps) {
  const statusColor = STATUS_COLORS[discord?.status ?? "dnd"];

  return (
    <WidgetCard
      isLoading={isLoading}
      error={!discord ? "Status indisponível" : null}
      loadingIcon={<SiDiscord size={28} className="text-[#5865f2]" />}
      emptyIcon={<SiDiscord size={24} className="text-[#5865f2]" />}
      className="rounded-2xl"
      style={{
        backgroundColor: isDark ? "#1e1f22" : "#f5f6ff",
        border: isDark ? "1px solid #2b2d31" : "1px solid #e3e4f0",
        gridColumn: "5",
        gridRow: "5 / 9",
      }}
      glowColor="88, 101, 242"
    >
      <motion.div
        custom={8}
        variants={fadeUpSoft}
        initial="hidden"
        animate="show"
        className="p-2.5 h-full flex flex-col"
      >
        {/* header */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-[8px] font-bold uppercase tracking-widest ${isDark ? "text-[#5865f2]/50" : "text-[#5865f2]/60"}`}
          >
            Discord
          </span>
          <SiDiscord size={11} className="text-[#5865f2]" />
        </div>

        {/* avatar + name + status - layout horizontal compacto */}
        <div className="flex items-center gap-2 mb-2">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#5865f2]/20">
              {discord?.avatarUrl ? (
                <img
                  src={discord.avatarUrl}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#5865f2] flex items-center justify-center">
                  <SiDiscord size={20} className="text-white" />
                </div>
              )}
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-[2px] ${isDark ? "border-[#1e1f22]" : "border-[#f5f6ff]"}`}
              style={{ backgroundColor: statusColor }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`font-bold text-[11px] leading-tight truncate ${isDark ? "text-white" : "text-[#111]"}`}
            >
              {discord?.displayName ?? "lucashdo"}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: statusColor }}
              />
              <p
                className={`text-[9px] capitalize ${isDark ? "text-white/40" : "text-[#888]"}`}
              >
                {discord?.status ?? "online"}
              </p>
            </div>
          </div>
        </div>

        {/* divider */}
        <div
          className={`border-t mb-2 ${isDark ? "border-white/5" : "border-[#e3e4f0]"}`}
        />

        {/* activity - ocupa espaço restante */}
        <div
          className={`rounded-lg p-2 border flex-1 flex flex-col justify-center min-h-0 ${isDark ? "bg-white/[0.04] border-white/5" : "bg-white border-[#e3e4f0]"}`}
        >
          <p
            className={`text-[7px] uppercase tracking-widest font-bold mb-0.5 ${isDark ? "text-[#5865f2]/50" : "text-[#5865f2]/60"}`}
          >
            {discord?.activity ? "Playing" : "Status"}
          </p>
          <p
            className={`text-[10px] font-semibold truncate ${isDark ? "text-white/80" : "text-[#333]"}`}
          >
            {discord?.activity ?? "VS Code"}
          </p>
          {discord?.activityDetail && (
            <p
              className={`text-[8px] truncate mt-0.5 ${isDark ? "text-white/30" : "text-[#aaa]"}`}
            >
              {discord.activityDetail}
            </p>
          )}
          {discord?.customStatus && (
            <p
              className={`text-[8px] italic truncate mt-0.5 ${isDark ? "text-white/25" : "text-[#bbb]"}`}
            >
              "{discord.customStatus}"
            </p>
          )}
        </div>
      </motion.div>
    </WidgetCard>
  );
});
