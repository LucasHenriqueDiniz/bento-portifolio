/**
 * Format a date range from YYYY-MM format
 * @param startDate - Start date in YYYY-MM format
 * @param endDate - End date in YYYY-MM format or null for current
 * @returns Formatted date range string
 */
export const formatDateRange = (startDate: string, endDate: string | null | undefined): string => {
  const start = new Date(startDate + "-01"); // Add day for valid date parsing
  const startYear = start.getFullYear();
  const startMonth = start.toLocaleDateString("en-US", { month: "short" });

  if (!endDate) {
    return `${startMonth} ${startYear} - Present`;
  }

  const end = new Date(endDate + "-01");
  const endYear = end.getFullYear();
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });

  if (startYear === endYear) {
    return `${startMonth} - ${endMonth} ${startYear}`;
  }

  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
};
