/**
 * Formats validity months into a human-readable string
 * Examples:
 * - 1 → "1 month"
 * - 3 → "3 months"
 * - 12 → "1 year"
 * - 13 → "1 year 1 month"
 * - 24 → "2 years"
 * - 25 → "2 years 1 month"
 */
export function formatValidity(months: number): string {
  if (!months || months < 1) {
    return 'Invalid';
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  }

  if (remainingMonths > 0) {
    parts.push(`${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`);
  }

  return parts.join(' ') || 'Invalid';
}

