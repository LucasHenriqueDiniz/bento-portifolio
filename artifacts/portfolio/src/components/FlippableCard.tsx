import React, { useState } from "react";
import { BentoCard } from "./BentoCard";
import { CardHeader } from "./CardHeader";
import { useFlipLock } from "@/hooks/useFlipLock";

interface FlippableCardProps {
  front: {
    title: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
    flipLabel?: string;
  };
  back: {
    title: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
    flipLabel?: string;
  };
  className?: string;
  style?: React.CSSProperties;
  flipDuration?: number;
}

export const FlippableCard = React.memo(function FlippableCard({
  front,
  back,
  className = "",
  style,
  flipDuration = 600,
}: FlippableCardProps) {
  const [flipped, setFlipped] = useState(false);
  const { isFlipping, runWithFlipLock } = useFlipLock(flipDuration);

  const handleFlip = () => {
    runWithFlipLock(() => setFlipped((f) => !f));
  };

  return (
    <BentoCard
      className={`cursor-pointer overflow-hidden border rounded-2xl transition-all duration-300 relative z-10 ${
        isFlipping ? "shadow-none border-transparent" : "border-[#ebebeb] dark:border-[#282828]"
      } ${className}`}
      style={{ perspective: "800px", ...style }}
      onClick={handleFlip}
    >
      <div
        className="relative w-full h-full transition-transform"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: `transform ${flipDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
          willChange: "transform",
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 p-4 flex flex-col bg-white dark:bg-[#181818] rounded-2xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardHeader
            title={front.title}
            icon={front.icon}
            flipLabel={front.flipLabel}
            onFlip={handleFlip}
          />
          <div className="flex-1 overflow-hidden">{front.content}</div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 p-4 flex flex-col bg-white dark:bg-[#181818] rounded-2xl"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <CardHeader
            title={back.title}
            icon={back.icon}
            flipLabel={back.flipLabel}
            onFlip={handleFlip}
          />
          <div className="flex-1 overflow-hidden">{back.content}</div>
        </div>
      </div>
    </BentoCard>
  );
});
