import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Dumbbell } from "lucide-react";
import { Card } from "@/components/Card";
import CountUp from "@/components/CountUp";
import { formatTimeAgo } from "@/lib/dateFormatter";
import { formatCount } from "@/lib/numberFormat";
import type { WorkoutData } from "@/lib/apiClient";

const SCAN_MS = 2400;

interface WorkoutCardV2Props {
  workout: WorkoutData | undefined;
}

const volumeOf = (ex: { sets: number; reps: number; weight: number }) => ex.sets * ex.reps * ex.weight;

/**
 * Last workout as a small chart: one bar per exercise, as tall as the volume it moved,
 * with its load written under it. One bar is always in focus: left alone, the focus
 * walks along the bars; hovering or focusing a bar takes it. The line under the chart
 * names the exercise in focus. Bodyweight exercises carry no load, so they get a short
 * dashed bar instead of none.
 */
export function WorkoutCardV2({ workout }: WorkoutCardV2Props) {
  const { t, i18n } = useTranslation("home");
  const still = useReducedMotion() ?? false;
  const [picked, setPicked] = useState<number | null>(null);
  const [scan, setScan] = useState(0);
  const exercises = workout?.exercises ?? [];
  const count = exercises.length;

  useEffect(() => {
    if (picked !== null || still || count < 2) return;
    const timer = setInterval(() => setScan((n) => (n + 1) % count), SCAN_MS);
    return () => clearInterval(timer);
  }, [picked, still, count]);

  if (!workout?.date || count === 0) {
    return (
      <Card className="h-full rounded-2xl bg-panel border border-base" glowColor="var(--accent-glow)">
        <div className="h-full flex flex-col items-center justify-center gap-2">
          <Dumbbell size={22} className="text-faint" />
          <p className="text-[11px] text-faint">{t("workout.error")}</p>
        </div>
      </Card>
    );
  }

  const active = picked ?? scan % count;
  const shown = exercises[active];
  const peak = Math.max(...exercises.map(volumeOf), 1);
  // From the start of the workout's day, so "2 days ago" counts calendar days.
  const ago = formatTimeAgo(new Date(`${workout.date}T00:00:00`).getTime(), i18n.language);

  return (
    <Card className="h-full rounded-2xl bg-panel border border-base" glowColor="var(--accent-glow)">
      <div className="h-full p-3 flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-brand">
            <Dumbbell size={11} />
            {t("workout.title")}
          </span>
          <span className="text-[9px] text-faint whitespace-nowrap">{ago}</span>
        </div>

        <div className="mt-1.5 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold leading-tight text-sub truncate">{workout.type}</p>
            <p className="mt-0.5 flex items-baseline gap-1">
              <span className="text-[24px] font-black leading-none tracking-tight text-main tabular-nums">
                <CountUp to={workout.totalVolume} separator="." duration={1.2} />
              </span>
              <span className="text-[10px] font-semibold text-faint">kg</span>
            </p>
          </div>
          <p className="shrink-0 text-right text-[9px] leading-tight text-faint">
            {workout.duration} min
            <br />
            {t("workout.items", { count })}
          </p>
        </div>

        <div
          className="relative mt-2 flex-1 min-h-[44px] flex items-stretch gap-1"
          role="list"
          aria-label={t("workout.exercises")}
          onMouseLeave={() => setPicked(null)}
        >
          {/* A faint midline and baseline, so the bars read as a chart. */}
          <span aria-hidden className="absolute inset-x-0 top-[calc(50%-7px)] border-t border-dashed border-base" />
          <span aria-hidden className="absolute inset-x-0 bottom-[13px] border-t border-base" />
          {exercises.map((ex, i) => {
            const share = volumeOf(ex) / peak;
            const bodyweight = ex.weight === 0;
            const isActive = i === active;
            return (
              <button
                key={`${ex.name}-${i}`}
                type="button"
                role="listitem"
                aria-label={`${ex.name.trim()}: ${ex.sets}×${ex.reps}${bodyweight ? "" : ` · ${ex.weight} kg`}`}
                aria-current={isActive}
                onMouseEnter={() => setPicked(i)}
                onFocus={() => setPicked(i)}
                onBlur={() => setPicked(null)}
                className="group relative flex-1 min-w-0 flex flex-col justify-end outline-none"
              >
                <span className="relative flex-1 min-h-0 flex items-end">
                  <motion.span
                    initial={{ scaleY: still ? 1 : 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.15 + i * 0.07, type: "spring", stiffness: 140, damping: 16 }}
                    style={{
                      height: bodyweight ? "18%" : `${Math.max(share * 100, 12)}%`,
                      ...(bodyweight
                        ? {}
                        : { background: "linear-gradient(180deg, var(--accent) 0%, rgba(var(--accent-glow), 0.55) 100%)" }),
                      boxShadow: isActive && !bodyweight ? "0 0 14px -2px rgba(var(--accent-glow), 0.75)" : undefined,
                    }}
                    className={`w-full origin-bottom rounded-t-[5px] transition-[opacity,box-shadow] duration-300 ${
                      bodyweight ? "border border-b-0 border-dashed border-brand bg-brand-subtle" : ""
                    } ${isActive ? "opacity-100" : "opacity-40"} group-focus-visible:ring-2 group-focus-visible:ring-brand`}
                  />
                </span>
                <span
                  className={`mt-[3px] h-[10px] text-center text-[8px] leading-[10px] tabular-nums transition-colors duration-300 ${
                    isActive ? "font-bold text-brand" : "text-faint"
                  }`}
                >
                  {bodyweight ? "–" : ex.weight}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-1.5 h-[24px] border-t border-base pt-1.5 text-[10px] leading-tight overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: still ? 0 : 0.2 }}
              className="flex items-center justify-between gap-2"
            >
              <span className="font-medium text-main truncate">{shown.name.trim()}</span>
              <span className="shrink-0 font-semibold text-brand tabular-nums">
                {shown.sets}×{shown.reps}
                {shown.weight > 0 && ` · ${formatCount(volumeOf(shown), i18n.language)} kg`}
              </span>
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}
