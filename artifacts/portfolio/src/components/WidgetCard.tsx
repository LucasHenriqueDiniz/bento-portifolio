import { ReactNode } from "react";
import { Card } from "./Card";

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
  glowColor = "var(--accent-glow)",
  allowOverflow = false,
}: WidgetCardProps) {
  if (isLoading) {
    return (
      <Card
        className={`${className} flex items-center justify-center h-full`}
        style={style}
        glowColor={glowColor}
      >
        <div className="flex items-center justify-center w-full h-full">
          <span className="animate-pulse">{loadingIcon}</span>
        </div>
      </Card>
    );
  }

  if (error || (emptyIcon && !children)) {
    return (
      <Card
        className={`${className} flex items-center justify-center h-full`}
        style={style}
        glowColor={glowColor}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center w-full h-full">
          {emptyIcon && <span className="opacity-50">{emptyIcon}</span>}
          <p className="text-[11px] text-faint">{error || emptyMessage}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`${className} h-full`}
      style={style}
      onClick={onClick}
      glowColor={glowColor}
      allowOverflow={allowOverflow}
    >
      {children}
    </Card>
  );
}
