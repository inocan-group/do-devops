import fs from "fs";
import path from "path";

import { DevopsError } from "~/errors";
import { IServerlessYaml } from "common-types";
import { load } from "js-yaml";

/**
 * Get the `serverless.yml` file in the root of the project
 */
export async function getServerlessYaml(): Promise<IServerlessYaml> {
  const baseStructure: Partial<IServerlessYaml> = {
    functions: {},
    stepFunctions: { stateMachines: {} },
  };

  try {
    const fileContents = fs.readFileSync(path.join(process.cwd(), "serverless.yml"), {
      encoding: "utf-8",
    });
    const config = load(fileContents);

    return { ...baseStructure, ...(config as IServerlessYaml) };
  } catch (error) {
    throw new DevopsError(`Failure getting serverless.yml: ${error.message}`, error.name);
  }
}
