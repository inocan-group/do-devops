import { rmdirSync } from "fs";

import { IDictionary } from "common-types";
import * as chalk from "chalk";

export default function InvalidateCache(opts: IDictionary) {
  try {
    rmdirSync(`/opt/atlassian/pipelines/agent/cache/node_modules`);
    console.log(chalk`- The {blue node_modules} cache has been invalidated!`);
  } catch (e) {
    console.warn(`There was an error while trying to invalidate the bitbucket cache:\n\n${e.message}`);
  }

  return 0;
}
