import { motion, useReducedMotion } from "framer-motion";

const DIGIT_EM = 1.05;

/** One digit: a strip of 0-9 that rolls up to the digit it shows. */
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

interface OdometerProps {
  /** The number already formatted for the reader's locale, e.g. "9.090". */
  text: string;
  /** What a screen reader says in place of the rolling digits. */
  label: string;
  className?: string;
}

/**
 * A number whose digits roll into place, one after another from the left. Separators
 * stay still. The rolling strips are hidden from screen readers, which get `label`.
 */
export function Odometer({ text, label, className = "" }: OdometerProps) {
  const still = useReducedMotion() ?? false;
  return (
    <span className={`inline-flex items-end tabular-nums ${className}`} role="img" aria-label={label}>
      {[...text].map((char, i) =>
        /\d/.test(char) ? (
          <Digit key={`${i}-${char}`} digit={Number(char)} index={i} still={still} />
        ) : (
          <span key={i} aria-hidden className="opacity-55">
            {char}
          </span>
        )
      )}
    </span>
  );
}
