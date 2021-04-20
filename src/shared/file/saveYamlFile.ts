import chalk from "chalk";
import path from "path";

import { IDictionary } from "common-types";
import { emoji } from "../ui";
import { promisify } from "util";
import { dump } from "js-yaml";
import { writeFile } from "fs";
const write = promisify(writeFile);

export async function saveYamlFile(filename: string, data: IDictionary) {
  try {
    console.log(data);

    const yamlData = dump(data);
    const fqFilename = path.join(process.cwd(), filename);
    await write(fqFilename, yamlData, { encoding: "utf-8" });
    return;
  } catch (error) {
    console.log(
      chalk`- {red writing the {bold {italic ${filename}} YAML file has failed!} ${emoji.poop}}`
    );
    console.log(error.message);
    console.log(chalk`{dim ${error.stack}}`);
    process.exit();
  }
}
