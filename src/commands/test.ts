import { getServerlessYaml, isServerless, consoleDimensions } from "../shared";
import { IDictionary } from "common-types";
import { table } from "table";
import chalk from "chalk";

export function description() {
  return `Test some or all of your tests and incorporate useful test data without effort`;
}

export async function handler(args: string[], opt: IDictionary) {
  try {
    console.log("Test command is a work in progress");
  } catch (e) {
    console.log(`- Error finding functions: ${e.message}\n`);
    process.exit();
  }
}
