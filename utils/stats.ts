export const stats = (values: (number | undefined)[]) => {
  const withValues = values.filter((v) => !!v);
  const sorted = withValues.sort((a, b) => {
    return (a || 0) < (b || 0) ? -1 : 1;
  });
  const count = values.length;
  const total = withValues.reduce<number>((sum, item) => sum + (item || 0), 0);
  return {
    high: +(sorted.at(-1) || 0),
    low: +(sorted.at(0) || 0),
    avg: total / Math.max(withValues.length, 1),
    count: withValues.length,
    invalidCount: count - withValues.length,
  };
};

export type MeasureStats = ReturnType<typeof stats>;
