import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, Flame, Clock, Target } from "lucide-react";
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
  const exercises = Array.isArray(workout?.exercises) ? workout.exercises : [];
  
  return (
    <WidgetCard
      isLoading={isLoading}
      error={!workout ? "Dados de treino indisponíveis" : null}
      loadingIcon={<Dumbbell size={28} className="text-[#ff6b6b]" />}
      emptyIcon={<Dumbbell size={24} className="text-[#ccc] dark:text-[#444]" />}
      className="h-full rounded-2xl overflow-hidden"
      style={{
        border: isDark ? "1px solid #282828" : "1px solid #ebebeb",
      }}
      glowColor="255, 107, 107"
    >
      {workout && (
        <div className="p-3 h-full flex flex-col gap-2">
          {/* Header */}
          <div className="flex items-center justify-between shrink-0">
            <div className="inline-flex items-center gap-1.5">
              <Dumbbell size={12} className="text-[#ff6b6b]" />
              <span className={`text-[9px] font-semibold text-[#ff6b6b] uppercase tracking-wider`}>Last Workout</span>
            </div>
          </div>

          {/* Stats Grid 2×2 */}
          <div className="grid grid-cols-2 gap-1.5 shrink-0">
            {/* Total Volume */}
            <div className={`rounded-lg p-2 border ${isDark ? "bg-white/3 border-white/8" : "bg-white border-[#ebebeb]"}`}>
              <p className={`text-[14px] font-black leading-none ${isDark ? "text-white" : "text-[#111]"}`}>
                <CountUp to={workout.totalVolume ?? 0} separator="," duration={1.4} />
              </p>
              <p className={`text-[7px] uppercase tracking-wider mt-0.5 font-semibold ${isDark ? "text-white/40" : "text-[#999]"}`}>
                Volume (kg)
              </p>
            </div>

            {/* Streak */}
            <div className={`rounded-lg p-2 border ${isDark ? "bg-white/3 border-white/8" : "bg-white border-[#ebebeb]"}`}>
              <p className={`text-[14px] font-black leading-none ${isDark ? "text-white" : "text-[#111]"}`}>
                <CountUp to={workout.weeklyStats?.streak ?? 0} duration={0.8} />
              </p>
              <p className={`text-[7px] uppercase tracking-wider mt-0.5 font-semibold ${isDark ? "text-white/40" : "text-[#999]"}`}>
                Day Streak
              </p>
            </div>

            {/* Duration */}
            <div className={`rounded-lg p-2 border ${isDark ? "bg-white/3 border-white/8" : "bg-white border-[#ebebeb]"}`}>
              <p className={`text-[14px] font-black leading-none ${isDark ? "text-white" : "text-[#111]"}`}>
                <CountUp to={workout.duration ?? 0} duration={1.0} />
              </p>
              <p className={`text-[7px] uppercase tracking-wider mt-0.5 font-semibold ${isDark ? "text-white/40" : "text-[#999]"}`}>
                Minutes
              </p>
            </div>

            {/* Workouts This Week */}
            <div className={`rounded-lg p-2 border ${isDark ? "bg-white/3 border-white/8" : "bg-white border-[#ebebeb]"}`}>
              <p className={`text-[14px] font-black leading-none ${isDark ? "text-white" : "text-[#111]"}`}>
                <CountUp to={workout.weeklyStats?.workoutsThisWeek ?? 0} duration={0.7} />
              </p>
              <p className={`text-[7px] uppercase tracking-wider mt-0.5 font-semibold ${isDark ? "text-white/40" : "text-[#999]"}`}>
                This Week
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className={`border-t ${isDark ? "border-white/[0.08]" : "border-[#ebebeb]"}`} />

          {/* Exercise List */}
          <div className="flex-1 flex flex-col justify-between min-h-0 gap-1">
            {exercises.slice(0, 4).map((ex, i) => (
              <motion.div
                key={ex.name}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.05, duration: 0.28 }}
                className="flex items-center justify-between gap-2 py-0.5 group"
              >
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <Dumbbell size={9} className="text-[#ff6b6b]/40 shrink-0" />
                  <p className={`text-[10px] font-medium truncate ${isDark ? "text-white/70" : "text-[#555]"}`}>
                    {ex.name}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-md ${isDark ? "bg-white/5 border border-white/10 text-white/50" : "bg-[#f5f5f5] border border-[#e0e0e0] text-[#666]"}`}>
                    {ex.sets}×{ex.reps}
                  </span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${isDark ? "bg-[#ff6b6b]/15 text-[#ff9999]" : "bg-[#fff5f5] border border-[#ffe0e0] text-[#ff6b6b]"}`}>
                    {ex.weight}kg
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </WidgetCard>
  );
});
