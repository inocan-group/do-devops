/* eslint-disable unicorn/no-await-expression-member */
import chalk from "chalk";
import { omit } from "native-dash";
import { IDictionary } from "common-types";
import { table } from "table";

import { consoleDimensions } from "src/shared/ui";
import { buildLambdaTypescriptProject, getServerlessYaml } from "src/shared/serverless";
import { DoDevopsHandler } from "src/@types/command";
import { IFnsOptions } from "./options";
import { getAwsLambdaFunctions } from "src/shared/aws";
import type { FunctionConfiguration } from "aws-sdk/clients/lambda";
import { determineRegion } from "src/shared/observations";
import { functionsApiTable } from "./tables";
import { Options } from "src/@types";
import { write } from "src/shared/file/crud/write";
import { exit } from "node:process";

export const handler: DoDevopsHandler<Options<IFnsOptions>> = async ({
  unknown: argv,
  opts,
  observations,
}) => {
  const filterBy = argv.length > 0 ? (fn: string) => fn.includes(argv[0]) : () => true;
  const isServerlessProject = observations.has("serverlessFramework");
  const region = opts.region ?? (await determineRegion(opts));
  const stageFilterMsg = opts.stage
    ? `, filtered down to only those in the {bold ${opts.stage.toUpperCase()}} stage.`
    : "";

  if (!isServerlessProject) {
    if (opts.profile) {
      const filter = opts.stage
        ? (f: FunctionConfiguration) => f.FunctionName?.includes(`-${opts.stage}-`)
        : () => true;
      const fns = (await getAwsLambdaFunctions(opts)).Functions?.filter(filter);

      if (fns) {
        console.log(
          `- AWS functions found using {blue {bold ${opts.profile}}} profile {dim [ ${region} ]}${stageFilterMsg}\n`
        );
        if (opts.json) {
          console.log(
            chalk.gray` - using ${chalk.inverse(opts.json) } output directly from AWS api instead of a table}`
          );
          console.log(fns);
        } else {
          console.log(functionsApiTable(fns));
        }
        if (opts.output) {
          write(opts.output, fns, { allowOverwrite: true });
        }
      }
      console.log(
        chalk.gray` - the AWS CLI provides access to data like this with} {bold aws lambda list-functions --profile ${opts.profile}}`
      );
    } else {
      console.log("- this project does not appear to be a Serverless project!");
      console.log(
        chalk.gray` - if you want a list of functions, you can still get this by stating an AWS profile with the "--profile" option}\n`
      );
    }
    exit();
  } else if (observations.has("serverlessTs")) {
    if (opts.forceBuild) {
      console.log(
        `- detected use of the ${chalk.blue(
          "typescript-microservice"
        )} template; rebuilding functions from config.`
      );
      await buildLambdaTypescriptProject();
    } else {
      console.log(
        `- detected use of the {blue typescript-microservice} template; use {bold {blue --forceBuild}} to rebuild prior to listing functions.\n`
      );
    }
  }

  try {
    const { width } = consoleDimensions();
    const fns = (await getServerlessYaml()).functions;

    const tableData = [
      [
        chalk.bold.yellow("function"),
        chalk.bold.yellow("events"),
        chalk.bold.yellow("memory"),
        chalk.bold.yellow("timeout"),
        chalk.bold.yellow("description"),
      ],
    ];
    if (fns) {
      for (const key of Object.keys(fns).filter(filterBy)) {
        const events = fns[key].events || [];
        tableData.push([
          key,
          events.map((i) => Object.keys(i)).join(", "),
          String(fns[key].memorySize || chalk.grey("1024")),
          String(fns[key].timeout || chalk.grey("3")),
          fns[key].description || "",
        ]);
      }
    }
    let tableConfig: { columns: IDictionary } = {
      columns: {
        0: { width: 30, alignment: "left" },
        1: { width: 16, alignment: "left" },
        2: { width: 7, alignment: "center" },
        3: { width: 10, alignment: "center" },
        4: { width: 46, alignment: "left" },
      },
    };
    let output = table(tableData, tableConfig as any);

    if (width < 70) {
      // TODO: come back and use a consistent means of omitting columns
      tableConfig = { columns: omit(tableConfig.columns, "2", "3", "4") };
      output = table(tableData.map((i) => i.slice(0, 2)));
    } else if (width < 80) {
      delete tableConfig.columns["3"];
      delete tableConfig.columns["4"];
      output = table(tableData.map((i) => i.slice(0, 3)));
    } else if (width < 125) {
      delete tableConfig.columns["4"];
      output = table(tableData.map((i) => i.slice(0, 4)));
    }

    console.log(output);
  } catch (error) {
    console.log(`- Error finding functions: ${(error as Error).message}\n`);
    exit(1);
  }
};
