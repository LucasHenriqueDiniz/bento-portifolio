import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CVCardProps {
  navigate: (path: string) => void;
  isDark?: boolean;
}

export const CVCard = React.memo(function CVCard({ navigate, isDark = false }: CVCardProps) {
  const { i18n } = useTranslation("home");
  const currentLang = i18n.language?.split("-")[0] || "pt";
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mag, setMag] = useState({ x: 0, y: 0, rx: 0, ry: 0 });
  const [docMag, setDocMag] = useState({ x: 0, y: 0, rx: 0, ry: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const dx = px - 0.5;
    const dy = py - 0.5;
    setMag({
      x: dx * 7,
      y: dy * 7,
      rx: -dy * 1.8,
      ry: dx * 1.8,
    });
    setDocMag({
      x: dx * 10,
      y: dy * 10,
      rx: -dy * 5,
      ry: dx * 5,
    });
  };

  const resetMag = () => {
    setMag({ x: 0, y: 0, rx: 0, ry: 0 });
    setDocMag({ x: 0, y: 0, rx: 0, ry: 0 });
  };

  return (
    <motion.div
      ref={wrapperRef}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full cursor-pointer"
      onClick={() => navigate("/resume")}
      onMouseMove={handleMove}
      onMouseLeave={resetMag}
      style={{ perspective: "900px" }}
    >
      {/* Card body */}
      <motion.div
        className="h-full rounded-xl border p-3 flex flex-col relative overflow-hidden group"
        style={{
          backgroundColor: `var(--accent)`,
          borderColor: `var(--accent-hover)`,
          boxShadow: isDark
            ? "0 22px 48px rgba(0,0,0,0.45)"
            : "0 18px 38px rgba(0,0,0,0.15)",
        }}
        animate={{
          x: mag.x,
          y: mag.y,
          rotateX: mag.rx,
          rotateY: mag.ry,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.7 }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-12 w-40 h-40 rounded-full bg-white/14 blur-2xl" />
          <div className="absolute -bottom-20 -left-16 w-48 h-48 rounded-full bg-black/12 blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-black/10" />
        </div>

        <div className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75 mb-2">Resume</div>

        <div className="relative z-10 flex-1 relative overflow-hidden rounded-lg">
          <div className="absolute inset-x-4 bottom-2 h-10 rounded-full blur-xl bg-black/20" />
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 translate-y-7 top-0 w-[244px] rounded-xl border overflow-hidden bg-panel border-base"
            style={{
              boxShadow: isDark
                ? "0 20px 42px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.25)"
                : "0 18px 38px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.08)",
            }}
            animate={{
              x: docMag.x,
              y: docMag.y,
              rotateX: docMag.rx,
              rotateY: docMag.ry,
            }}
            transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.65 }}
          >
            <div className="h-7 relative" style={{ backgroundColor: `var(--accent)` }}>
              <div className="absolute right-0 top-0 w-6 h-6 bg-gradient-to-bl from-white/85 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-white/35" />
            </div>
            <div className="relative px-3.5 py-3.5 space-y-2.5 bg-gradient-to-b from-[#ffffff] to-[#edf1f6]">
              <div className="space-y-1">
                <div className="h-1.5 w-[46%] rounded-full bg-[#223046]" />
                <div className="h-1 w-[97%] rounded-full bg-[#8a96a8]" />
                <div className="h-1 w-[91%] rounded-full bg-[#8a96a8]" />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-[38%] rounded-full bg-[#223046]" />
                <div className="h-1 w-[95%] rounded-full bg-[#8a96a8]" />
                <div className="h-1 w-[84%] rounded-full bg-[#8a96a8]" />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-[33%] rounded-full bg-[#223046]" />
                <div className="h-1 w-[88%] rounded-full bg-[#8a96a8]" />
                <div className="h-1 w-[72%] rounded-full bg-[#8a96a8]" />
              </div>
              <div className="absolute right-2.5 bottom-2.5 w-4 h-4 rounded-full border border-[#c8d2e0] bg-white/60" />
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 mt-2.5 flex items-end justify-between">
          <div>
            <p className="text-[21px] leading-none font-black text-white">{currentLang === "en" ? "View CV" : "Ver CV"}</p>
            <p className="text-[10px] mt-1 text-white/75">{currentLang === "en" ? "Click to open ->" : "Clique para abrir ->"}</p>
          </div>
          <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all group-hover:scale-110 bg-white/18 text-white border border-white/25">
            <ArrowUpRight size={12} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});
