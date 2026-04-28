import { ReactNode } from "react";
import { BentoCard } from "./BentoCard";

interface WidgetCardProps {
  children: ReactNode;
  isLoading?: boolean;
  error?: string | null;
  loadingIcon?: ReactNode;
  emptyIcon?: ReactNode;
  emptyMessage?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  tier?: 1 | 2 | 3 | 4;
  // MagicBento effects
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  glowColor?: string;
  allowOverflow?: boolean;
}

export function WidgetCard({
  children,
  isLoading = false,
  error = null,
  loadingIcon,
  emptyIcon,
  emptyMessage = "Dados indisponíveis",
  className = "",
  style,
  onClick,
  tier = 2,
  enableBorderGlow = true, // Enabled by default but subtle
  enableTilt = true, // Enabled by default but subtle
  enableMagnetism = false, // Disabled - too distracting
  clickEffect = false, // Disabled - not needed
  glowColor = "61, 114, 204",
  allowOverflow = false,
}: WidgetCardProps) {
  // Loading state
  if (isLoading) {
    return (
      <BentoCard
        className={`${className} flex items-center justify-center`}
        style={style}
        tier={tier}
        enableBorderGlow={false}
        enableTilt={false}
        enableMagnetism={false}
        clickEffect={false}
      >
        <div className="flex items-center justify-center w-full h-full">
          <span className="animate-pulse">{loadingIcon}</span>
        </div>
      </BentoCard>
    );
  }

  // Error/Empty state
  if (error || (emptyIcon && !children)) {
    return (
      <BentoCard
        className={`${className} flex items-center justify-center`}
        style={style}
        tier={tier}
        enableBorderGlow={false}
        enableTilt={false}
        enableMagnetism={false}
        clickEffect={false}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center w-full h-full">
          {emptyIcon && <span className="opacity-50">{emptyIcon}</span>}
          <p className="text-[11px] text-[#999] dark:text-[#666]">{error || emptyMessage}</p>
        </div>
      </BentoCard>
    );
  }

  // Success state with effects
  return (
    <BentoCard
      className={`${className} h-full`}
      style={style}
      onClick={onClick}
      tier={tier}
      enableBorderGlow={enableBorderGlow}
      enableTilt={enableTilt}
      enableMagnetism={enableMagnetism}
      clickEffect={clickEffect}
      glowColor={glowColor}
      allowOverflow={allowOverflow}
    >
      {children}
    </BentoCard>
  );
}
