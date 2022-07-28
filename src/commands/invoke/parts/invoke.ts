/* eslint-disable quotes */
import chalk from "chalk";
import { emoji } from "src/shared/ui";
import { asyncExec } from "async-shelljs";
import {
  getLocalServerlessFunctionsFromServerlessYaml,
  askForFunction,
} from "src/shared/serverless";
import { isServerless } from "src/shared/observations";
import { getDataFiles, readDataFile } from "src/shared/file";
import { askForDataFile } from "src/shared/interactive";
import { DoDevopsHandler } from "src/@types/command";
import { IInvokeOptions } from "./invoke-meta";
import { proxyToPackageManager } from "src/shared/core";

export const handler: DoDevopsHandler<IInvokeOptions> = async ({
  observations,
  opts,
  unknown: argv,
  raw,
}) => {
  if (!observations.has("serverlessFramework")) {
    await proxyToPackageManager("invoke", observations, raw);
    process.exit();
  }
  try {
    const sls = await isServerless();
    if (!sls) {
      console.log(
        chalk`{red - This project is not configured as a {bold Serverless} project!} ${emoji.angry}\n`
      );

      process.exit();
    }
    if (argv.length > 1) {
      console.log(chalk`{dim - you have stated more than one function to {italic invoke}.}`);
      console.log(chalk`{dim - this command only executes one at a time; the rest are ignored.}`);
    }
    let fn: string;
    if (argv.length === 0) {
      fn = await askForFunction();
    } else {
      fn = argv[0];
      const availableFns = Object.keys(
        (await getLocalServerlessFunctionsFromServerlessYaml()) || {}
      );
      if (!availableFns.includes(fn)) {
        console.log(
          chalk`{red - The function "{white ${fn}}" is not a valid function!} ${emoji.shocked}`
        );
        console.log("- valid functions are:");
        console.log(chalk`{dim   - ${availableFns.join("\n  - ")}}`);

        process.exit();
      }
    }
    let data;
    if (opts.data) {
      try {
        data = await readDataFile(opts.data, "json");
      } catch {
        const possible = await getDataFiles({
          filterBy: opts.data,
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
  } catch (error) {
    console.log(`- Error finding functions: ${(error as Error).message}\n`);
    process.exit();
  }
};
