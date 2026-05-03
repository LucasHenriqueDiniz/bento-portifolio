import React, { useState } from "react";
import { Card } from "./Card";
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
  const [flipAngle, setFlipAngle] = useState(0);
  const { isFlipping, runWithFlipLock } = useFlipLock(flipDuration);

  const handleFlip = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isRight = x > rect.width / 2;
    runWithFlipLock(() => setFlipAngle((prev) => prev + (isRight ? 180 : -180)));
  };

  return (
    <Card
      className={`cursor-pointer border rounded-2xl transition-all duration-300 ${
        isFlipping ? "shadow-none border-transparent" : "border-base"
      } ${className}`}
      style={{ perspective: "800px", ...style }}
      onClick={handleFlip}
      glowColor="var(--accent-glow)"
      flipAngle={flipAngle}
    >
      <div
        className="relative w-full h-full transition-transform"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${flipAngle}deg)`,
          transition: `transform ${flipDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
          willChange: "transform",
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 p-4 flex flex-col bg-panel rounded-2xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardHeader
            title={front.title}
            icon={front.icon}
            flipLabel={front.flipLabel}
            onFlip={() => runWithFlipLock(() => setFlipAngle((prev) => prev + 180))}
          />
          <div className="flex-1 overflow-hidden">{front.content}</div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 p-4 flex flex-col bg-panel rounded-2xl"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <CardHeader
            title={back.title}
            icon={back.icon}
            flipLabel={back.flipLabel}
            onFlip={() => runWithFlipLock(() => setFlipAngle((prev) => prev + 180))}
          />
          <div className="flex-1 overflow-hidden">{back.content}</div>
        </div>
      </div>
    </Card>
  );
});

export default FlippableCard;
