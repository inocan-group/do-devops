import chalk from "chalk";
import fs from "fs";
import path from "path";
import { dump } from "js-yaml";
import { IServerlessYaml } from "common-types";
import { emoji } from "../ui";

export async function saveToServerlessYaml(data: IServerlessYaml) {
  try {
    const filename = path.join(process.cwd(), "serverless.yml");
    console.log({ filename, data });
    const yamlData = dump(data);

    fs.writeFileSync(filename, yamlData, { encoding: "utf-8" });
  } catch (error) {
    console.log(
      chalk`- {red writing the {bold serverless.yml} file has failed!} ${emoji.poop}`
    );
    console.log(error.message);
    console.log(chalk`{dim ${error.stack}}`);
    process.exit();
  }
}
