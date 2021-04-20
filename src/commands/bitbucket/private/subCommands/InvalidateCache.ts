import { rmdirSync } from "fs";

import { IDictionary } from "common-types";
import chalk from "chalk";

export const handler = function InvalidateCache(_opts: IDictionary) {
  try {
    rmdirSync("/opt/atlassian/pipelines/agent/cache/node_modules");
    console.log(chalk`- The {blue node_modules} cache has been invalidated!`);
  } catch (error) {
    console.warn(
      `There was an error while trying to invalidate the bitbucket cache:\n\n${error.message}`
    );
  }
};
