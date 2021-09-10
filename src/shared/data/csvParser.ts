export type NumericString = `${number}`;

/**
 * Either a number or a string version of a number
 */
export type NumberLike = number | NumericString;

export interface ICsvParserOptions {
  /** by default the parsed result sets a "name" property but this can be changed */
  nameProp?: string;
  /** by default the parsed result sets a "value" property but this can be changed */
  valueProp?: string;
}

function booleanChecker<T extends any>(v: T): T extends "true" | "false" | boolean ? boolean : T {
  return (v === "true" ? true : v === "false" ? false : v) as T extends "true" | "false" | boolean
    ? boolean
    : T;
}

function numericChecker<T extends any>(v: T): T extends NumberLike ? number : T {
  return (Number.isNaN(Number(v)) ? v : Number(v)) as T extends NumberLike ? number : T;
}

function arrayChecker<T extends any>(v: T): T extends `[${string}]` ? any[] : T {
  return (
    typeof v === "string" && v.startsWith("[") && v.endsWith("]")
      ? v
          .replace(/(\[])/g, "")
          .trim()
          .split("|")
          .map((i) => booleanChecker(numericChecker(i)))
      : v
  ) as T extends `[${string}]` ? any[] : T;
}

function prepArrayValues(input: string) {
  const re = /\[([^\]]*)]/g;
  const matches = [...input.matchAll(re)].map((i) => i[0]);

  for (const match of matches) {
    input = input.replace(match, match.replace(/,\s*/g, "|"));
  }

  return input;
}

/**
 * Takes a string input and parses it into a name/value pair
 */
export function csvParser<T extends {} = { name: string; value: string | number | boolean }>(
  input: string,
  options: ICsvParserOptions = {}
): T {
  const props = {
    nameProp: "name",
    valueProp: "value",
    ...options,
  };

  input = prepArrayValues(input);

  return input.split(/,\s*/).map((i) => {
    // eslint-disable-next-line prefer-const
    let [name, value] = i.split("::") as [string, undefined | string | number | boolean];
    name = name.trim();
    if (!value) {
      value = input.includes("::") ? "" : name;
    }

    value = arrayChecker(booleanChecker(numericChecker(value)));

    return { [props.nameProp]: name, [props.valueProp]: value };
  }) as unknown as T;
}
