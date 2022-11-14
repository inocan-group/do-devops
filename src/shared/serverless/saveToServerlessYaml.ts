import chalk from "chalk";
import fs from "node:fs";
import path from "node:path";
import { dump } from "js-yaml";
import { IServerlessYaml } from "common-types";
import { emoji } from "../ui";
import { isDevopsError } from "src/@type-guards";

export async function saveToServerlessYaml(data: IServerlessYaml) {
  try {
    const filename = path.join(process.cwd(), "serverless.yml");
    console.log({ filename, data });
    const yamlData = dump(data);

    fs.writeFileSync(filename, yamlData, { encoding: "utf8" });
  } catch (error) {
    console.log(`- {red writing the {bold serverless.yml} file has failed!} ${emoji.poop}`);

    if (isDevopsError(error)) {
      console.log(error.message);
      console.log(`{dim ${error.stack}}`);
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit();
    }
  }
}
