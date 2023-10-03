export const cutoffText = (t: string, limit = 25) =>
  t.length <= limit ? t : t.slice(0, limit - 1) + "...";
