import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";
import { Card } from "@/components/Card";
import { formatCount } from "@/lib/numberFormat";

const FLIP_MS = 70;

/** One tile of the board: it flips through the digits until it lands on its own. */
function Flap({ digit, index, still }: { digit: number; index: number; still: boolean }) {
  // Each tile to the right spins a little longer, so the number settles left to right.
  const spins = still ? 0 : 6 + index * 4;
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= spins) return;
    const timer = setTimeout(() => setStep((n) => n + 1), FLIP_MS);
    return () => clearTimeout(timer);
  }, [step, spins]);
  const showing = (((digit - (spins - step)) % 10) + 10) % 10;

  return (
    <span
      aria-hidden
      className="relative inline-flex h-[1.5em] w-[1.02em] items-center justify-center rounded-md bg-[#15171c] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.35)]"
    >
      <span key={step} className={still ? "" : "flap-digit"}>
        {showing}
      </span>
      {/* The hinge of a split-flap tile. */}
      <span className="absolute inset-x-0 top-1/2 h-px bg-black/70" />
    </span>
  );
}

// Dots of the backdrop that light up now and then, as [column, row, delay in s].
const BLIPS: Array<[number, number, number]> = [
  [1, 1, 0], [4, 0, 1.3], [7, 2, 2.1], [10, 1, 0.6], [2, 3, 3.2], [8, 4, 1.8], [5, 5, 2.7], [11, 4, 0.9], [0, 5, 3.9], [9, 0, 3.4],
];

interface VisitsBoardCardProps {
  count: number | undefined;
}

/**
 * Site visits on a split-flap board, like an airport departures display: every tile
 * flips through digits and they settle from left to right. Behind it, a field of dots
 * where a few light up at random, one visitor at a time.
 */
export function VisitsBoardCard({ count }: VisitsBoardCardProps) {
  const { t, i18n } = useTranslation("home");
  const still = useReducedMotion() ?? false;
  const text = count === undefined ? null : formatCount(count, i18n.language);

  return (
    <Card className="h-full rounded-2xl bg-panel border border-base" glowColor="var(--accent-glow)">
      <div className="relative h-full overflow-hidden p-3 flex flex-col">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--border-base) 1px, transparent 0)", backgroundSize: "18px 18px" }}
        />
        {!still &&
          BLIPS.map(([col, row, delay]) => (
            <span
              key={`${col}-${row}`}
              aria-hidden
              className="visit-blip absolute h-[5px] w-[5px] rounded-full bg-brand"
              style={{ left: col * 18 - 1.5, top: row * 18 - 1.5, animationDelay: `${delay}s` }}
            />
          ))}

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

        <div className="relative flex-1 flex flex-col items-center justify-center gap-2">
          <p
            className="flex items-center gap-[3px] text-[30px] font-black leading-none tabular-nums"
            aria-label={text ? `${text} ${t("views.label")}` : undefined}
          >
            {text === null ? (
              <span className="text-faint">—</span>
            ) : (
              [...text.replace(/\D/g, "")].map((char, i) => <Flap key={`${i}-${char}`} digit={Number(char)} index={i} still={still} />)
            )}
          </p>
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-faint">{t("views.label")}</p>
        </div>
      </div>
    </Card>
  );
}
