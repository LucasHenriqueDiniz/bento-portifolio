import React from "react";
import { useTranslation } from "react-i18next";
import { Monitor, Server } from "lucide-react";
import { FlippableCard } from "@/components/FlippableCard";
import { useGetMachinesStatusCached } from "@/hooks/usePortfolioQueries";
import { formatCount, formatPercent, formatTimeOfDay } from "@/lib/numberFormat";
import type { MachineStatus } from "@/lib/apiClient";

// A reading older than this is shown as a past measurement instead of a live status,
// so a cached payload never claims a machine is up right now.
const FRESH_READING_MS = 30 * 60 * 1000;

const METER_SEGMENTS = 10;
const TEMP_METER_FULL_SCALE_C = 100;
const FACEPLATE_SLITS = 16;

interface Metric {
  label: string;
  value: string;
  ratio: number;
}

const isRecentReading = (at: string | undefined) => {
  if (!at) return false;
  const timestamp = new Date(at).getTime();
  return Number.isFinite(timestamp) && Date.now() - timestamp < FRESH_READING_MS;
};

const clampRatio = (ratio: number) => Math.min(Math.max(ratio, 0), 1);

function SegmentMeter({ ratio }: { ratio: number }) {
  const filled = Math.max(Math.round(clampRatio(ratio) * METER_SEGMENTS), 1);

  return (
    <div className="flex flex-1 min-w-[28px] gap-[2px]" aria-hidden="true">
      {Array.from({ length: METER_SEGMENTS }, (_, index) => (
        <span
          key={index}
          className={`flex-1 h-[6px] rounded-[1px] ${index < filled ? "bg-brand" : ""}`}
          style={index < filled ? undefined : { backgroundColor: "var(--border-base)" }}
        />
      ))}
    </div>
  );
}

function MetricRow({ label, value, ratio }: Metric) {
  return (
    <div className="flex items-center gap-2">
      <dt className="font-mono text-[9px] uppercase tracking-wider text-faint w-[42px] shrink-0 truncate">
        {label}
      </dt>
      <SegmentMeter ratio={ratio} />
      <dd className="font-mono text-[10px] font-bold tabular-nums text-main shrink-0">{value}</dd>
    </div>
  );
}

export const MachinesCard = React.memo(function MachinesCard() {
  const { t, i18n } = useTranslation("home");
  const locale = i18n.language || "pt";
  const { data } = useGetMachinesStatusCached();

  const isLive = isRecentReading(data?.at);
  const readingTime = data?.at ? formatTimeOfDay(data.at, locale) : null;

  const buildMetrics = (machine: MachineStatus): Metric[] => {
    const metrics: Metric[] = [];
    if (machine.cpuPct !== null) {
      metrics.push({
        label: t("machines.cpu"),
        value: formatPercent(machine.cpuPct, locale),
        ratio: machine.cpuPct / 100,
      });
    } else if (machine.cpuTempC !== null) {
      metrics.push({
        label: t("machines.cpu"),
        value: `${formatCount(machine.cpuTempC, locale)} °C`,
        ratio: machine.cpuTempC / TEMP_METER_FULL_SCALE_C,
      });
    }
    if (machine.ramPct !== null) {
      metrics.push({
        label: t("machines.ram"),
        value: formatPercent(machine.ramPct, locale),
        ratio: machine.ramPct / 100,
      });
    }
    if (machine.gpuTempC !== null) {
      metrics.push({
        label: t("machines.gpu"),
        value: `${formatCount(machine.gpuTempC, locale)} °C`,
        ratio: machine.gpuTempC / TEMP_METER_FULL_SCALE_C,
      });
    } else if (machine.gpuPct !== null) {
      metrics.push({
        label: t("machines.gpu"),
        value: formatPercent(machine.gpuPct, locale),
        ratio: machine.gpuPct / 100,
      });
    }
    for (const disk of machine.disks) {
      metrics.push({
        label:
          machine.disks.length > 1
            ? `${t("machines.disk")} ${disk.name.toUpperCase()}`
            : t("machines.disk"),
        value: formatPercent(disk.usedPct, locale),
        ratio: disk.usedPct / 100,
      });
    }
    return metrics;
  };

  const machineFace = (machine: MachineStatus | null, emptyIcon: React.ReactNode) => {
    if (!machine) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="absolute h-14 w-14 rounded-full border border-ghost animate-ping [animation-duration:3s] opacity-40" />
            <span className="absolute h-14 w-14 rounded-full border border-ghost" />
            <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-field border border-base text-faint">
              {emptyIcon}
            </div>
          </div>
          <p className="font-mono text-[8px] text-faint">{t("machines.unavailable")}</p>
        </div>
      );
    }

    const metrics = buildMetrics(machine);

    return (
      <div className="flex-1 flex flex-col justify-between mt-2 min-h-0 overflow-hidden gap-2">
        <div className="rounded-lg border border-ghost bg-field px-2.5 py-2">
          <div className="flex items-center gap-[3px] overflow-hidden mb-2" aria-hidden="true">
            {Array.from({ length: FACEPLATE_SLITS }, (_, index) => (
              <span
                key={index}
                className="h-2.5 w-[2px] shrink-0 rounded-full"
                style={{ backgroundColor: "var(--border-base)" }}
              />
            ))}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="relative flex h-2 w-2 shrink-0 self-center">
              {machine.online && isLive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  machine.online
                    ? "bg-emerald-400 shadow-[0_0_6px_1px_rgba(52,211,153,0.65)]"
                    : "bg-neutral-500"
                }`}
              />
            </span>
            <p className="font-mono text-[15px] font-black uppercase tracking-tight leading-none text-main">
              {machine.online ? t("machines.online") : t("machines.offline")}
            </p>
            {machine.uptimeHours !== null && (
              <p className="font-mono text-[9px] text-faint ml-auto shrink-0">
                {t("machines.uptime")} {formatCount(Math.round(machine.uptimeHours), locale)} h
              </p>
            )}
          </div>
        </div>

        {metrics.length > 0 && (
          <dl className="space-y-1.5">
            {metrics.map((metric) => (
              <MetricRow key={metric.label} label={metric.label} value={metric.value} ratio={metric.ratio} />
            ))}
          </dl>
        )}

        {readingTime && (
          <p className="font-mono text-[8px] leading-none text-faint">
            {t("machines.lastReading", { time: readingTime })}
          </p>
        )}
      </div>
    );
  };

  return (
    <FlippableCard
      className="h-full"
      front={{
        title: t("machines.pcTitle"),
        icon: <span className="font-mono text-[9px] text-faint">▚</span>,
        content: machineFace(data?.pc ?? null, <Monitor size={16} />),
        flipLabel: t("machines.flipToServer"),
      }}
      back={{
        title: t("machines.serverTitle"),
        icon: <span className="font-mono text-[9px] text-faint">▤</span>,
        content: machineFace(data?.server ?? null, <Server size={16} />),
        flipLabel: t("machines.flipToPc"),
      }}
    />
  );
});

export default MachinesCard;
