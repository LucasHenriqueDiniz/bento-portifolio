import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/Card";
import { PortalTooltip } from "@/components/PortalTooltip";
import {
  timelineJobExperiences,
  timelineAcademicExperiences,
} from "@/constants/timelineData";
import { certificates } from "@/constants/academicExperiences";
import {
  FiBriefcase,
  FiBook,
  FiCalendar,
  FiMapPin,
  FiFileText,
  FiAward,
  FiExternalLink,
} from "react-icons/fi";
import { CardHeader } from "@/components/CardHeader";
import { fadeUpSoft } from "@/lib/animations";
import { useFlipLock } from "@/hooks/useFlipLock";

const ACCENT = "var(--accent)";
const GREEN = "var(--status-completed)";

const formatDateRange = (
  startDate: string,
  endDate: string | null,
  locale: string,
  presentLabel: string
): string => {
  const start = new Date(startDate);
  const startYear = start.getFullYear();
  const startMonth = start.toLocaleDateString(locale, { month: "short" });

  if (!endDate) {
    return `${startMonth} ${startYear} — ${presentLabel}`;
  }

  const end = new Date(endDate);
  const endYear = end.getFullYear();
  const endMonth = end.toLocaleDateString(locale, { month: "short" });

  if (startYear === endYear) {
    return `${startMonth} — ${endMonth} ${startYear}`;
  }

  return `${startMonth} ${startYear} — ${endMonth} ${endYear}`;
};

interface TimelineCardProps {
  isDark: boolean;
}

export const TimelineCard = React.memo(function TimelineCard({
  isDark,
}: TimelineCardProps) {
  const { t, i18n } = useTranslation("home");
  const currentLang = i18n.language?.split("-")[0] || "pt";
  const dateLocale = currentLang === "en" ? "en-US" : "pt-BR";
  const [flipped, setFlipped] = useState(false);
  const { runWithFlipLock } = useFlipLock(700);
  const scrollFrontRef = useRef<HTMLDivElement>(null);
  const scrollBackRef = useRef<HTMLDivElement>(null);

  const handleFlip = () => {
    runWithFlipLock(() => {
      setFlipped((prev) => !prev);
    });
  };

  const handleViewCV = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open("/resume", "_blank");
  };

  const jobs = timelineJobExperiences;
  const education = timelineAcademicExperiences;

  const handleWheel = (e: React.WheelEvent, ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    ref.current.scrollTop += e.deltaY;
    e.preventDefault();
  };

  return (
    <Card
      className="cursor-pointer h-full"
      onClick={handleFlip}
      allowOverflow={true}
      glowColor="var(--accent-glow)"
      flipAngle={flipped ? 180 : 0}
    >
      <div
        className="relative w-full h-full transition-transform"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)",
        }}
      >
        {/* FRONT — Work */}
        <div
          className="absolute inset-0 flex flex-col p-3.5 bg-panel rounded-2xl"
          style={{ backfaceVisibility: "hidden" }}
          onWheel={(e) => handleWheel(e, scrollFrontRef)}
        >
          <motion.div
            custom={10}
            variants={fadeUpSoft}
            initial="hidden"
            animate="show"
            className="h-full flex flex-col"
          >
            <CardHeader
              icon={<FiBriefcase size={11} style={{ color: ACCENT }} />}
              title={t("timeline.workTitle")}
              flipLabel={t("timeline.flipEducation")}
              onFlip={handleFlip}
            />

            <div ref={scrollFrontRef} className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-0.5 mt-2 -mx-1 px-1">
              <div className="flex flex-col gap-2">
                {jobs.map((job, i) => (
                  <PortalTooltip
                    key={job.id}
                    width={320}
                    placement="right"
                    offsetX={4}
                    content={
                      <div>
                        <div className="flex items-start gap-3">
                          {job.logo ? (
                            <img
                              src={job.logo}
                              alt={job.company}
                              className="w-10 h-10 rounded-lg object-cover shrink-0 bg-field border border-base"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-field flex items-center justify-center shrink-0">
                              <FiBriefcase size={16} style={{ color: ACCENT }} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-bold text-main leading-tight">
                              {job.position}
                            </p>
                            <p className="text-[12px] text-faint mt-0.5">
                              {job.company}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <FiMapPin size={11} className="text-faint" />
                              <span className="text-[11px] text-faint">{job.location}</span>
                              <span className="text-[11px] text-faint">•</span>
                              <span className="text-[11px] text-faint capitalize">{job.type}</span>
                            </div>
                          </div>
                        </div>
                        {job.description && (
                          <p className="text-[12px] text-sub leading-relaxed mt-2.5 border-t border-base pt-2 line-clamp-4">
                            {job.description}
                          </p>
                        )}
                        {job.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {job.technologies.slice(0, 6).map((tech) => (
                              <span
                                key={tech}
                                className="text-[11px] px-2 py-0.5 rounded-md font-medium"
                                style={{
                                  backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#f0f0f0",
                                  color: isDark ? "#aaa" : "#555",
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    }
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.06, duration: 0.3 }}
                      className="flex gap-2.5 p-2 rounded-xl border border-transparent hover:border-base hover:bg-panel-hover transition-all"
                    >
                      <div className="shrink-0 mt-0.5">
                        {job.logo ? (
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-field border border-base flex items-center justify-center">
                            <img src={job.logo} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-field flex items-center justify-center">
                            <FiBriefcase size={14} style={{ color: ACCENT }} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[11px] font-bold text-main leading-tight truncate">
                            {job.position}
                          </p>
                          {job.endDate === null && (
                            <span
                              className="text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0"
                              style={{ color: ACCENT, backgroundColor: `${ACCENT}15` }}
                            >
                              {t("timeline.present")}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-faint leading-tight mt-0.5 truncate">
                          {job.company}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <FiCalendar size={8} className="text-faint" />
                          <span className="text-[9px] text-faint">
                            {formatDateRange(job.startDate, job.endDate, dateLocale, t("timeline.present"))}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {job.technologies.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="text-[9px] px-1.5 py-px rounded font-medium"
                              style={{
                                backgroundColor: isDark ? "var(--bg-elevated)" : "var(--bg-field)",
                                color: isDark ? "var(--text-faint)" : "var(--text-sub)",
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </PortalTooltip>
                ))}
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-base shrink-0">
              <button
                onClick={handleViewCV}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all hover:translate-y-[-1px]"
                style={{
                  backgroundColor: `${ACCENT}15`,
                  color: ACCENT,
                  border: `1.5px solid ${ACCENT}35`,
                }}
              >
                <span className="inline-flex items-center gap-2">
                  <FiFileText size={12} />
                  {t("timeline.viewFullCV")}
                </span>
                <span className="text-[12px] leading-none">→</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* BACK — Education & Certificates */}
        <div
          className="absolute inset-0 flex flex-col p-3.5 bg-panel rounded-2xl"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          onWheel={(e) => handleWheel(e, scrollBackRef)}
        >
          <motion.div
            custom={10}
            variants={fadeUpSoft}
            initial="hidden"
            animate="show"
            className="h-full flex flex-col"
          >
            <CardHeader
              icon={<FiBook size={11} style={{ color: GREEN }} />}
              title={t("timeline.educationTitle")}
              flipLabel={t("timeline.flipWork")}
              flipDirection="left"
              onFlip={handleFlip}
            />

            <div ref={scrollBackRef} className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-0.5 mt-2 -mx-1 px-1">
              <div className="flex flex-col gap-2 mb-3">
                {education.map((edu, i) => (
                  <PortalTooltip
                    key={edu.id}
                    width={320}
                    placement="right"
                    offsetX={4}
                    content={
                      <div>
                        <div className="flex items-start gap-3">
                          {edu.logo ? (
                            <img
                              src={edu.logo}
                              alt={edu.institution}
                              className="w-10 h-10 rounded-lg object-cover shrink-0 bg-field border border-base"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-field flex items-center justify-center shrink-0">
                              <FiBook size={16} style={{ color: GREEN }} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-bold text-main leading-tight">
                              {edu.degree}
                            </p>
                            <p className="text-[10px] text-faint mt-0.5">
                              {edu.institution}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <FiMapPin size={9} className="text-faint" />
                              <span className="text-[9px] text-faint">{edu.location}</span>
                              <span className="text-[9px] text-faint">•</span>
                              <span className="text-[9px] text-faint">{edu.field}</span>
                            </div>
                          </div>
                        </div>
                        {edu.description && (
                          <p className="text-[10px] text-sub leading-relaxed mt-2.5 border-t border-base pt-2 line-clamp-4">
                            {edu.description}
                          </p>
                        )}
                        {edu.highlights && edu.highlights.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {edu.highlights.slice(0, 6).map((h) => (
                              <span
                                key={h}
                                className="text-[9px] px-2 py-0.5 rounded-md font-medium"
                                style={{
                                  backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#f0f0f0",
                                  color: isDark ? "#aaa" : "#555",
                                }}
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    }
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.06, duration: 0.3 }}
                      className="flex gap-2.5 p-2 rounded-xl border border-transparent hover:border-base hover:bg-panel-hover transition-all"
                    >
                      <div className="shrink-0 mt-0.5">
                        {edu.logo ? (
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-field border border-base flex items-center justify-center">
                            <img src={edu.logo} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-field flex items-center justify-center">
                            <FiBook size={14} style={{ color: GREEN }} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[11px] font-bold text-main leading-tight truncate">
                            {edu.degree}
                          </p>
                          {edu.endDate === null && (
                            <span
                              className="text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0"
                              style={{ color: GREEN, backgroundColor: `${GREEN}15` }}
                            >
                              {t("timeline.present")}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-faint leading-tight mt-0.5 truncate">
                          {edu.institution}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <FiCalendar size={8} className="text-faint" />
                          <span className="text-[9px] text-faint">
                            {formatDateRange(edu.startDate, edu.endDate, dateLocale, t("timeline.present"))}
                          </span>
                        </div>
                        {edu.highlights && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {edu.highlights.slice(0, 2).map((h) => (
                              <span
                                key={h}
                                className="text-[9px] px-1.5 py-px rounded font-medium"
                                style={{
                                  backgroundColor: isDark ? "var(--bg-elevated)" : "var(--bg-field)",
                                  color: isDark ? "var(--text-faint)" : "var(--text-sub)",
                                }}
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </PortalTooltip>
                ))}
              </div>

              {/* Certificates */}
              <div className="border-t border-base pt-2">
                <p className="text-[9px] font-bold uppercase tracking-wider text-faint mb-2 flex items-center gap-1">
                  <FiAward size={9} />
                  {t("timeline.certificates", "Certificações")}
                </p>
                <div className="flex flex-col gap-1.5">
                  {certificates.filter(c => c.url).map((cert) => (
                    <a
                      key={cert.title}
                      href={cert.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-panel-hover transition-colors group"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-main truncate">
                          {cert.title}
                        </p>
                        <p className="text-[9px] text-faint">
                          {cert.issuer} · {cert.issueDate}
                        </p>
                      </div>
                      <FiExternalLink size={10} className="text-faint shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-base shrink-0">
              <button
                onClick={handleViewCV}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all hover:translate-y-[-1px]"
                style={{
                  backgroundColor: `${GREEN}15`,
                  color: GREEN,
                  border: `1.5px solid ${GREEN}35`,
                }}
              >
                <span className="inline-flex items-center gap-2">
                  <FiFileText size={12} />
                  {t("timeline.viewFullCV")}
                </span>
                <span className="text-[12px] leading-none">→</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </Card>
  );
});

export default TimelineCard;
