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
