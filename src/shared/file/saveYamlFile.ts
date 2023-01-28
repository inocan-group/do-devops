import chalk from "chalk";
import path from "node:path";

import { IDictionary } from "common-types";
import { emoji } from "../ui";
import { promisify } from "node:util";
import { dump } from "js-yaml";
import { writeFile } from "node:fs";
import { exit } from "node:process";
const write = promisify(writeFile);

export const saveYamlFile = async (filename: string, data: IDictionary) => {
  try {
    console.log(data);

    const yamlData = dump(data);
    const fqFilename = path.join(process.cwd(), filename);
    await write(fqFilename, yamlData, { encoding: "utf8" });
    return;
  } catch (error) {
    console.log(
      `- {red writing the ${chalk.bold.italic(filename)} YAML file has failed!} ${emoji.poop}}`
    );
    console.log((error as Error).message);
    console.log(chalk.dim`${(error as Error).stack}`);
    exit(1);
  }
};
