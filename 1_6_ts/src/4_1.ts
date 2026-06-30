// 4.1
type Hero = {
  name: () => string;
};
export default function hey<T extends Hero>(a: T) {
  return "hey! i'm " + a.name();
}
hey({ name: () => "roman", cuteness: 100 });
hey({ name: () => "vasyl", coolness: 100 });
