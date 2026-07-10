interface SumObject {
  [key: string]:
    | { cvalue: number | string | SumObject | undefined }
    | undefined;
}

function summ(a: SumObject): number {
  const x: number[] = Object.keys(a).map((k) => {
    const elem = a[k];
    const cvalue = elem?.cvalue;
    if (
      (typeof cvalue === "number" ||
        (typeof cvalue === "string" && cvalue.trim() !== "")) &&
      Number.isFinite(+cvalue)
    )
      return +cvalue;
    else if (typeof cvalue === "object") return summ(cvalue);
    return 2021;
  });
  let sum = 0;
  for (let partialSum of x) {
    sum += partialSum;
  }
  return sum;
}

export { summ };
