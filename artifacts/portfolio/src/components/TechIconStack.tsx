import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  SiApollographql,
  SiExpo,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiRedis,
  SiSupabase,
  SiTypescript,
  SiNextdotjs,
} from "react-icons/si";
import { FiCpu, FiDatabase, FiZap } from "react-icons/fi";

interface TechIconStackProps {
  techs: string[];
  className?: string;
  iconSize?: number;
}

type TechMeta = {
  label: string;
  icon: React.ReactNode;
  color: string;
};

function getTechMeta(tech: string): TechMeta {
  const key = tech.toLowerCase();

  if (key.includes("typescript")) {
    return { label: tech, icon: <SiTypescript />, color: "#3178c6" };
  }
  if (key.includes("next")) {
    return { label: tech, icon: <SiNextdotjs />, color: "#e5e5e5" };
  }
  if (key.includes("node")) {
    return { label: tech, icon: <SiNodedotjs />, color: "#5fa04e" };
  }
  if (key.includes("supabase")) {
    return { label: tech, icon: <SiSupabase />, color: "#3ecf8e" };
  }
  if (key.includes("postgres")) {
    return { label: tech, icon: <SiPostgresql />, color: "#4169e1" };
  }
  if (key.includes("redis")) {
    return { label: tech, icon: <SiRedis />, color: "#dc382d" };
  }
  if (key.includes("expo")) {
    return { label: tech, icon: <SiExpo />, color: "#bbbbbb" };
  }
  if (key.includes("react")) {
    return { label: tech, icon: <SiReact />, color: "#61dafb" };
  }
  if (key.includes("api integration")) {
    return { label: tech, icon: <SiApollographql />, color: "#e535ab" };
  }
  if (key.includes("automation")) {
    return { label: tech, icon: <FiZap />, color: "#f7c948" };
  }
  if (key.includes("llm")) {
    return { label: tech, icon: <FiCpu />, color: "#8b7cf6" };
  }
  if (key.includes("data")) {
    return { label: tech, icon: <FiDatabase />, color: "#4f9dff" };
  }

  return { label: tech, icon: <FiCpu />, color: "#999999" };
}

export function TechIconStack({
  techs,
  className = "",
  iconSize = 13,
}: TechIconStackProps) {
  const [hovered, setHovered] = useState<{
    label: string;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {techs.map((tech, i) => {
        const meta = getTechMeta(tech);

        return (
          <div
            key={`${tech}-${i}`}
            className="relative"
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setHovered({
                label: meta.label,
                x: rect.left + rect.width / 2,
                y: rect.top - 8,
              });
            }}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className="w-7 h-7 rounded-lg border border-white/20 bg-white/12 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-105"
              style={{ color: meta.color }}
              title={meta.label}
            >
              <span style={{ fontSize: iconSize }}>{meta.icon}</span>
            </div>
          </div>
        );
      })}

      {hovered
        ? createPortal(
            <div
              className="fixed pointer-events-none z-[4000] -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-lg border border-white/15 bg-[#111]/95 text-white shadow-2xl"
              style={{ left: hovered.x, top: hovered.y }}
            >
              <span className="text-[10px] font-semibold tracking-wide whitespace-nowrap">
                {hovered.label}
              </span>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
