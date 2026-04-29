import React, { useState } from "react";
import { FiClock } from "react-icons/fi";
import { BentoCard } from "@/components/BentoCard";
import { useFlipLock } from "@/hooks/useFlipLock";
import { useBrasiliaWeather } from "@/hooks/useBrasiliaWeather";
import CountUp from "@/components/CountUp";
import { CardHeader } from "@/components/CardHeader";

/**
 * Props for WeatherClockCard component
 * @interface WeatherClockCardProps
 * @property {Object} clock - Clock time object
 * @property {string} clock.h - Hours (00-23)
 * @property {string} clock.m - Minutes (00-59)
 * @property {string} clock.s - Seconds (00-59)
 */
interface WeatherClockCardProps {
  clock: { h: string; m: string; s: string };
}

/**
 * WeatherClockCard - Flip card showing weather on front and clock on back
 * @component
 * @param {WeatherClockCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const WeatherClockCard = React.memo(function WeatherClockCard({
  clock,
}: WeatherClockCardProps) {
  const [flipped, setFlipped] = useState(false);
  const { isFlipping, runWithFlipLock } = useFlipLock(600);
  const weather = useBrasiliaWeather();
  const hh = Number.parseInt(clock.h, 10);
  const mm = Number.parseInt(clock.m, 10);
  const ss = Number.parseInt(clock.s, 10);

  const handleFlip = () => {
    runWithFlipLock(() => {
      setFlipped((f) => !f);
    });
  };

  return (
    <BentoCard
      className={`cursor-pointer overflow-hidden border rounded-2xl transition-all duration-300 relative z-10 h-full ${
        isFlipping
          ? "shadow-none border-transparent"
          : "border-[#ebebeb] dark:border-[#282828]"
      }`}
      onClick={handleFlip}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)", // Smooth easing
          willChange: "transform",
        }}
      >
        {/* FRONT — Weather */}
        <div
          className="absolute inset-0 p-4 flex flex-col justify-between bg-white dark:bg-[#181818]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardHeader
            title="Weather"
            icon={<span>☁</span>}
            flipLabel="horario"
            onFlip={handleFlip}
          />
          <div>
            <p className="text-[28px] font-black tracking-tight leading-none text-[#111] dark:text-[#eee]">
              {weather.temperature === null
                ? "--"
                : `${Math.round(weather.temperature)}°C`}
            </p>
            <p className="text-[11px] text-[#aaa] dark:text-[#555] mt-1">
              {weather.isLoading ? "Carregando clima..." : weather.description}{" "}
              · Brasilia
            </p>
          </div>
        </div>

        {/* BACK — Clock */}
        <div
          className="absolute inset-0 p-4 flex flex-col justify-between bg-white dark:bg-[#181818]"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <CardHeader
            title="Horario local"
            icon={<FiClock size={9} />}
            flipLabel="clima"
            flipDirection="left"
            onFlip={handleFlip}
          />
          <div>
            <div className="flex items-end gap-0.5 font-black tabular-nums leading-none">
              <span className="text-[26px] text-[#111] dark:text-[#eee]">
                <CountUp
                  to={hh}
                  from={hh}
                  duration={0.12}
                  minDigits={2}
                  springProfile="digital"
                  animationMode="step"
                />
              </span>
              <span className="text-[20px] text-[#ccc] dark:text-[#444] mb-0.5">
                :
              </span>
              <span className="text-[26px] text-[#111] dark:text-[#eee]">
                <CountUp
                  to={mm}
                  from={mm}
                  duration={0.12}
                  minDigits={2}
                  springProfile="digital"
                  animationMode="step"
                />
              </span>
              <span className="text-[20px] text-[#ccc] dark:text-[#444] mb-0.5">
                :
              </span>
              <span className="text-[20px] text-[#aaa] dark:text-[#555] mb-0.5">
                <CountUp
                  to={ss}
                  from={ss}
                  duration={0.08}
                  minDigits={2}
                  springProfile="digital"
                  animationMode="step"
                />
              </span>
            </div>
            <p className="text-[11px] text-[#aaa] dark:text-[#555] mt-1">
              Brasilia (BRT, UTC-3)
            </p>
          </div>
        </div>
      </div>
    </BentoCard>
  );
});
