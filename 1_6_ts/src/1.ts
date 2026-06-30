// 1.
export function getFirstWord(a: string) {
  return a.split(/ +/)[0]?.length;
}
