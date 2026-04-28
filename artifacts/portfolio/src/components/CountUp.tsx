import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
  minDigits?: number;
  springProfile?: "digital" | "smooth" | "bouncy";
  animationMode?: "step" | "smooth";
}

const SPRING_PROFILES = {
  digital: { damping: 30, stiffness: 200 },
  smooth: { damping: 20, stiffness: 100 },
  bouncy: { damping: 10, stiffness: 150 },
};

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
  minDigits,
  springProfile = "smooth",
  animationMode = "smooth",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  const springConfig = SPRING_PROFILES[springProfile] || SPRING_PROFILES.smooth;
  const springValue = useSpring(motionValue, springConfig);

  const isInView = useInView(ref, { once: true, margin: "0px" });

  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes(".")) {
      const decimals = str.split(".")[1];
      if (parseInt(decimals) !== 0) return decimals.length;
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = useCallback(
    (latest: number) => {
      const hasDecimals = maxDecimals > 0;
      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0,
      };
      let formattedNumber = Intl.NumberFormat("en-US", options).format(latest);
      if (separator) formattedNumber = formattedNumber.replace(/,/g, separator);
      
      if (minDigits !== undefined && minDigits > 0) {
        const [intPart, decPart] = formattedNumber.split(".");
        const paddedInt = intPart.padStart(minDigits, "0");
        formattedNumber = decPart ? `${paddedInt}.${decPart}` : paddedInt;
      }
      
      return formattedNumber;
    },
    [maxDecimals, separator, minDigits],
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(direction === "down" ? to : from);
    }
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === "function") onStart();

      if (animationMode === "step") {
        // Step animation: update immediately without spring
        const timeoutId = setTimeout(() => {
          motionValue.set(direction === "down" ? from : to);
        }, delay * 1000);
        const durationTimeoutId = setTimeout(() => {
          if (typeof onEnd === "function") onEnd();
        }, delay * 1000 + duration * 1000);
        return () => {
          clearTimeout(timeoutId);
          clearTimeout(durationTimeoutId);
        };
      } else {
        // Smooth spring animation
        const timeoutId = setTimeout(() => {
          motionValue.set(direction === "down" ? from : to);
        }, delay * 1000);
        const durationTimeoutId = setTimeout(() => {
          if (typeof onEnd === "function") onEnd();
        }, delay * 1000 + duration * 1000);
        return () => {
          clearTimeout(timeoutId);
          clearTimeout(durationTimeoutId);
        };
      }
    }
    return undefined;
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration, animationMode]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest: number) => {
      if (ref.current) ref.current.textContent = formatValue(latest);
    });
    return () => unsubscribe();
  }, [springValue, formatValue]);

  return <span className={className} ref={ref} />;
}
