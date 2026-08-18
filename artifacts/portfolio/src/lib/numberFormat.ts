/**
 * Locale-aware number formatting shared by cards that display raw metrics.
 * The locale is the i18n language code ("pt" / "en"), which Intl resolves on its own.
 */

export const formatCount = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale).format(value);

export const formatPercent = (value: number, locale: string): string =>
  `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)}%`;

export const formatTimeOfDay = (isoTimestamp: string, locale: string): string | null => {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(date);
};
