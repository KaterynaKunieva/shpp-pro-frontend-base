function summ(a) {
    return Object.values(a).reduce((sum, elem) => {
        const cvalue = elem?.cvalue;
        if (typeof cvalue === "object")
            return sum + summ(cvalue);
        else if ((typeof cvalue === "number" ||
            (typeof cvalue === "string" && cvalue.trim() !== "")) &&
            Number.isFinite(+cvalue))
            return sum + Number(cvalue);
        return sum + 2021;
    }, 0);
    // const x = Object.values(a).map((elem) => {
    //   const cvalue = elem?.cvalue;
    //   if (
    //     (typeof cvalue === "number" ||
    //       (typeof cvalue === "string" && cvalue.trim() !== "")) &&
    //     Number.isFinite(+cvalue)
    //   )
    //     return +cvalue;
    //   else if (typeof cvalue === "object") return summ(cvalue);
    //   return 2021;
    // });
    // return x.reduce((sum, cv) => sum + cv);
}
export { summ };
