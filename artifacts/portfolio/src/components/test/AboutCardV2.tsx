import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SiGithub, SiInstagram } from "react-icons/si";
import { FiMail } from "react-icons/fi";
import { Linkedin } from "lucide-react";
import { Card } from "@/components/Card";
import { ContactLinks } from "@/constants/contacts";

const SOCIALS = [
  { name: "GitHub", href: ContactLinks.github, icon: SiGithub },
  { name: "LinkedIn", href: ContactLinks.linkedin, icon: Linkedin },
  { name: "Instagram", href: ContactLinks.instagram, icon: SiInstagram },
  { name: "Email", href: `mailto:${ContactLinks.email}`, icon: FiMail },
];

/** Types `text` out one character at a time; shows it whole when motion is reduced. */
function useTyped(text: string, still: boolean, startDelayMs = 500, stepMs = 34) {
  const [shown, setShown] = useState(still ? text.length : 0);
  useEffect(() => {
    if (still) {
      setShown(text.length);
      return;
    }
    setShown(0);
    let step: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      step = setInterval(() => setShown((n) => (n >= text.length ? n : n + 1)), stepMs);
    }, startDelayMs);
    return () => {
      clearTimeout(start);
      if (step) clearInterval(step);
    };
  }, [text, still, startDelayMs, stepMs]);
  return { typed: text.slice(0, shown), done: shown >= text.length };
}

/**
 * The introduction: the avatar inside a slowly turning accent ring, the role typed out,
 * the text rising in line by line, and the social links popping in last.
 */
export function AboutCardV2() {
  const { t } = useTranslation("home");
  const still = useReducedMotion() ?? false;
  const { typed, done } = useTyped(t("about.role"), still);
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <Card className="h-full rounded-2xl bg-panel border border-base" glowColor="var(--accent-glow)">
      <div className="h-full p-3 flex flex-col">
        <div className="flex items-center gap-2.5">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 15 }}
            className="relative h-11 w-11 shrink-0"
          >
            <span
              aria-hidden
              className={`absolute inset-0 rounded-full ${still ? "" : "animate-spin [animation-duration:7s]"}`}
              style={{ background: "conic-gradient(from 0deg, var(--accent), transparent 55%, var(--accent))" }}
            />
            <span className="absolute inset-[2px] rounded-full bg-field overflow-hidden flex items-center justify-center">
              <img src="/favicon-96x96.png" alt="" className="h-7 w-7 object-contain" />
            </span>
          </motion.div>
          <div className="min-w-0">
            <motion.p {...rise(0.12)} className="text-[15px] font-black leading-tight tracking-tight text-main">
              {t("about.greeting")} <span className="text-brand">{t("about.name")}</span>
            </motion.p>
            <p className="mt-0.5 h-[14px] text-[10px] text-faint whitespace-nowrap" aria-label={t("about.role")}>
              <span aria-hidden>{typed}</span>
              {!done && <span aria-hidden className="ml-px inline-block w-px h-[10px] align-middle bg-brand animate-pulse" />}
            </p>
          </div>
        </div>

        <motion.p {...rise(0.3)} className="mt-2.5 flex-1 text-[11px] leading-relaxed text-sub">
          {t("about.descriptionPrefix")}
          <a href="/projects" className="font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand">
            {t("about.codingLabel")}
          </a>
          {t("about.descriptionMiddle")}
          <a href="/gallery" className="font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand">
            {t("about.drawingLabel")}
          </a>
          {t("about.descriptionSuffix")}
        </motion.p>

        <ul className="flex gap-1.5">
          {SOCIALS.map(({ name, href, icon: Icon }, i) => (
            <motion.li
              key={name}
              initial={{ opacity: 0, scale: 0.4, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.07, type: "spring", stiffness: 300, damping: 18 }}
              className="flex-1"
            >
              <a
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={name}
                className="flex h-7 items-center justify-center rounded-lg border border-base bg-field text-sub transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:text-brand focus-visible:ring-2 focus-visible:ring-brand outline-none"
              >
                <Icon size={13} />
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
