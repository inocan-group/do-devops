import * as chalk from "chalk";
import * as path from "path";

import { IDictionary } from "common-types";
import { emoji } from "../ui";
import { promisify } from "util";
import { safeDump } from "js-yaml";
import { writeFile } from "fs";
const write = promisify(writeFile);

export async function saveYamlFile(filename: string, data: IDictionary) {
  try {
    console.log(data);

    const yamlData = safeDump(data);
    const fqFilename = path.join(process.cwd(), filename);
    await write(fqFilename, yamlData, { encoding: "utf-8" });
    return;
  } catch (e) {
    console.log(chalk`- {red writing the {bold {italic ${filename}} YAML file has failed!} ${emoji.poop}}`);
    console.log(e.message);
    console.log(chalk`{dim ${e.stack}}`);
    process.exit();
  }
}
