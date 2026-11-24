import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/Card";
import { jobExperiences } from "@/constants/jobExperiences";

// The page's lines, as [width %, dark heading?]. They are drawn one after another.
const LINES: Array<[number, boolean]> = [
  [46, true], [96, false], [88, false], [0, false],
  [38, true], [94, false], [80, false], [0, false],
  [33, true], [86, false],
];

/**
 * The résumé as a sheet of paper that writes itself: the header, then each line drawn
 * left to right. The sheet leans toward the pointer and lifts on hover; the whole card
 * opens the résumé.
 */
export function ResumeCardV2() {
  const { t, i18n } = useTranslation("home");
  const [, setLocation] = useLocation();
  const still = useReducedMotion() ?? false;
  const px = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const py = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const rotateY = useTransform(px, [-0.5, 0.5], [-10, 10]);
  const rotateX = useTransform(py, [-0.5, 0.5], [8, -8]);
  const job = jobExperiences.find((j) => !j.endDate) ?? jobExperiences[0];
  const role = i18n.language.startsWith("en") && job.titleEn ? job.titleEn : job.title;

  return (
    <Card className="h-full" glowColor="255, 200, 100" glowIntensity={1.4}>
      <button
        type="button"
        onClick={() => setLocation("/resume")}
        onMouseMove={(e) => {
          if (still) return;
          const rect = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - rect.left) / rect.width - 0.5);
          py.set((e.clientY - rect.top) / rect.height - 0.5);
        }}
        onMouseLeave={() => {
          px.set(0);
          py.set(0);
        }}
        className="group relative h-full w-full overflow-hidden p-3 flex flex-col text-left text-white outline-none focus-visible:ring-2 focus-visible:ring-white"
        style={{ borderRadius: "inherit", backgroundColor: "var(--accent)", perspective: 700 }}
        aria-label={t("cv.viewFull")}
      >
        <span aria-hidden className="absolute -top-14 -right-10 h-36 w-36 rounded-full bg-white/20 blur-2xl" />
        <span aria-hidden className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-black/15 blur-2xl" />

        <span className="relative flex items-center justify-between">
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/80">{t("cv.title")}</span>
          <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 group-hover:bg-white/30">
            <ArrowUpRight size={13} />
          </span>
        </span>

        <motion.span
          className="relative mt-2 mx-auto block w-[78%] flex-1 min-h-0 rounded-t-lg bg-gradient-to-b from-white to-[#eef1f6] px-3 pt-3 shadow-[0_14px_30px_rgba(0,0,0,0.28)] transition-[translate] duration-300 group-hover:-translate-y-1"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="flex items-center gap-2">
            <motion.span
              className="h-5 w-5 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 260, damping: 14 }}
            />
            <span className="min-w-0">
              <span className="block truncate text-[9px] font-black leading-tight text-[#1c2536]">Lucas Diniz</span>
              <span className="block truncate text-[7px] leading-tight text-[#6b778a]">
                {role} · {job.institution}
              </span>
            </span>
          </span>
          <span className="mt-2 block space-y-[5px]">
            {LINES.map(([width, heading], i) =>
              width === 0 ? (
                <span key={i} className="block h-px" />
              ) : (
                <motion.span
                  key={i}
                  className={`block origin-left rounded-full ${heading ? "h-[5px] bg-[#223046]" : "h-[3px] bg-[#9aa5b6]"}`}
                  style={{ width: `${width}%` }}
                  initial={{ scaleX: still ? 1 : 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5 + i * 0.09, duration: 0.4, ease: "easeOut" }}
                />
              )
            )}
          </span>
        </motion.span>
      </button>
    </Card>
  );
}
