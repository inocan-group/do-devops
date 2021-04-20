import chalk from "chalk";

import {
  buildLambdaTypescriptProject,
  consoleDimensions,
  getServerlessYaml,
} from "../shared";

import { IDictionary } from "common-types";
import { OptionDefinition } from "command-line-usage";
import { table } from "table";
import { isServerless } from "~/shared/observations";
import { omit } from "native-dash";

export function description() {
  return "Lists all serverless function handlers and basic meta about them";
}

export const options: OptionDefinition[] = [
  {
    name: "forceBuild",
    alias: "f",
    type: Boolean,
    description: chalk`by default functions will be derived from {italic serverless.yml} but if you are in a {italic typescript-microservice} project you can force a rebuild prior to listing the functions`,
  },
];

export async function handler(args: string[], opts: IDictionary) {
  const filterBy = args.length > 0 ? (fn: string) => fn.includes(args[0]) : () => true;
  const status = await isServerless();

  if (!status) {
    console.log("- this project does not appear to be a Serverless project!\n");
    process.exit();
  } else if (status.isUsingTypescriptMicroserviceTemplate) {
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
}
