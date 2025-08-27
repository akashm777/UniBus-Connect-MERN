// Simple normalizer for stop/location names (trim, collapse spaces, case-insensitive key)
export const normalizeStop = (s = "") =>
  s
    .toString()
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
