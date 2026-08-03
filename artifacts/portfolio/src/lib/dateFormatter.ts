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
  const start = new Date(startDate + "-01"); // Add day for valid date parsing
  const startYear = start.getFullYear();
  const startMonth = start.toLocaleDateString(locale, { month: "short" });

  if (!endDate) {
    return `${startMonth} ${startYear} - ${presentLabel}`;
  }

  const end = new Date(endDate + "-01");
  const endYear = end.getFullYear();
  const endMonth = end.toLocaleDateString(locale, { month: "short" });

  if (startYear === endYear) {
    return `${startMonth} - ${endMonth} ${startYear}`;
  }

  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
};
