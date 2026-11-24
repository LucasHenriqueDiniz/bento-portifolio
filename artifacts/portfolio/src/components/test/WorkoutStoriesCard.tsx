import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Dumbbell } from "lucide-react";
import { Card } from "@/components/Card";
import { formatTimeAgo } from "@/lib/dateFormatter";
import { formatCount } from "@/lib/numberFormat";
import type { WorkoutData } from "@/lib/apiClient";

const SLIDE_MS = 3200;

interface WorkoutStoriesCardProps {
  workout: WorkoutData | undefined;
}

/**
 * Last workout told like a story: one exercise at a time, with Lyfta's illustration of
 * the movement, and a segmented bar on top that fills as each one plays. Hovering
 * pauses it; clicking a segment (or the card) jumps.
 */
export function WorkoutStoriesCard({ workout }: WorkoutStoriesCardProps) {
  const { t, i18n } = useTranslation("home");
  const still = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [brokenImages, setBrokenImages] = useState<ReadonlySet<string>>(() => new Set());
  const exercises = workout?.exercises ?? [];
  const count = exercises.length;
  const playing = count > 1 && !paused && !still;

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [playing, index, count]);

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

  const exercise = exercises[index % count];
  const image = exercise.exercise_image && !brokenImages.has(exercise.exercise_image) ? exercise.exercise_image : null;
  const ago = formatTimeAgo(new Date(`${workout.date}T00:00:00`).getTime(), i18n.language);

  return (
    <Card className="h-full rounded-2xl bg-panel border border-base" glowColor="var(--accent-glow)">
      <div
        className="h-full p-3 flex flex-col"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="flex gap-1" role="tablist" aria-label={t("workout.exercises")}>
          {exercises.map((ex, i) => (
            <button
              key={`${ex.name}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={ex.name.trim()}
              onClick={() => setIndex(i)}
              className="flex-1 h-[3px] rounded-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-brand"
              style={{ backgroundColor: "rgba(var(--accent-glow), 0.2)" }}
            >
              {i < index && <span className="block h-full bg-brand/60" />}
              {i === index && (
                <span
                  key={`${index}-${playing}`}
                  className="block h-full bg-brand origin-left"
                  style={playing ? { animation: `project-progress ${SLIDE_MS}ms linear forwards` } : undefined}
                />
              )}
            </button>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-brand">
            <Dumbbell size={11} />
            {t("workout.title")}
          </span>
          <span className="text-[9px] text-faint whitespace-nowrap">{ago}</span>
        </div>

        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % count)}
          aria-label={t("workout.next")}
          className="mt-1.5 flex-1 min-h-0 flex items-center gap-2 text-left outline-none"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: still ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 min-w-0 h-full flex items-center gap-2"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold leading-tight text-main line-clamp-2">{exercise.name.trim()}</p>
                <p className="mt-1.5 text-[22px] font-black leading-none tracking-tight text-main tabular-nums">
                  {exercise.sets}
                  <span className="text-faint font-bold">×</span>
                  {exercise.reps}
                </p>
                <p className="mt-1 text-[10px] font-semibold text-brand">
                  {exercise.weight > 0 ? `${exercise.weight} kg` : t("workout.bodyweight")}
                </p>
              </div>
              <div className="shrink-0 h-[78px] w-[78px] rounded-xl bg-white/95 border border-base overflow-hidden flex items-center justify-center">
                {image ? (
                  <motion.img
                    src={image}
                    alt=""
                    initial={{ scale: 0.86 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full w-full object-contain"
                    onError={() => setBrokenImages((prev) => new Set(prev).add(image))}
                  />
                ) : (
                  <Dumbbell size={26} className="text-black/25" />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </button>

        <p className="mt-1.5 border-t border-base pt-1.5 flex items-center justify-between gap-2 text-[9px] text-faint">
          <span className="truncate font-medium text-sub">{workout.type}</span>
          <span className="shrink-0 tabular-nums">
            {formatCount(workout.totalVolume, i18n.language)} kg · {workout.duration} min
          </span>
        </p>
      </div>
    </Card>
  );
}
