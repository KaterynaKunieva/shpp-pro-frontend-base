// 6.
async function world(a: number): Promise<string> {
  return "*".repeat(a);
}
export const hello = async (): Promise<string> => {
  return await world(10);
};
