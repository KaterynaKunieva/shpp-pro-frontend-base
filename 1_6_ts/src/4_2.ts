// 4.2
interface Pet {
  name: () => string;
}
export class Cat implements Pet {
  constructor(
    private n: string,
    private bool: boolean,
  ) {
    this.n = n;
    this.bool = bool;
  }
  name() {
    return this.n;
  }
}
export class Dog implements Pet {
  constructor(
    private n: string,
    private num: number,
  ) {
    this.n = n;
    this.num = num;
  }
  name() {
    return this.n;
  }
}
export default function hey(abstractPet: Pet) {
  return "hey! i'm " + abstractPet.name();
}
let a = new Cat("snizhok", true);
let b = new Dog("sirko", 333);
hey(a);
hey(b);
