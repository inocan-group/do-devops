import * as fs from "fs";
import * as path from "path";

import { DevopsError } from "../errors";
import { IServerlessConfig } from "common-types";
import { safeLoad } from "js-yaml";

/**
 * Get the `serverless.yml` file in the root of the project
 */
export async function getServerlessYaml(): Promise<IServerlessConfig> {
  const baseStructure: Partial<IServerlessConfig> = {
    functions: {},
    stepFunctions: { stateMachines: {} },
  };

  try {
    const fileContents = fs.readFileSync(path.join(process.cwd(), "serverless.yml"), {
      encoding: "utf-8",
    });
    const config = safeLoad(fileContents);

    return { ...baseStructure, ...(config as IServerlessConfig) };
  } catch (e) {
    throw new DevopsError(`Failure getting serverless.yml: ${e.message}`, e.name);
  }
}
