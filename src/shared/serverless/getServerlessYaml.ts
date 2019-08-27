import { IServerlessConfig } from "common-types";
import { safeLoad } from "js-yaml";
import path from "path";
import fs from "fs";
import { DevopsError } from "../errors";

/**
 * Get the `serverless.yml` file in the root of the project
 */
export async function getServerlessYaml(): Promise<IServerlessConfig> {
  try {
    const config: IServerlessConfig = safeLoad(
      fs.readFileSync(path.join(process.cwd(), "serverless.yml"), {
        encoding: "utf-8"
      })
    );
    return config;
  } catch (e) {
    throw new DevopsError(
      `Failure getting serverless.yml: ${e.message}`,
      e.name
    );
  }
}
