import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BentoCard } from "@/components/BentoCard";
import { timelineJobExperiences, timelineAcademicExperiences } from "@/constants/timelineData";
import {
  FiBriefcase,
  FiBook,
  FiCalendar,
  FiMapPin,
  FiFileText,
} from "react-icons/fi";
import { CardHeader } from "@/components/CardHeader";
import { fadeUpSoft } from "@/lib/animations";
import { useFlipLock } from "@/hooks/useFlipLock";
const CARD = "rounded-2xl bg-white dark:bg-[#181818]";
const ACCENT = "#3d72cc";

/**
 * Props for TimelineCard component
 * @interface TimelineCardProps
 * @property {boolean} isDark - Dark mode flag
 */
interface TimelineCardProps {
  isDark: boolean;
}

/**
 * Format date range for display
 */
const formatDateRange = (startDate: string, endDate: string | null): string => {
  const start = new Date(startDate);
  const startYear = start.getFullYear();
  const startMonth = start.toLocaleDateString("en-US", { month: "short" });

  if (!endDate) {
    return `${startMonth} ${startYear} - Present`;
  }

  const end = new Date(endDate);
  const endYear = end.getFullYear();
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });

  if (startYear === endYear) {
    return `${startMonth} - ${endMonth} ${startYear}`;
  }

  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
};

/**
 * TimelineCard - Displays career timeline with job and academic experiences
 * Flipable between work and education, with hover tooltips
 * Filters experiences by showInTimeline field to hide low-value items
 * @component
 * @param {TimelineCardProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const TimelineCard = React.memo(function TimelineCard({
  isDark,
}: TimelineCardProps) {
  const [showAcademic, setShowAcademic] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { runWithFlipLock } = useFlipLock(700);

  const handleFlip = () => {
    runWithFlipLock(() => {
      setShowAcademic((prev) => !prev);
      setHoveredIndex(null);
    });
  };

  const handleViewCV = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open("/cv", "_blank");
  };

  // Use timeline-specific data
  const filteredJobExperiences = timelineJobExperiences;
  const filteredAcademicExperiences = timelineAcademicExperiences;

  return (
    <BentoCard
      className="cursor-pointer relative z-10 overflow-hidden h-full"
      onClick={handleFlip}
      allowOverflow={true}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: showAcademic ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT - Job Experiences */}
        <div
          className={`absolute inset-0 flex flex-col p-4 ${CARD} rounded-2xl`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <motion.div
            custom={10}
            variants={fadeUpSoft}
            initial="hidden"
            animate="show"
            className="h-full flex flex-col"
          >
            {/* Header */}
            <div className="mb-3 shrink-0" onClick={handleFlip}>
              <CardHeader
                icon={<FiBriefcase size={11} style={{ color: ACCENT }} />}
                title="Work Experience"
                flipLabel="education"
                onFlip={handleFlip}
              />
            </div>

            {/* Timeline */}
            <div className="flex-1 flex flex-col relative">
              {/* Vertical line */}
              <div
                className="absolute left-[7px] top-2 bottom-[54px] w-[2px]"
                style={{
                  background: isDark
                    ? "linear-gradient(to bottom, #3d72cc 0%, #3d72cc 70%, transparent 100%)"
                    : "linear-gradient(to bottom, #3d72cc 0%, #3d72cc 70%, transparent 100%)",
                }}
              />

              {/* Timeline Items */}
              <div className="flex-1 min-h-0 flex flex-col justify-between gap-2.5">
                {filteredJobExperiences.map((job, i) => (
                  <div
                    key={i}
                    className="relative"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
                      className="flex gap-3 relative"
                    >
                      {/* Dot */}
                      <div className="relative z-10 shrink-0">
                        <div
                          className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                          style={{
                            backgroundColor: isDark ? "#181818" : "#fff",
                            borderColor:
                              job.endDate === null
                                ? ACCENT
                                : isDark
                                  ? "#555"
                                  : "#ccc",
                            transform:
                              hoveredIndex === i ? "scale(1.2)" : "scale(1)",
                          }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor:
                                job.endDate === null
                                  ? ACCENT
                                  : isDark
                                    ? "#555"
                                    : "#ccc",
                            }}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-[12px] font-bold text-[#111] dark:text-[#eee] leading-tight truncate">
                            {job.position}
                          </p>
                          {job.endDate === null && (
                            <span
                              className="text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0"
                              style={{
                                color: ACCENT,
                                backgroundColor: `${ACCENT}15`,
                              }}
                            >
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#888] dark:text-[#666] leading-tight mb-1">
                          {job.company}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-[#aaa] dark:text-[#555]">
                          <span className="flex items-center gap-1">
                            <FiCalendar size={8} />
                            {formatDateRange(job.startDate, job.endDate)}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Tooltip on hover */}
                    <AnimatePresence>
                      {hoveredIndex === i && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-8 top-full mt-2 z-[9999] pointer-events-none w-[250px] sm:w-[290px]"
                        >
                          <div
                            className="rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)] border backdrop-blur-sm"
                            style={{
                              backgroundColor: isDark ? "#1a1a1a" : "#fff",
                              borderColor: isDark ? "#333" : "#e5e5e5",
                            }}
                          >
                            {/* Logo + Location + Type */}
                            <div className="flex items-center gap-2 mb-1.5">
                              {job.logo && (
                                <img
                                  src={job.logo}
                                  alt={job.company}
                                  className="w-6 h-6 rounded object-contain shrink-0 bg-white dark:bg-[#252525] p-0.5"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              )}
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <FiMapPin
                                  size={10}
                                  className="text-[#888] dark:text-[#666] shrink-0"
                                />
                                <p className="text-[11px] text-[#888] dark:text-[#666] truncate">
                                  {job.location}
                                </p>
                                <span className="text-[10px] text-[#ccc] dark:text-[#444]">
                                  •
                                </span>
                                <p className="text-[11px] text-[#888] dark:text-[#666] capitalize">
                                  {job.type}
                                </p>
                              </div>
                            </div>
                            <p className="text-[11px] text-[#666] dark:text-[#888] leading-relaxed mb-2 line-clamp-4">
                              {job.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {job.technologies.slice(0, 4).map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-2 py-0.5 rounded-md"
                                  style={{
                                    backgroundColor: isDark
                                      ? "#252525"
                                      : "#f5f5f5",
                                    color: isDark ? "#888" : "#666",
                                  }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Connected footer action */}
              <div className="mt-3 pt-2.5 border-t border-[#ebebeb] dark:border-[#2a2a2a]">
                <button
                  onClick={handleViewCV}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-[11px] font-semibold transition-all hover:translate-y-[-1px]"
                  style={{
                    backgroundColor: `${ACCENT}15`,
                    color: ACCENT,
                    border: `1.5px solid ${ACCENT}35`,
                  }}
                  title="Ver CV completo"
                >
                  <span className="inline-flex items-center gap-2">
                    <FiFileText size={12} />
                    Ver CV Completo
                  </span>
                  <span className="text-[12px] leading-none">→</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BACK - Academic Experiences */}
        <div
          className={`absolute inset-0 flex flex-col p-4 ${CARD} rounded-2xl`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <motion.div
            custom={10}
            variants={fadeUpSoft}
            initial="hidden"
            animate="show"
            className="h-full flex flex-col"
          >
            {/* Header */}
            <div className="mb-3 shrink-0" onClick={handleFlip}>
              <CardHeader
                icon={<FiBook size={11} style={{ color: "#22c55e" }} />}
                title="Education"
                flipLabel="work"
                flipDirection="left"
                onFlip={handleFlip}
              />
            </div>

            {/* Timeline */}
            <div className="flex-1 flex flex-col relative">
              {/* Vertical line */}
              <div
                className="absolute left-[7px] top-2 bottom-[54px] w-[2px]"
                style={{
                  background: isDark
                    ? "linear-gradient(to bottom, #22c55e 0%, #22c55e 70%, transparent 100%)"
                    : "linear-gradient(to bottom, #22c55e 0%, #22c55e 70%, transparent 100%)",
                }}
              />

              {/* Timeline Items */}
              <div className="flex-1 min-h-0 flex flex-col justify-between gap-2.5">
                {filteredAcademicExperiences.map((edu, i) => (
                  <div
                    key={i}
                    className="relative"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
                      className="flex gap-3 relative"
                    >
                      {/* Dot */}
                      <div className="relative z-10 shrink-0">
                        <div
                          className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                          style={{
                            backgroundColor: isDark ? "#181818" : "#fff",
                            borderColor:
                              edu.endDate === null
                                ? "#22c55e"
                                : isDark
                                  ? "#555"
                                  : "#ccc",
                            transform:
                              hoveredIndex === i ? "scale(1.2)" : "scale(1)",
                          }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor:
                                edu.endDate === null
                                  ? "#22c55e"
                                  : isDark
                                    ? "#555"
                                    : "#ccc",
                            }}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-[12px] font-bold text-[#111] dark:text-[#eee] leading-tight truncate">
                            {edu.degree}
                          </p>
                          {edu.endDate === null && (
                            <span
                              className="text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0"
                              style={{
                                color: "#22c55e",
                                backgroundColor: "#22c55e15",
                              }}
                            >
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#888] dark:text-[#666] leading-tight mb-1">
                          {edu.institution}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-[#aaa] dark:text-[#555]">
                          <span className="flex items-center gap-1">
                            <FiCalendar size={8} />
                            {formatDateRange(edu.startDate, edu.endDate)}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Tooltip on hover */}
                    <AnimatePresence>
                      {hoveredIndex === i && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-8 top-full mt-2 z-[9999] pointer-events-none w-[250px] sm:w-[290px]"
                        >
                          <div
                            className="rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)] border backdrop-blur-sm"
                            style={{
                              backgroundColor: isDark ? "#1a1a1a" : "#fff",
                              borderColor: isDark ? "#333" : "#e5e5e5",
                            }}
                          >
                            {/* Logo + Location + Field */}
                            <div className="flex items-center gap-2 mb-1.5">
                              {edu.logo && (
                                <img
                                  src={edu.logo}
                                  alt={edu.institution}
                                  className="w-6 h-6 rounded object-contain shrink-0 bg-white dark:bg-[#252525] p-0.5"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              )}
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <FiMapPin
                                  size={10}
                                  className="text-[#888] dark:text-[#666] shrink-0"
                                />
                                <p className="text-[11px] text-[#888] dark:text-[#666] truncate">
                                  {edu.location}
                                </p>
                                <span className="text-[10px] text-[#ccc] dark:text-[#444]">
                                  •
                                </span>
                                <p className="text-[11px] text-[#888] dark:text-[#666]">
                                  {edu.field}
                                </p>
                              </div>
                            </div>
                            {edu.description && (
                              <p className="text-[11px] text-[#666] dark:text-[#888] leading-relaxed mb-2 line-clamp-4">
                                {edu.description}
                              </p>
                            )}
                            {edu.highlights && (
                              <div className="flex flex-wrap gap-1">
                                {edu.highlights
                                  .slice(0, 4)
                                  .map((highlight, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] px-2 py-0.5 rounded-md"
                                      style={{
                                        backgroundColor: isDark
                                          ? "#252525"
                                          : "#f5f5f5",
                                        color: isDark ? "#888" : "#666",
                                      }}
                                    >
                                      {highlight}
                                    </span>
                                  ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Connected footer action */}
              <div className="mt-3 pt-2.5 border-t border-[#ebebeb] dark:border-[#2a2a2a]">
                <button
                  onClick={handleViewCV}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-[11px] font-semibold transition-all hover:translate-y-[-1px]"
                  style={{
                    backgroundColor: "#22c55e15",
                    color: "#22c55e",
                    border: "1.5px solid #22c55e35",
                  }}
                  title="Ver CV completo"
                >
                  <span className="inline-flex items-center gap-2">
                    <FiFileText size={12} />
                    Ver CV Completo
                  </span>
                  <span className="text-[12px] leading-none">→</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </BentoCard>
  );
});
