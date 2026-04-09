import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  from?: number;
  to: number;
  separator?: string;
  direction?: "up" | "down";
  duration?: number;
  className?: string;
  startCounting?: boolean;
}

function Digit({ value, duration, direction }: { value: string; duration: number; direction: "up" | "down" }) {
  const isNum = /\d/.test(value);
  if (!isNum) return <span>{value}</span>;

  const num = parseInt(value, 10);
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <span
      className="inline-block overflow-hidden"
      style={{ height: "1.1em", verticalAlign: "text-bottom", lineHeight: "1.1em" }}
    >
      <span
        className="flex flex-col"
        style={{
          transform: `translateY(${direction === "up" ? -num * 1.1 : -(9 - num) * 1.1}em)`,
          transition: `transform ${duration}s cubic-bezier(0.25, 1, 0.5, 1)`,
          willChange: "transform",
        }}
      >
        {(direction === "up" ? digits : [...digits].reverse()).map((d) => (
          <span
            key={d}
            style={{ display: "block", height: "1.1em", lineHeight: "1.1em", textAlign: "center" }}
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function CountUp({
  from = 0,
  to,
  separator = "",
  direction = "up",
  duration = 1,
  className = "",
  startCounting = true,
}: CountUpProps) {
  const [display, setDisplay] = useState(from);
  const triggered = useRef(false);

  useEffect(() => {
    if (!startCounting || triggered.current) return;
    triggered.current = true;

    const start = performance.now();
    const diff = to - from;

    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + diff * eased));
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [startCounting, from, to, duration]);

  const formatted = separator
    ? display.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    : display.toString();

  return (
    <span className={`inline-flex items-baseline tabular-nums ${className}`}>
      {formatted.split("").map((ch, i) => (
        <Digit key={i} value={ch} duration={duration} direction={direction} />
      ))}
    </span>
  );
}
