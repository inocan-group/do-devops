import { IDictionary } from "common-types";
import { asyncExec } from "async-shelljs";
import { OptionDefinition } from "command-line-usage";
import chalk from "chalk";
import {
  askForFunction,
  readDataFile,
  getDataFiles,
  askForDataFile,
  getFunctionNames,
  getLambdaFunctions,
  isServerless,
  emoji
} from "../shared";
import { getLocalServerlessFunctions } from "../shared/serverless/getLocalServerlessFunctions";

export function description() {
  return `invoke serverless functions locally, leveraging test data where desired`;
}

export const options: OptionDefinition[] = [
  {
    name: "stage",
    type: String,
    typeLabel: "<stage>",
    group: "invoke",
    description: `state the "stage" you want to emulate with invokation`
  },
  {
    name: "data",
    type: String,
    typeLabel: "<dataFile>",
    group: "invoke",
    description: `use a known data input`
  },
  {
    name: "interactive",
    alias: "i",
    type: Boolean,
    group: "invoke",
    description: "bring up an interactive dialog to choose the data file"
  }
];

export async function handler(args: string[], opts: IDictionary) {
  try {
    const sls = await isServerless();
    if (!sls) {
      console.log(
        chalk`{red - This project is not configured as a {bold Serverless} project!} ${emoji.angry}\n`
      );

      process.exit();
    }
    if (args.length > 1) {
      console.log(
        chalk`{dim - you have stated more than one function to {italic invoke}.}`
      );
      console.log(
        chalk`{dim - this command only executes one at a time; the rest are ignored.}`
      );
    }
    let fn: string;
    if (args.length === 0) {
      fn = await askForFunction();
    } else {
      fn = args[0];
      const availableFns = Object.keys(await getLocalServerlessFunctions());
      if (!availableFns.includes(fn)) {
        console.log(
          chalk`{red - The function "{white ${fn}}" is not a valid function!} ${emoji.shocked}`
        );
        console.log(`- valid functions are:`);
        console.log(chalk`{dim   - ${availableFns.join("\n  - ")}}`);

        process.exit();
      }
    }
    let data;
    if (opts.data) {
      try {
        data = await readDataFile(opts.data, "json");
      } catch (e) {
        const possible = await getDataFiles({
          filterBy: opts.data
        });

        if (possible.length > 1) {
          data = await askForDataFile(possible);
        } else if (possible.length === 1) {
          data = await readDataFile(possible[0]);
        } else {
          console.log(chalk`{red - Data file "${opts.data}" not found!}`);
          data = await askForDataFile();
        }
      }
    }
    if (opts.interactive) {
      data = await askForDataFile();
    }

    if (!opts.quiet) {
      console.log(
        chalk`{grey > sls invoke local --function {dim {white ${fn}}} --data '{dim {white ${data}}}'}`
      );
    }
    await asyncExec(`sls invoke local --function ${fn} --data '${data}'`);
  } catch (e) {
    console.log(`- Error finding functions: ${e.message}\n`);
    process.exit();
  }
}
