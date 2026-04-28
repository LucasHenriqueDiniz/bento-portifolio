import React from "react";
import { motion } from "framer-motion";

type FlipDirection = "left" | "right";

interface CardHeaderProps {
  icon?: React.ReactNode;
  title: string;
  rightContent?: React.ReactNode;
  flipLabel?: string;
  flipDirection?: FlipDirection;
  onFlip?: () => void;
}

export function CardHeader({
  icon,
  title,
  rightContent,
  flipLabel,
  flipDirection = "right",
  onFlip,
}: CardHeaderProps) {
  const isLeft = flipDirection === "left";

  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#aaa] dark:text-[#555] inline-flex items-center gap-1.5">
        {icon}
        {title}
      </p>

      {rightContent ? <div className="shrink-0">{rightContent}</div> : null}

      {flipLabel ? (
        <motion.button
          type="button"
          className="shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#f5f5f5] dark:bg-[#252525] hover:bg-[#ebebeb] dark:hover:bg-[#2a2a2a] transition-colors"
          whileHover={{ x: isLeft ? -2 : 2 }}
          onClick={(e) => {
            e.stopPropagation();
            onFlip?.();
          }}
        >
          {isLeft ? (
            <svg
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#666] dark:text-[#888]"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          ) : null}

          <span className="text-[8px] font-medium text-[#666] dark:text-[#888]">
            {flipLabel}
          </span>

          {!isLeft ? (
            <svg
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#666] dark:text-[#888]"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          ) : null}
        </motion.button>
      ) : null}
    </div>
  );
}
