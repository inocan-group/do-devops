import chalk from "chalk";
import { omit } from "native-dash";
import { IDictionary } from "common-types";
import { table, TableUserConfig } from "table";

import { consoleDimensions, toTable } from "~/shared/ui";
import { buildLambdaTypescriptProject, getServerlessYaml } from "~/shared/serverless";
import { DoDevopsHandler } from "~/@types/command";
import { IFnsOptions } from "./options";
import { determineRegion, getAwsLambdaFunctions } from "~/shared";
import type { FunctionConfiguration } from "aws-sdk/clients/lambda";

export const handler: DoDevopsHandler<IFnsOptions> = async ({
  argv,
  opts,
  observations,
}) => {
  const filterBy = argv.length > 0 ? (fn: string) => fn.includes(argv[0]) : () => true;
  const isServerlessProject = observations.includes("serverlessFramework");

  if (!isServerlessProject) {
    if (opts.profile) {
      const fns = (await getAwsLambdaFunctions(opts)).Functions;
      const region = opts.region ? opts.region : await determineRegion(opts);
      const tblConfig: TableUserConfig = {
        columns: [
          { width: 45, alignment: "left" },
          { width: 8, alignment: "center" },
          { width: 12, alignment: "right" },
          { width: 8, alignment: "right" },
          { width: 42, alignment: "left", wrapWord: true },
        ],
      };

      if (fns) {
        console.log(
          chalk`- AWS functions found using profile {yellow {bold ${opts.profile}} {dim [ ${region} ]}}\n`
        );

        console.log(
          table(
            [
              [
                chalk.bold.yellow("Name"),
                chalk.bold.yellow("Memory"),
                chalk.bold.yellow("Code Size"),
                chalk.bold.yellow("Timeout"),
                chalk.bold.yellow("Description"),
              ],
              ...toTable<FunctionConfiguration>(
                fns,
                "FunctionName",
                "MemorySize",
                [
                  "CodeSize",
                  (cs) => chalk`${Math.floor(Number(cs) / 10000) * 10} {italic kb}`,
                ],
                ["Timeout", (t) => `${t}s`],
                "Description"
              ),
            ],
            tblConfig
          )
        );
      }
    } else {
      console.log("- this project does not appear to be a Serverless project!");
      console.log(
        chalk`{gray - if you want a list of functions, you can still get this by stating an AWS profile with the "--profile" option}\n`
      );
    }
    process.exit();
  } else if (observations.includes("serverlessTs")) {
    if (opts.forceBuild) {
      console.log(
        `- detected use of the ${chalk.blue(
          "typescript-microservice"
        )} template; rebuilding functions from config.`
      );
      await buildLambdaTypescriptProject();
    } else {
      console.log(
        chalk`- detected use of the {blue typescript-microservice} template; use {bold {blue --forceBuild}} to rebuild prior to listing functions.\n`
      );
    }
  }

  try {
    const { width } = await consoleDimensions();
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
      // eslint-disable-next-line unicorn/no-array-callback-reference
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
      output = table(tableData.map((i) => i.slice(0, 2), tableConfig));
    } else if (width < 80) {
      delete tableConfig.columns["3"];
      delete tableConfig.columns["4"];
      output = table(tableData.map((i) => i.slice(0, 3), tableConfig));
    } else if (width < 125) {
      delete tableConfig.columns["4"];
      output = table(tableData.map((i) => i.slice(0, 4), tableConfig));
    }

    console.log(output);
  } catch (error) {
    console.log(`- Error finding functions: ${error.message}\n`);
    process.exit();
  }
};
