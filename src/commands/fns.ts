import { getServerlessYaml, isServerless, consoleDimensions } from "../shared";
import { IDictionary } from "common-types";
import { table } from "table";
import chalk from "chalk";

export async function handler(args: string[], opt: IDictionary) {
  const filterBy =
    args.length > 0 ? (fn: string) => fn.includes(args[0]) : () => true;
  const status = isServerless();
  if (!status) {
    console.log("- this project does not appear to be a Serverless project!\n");
    process.exit();
  } else if (status.isUsingTypescriptMicroserviceTemplate) {
    console.log(
      `- detected use of the ${chalk.blue(
        "typescript-microservice"
      )} template; rebuilding functions from config.`
    );
    // await rebuildTypescriptMicroserviceProject();
  }

  try {
    const { width } = await consoleDimensions();
    const fns = (await getServerlessYaml()).functions;
    let tableData = [
      [
        chalk.bold.yellow("function"),
        chalk.bold.yellow("events"),
        chalk.bold.yellow("memory"),
        chalk.bold.yellow("timeout"),
        chalk.bold.yellow("description")
      ]
    ];
    Object.keys(fns)
      .filter(filterBy)
      .forEach(key => {
        const events = fns[key].events || [];
        tableData.push([
          key,
          events.map(i => Object.keys(i)).join(", "),
          String(fns[key].memorySize || chalk.grey("1024")),
          String(fns[key].timeout || chalk.grey("3")),
          fns[key].description
        ]);
      });
    const tableConfig = {
      columns: {
        0: { width: 30, alignment: "left" },
        1: { width: 16, alignment: "left" },
        2: { width: 7, alignment: "center" },
        3: { width: 8, alignment: "center" },
        4: { width: 46, alignment: "left" }
      }
    };
    let output = table(tableData, tableConfig as any);

    if (width < 70) {
      delete tableConfig.columns["2"];
      delete tableConfig.columns["3"];
      delete tableConfig.columns["4"];
      output = table(tableData.map(i => i.slice(0, 2), tableConfig));
    } else if (width < 80) {
      delete tableConfig.columns["3"];
      delete tableConfig.columns["4"];
      output = table(tableData.map(i => i.slice(0, 3), tableConfig));
    } else if (width < 125) {
      delete tableConfig.columns["4"];
      output = table(tableData.map(i => i.slice(0, 4), tableConfig));
    }

    console.log(output);
  } catch (e) {
    console.log(`- Error finding functions: ${e.message}\n`);
    process.exit();
  }
  // const inlineFns = await findInlineFunctionDefnFiles();
  // const configFiles = await findConfigFunctionDefnFiles();
  // console.log(inlineFns);
  // console.log(configFiles);
  // for await (const fn of inlineFns) {
  //   console.log(fn, fn.replace(process.env.PWD, ""));

  //   const e = await getExportsFromFile(fn);
  //   console.log(e);
  // }
}
