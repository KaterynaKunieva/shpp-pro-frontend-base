interface SumObject {
  [key: string]:
    | { cvalue: number | string | SumObject | undefined }
    | undefined;
}

function summ(a: SumObject): number {
  return Object.values(a).reduce((sum, elem) => {
    const cvalue = elem?.cvalue;

    if (typeof cvalue === "object") return sum + summ(cvalue);
    else if (
      (typeof cvalue === "number" ||
        (typeof cvalue === "string" && cvalue.trim() !== "")) &&
      Number.isFinite(+cvalue)
    )
      return sum + Number(cvalue);
    return sum + 2021;
  }, 0);
}

export { summ };
