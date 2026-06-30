// 5.
export function stringEntries(a) {
    return Array.isArray(a) ? a : Object.keys(a);
}
