export const trimOrNull = (value: string | undefined | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
};

export const trimOrDefault = (value: string | undefined | null, defaultValue: string): string => {
  const trimmed = trimOrNull(value);
  return trimmed ?? defaultValue;
};
