import { getFirstWord } from "./1.js";
import { getUserNamings } from "./2.js";
import { getAllProductNames } from "./3.js";
import heyFirst from "./4_1.js";
import heySecond, { Cat, Dog } from "./4_2.js";
import heyThird from "./4_3.js";
import { stringEntries } from "./5.js";
import { hello } from "./6.js";
import { summ } from "./main.js";
console.log("Main");
console.log(summ({
    hello: { cvalue: 1 },
    world: { cvalue: { yay: { cvalue: "2" } } },
})); // 3
console.log(summ({
    hello: { cvalue: 0 },
    world: { cvalue: { yay: { cvalue: "0" } } },
})); // 0
console.log(summ({
    hello: { cvalue: 1 },
    world: { cvalue: { yay: { cvalue: "invalid" } } },
})); // 2022
console.log(summ({
    hello: { cvalue: 1 },
    world: { cvalue: { yay: { cvalue: "" } } },
})); // 2022
console.log(summ({
    hello: { cvalue: 1 },
    world: { cvalue: { yay: { cvalue: "  " } } },
})); // 2022
console.log(summ({
    hello: { cvalue: 1 },
    test: undefined,
})); // 2022
console.log(summ({
    hello: { cvalue: 1 },
    test: {
        cvalue: undefined,
    },
})); // 2022
console.log(summ({
    hello: { cvalue: 1 },
    test: {
        cvalue: Number.POSITIVE_INFINITY,
    },
})); // 2022
console.log(summ({
    hello: { cvalue: 0.5 },
    world: { cvalue: { yay: { cvalue: "300" } } },
})); // 300.5
console.log("\n");
console.log("Task #1");
console.log(getFirstWord("It is task 1"));
console.log("\n");
console.log("Task #2");
console.log(getUserNamings({
    name: "Name",
    surname: "Surname",
}));
console.log("\n");
console.log("Task #3");
console.log(getAllProductNames({
    products: [{ name: "prod1" }, { name: "prod2" }],
}));
console.log("\n");
console.log("Task #4_1");
console.log(heyFirst({ name: () => "roman", cuteness: 100 }));
console.log(heyFirst({ name: () => "vasyl", coolness: 100 }));
console.log("\n");
console.log("Task #4_2");
let a = new Cat("snizhok", true);
let b = new Dog("sirko", 333);
console.log(heySecond(a));
console.log(heySecond(b));
console.log("\n");
console.log("Task #4_3");
console.log(heyThird({ name: () => "snizhok", type: "cat", cuteness: 100 }));
console.log(heyThird({ name: () => "sirko", type: "dog", coolness: 100 }));
console.log("\n");
console.log("Task #5");
console.log(stringEntries(["array", "b", "c"]));
console.log(stringEntries({ record: 1, b: 2, c: "3" }));
console.log("\n");
console.log("Task #6");
hello()
    .then((r) => console.log(r))
    .catch((e) => console.log("fail"));
