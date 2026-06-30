// 4.3
interface Pet {
  name: () => string;
}
interface Cat extends Pet {
  type: "cat";
  cuteness: number;
}
interface Dog extends Pet {
  type: "dog";
  coolness: number;
}
type CatOrDog = Cat | Dog;

export default function hey(a: CatOrDog) {
  return (
    "hey! i'm " +
    a.name() +
    (a.type === "cat" ? "cuteness: " + a.cuteness : "coolness: " + a.coolness)
  );
}
hey({ name: () => "snizhok", type: "cat", cuteness: 100 });
hey({ name: () => "sirko", type: "dog", coolness: 100 });
