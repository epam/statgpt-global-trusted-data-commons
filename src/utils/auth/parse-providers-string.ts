export const parseCommaSeparatedList = (
  str: string | undefined,
  defaultValue: string[] = [],
): string[] => str?.split(',').map((str) => str.trim()) ?? defaultValue;
