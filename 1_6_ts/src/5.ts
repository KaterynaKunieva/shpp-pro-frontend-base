// 5.
export function stringEntries(a: string[] | Record<string, any>): string[] {
  return Array.isArray(a) ? a : Object.keys(a);
}
