// 6.
async function world(a) {
    return "*".repeat(a);
}
export const hello = async () => {
    return await world(10);
};
hello()
    .then((r) => console.log(r))
    .catch((e) => console.log("fail"));
