export function getAllProductNames(a) {
    return a?.products?.map((prod) => prod?.name) || [];
}
