// 6.
async function world(a) {
    return "*".repeat(a);
}
export const hello = async () => {
    return await world(10);
};
