function summ(a) {
    const x = Object.keys(a).map((k) => {
        const elem = a[k];
        if (typeof elem === "undefined")
            return 2021;
        const cvalue = elem.cvalue;
        if (typeof cvalue === "string" &&
            cvalue.trim() !== "" &&
            Number.isFinite(+cvalue))
            return +cvalue;
        if (typeof cvalue === "object")
            return summ(cvalue);
        if (typeof cvalue === "number" && Number.isFinite(cvalue))
            return cvalue;
        return 2021;
    });
    let sum = 0;
    for (let partialSum of x) {
        sum += partialSum;
    }
    return sum;
}
export { summ };
