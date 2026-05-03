import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Dumbbell, TrendingUp } from "lucide-react";
import { WidgetCard } from "@/components/WidgetCard";
import CountUp from "@/components/CountUp";

/**
 * Exercise data structure
 * @interface Exercise
 * @property {string} name - Exercise name
 * @property {number} sets - Number of sets
 * @property {number} reps - Number of reps per set
 * @property {number} weight - Weight in kg
 */
interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

/**
 * Workout data from Lyfta API
 * @interface WorkoutData
 * @property {string} [type] - Workout type (e.g., "Push", "Pull", "Legs")
 * @property {number} [totalVolume] - Total volume in kg
 * @property {Object} [weeklyStats] - Weekly statistics
 * @property {number} [weeklyStats.streak] - Current streak in days
 * @property {number} [weeklyStats.workoutsThisWeek] - Workouts completed this week
 * @property {number} [duration] - Workout duration in minutes
 * @property {Exercise[]} [exercises] - List of exercises performed
 */
interface WorkoutData {
  type?: string;
  totalVolume?: number;
  weeklyStats?: {
    streak?: number;
    workoutsThisWeek?: number;
  };
  duration?: number;
  exercises?: Exercise[];
}

/**
 * Props for WorkoutCard component
 * @interface WorkoutCardProps
 * @property {WorkoutData | undefined} workout - Last workout data
 * @property {boolean} isLoading - Loading state
 * @property {boolean} isDark - Dark mode flag
 */
interface WorkoutCardProps {
  workout: WorkoutData | undefined;
  isLoading: boolean;
  isDark: boolean;
}

/**
 * WorkoutCard - Displays last workout data from Lyfta with exercises and stats
 * @component
 * @param {WorkoutCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const WorkoutCard = React.memo(function WorkoutCard({
  workout,
  isLoading,
  isDark,
}: WorkoutCardProps) {
  const { t } = useTranslation("home");
  const exercises = Array.isArray(workout?.exercises) ? workout.exercises : [];
  const hasExercises = exercises.length > 0;
  
  return (
    <WidgetCard
      isLoading={isLoading}
      error={!workout ? t("workout.error") : null}
      loadingIcon={<Dumbbell size={28} className="text-brand" />}
      emptyIcon={<Dumbbell size={24} className="text-faint" />}
      className="h-full rounded-2xl overflow-hidden"
      style={{
        border: `1px solid var(--border-base)`,
      }}
      glowColor="var(--accent-glow)"
    >
      {workout && (
        <div className="p-3 h-full flex flex-col gap-2 bg-panel">
          {/* Header */}
          <div className="flex items-center justify-between shrink-0">
            <div className="inline-flex items-center gap-1.5">
              <Dumbbell size={12} className="text-brand" />
              <span className="text-[9px] font-semibold text-brand uppercase tracking-wider">{t("workout.title")}</span>
            </div>
            <span className={`text-[8px] px-1.5 py-0.5 rounded-full border ${isDark ? "bg-white/5 border-white/10 text-white/60" : "bg-field border-base text-faint"}`}>
              {workout.type ?? "Workout"}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-1.5 shrink-0">
            {/* Total Volume */}
            <div className={`rounded-lg p-2 border ${isDark ? "bg-white/4 border-white/10" : "bg-panel border-base"}`}>
              <div className="flex items-start justify-between">
                <p className="text-[14px] font-black leading-none text-main">
                  <CountUp to={workout.totalVolume ?? 0} separator="," duration={1.4} />
                </p>
                <TrendingUp size={10} className="text-brand/70" />
              </div>
              <p className="text-[7px] uppercase tracking-wider mt-0.5 font-semibold text-faint">{t("workout.volume")}</p>
            </div>

            {/* Workouts This Week */}
            <div className={`rounded-lg p-2 border ${isDark ? "bg-white/4 border-white/10" : "bg-panel border-base"}`}>
              <p className="text-[14px] font-black leading-none text-main">
                <CountUp to={workout.weeklyStats?.workoutsThisWeek ?? 0} duration={0.7} />
              </p>
              <p className="text-[7px] uppercase tracking-wider mt-0.5 font-semibold text-faint">{t("workout.thisWeek")}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-0.5 shrink-0">
            <p className="text-[8px] uppercase tracking-[0.18em] font-semibold text-faint">{t("workout.exercises")}</p>
            <p className="text-[8px] text-faint">{t("workout.items", { count: exercises.length })}</p>
          </div>

          <div className={`rounded-lg border ${isDark ? "border-white/10 bg-white/3" : "border-base bg-field/40"} p-1.5 flex-1 min-h-0`}>
            {hasExercises ? (
              <div className="h-full overflow-y-auto custom-scrollbar pr-1 space-y-1">
                {exercises.map((ex, i) => (
                  <motion.div
                    key={`${ex.name}-${i}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.03, duration: 0.24 }}
                    className={`flex items-center justify-between gap-2 rounded-md px-1.5 py-1 ${isDark ? "hover:bg-white/5" : "hover:bg-panel"}`}
                  >
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <Dumbbell size={9} className="text-brand/45 shrink-0" />
                      <p className="text-[10px] font-medium truncate text-sub">{ex.name}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-md ${isDark ? "bg-white/5 border border-white/10 text-white/65" : "bg-panel border border-base text-faint"}`}>
                        {ex.sets}x{ex.reps}
                      </span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${isDark ? "bg-brand/15 text-brand" : "bg-brand-subtle border border-brand/20 text-brand"}`}>
                        {ex.weight}kg
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-[10px] text-faint">{t("workout.empty")}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </WidgetCard>
  );
});
