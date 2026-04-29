import React from "react";
import { SiDiscord } from "react-icons/si";
import { WidgetCard } from "@/components/WidgetCard";

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
      className="h-full rounded-2xl overflow-hidden"
      style={{
        border: isDark ? "1px solid #282828" : "1px solid #ebebeb",
      }}
      glowColor="88, 101, 242"
    >
      {discord && (
        <div className="p-3 h-full flex flex-col gap-2">
          {/* Header */}
          <div className="flex items-center justify-between shrink-0">
            <div className="inline-flex items-center gap-1.5">
              <SiDiscord size={12} className="text-[#5865f2]" />
              <span className="text-[9px] font-semibold text-[#5865f2] uppercase tracking-wider">Discord</span>
            </div>
          </div>

          {/* Avatar + Name + Status */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#5865f2]/20">
                {discord.avatarUrl ? (
                  <img
                    src={discord.avatarUrl}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#5865f2] flex items-center justify-center">
                    <SiDiscord size={18} className="text-white" />
                  </div>
                )}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-[2px] ring-1 ring-[#5865f2]/20 ${isDark ? "border-[#181818]" : "border-white"}`}
                style={{ backgroundColor: statusColor }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-[11px] leading-tight truncate ${isDark ? "text-white" : "text-[#111]"}`}>
                {discord.displayName ?? "lucashdo"}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: statusColor }} />
                <p className={`text-[8px] capitalize font-medium ${isDark ? "text-white/50" : "text-[#666]"}`}>
                  {discord.status ?? "online"}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className={`border-t ${isDark ? "border-white/[0.08]" : "border-[#ebebeb]"}`} />

          {/* Activity Section */}
          <div className="flex-1 min-h-0 flex flex-col justify-between">
            <div>
              <p className={`text-[7px] uppercase tracking-widest font-bold mb-1 ${isDark ? "text-[#5865f2]/60" : "text-[#5865f2]/70"}`}>
                {discord.activity ? "Activity" : "Status"}
              </p>
              <div className={`rounded-lg p-2 border ${isDark ? "bg-white/3 border-white/8" : "bg-[#f5f5ff] border-[#e0e0ff]"}`}>
                <p className={`text-[10px] font-semibold truncate ${isDark ? "text-white" : "text-[#111]"}`}>
                  {discord.activity ?? discord.customStatus ?? "Idle"}
                </p>
                {discord.activityDetail && (
                  <p className={`text-[8px] truncate mt-0.5 ${isDark ? "text-white/40" : "text-[#666]"}`}>
                    {discord.activityDetail}
                  </p>
                )}
              </div>
            </div>
            
            {discord.customStatus && (
              <div className={`rounded-lg p-2 border text-center ${isDark ? "bg-white/3 border-white/8" : "bg-[#f5f5ff] border-[#e0e0ff]"}`}>
                <p className={`text-[8px] italic ${isDark ? "text-white/60" : "text-[#555]"}`}>
                  "{discord.customStatus}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </WidgetCard>
  );
});
