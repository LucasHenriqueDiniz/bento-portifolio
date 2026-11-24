import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/Card";
import { Odometer } from "@/components/Odometer";
import { projects } from "@/constants/projects";

const NAMES = projects.map((project) => project.name);
const HALF = Math.ceil(NAMES.length / 2);
// Two rows running at different speeds, each written twice so the loop has no seam.
const ROWS = [
  { names: NAMES.slice(0, HALF), seconds: 46 },
  { names: NAMES.slice(HALF), seconds: 58 },
];

/**
 * The way into the projects page: how many there are, over their names running by.
 */
export function ProjectsCard() {
  const { t } = useTranslation("home");
  const count = String(projects.length);

  return (
    <Card className="h-full overflow-hidden" glowColor="255, 200, 100" glowIntensity={1.6}>
      <a
        href="/projects"
        className="group relative flex h-full flex-col justify-between overflow-hidden p-3 text-white"
        style={{ backgroundColor: "var(--accent)" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/25" />

        <div className="relative flex items-start justify-between">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/80">{t("projectsCta.title")}</p>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 border border-white/25 transition-all duration-300 group-hover:bg-white group-hover:text-[var(--accent)]">
            <ArrowUpRight size={14} aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        <div className="relative">
          <p className="flex items-end gap-1.5 leading-none">
            <Odometer text={count} label={`${count} ${t("projectsCta.count")}`} className="text-[40px] font-black tracking-tight" />
            <span className="pb-1.5 text-[11px] font-semibold text-white/80">{t("projectsCta.count")}</span>
          </p>

          <div aria-hidden className="mt-2 -mx-3 space-y-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
            {ROWS.map((row, i) => (
              <div
                key={i}
                className="marquee-x flex w-max gap-1.5 group-hover:[animation-play-state:paused]"
                style={{ ["--marquee-dur" as string]: `${row.seconds}s`, animationDirection: i ? "reverse" : "normal" }}
              >
                {[...row.names, ...row.names].map((name, n) => (
                  <span key={n} className="whitespace-nowrap rounded-full bg-black/15 border border-white/15 px-2 py-0.5 text-[9px] font-semibold text-white/85">
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <p className="mt-2 text-[10px] text-white/80">{t("projectsCta.subtitle")}</p>
        </div>
      </a>
    </Card>
  );
}
