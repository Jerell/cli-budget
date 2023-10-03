export const cutoffText = (t: string, chars = 25) =>
  t.length <= chars ? t : t.slice(0, chars) + "...";
