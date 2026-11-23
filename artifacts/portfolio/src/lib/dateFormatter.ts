/**
 * Format a date range from YYYY-MM format
 * @param startDate - Start date in YYYY-MM format
 * @param endDate - End date in YYYY-MM format or null for current
 * @param locale - BCP 47 locale used for the month names
 * @param presentLabel - Label used when there is no end date
 * @returns Formatted date range string
 */
export const formatDateRange = (
  startDate: string,
  endDate: string | null | undefined,
  locale = "en-US",
  presentLabel = "Present",
): string => {
  // Parsed and formatted in UTC so the month never shifts for visitors west of UTC.
  const start = new Date(`${startDate}-01T00:00:00Z`);
  const startYear = start.getUTCFullYear();
  const startMonth = start.toLocaleDateString(locale, { month: "short", timeZone: "UTC" });

  if (!endDate) {
    return `${startMonth} ${startYear} - ${presentLabel}`;
  }

  const end = new Date(`${endDate}-01T00:00:00Z`);
  const endYear = end.getUTCFullYear();
  const endMonth = end.toLocaleDateString(locale, { month: "short", timeZone: "UTC" });

  if (startYear === endYear) {
    return `${startMonth} - ${endMonth} ${startYear}`;
  }

  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
};

const RELATIVE_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

/**
 * How long ago a moment was, in the visitor's language ("há 3 dias", "yesterday").
 * Anything under a minute reads as "now"; a missing timestamp gives null.
 */
export const formatTimeAgo = (
  timestampMs: number | null | undefined,
  locale = "en-US",
  now = Date.now(),
): string | null => {
  if (!timestampMs) return null;
  const seconds = Math.max(0, Math.floor((now - timestampMs) / 1000));
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  for (const [unit, size] of RELATIVE_UNITS) {
    if (seconds >= size) return rtf.format(-Math.floor(seconds / size), unit);
  }
  return rtf.format(0, "second");
};
