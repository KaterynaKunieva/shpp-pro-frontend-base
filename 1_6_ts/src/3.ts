// 3.
type Product = {
  name?: string;
};
type Products = {
  products?: Product[];
};
export function getAllProductNames(a: Products) {
  return a?.products?.map((prod) => prod?.name) || [];
}
