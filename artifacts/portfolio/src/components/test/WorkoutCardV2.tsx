import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Dumbbell } from "lucide-react";
import { Card } from "@/components/Card";
import CountUp from "@/components/CountUp";
import { formatTimeAgo } from "@/lib/dateFormatter";
import type { WorkoutData } from "@/lib/apiClient";

interface WorkoutCardV2Props {
  workout: WorkoutData | undefined;
}

const volumeOf = (ex: { sets: number; reps: number; weight: number }) => ex.sets * ex.reps * ex.weight;

/**
 * Last workout as a small chart: one bar per exercise, as tall as the volume it moved.
 * Hovering (or focusing) a bar swaps the footer for that exercise's sets and load.
 * Bodyweight exercises carry no load, so they get a short hollow bar instead of none.
 */
export function WorkoutCardV2({ workout }: WorkoutCardV2Props) {
  const { t, i18n } = useTranslation("home");
  const [active, setActive] = useState<number | null>(null);
  const exercises = workout?.exercises ?? [];

  if (!workout?.date || exercises.length === 0) {
    return (
      <Card className="h-full rounded-2xl bg-panel border border-base" glowColor="var(--accent-glow)">
        <div className="h-full flex flex-col items-center justify-center gap-2">
          <Dumbbell size={22} className="text-faint" />
          <p className="text-[11px] text-faint">{t("workout.error")}</p>
        </div>
      </Card>
    );
  }

  const peak = Math.max(...exercises.map(volumeOf), 1);
  const shown = active === null ? null : exercises[active];
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

        <p className="mt-1.5 text-[12px] font-bold leading-tight text-main truncate">{workout.type}</p>

        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-[26px] font-black leading-none tracking-tight text-main tabular-nums">
            <CountUp to={workout.totalVolume} separator="." duration={1.2} />
          </span>
          <span className="text-[10px] font-semibold text-faint">kg</span>
        </div>

        <div
          className="mt-2 flex-1 min-h-[36px] flex items-end gap-1"
          role="list"
          aria-label={t("workout.exercises")}
          onMouseLeave={() => setActive(null)}
        >
          {exercises.map((ex, i) => {
            const share = volumeOf(ex) / peak;
            const bodyweight = ex.weight === 0;
            return (
              <button
                key={`${ex.name}-${i}`}
                type="button"
                role="listitem"
                aria-label={`${ex.name}: ${ex.sets}×${ex.reps}${bodyweight ? "" : ` · ${ex.weight} kg`}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group flex-1 h-full flex items-end outline-none"
              >
                <motion.span
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.15 + i * 0.07, type: "spring", stiffness: 140, damping: 16 }}
                  style={{ height: bodyweight ? "18%" : `${Math.max(share * 100, 12)}%` }}
                  className={`w-full origin-bottom rounded-t-md transition-opacity duration-200 ${
                    bodyweight ? "border border-b-0 border-dashed border-brand bg-brand-subtle" : "bg-brand"
                  } ${active === null || active === i ? "opacity-100" : "opacity-30"} group-focus-visible:ring-2 group-focus-visible:ring-brand`}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-2 h-[26px] border-t border-base pt-1.5 text-[10px] leading-tight">
          {shown ? (
            <motion.p key={active} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-2">
              <span className="font-medium text-main truncate">{shown.name.trim()}</span>
              <span className="shrink-0 font-semibold text-brand tabular-nums">
                {shown.sets}×{shown.reps}
                {shown.weight > 0 && ` · ${shown.weight} kg`}
              </span>
            </motion.p>
          ) : (
            <p className="flex items-center justify-between gap-2 text-faint">
              <span>
                {workout.duration} min · {t("workout.items", { count: exercises.length })}
              </span>
              <span className="shrink-0">
                {workout.weeklyStats.workoutsThisWeek} {t("workout.thisWeek").toLowerCase()}
              </span>
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
