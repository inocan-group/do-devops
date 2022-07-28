import fs from "node:fs";
import path from "node:path";

import { DevopsError } from "src/errors";
import { IServerlessYaml } from "common-types";
import { load } from "js-yaml";
import { isDevopsError } from "src/@type-guards";

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
    const error_ = isDevopsError(error)
      ? new DevopsError(`Failure getting serverless.yml: ${error.message}`, error.name)
      : new DevopsError(`Failure getting serverless.yml`, "serverless/not-ready");
    throw error_;
  }
}
