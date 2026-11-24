import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";
import { Card } from "@/components/Card";
import { formatCount } from "@/lib/numberFormat";

const DIGIT_EM = 1.05;

interface VisitsCardV2Props {
  count: number | undefined;
}

/** One digit of the odometer: a strip of 0-9 that rolls up to the digit it shows. */
function Digit({ digit, index, still }: { digit: number; index: number; still: boolean }) {
  return (
    <span className="relative inline-block overflow-hidden" style={{ height: `${DIGIT_EM}em`, width: "0.62em" }} aria-hidden>
      <motion.span
        className="absolute left-0 top-0 flex flex-col items-center w-full"
        initial={{ y: still ? `-${digit * DIGIT_EM}em` : 0 }}
        animate={{ y: `-${digit * DIGIT_EM}em` }}
        transition={{ delay: 0.15 + index * 0.09, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="flex items-center justify-center" style={{ height: `${DIGIT_EM}em` }}>
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * Site visits as an odometer: every digit rolls into place, over a slow drifting glow
 * and rings that spread from the eye like a ripple.
 */
export function VisitsCardV2({ count }: VisitsCardV2Props) {
  const { t, i18n } = useTranslation("home");
  const still = useReducedMotion() ?? false;
  const text = count === undefined ? null : formatCount(count, i18n.language);

  return (
    <Card className="h-full rounded-2xl bg-panel border border-base" glowColor="var(--accent-glow)">
      <div className="relative h-full overflow-hidden p-3 flex flex-col">
        <motion.div
          aria-hidden
          className="absolute h-44 w-44 rounded-full blur-2xl"
          style={{ right: -50, top: -60, background: "radial-gradient(circle, rgba(var(--accent-glow), 0.34), transparent 70%)" }}
          animate={still ? undefined : { x: [0, -34, 0], y: [0, 26, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-brand">
            <Eye size={11} />
            {t("views.title")}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[8px] font-medium uppercase tracking-wider text-faint">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {t("views.live")}
          </span>
        </div>

        <div className="relative flex-1 flex items-center justify-center">
          {!still &&
            [0, 1, 2].map((ring) => (
              <motion.span
                key={ring}
                aria-hidden
                className="absolute h-12 w-12 rounded-full border border-brand"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [0.6, 3.2], opacity: [0.5, 0] }}
                transition={{ duration: 3.6, delay: ring * 1.2, repeat: Infinity, ease: "easeOut" }}
              />
            ))}
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="relative h-10 w-10 rounded-full bg-field border border-brand/40 flex items-center justify-center"
            style={{ boxShadow: "0 0 26px -4px rgba(var(--accent-glow), 0.7)" }}
          >
            <Eye size={16} className="text-brand" />
          </motion.span>
        </div>

        <div className="relative">
          <p
            className="text-[38px] font-black leading-none tracking-tight text-main tabular-nums flex items-end"
            aria-label={text ? `${text} ${t("views.label")}` : undefined}
          >
            {text === null
              ? "—"
              : [...text].map((char, i) =>
                  /\d/.test(char) ? (
                    <Digit key={`${i}-${char}`} digit={Number(char)} index={i} still={still} />
                  ) : (
                    <span key={i} aria-hidden className="text-faint">
                      {char}
                    </span>
                  )
                )}
          </p>
          <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-faint">{t("views.label")}</p>
        </div>
      </div>
    </Card>
  );
}
