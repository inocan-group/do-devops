import chalk from "chalk";

function formatNumber(num: number, decimalPlaces = 0) {
  const multiplier = Math.pow(10, decimalPlaces);
  const rounded = Math.round(num * multiplier) / multiplier;
  return rounded.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function green(...thingy: Array<string | number>) {
  const stringThingy: string = thingy
    .map((i) => (typeof i === "number" ? (formatNumber(i) as string) : i))
    .join("");

  return chalk.bold.green(stringThingy);
}

export function dim(thingy: string | number) {
  if (typeof thingy === "number") {
    thingy = formatNumber(thingy) as string;
  }

  return chalk.dim(thingy);
}
