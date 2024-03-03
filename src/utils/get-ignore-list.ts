export function getIgnoreList(obj: Record<string, string[]>): string[] {
  const ignoreList = Object.values(obj).flat();
  return Array.from(new Set(ignoreList));
}
