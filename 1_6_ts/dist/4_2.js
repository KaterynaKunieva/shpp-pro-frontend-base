export class Cat {
    n;
    bool;
    constructor(n, bool) {
        this.n = n;
        this.bool = bool;
        this.n = n;
        this.bool = bool;
    }
    name() {
        return this.n;
    }
}
export class Dog {
    n;
    num;
    constructor(n, num) {
        this.n = n;
        this.num = num;
        this.n = n;
        this.num = num;
    }
    name() {
        return this.n;
    }
}
export default function hey(abstractPet) {
    return "hey! i'm " + abstractPet.name();
}
let a = new Cat("snizhok", true);
let b = new Dog("sirko", 333);
hey(a);
hey(b);
