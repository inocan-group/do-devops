import { IDictionary } from "common-types";
import { table } from "table";
import chalk from "chalk";

export function description() {
  return `invoke serverless functions locally, leveraging test data where desired`;
}

export async function handler(args: string[], opt: IDictionary) {
  try {
    console.log("Invoke command is a work in progress");
  } catch (e) {
    console.log(`- Error finding functions: ${e.message}\n`);
    process.exit();
  }
}
