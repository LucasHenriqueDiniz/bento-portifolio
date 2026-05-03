import React, { useState, useEffect } from "react";
import { FiClock } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/Card";
import { useFlipLock } from "@/hooks/useFlipLock";
import { useBrasiliaWeather } from "@/hooks/useBrasiliaWeather";
import { CardHeader } from "@/components/CardHeader";

interface WeatherClockCardProps {
  clock: { h: string; m: string; s: string };
}

export const WeatherClockCard = React.memo(function WeatherClockCard({
  clock,
}: WeatherClockCardProps) {
  const { t } = useTranslation("home");
  const [flipAngle, setFlipAngle] = useState(0);
  const { isFlipping, runWithFlipLock } = useFlipLock(600);
  const weather = useBrasiliaWeather();
  const [colonVisible, setColonVisible] = useState(true);

  const hh = clock.h.padStart(2, "0");
  const mm = clock.m.padStart(2, "0");

  useEffect(() => {
    const id = setInterval(() => setColonVisible(v => !v), 1000);
    return () => clearInterval(id);
  }, []);

  const handleFlip = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isRight = x > rect.width / 2;
    runWithFlipLock(() => {
      setFlipAngle((prev) => prev + (isRight ? 180 : -180));
    });
  };

  return (
    <Card
      className={`cursor-pointer border rounded-2xl transition-all duration-300 h-full ${
        isFlipping
          ? "shadow-none border-transparent"
          : "border-base"
      }`}
      onClick={handleFlip}
      glowColor="var(--accent-glow)"
      flipAngle={flipAngle}
    >
      <div
        className="relative w-full h-full transition-transform"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${flipAngle}deg)`,
          transition: "transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)",
          willChange: "transform",
        }}
      >
        {/* FRONT — Weather */}
        <div
          className="absolute inset-0 p-4 flex flex-col justify-between bg-panel"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardHeader
            title={t("weather.title")}
            icon={<span>☁</span>}
            flipLabel={t("weather.timeLabel")}
            onFlip={() => runWithFlipLock(() => setFlipAngle((prev) => prev + 180))}
          />
          <div>
            <p className="text-[28px] font-black tracking-tight leading-none text-main">
              {weather.temperature === null
                ? "--"
                : `${Math.round(weather.temperature)}°C`}
            </p>
            <p className="text-[11px] text-faint mt-1">
              {weather.isLoading ? t("weather.loading") : weather.description}{" "}
              · {t("weather.location")}
            </p>
          </div>
        </div>

        {/* BACK — Clock */}
        <div
          className="absolute inset-0 p-4 flex flex-col justify-between bg-panel"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <CardHeader
            title={t("weather.localTime")}
            icon={<FiClock size={9} />}
            flipLabel={t("weather.flipLabel")}
            flipDirection="left"
            onFlip={() => runWithFlipLock(() => setFlipAngle((prev) => prev - 180))}
          />
          <div>
            <div className="flex items-end gap-1 font-black tabular-nums leading-none">
              <span className="text-[32px] text-main tracking-tight">{hh}</span>
              <span
                className="text-[32px] text-faint mb-0.5 transition-opacity duration-200"
                style={{ opacity: colonVisible ? 1 : 0.15 }}
              >
                :
              </span>
              <span className="text-[32px] text-main tracking-tight">{mm}</span>
            </div>
            <p className="text-[11px] text-faint mt-1">
              {t("weather.timezone")}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
});

export default WeatherClockCard;
