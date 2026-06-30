export default function hey(a) {
    return ("hey! i'm " +
        a.name() +
        (a.type === "cat" ? "cuteness: " + a.cuteness : "coolness: " + a.coolness));
}
hey({ name: () => "snizhok", type: "cat", cuteness: 100 });
hey({ name: () => "sirko", type: "dog", coolness: 100 });
