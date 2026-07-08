// lib/achievements-utils.ts
export const getText = (value?: string | null, fallback = "") => {
  if (!value || !String(value).trim()) return fallback;
  return String(value).trim();
};

export const normalizeUrl = (url?: string | null) => {
  if (!url) return "";

  const trimmed = url.trim();

  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

export const formatDateRange = (startDate?: string, endDate?: string) => {
  const start = getText(startDate);
  const end = getText(endDate);

  if (start && end) return `${start} — ${end}`;
  if (start && !end) return `${start} — Present`;
  if (!start && end) return end;

  return "";
};