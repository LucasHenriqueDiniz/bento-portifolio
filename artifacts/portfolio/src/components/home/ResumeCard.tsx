import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/Card";
import { jobExperiences } from "@/constants/jobExperiences";

// The page's lines, as [width %, dark heading?]. They are drawn one after another.
const LINES: Array<[number, boolean]> = [
  [44, true], [96, false], [88, false], [0, false],
  [36, true], [94, false], [80, false], [0, false],
  [32, true], [86, false], [72, false],
];

/**
 * The résumé as a sheet of paper resting in the card, its lower part out of view like
 * a page in a tray. It slides in once, the header appears and each line is drawn left
 * to right. Hovering pulls the page up a little and straightens it; nothing follows the
 * pointer, so the sheet stays put. The whole card opens the résumé.
 */
export function ResumeCard() {
  const { t, i18n } = useTranslation("home");
  const [, setLocation] = useLocation();
  const still = useReducedMotion() ?? false;
  const job = jobExperiences.find((j) => !j.endDate) ?? jobExperiences[0];
  const role = i18n.language.startsWith("en") && job.titleEn ? job.titleEn : job.title;

  return (
    <Card className="h-full" glowColor="255, 200, 100" glowIntensity={1.4}>
      <button
        type="button"
        onClick={() => setLocation("/resume")}
        className="group relative h-full w-full overflow-hidden px-3 pt-3 flex flex-col text-left text-white outline-none focus-visible:ring-2 focus-visible:ring-white"
        style={{ borderRadius: "inherit", background: "linear-gradient(160deg, var(--accent) 0%, var(--accent-hover) 100%)" }}
        aria-label={t("cv.viewFull")}
      >
        <span aria-hidden className="absolute -top-14 -right-10 h-36 w-36 rounded-full bg-white/20 blur-2xl" />

        <span className="relative flex items-center justify-between">
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/85">{t("cv.title")}</span>
          <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 group-hover:rotate-45 group-hover:bg-white/35">
            <ArrowUpRight size={13} />
          </span>
        </span>

        {/* The slide-in runs on this wrapper and the hover on the sheet inside it, so the
            two never fight over the same transform. */}
        <motion.span
          className="relative mt-2.5 block flex-1 min-h-0"
          initial={{ y: still ? 0 : 46, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            data-testid="resume-sheet"
            className="absolute inset-x-1 top-1.5 block h-[150%] origin-bottom rounded-t-lg bg-gradient-to-b from-white to-[#eef1f6] px-3 pt-3 shadow-[0_-6px_22px_rgba(0,0,0,0.22)] transition-transform duration-300 ease-out -rotate-[1.5deg] group-hover:-translate-y-2 group-hover:rotate-0 group-focus-visible:-translate-y-2 group-focus-visible:rotate-0"
          >
            <span className="flex items-center gap-2">
              <motion.span
                className="h-6 w-6 shrink-0 rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
                initial={{ scale: still ? 1 : 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.35, type: "spring", stiffness: 260, damping: 14 }}
              />
              <span className="min-w-0">
                <span className="block truncate text-[10px] font-black leading-tight text-[#1c2536]">Lucas Diniz</span>
                <span className="block truncate text-[8px] leading-tight text-[#6b778a]">
                  {role} · {job.institution}
                </span>
              </span>
            </span>
            <span className="mt-2.5 block space-y-[5px]">
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
                    transition={{ delay: 0.55 + i * 0.08, duration: 0.38, ease: "easeOut" }}
                  />
                )
              )}
            </span>
          </span>
        </motion.span>
      </button>
    </Card>
  );
}
