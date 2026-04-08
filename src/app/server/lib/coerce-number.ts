export const coerceNumber = (value: unknown, fallback: number): number => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
};
