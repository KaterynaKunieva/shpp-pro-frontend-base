export default function hey(a) {
    return "hey! i'm " + a.name();
}
hey({ name: () => "roman", cuteness: 100 });
hey({ name: () => "vasyl", coolness: 100 });
