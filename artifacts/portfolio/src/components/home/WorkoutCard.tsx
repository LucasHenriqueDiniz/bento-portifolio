import React from "react";
import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";
import { WidgetCard } from "@/components/WidgetCard";
import CountUp from "@/components/CountUp";
import { CardHeader } from "@/components/CardHeader";
import { fadeUpSoft } from "@/lib/animations";

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
 * @property {1 | 2 | 3 | 4} [tier] - Visual hierarchy tier (optional, defaults to 2)
 */
interface WorkoutCardProps {
  workout: WorkoutData | undefined;
  isLoading: boolean;
  isDark: boolean;
  tier?: 1 | 2 | 3 | 4;
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
  tier = 2,
}: WorkoutCardProps) {
  return (
    <WidgetCard
      isLoading={isLoading}
      error={!workout ? "Dados de treino indisponíveis" : null}
      loadingIcon={
        <Dumbbell
          size={28}
          className={isDark ? "text-white/40" : "text-[#ccc]"}
        />
      }
      emptyIcon={
        <Dumbbell
          size={24}
          className={isDark ? "text-white/40" : "text-[#ccc]"}
        />
      }
      className={`rounded-2xl overflow-hidden flex flex-col
        /* Mobile: full width, order 11 (tier-3) */
        col-span-1 order-11
        /* Tablet: column 2, rows 3-9 */
        md:col-start-2 md:col-end-3 md:row-start-3 md:row-end-9
        /* Desktop: column 2, rows 3-9 */
        lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-9`}
      tier={tier}
      style={{
        background: isDark
          ? "linear-gradient(160deg, #181818 0%, #0f0f0f 100%)"
          : "#fff",
        border: !isDark ? "1px solid #ebebeb" : undefined,
      }}
    >
      {workout && (
        <div className="p-3.5 h-full flex flex-col gap-2.5">
          <motion.div
            custom={6}
            variants={fadeUpSoft}
            initial="hidden"
            animate="show"
            className="flex flex-col h-full gap-2.5"
          >
            {/* header */}
            <CardHeader
              icon={
                <Dumbbell
                  size={9}
                  className={isDark ? "text-white/40" : "text-[#ccc]"}
                />
              }
              title="Last Workout"
            />

            {/* top stats row */}
            <div className="grid grid-cols-2 gap-1.5">
              <div
                className={`rounded-xl p-2 border ${isDark ? "bg-white/5 border-white/5" : "bg-[#f8f8f8] border-[#ebebeb]"}`}
              >
                <p
                  className={`font-black text-[18px] leading-none ${isDark ? "text-white" : "text-[#111]"}`}
                >
                  <CountUp
                    to={workout.totalVolume ?? 0}
                    separator=","
                    duration={1.4}
                  />
                  <span
                    className={`text-[9px] font-normal ml-0.5 ${isDark ? "text-white/30" : "text-[#bbb]"}`}
                  >
                    kg
                  </span>
                </p>
                <p
                  className={`text-[8px] uppercase tracking-wider mt-1 ${isDark ? "text-white/25" : "text-[#bbb]"}`}
                >
                  total volume
                </p>
              </div>
              <div
                className={`rounded-xl p-2 border ${isDark ? "bg-white/5 border-white/5" : "bg-[#f8f8f8] border-[#ebebeb]"}`}
              >
                <p
                  className={`font-black text-[18px] leading-none ${isDark ? "text-white" : "text-[#111]"}`}
                >
                  <CountUp
                    to={workout.weeklyStats?.streak ?? 0}
                    duration={0.8}
                  />
                  <span
                    className={`text-[9px] font-normal ml-0.5 ${isDark ? "text-white/30" : "text-[#bbb]"}`}
                  >
                    days
                  </span>
                </p>
                <p
                  className={`text-[8px] uppercase tracking-wider mt-1 ${isDark ? "text-white/25" : "text-[#bbb]"}`}
                >
                  streak
                </p>
              </div>
            </div>

            {/* sub stats */}
            <div className="flex gap-3 px-0.5">
              <span
                className={`text-[10px] ${isDark ? "text-white/30" : "text-[#bbb]"}`}
              >
                <span
                  className={`font-semibold ${isDark ? "text-white/60" : "text-[#666]"}`}
                >
                  <CountUp to={workout.duration ?? 0} duration={1.0} />
                </span>{" "}
                min
              </span>
              <span className={isDark ? "text-white/15" : "text-[#ddd]"}>
                ·
              </span>
              <span
                className={`text-[10px] ${isDark ? "text-white/30" : "text-[#bbb]"}`}
              >
                <span
                  className={`font-semibold ${isDark ? "text-white/60" : "text-[#666]"}`}
                >
                  <CountUp
                    to={workout.weeklyStats?.workoutsThisWeek ?? 0}
                    duration={0.7}
                  />
                  ×
                </span>{" "}
                this week
              </span>
            </div>

            {/* divider */}
            <div
              className={`border-t ${isDark ? "border-white/[0.06]" : "border-[#ebebeb]"}`}
            />

            {/* exercise list */}
            <div className="flex flex-col justify-between flex-1 min-h-0">
              {(Array.isArray(workout.exercises) ? workout.exercises : []).slice(0, 4).map((ex, i) => (
                <motion.div
                  key={ex.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.32 }}
                  className="flex items-center justify-between gap-2 py-0.5"
                >
                  <p
                    className={`text-[10px] font-medium truncate flex-1 ${isDark ? "text-white/55" : "text-[#555]"}`}
                  >
                    {ex.name}
                  </p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[9px] ${isDark ? "text-white/25" : "text-[#bbb]"}`}
                    >
                      {ex.sets}×{ex.reps}
                    </span>
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${isDark ? "text-white/45 bg-white/5" : "text-[#555] bg-[#f5f5f5]"}`}
                    >
                      {ex.weight}kg
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </WidgetCard>
  );
});
