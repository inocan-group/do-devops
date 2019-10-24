import { IServerlessConfig } from "common-types";
import * as fs from "fs";
import path from "path";
import { safeDump } from "js-yaml";
import { promisify } from "util";
import chalk from "chalk";
import { emoji } from "../ui";
const writeFile = promisify(fs.writeFile);

export async function saveToServerlessYaml(data: IServerlessConfig) {
  try {
    const filename = path.join(process.cwd(), "serverless.yml");
    const yamlData = safeDump(data);
    await writeFile(filename, yamlData, { encoding: "utf-8" });
  } catch (e) {
    console.log(
      chalk`- {red writing the {bold serverless.yml} file has failed!} ${emoji.poop}`
    );
    console.log(e.message);
    console.log(chalk`{dim ${e.stack}}`);
    process.exit();
  }
}
